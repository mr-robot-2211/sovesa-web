from django.urls import path
from .views import SignupView, LoginView, PostSadhanaView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("post-sadhana/", PostSadhanaView.as_view(), name="post-sadhana"),
]
