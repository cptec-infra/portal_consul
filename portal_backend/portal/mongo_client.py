from pymongo import MongoClient
from django.conf import settings

mongo_client = MongoClient(
    f"mongodb://{settings.MONGO_USER}:{settings.MONGO_PASSWORD}@{settings.MONGO_HOST}:27017/"
)

history_db = mongo_client[settings.MONGO_BD]
history_collection = history_db['history']
