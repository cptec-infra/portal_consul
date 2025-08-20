from consulviewer.consul_client import get_services_by_node
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from django.conf import settings

class MachineHistoryView(APIView):
    def get(self, request, node):
        try:
            client = MongoClient(
                    f"mongodb://{settings.MONGO_USER}:{settings.MONGO_PASSWORD}@{settings.MONGO_HOST}:{settings.MONGO_PORT}/",
                serverSelectionTimeoutMS=5000
            )
            db = client[settings.MONGO_BD]
            collection = db['history']
            
            pipeline = [
                {"$match": {"node": node}},
                {"$sort": {"last_update": -1}},
                {"$group": {
                    "_id": "$hostname",
                    "doc": {"$first": "$$ROOT"}
                }},
                {"$replaceRoot": {"newRoot": "$doc"}},
                {"$sort": {"last_update": -1}}
            ]

            history = list(collection.aggregate(pipeline))
            
            for h in history:
                h['_id'] = str(h['_id'])
                if 'timestamp' in h and hasattr(h['timestamp'], "isoformat"):
                    h['timestamp'] = h['timestamp'].isoformat()

            return Response(history, status=status.HTTP_200_OK)

        except Exception as e:
            print('[MachineHistoryView] Erro:', e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MachineDetailView(APIView):
    def get(self, request, node):
        if not node:
            return Response({'error': 'Node parameter is required'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        service = get_services_by_node(node)
        return Response(service, status=status.HTTP_200_OK)
