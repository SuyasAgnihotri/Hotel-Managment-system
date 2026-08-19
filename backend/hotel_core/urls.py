
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hotels.views import HotelViewSet
from rooms.views import RoomTypeViewSet, RoomViewSet
from bookings.views import BookingViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from guests.views import GuestViewSet
from rooms.views import available_rooms_view

router = DefaultRouter()
router.register("hotels", HotelViewSet, basename="hotel")
router.register("room-types", RoomTypeViewSet, basename="roomtype")
router.register("rooms", RoomViewSet, basename="room")
router.register("bookings", BookingViewSet, basename="booking")
router.register("guests", GuestViewSet, basename="guest")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/rooms/available/", available_rooms_view, name="available-rooms"),
]
