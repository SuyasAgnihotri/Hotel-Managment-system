from rest_framework import serializers
from .models import Hotel

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ["id", "name", "slug", "city", "timezone", "is_active", "created_at"]
        read_only_fields = ["id", "created_at"]