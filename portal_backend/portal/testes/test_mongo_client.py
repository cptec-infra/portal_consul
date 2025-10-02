from django.test import TestCase, override_settings
from unittest.mock import patch, MagicMock

@override_settings(
    MONGO_USER="user",
    MONGO_PASSWORD="pass",
    MONGO_HOST="localhost",
    MONGO_BD="mydb"
)
class MongoClientTest(TestCase):
    @patch("portal.mongo_client.MongoClient")
    def test_mongo_client_initialization(self, mock_mongo):
        mock_client = MagicMock()
        mock_db = MagicMock()
        mock_collection = MagicMock()

        mock_mongo.return_value = mock_client
        mock_client.__getitem__.return_value = mock_db
        mock_db.__getitem__.return_value = mock_collection

        import portal.mongo_client as mongo_mod

        mongo_mod.history_collection.find_one({"_test": True})

        mongo_uri = "mongodb://user:pass@localhost:27017/"
        mock_mongo.assert_called_once_with(mongo_uri)
        mock_client.__getitem__.assert_called_once_with("mydb")
        mock_db.__getitem__.assert_called_once_with("history")

        self.assertIsNotNone(mongo_mod.history_collection._ensure_initialized())

