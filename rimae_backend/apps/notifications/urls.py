from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.views import IsAdmin

class NotificationsView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        return Response([])

urlpatterns = [path('', NotificationsView.as_view())]
