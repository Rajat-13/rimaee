"""
Settings Views (Admin)
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser

from ..models import BrandSettings
from ..viewmodels import BrandSettingsSerializer


class SettingsView(APIView):
    """
    GET  /settings/          - Get all settings
    PUT  /settings/brand/    - Update brand settings
    PUT  /settings/security/ - Update security (handled separately)
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        settings = BrandSettings.get_settings()
        serializer = BrandSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        settings = BrandSettings.get_settings()
        serializer = BrandSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
