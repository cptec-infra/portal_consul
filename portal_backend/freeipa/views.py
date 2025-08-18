from django.http import JsonResponse
from .services.client import get_all_users, format_users, get_all_groups

def users_all(request):
    try:
        raw_users = get_all_users()
        user_formatted = format_users(raw_users)
        return JsonResponse({"usuarios": user_formatted}, status=200)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    
def groups_all(request):
    try:
        raw_groups = get_all_groups()
        return JsonResponse({"grupos": raw_groups}, status=200)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)