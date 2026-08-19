from rest_framework import viewsets, permissions
from .models import RoomType, Room
from .serializers import RoomTypeSerializer, RoomSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from bookings.services import get_available_rooms
from hotels.models import Hotel


class RoomTypeViewSet(viewsets.ModelViewSet):
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.select_related("room_type").all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def available_rooms_view(request):
    hotel_id = request.query_params.get("hotel")
    check_in = request.query_params.get("check_in")
    check_out = request.query_params.get("check_out")

    if not all([hotel_id, check_in, check_out]):
        return Response({"detail": "hotel, check_in, and check_out are required."}, status=400)

    try:
        hotel = Hotel.objects.get(id=hotel_id)
    except Hotel.DoesNotExist:
        return Response({"detail": "Hotel not found."}, status=404)

    rooms = get_available_rooms(hotel, check_in, check_out)
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)