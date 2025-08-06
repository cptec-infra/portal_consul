from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from django.conf import settings


class MachineHistoryView(APIView):
    def get(self, request, node):
        try:
            client = MongoClient("mongodb://admin:admin123@portal_mongo:27017/")
            db = client['portal_mongo']
            print('------------___>', client)
            print(f'entre')
            collection = db['history']
            history = list(collection.find({'node': node}).sort('timestamp', -1))

            for h in history:
                h['_id'] = str(h['_id'])
                if 'timestamp' in h:
                    h['timestamp'] = h['timestamp'].isoformat()

            return Response(history, status=status.HTTP_200_OK)
        except Exception as e:
            print('Erro:', e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
