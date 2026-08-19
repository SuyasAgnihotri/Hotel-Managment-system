from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Booking
from rooms.models import Room

def is_room_available(room, check_in, check_out, exclude_booking_id=None):
    """
    Returns True if the room has no CONFIRMED/CHECKED_IN booking
    that overlaps with the requested date range.
    """
    overlapping = Booking.objects.filter(
        room=room,
        status__in=[Booking.Status.CONFIRMED, Booking.Status.CHECKED_IN],
        check_in__lt=check_out,
        check_out__gt=check_in,
    )
    if exclude_booking_id:
        overlapping = overlapping.exclude(id=exclude_booking_id)

    return not overlapping.exists()


@transaction.atomic
def create_booking(hotel, guest, room, check_in, check_out, total_amount, source="direct"):
    """
    Creates a booking only if the room is actually free.
    Uses select_for_update to lock the room's existing bookings
    during this transaction, preventing a race condition where
    two requests both pass the availability check simultaneously.
    """
    # Lock existing bookings for this room while we check + create
    Booking.objects.select_for_update().filter(room=room)

    if not is_room_available(room, check_in, check_out):
        raise ValidationError(f"Room {room.room_number} is not available for {check_in} to {check_out}.")

    return Booking.objects.create(
        hotel=hotel,
        guest=guest,
        room=room,
        check_in=check_in,
        check_out=check_out,
        total_amount=total_amount,
        source=source,
        status=Booking.Status.CONFIRMED,
    )



def check_in_booking(booking):
    if booking.status != Booking.Status.CONFIRMED:
        raise ValidationError(f"Cannot check in a booking with status '{booking.status}'.")
    booking.status = Booking.Status.CHECKED_IN
    booking.save(update_fields=["status"])
    booking.room.status = booking.room.Status.OCCUPIED if hasattr(booking.room, "Status") else "occupied"
    booking.room.status = "occupied"
    booking.room.save(update_fields=["status"])
    return booking


def check_out_booking(booking):
    if booking.status != Booking.Status.CHECKED_IN:
        raise ValidationError(f"Cannot check out a booking with status '{booking.status}'.")
    booking.status = Booking.Status.CHECKED_OUT
    booking.save(update_fields=["status"])
    booking.room.status = "cleaning"
    booking.room.save(update_fields=["status"])
    return booking


def get_available_rooms(hotel, check_in, check_out, room_type=None):
    """
    Returns a queryset of rooms in `hotel` that have NO overlapping
    CONFIRMED/CHECKED_IN booking for the given date range.
    """
    booked_room_ids = Booking.objects.filter(
        room__hotel=hotel,
        status__in=[Booking.Status.CONFIRMED, Booking.Status.CHECKED_IN],
        check_in__lt=check_out,
        check_out__gt=check_in,
    ).values_list("room_id", flat=True)

    rooms = Room.objects.filter(hotel=hotel).exclude(id__in=booked_room_ids)

    if room_type:
        rooms = rooms.filter(room_type=room_type)

    return rooms