from django.urls import path
from .views import CourseListView, TripListView , TripRegistrationView

urlpatterns = [
    path("courses/", CourseListView.as_view(), name="courses"),  
    path("trips/", TripListView.as_view(), name="trips"),  # ✅ Use `.as_view()`
    path("trips-registration/", TripRegistrationView.as_view(), name="trips-registration"),
]
