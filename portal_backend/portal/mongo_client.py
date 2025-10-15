from pymongo import MongoClient
from django.conf import settings

class _LazyHistoryCollection:
    def __init__(self):
        self._coll = None

    def _init(self):
        if self._coll is None:
            mongo_uri = f"mongodb://{settings.MONGO_USER}:{settings.MONGO_PASSWORD}@{settings.MONGO_HOST}:27017/"
            client = MongoClient(mongo_uri)
            db = client[settings.MONGO_BD]
            self._coll = db["history"]

    def __getattr__(self, name):
        self._init()
        return getattr(self._coll, name)

    def _ensure_initialized(self):
        self._init()
        return self._coll

history_collection = _LazyHistoryCollection()
