from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch
from rest_framework.test import APIClient
from rest_framework import status


class FreeIPAUsersTest(TestCase):
    @patch("freeipa.views.get_all_users")
    @patch("freeipa.views.format_users")
    def test_users_all_ok(self, mock_format, mock_get_users):
        mock_get_users.return_value = [{"uid": "user1"}]
        mock_format.return_value = [{"uid": "user1", "firstname": "John"}]

        client = APIClient()
        response = client.get(reverse("users_all"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), [{"uid": "user1", "firstname": "John"}])
        mock_get_users.assert_called_once()
        mock_format.assert_called_once()

    @patch("freeipa.views.get_all_users", side_effect=Exception("IPA error"))
    def test_users_all_error(self, mock_get_users):
        client = APIClient()
        response = client.get(reverse("users_all"))

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.json()["status"])


class FreeIPAGroupsTest(TestCase):
    @patch("freeipa.views.get_all_groups")
    def test_groups_all_ok(self, mock_get_groups):
        mock_get_groups.return_value = [
            {"cn": "admins", "description": "Admin group"}
        ]

        client = APIClient()
        response = client.get(reverse("groups_all"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), [{"cn": "admins", "description": "Admin group"}])
        mock_get_groups.assert_called_once()

    @patch("freeipa.views.get_all_groups", side_effect=Exception("IPA error"))
    def test_groups_all_error(self, mock_get_groups):
        client = APIClient()
        response = client.get(reverse("groups_all"))

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.json()["status"])
