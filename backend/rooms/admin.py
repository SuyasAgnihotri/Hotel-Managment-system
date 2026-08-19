from django.contrib import admin
from .models import RoomType, Room

@admin.register(RoomType)
class RoomTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "hotel", "base_price", "max_occupancy")
    list_filter = ("hotel",)

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("room_number", "hotel", "room_type", "floor", "status")
    list_filter = ("hotel", "status")
    search_fields = ("room_number",)