from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .models import Booking
from .serializers import BookingSerializer
from .services import create_booking, check_in_booking, check_out_booking

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related("guest", "room", "hotel").all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            booking = create_booking(
                hotel=data["hotel"],
                guest=data["guest"],
                room=data["room"],
                check_in=data["check_in"],
                check_out=data["check_out"],
                total_amount=data["total_amount"],
                source=data.get("source", "direct"),
            )
        except ValidationError as e:
            message = e.messages[0] if hasattr(e, "messages") else str(e)
            return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)
        return Response(self.get_serializer(booking).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def check_in(self, request, pk=None):
        booking = self.get_object()
        try:
            check_in_booking(booking)
        except ValidationError as e:
            message = e.messages[0] if hasattr(e, "messages") else str(e)
            return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)
        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=["post"])
    def check_out(self, request, pk=None):
        booking = self.get_object()
        try:
            check_out_booking(booking)
        except ValidationError as e:
            message = e.messages[0] if hasattr(e, "messages") else str(e)
            return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)
        return Response(self.get_serializer(booking).data)