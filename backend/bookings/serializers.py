from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    guest_name = serializers.CharField(source="guest.full_name", read_only=True)
    room_number = serializers.CharField(source="room.room_number", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id", "hotel", "guest", "guest_name", "room", "room_number",
            "check_in", "check_out", "status", "total_amount", "source", "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]