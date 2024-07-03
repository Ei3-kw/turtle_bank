from django.urls import path
from . import views

urlpatterns = [
    path("userrequest/", views.UserRequestListCreate.as_view(), name="userrequest-view-create"),
    path("userrequest/<int:pk>/", views.UserRequestRetrieveUpdateDestroy.as_view(), name="userrequest-view-update")
]