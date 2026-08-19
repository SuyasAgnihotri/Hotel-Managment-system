from django.contrib import admin
from .models import Booking
from .services import check_in_booking, check_out_booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("guest", "room", "hotel", "check_in", "check_out", "status", "source", "total_amount")
    list_filter = ("hotel", "status", "source")
    search_fields = ("guest__full_name", "guest__phone")
    actions = ["do_check_in", "do_check_out"]

    @admin.action(description="Check in selected bookings")
    def do_check_in(self, request, queryset):
        for booking in queryset:
            try:
                check_in_booking(booking)
            except Exception as e:
                self.message_user(request, f"Booking {booking.id}: {e}", level="error")

    @admin.action(description="Check out selected bookings")
    def do_check_out(self, request, queryset):
        for booking in queryset:
            try:
                check_out_booking(booking)
            except Exception as e:
                self.message_user(request, f"Booking {booking.id}: {e}", level="error")