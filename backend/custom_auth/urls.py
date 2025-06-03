from django.urls import path
from .views import SignupView, LoginView, MeditationStatsView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("meditation-stats/", MeditationStatsView.as_view(), name="meditation-stats"),
]
