from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, TripViewSet, BlogViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'trips', TripViewSet)
router.register(r'blogs', BlogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
