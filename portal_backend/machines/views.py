from django.http import HttpResponse, StreamingHttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from consulviewer.consul_client import get_services_by_node
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from django.conf import settings
import requests
import json

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
                {"$sort": {"_id": -1}},
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


class GrafanaProxyView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, grafana_path):
        return self._proxy_request(request, grafana_path)

    def post(self, request, grafana_path):
        return self._proxy_request(request, grafana_path)

    def _proxy_request(self, request, grafana_path):

        target_url = f"{settings.GRAFANA_URL}/{grafana_path}"
        params = request.GET.dict()

        headers = {
            "Authorization": f"Bearer {settings.GRAFANA_API_KEY}",
            "Content-Type": request.content_type,  
        }

        if request.method == "POST":
            data = request.body  
        else:
            data = None

        grafana_resp = requests.request(
            method=request.method,
            url=target_url,
            headers=headers,
            params=request.GET.dict() if request.method == "GET" else None,
            data=data,
            stream=True,
        )

        content_type = grafana_resp.headers.get("Content-Type", "text/plain")

        # Se for HTML → reescreve os caminhos
        if "text/html" in content_type:
            text = grafana_resp.text
            text = text.replace('href="/', 'href="/api/grafana/')
            text = text.replace('src="/', 'src="/api/grafana/')
            # text = text.replace('fetch("/', 'fetch("/api/grafana/')

            response = HttpResponse(text, status=grafana_resp.status_code, content_type=content_type)
        else:
            response = StreamingHttpResponse(
                grafana_resp.iter_content(chunk_size=8192),
                status=grafana_resp.status_code,
                content_type=content_type,
            )
            excluded_headers = {"content-encoding", "transfer-encoding", "connection", "content-length"}
            for header, value in grafana_resp.headers.items():
                if header.lower() not in excluded_headers:
                    response[header] = value

        response["X-Frame-Options"] = "ALLOWALL"
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "*"

        return response