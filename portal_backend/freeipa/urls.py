from django.urls import path
from .views import users_all, groups_all

urlpatterns = [
    path("freeipa/users", users_all, name="users_all"), 
    path("freeipa/groups", groups_all, name="groups_all"),
]