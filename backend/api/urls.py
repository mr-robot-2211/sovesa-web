from django.urls import path
from .views import CourseListView, TripListView , TripRegistrationView, CourseRegistrationView, BlogListView

urlpatterns = [
    path("courses/", CourseListView.as_view(), name="courses"),  
    path("trips/", TripListView.as_view(), name="trips"),
    path("trips-registration/", TripRegistrationView.as_view(), name="trips-registration"),
    path("courses-registration/", CourseRegistrationView.as_view(), name="courses-registration"),
    path("blog/", BlogListView.as_view(), name="blog"),
]


