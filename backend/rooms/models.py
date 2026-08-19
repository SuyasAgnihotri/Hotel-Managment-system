from django.db import models
from hotels.models import Hotel

class RoomType(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="room_types")
    name = models.CharField(max_length=100)          # "Deluxe", "Suite"
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_occupancy = models.PositiveSmallIntegerField()
    amenities = models.JSONField(default=list)        # ["AC", "WiFi", "TV"]

    class Meta:
        unique_together = ("hotel", "name")

    def __str__(self):
        return f"{self.name} ({self.hotel.name})"

class Room(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        OCCUPIED = "occupied", "Occupied"
        MAINTENANCE = "maintenance", "Under Maintenance"
        CLEANING = "cleaning", "Needs Cleaning"

    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="rooms")
    room_type = models.ForeignKey(RoomType, on_delete=models.PROTECT, related_name="rooms")
    room_number = models.CharField(max_length=10)
    floor = models.PositiveSmallIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)

    class Meta:
        unique_together = ("hotel", "room_number")
        indexes = [models.Index(fields=["hotel", "status"])]

    def __str__(self):
        return f"{self.room_number} - {self.hotel.name}"