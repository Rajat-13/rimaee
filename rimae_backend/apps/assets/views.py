import mimetypes
from django.db.models import Sum
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Asset
from .serializers import AssetSerializer

class AssetViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Asset.objects.all().order_by('-created_at')
    serializer_class = AssetSerializer

        # apps/assets/views.py
    def perform_create(self, serializer):
        file_obj = self.request.data.get('file')
        
        # 1. Detect Mime Type
        mime_type, _ = mimetypes.guess_type(file_obj.name)
        mime_type = mime_type or 'application/octet-stream'
        
        # 2. Determine Asset Type
        asset_type = 'image'
        if 'video' in mime_type:
            asset_type = 'video'
        elif 'gif' in mime_type or file_obj.name.lower().endswith('.gif'):
            asset_type = 'gif'

        # 3. Save with backend-calculated values
        serializer.save(
            file_size=file_obj.size,
            mime_type=mime_type,
            asset_type=asset_type,
            used_in=[] # Initialize as empty list for your JSONB/JSON column
        )

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        
        # Calculate Total Storage Usage
        total_bytes = Asset.objects.aggregate(total=Sum('file_size'))['total'] or 0
        total_mb = round(total_bytes / (1024 * 1024), 2)

        return Response({
            'total_memory_utilisation_mb': total_mb,
            'assets': response.data 
        })

    def destroy(self, request, *args, **kwargs):
        asset = self.get_object()
        if asset.file:
            asset.file.delete(save=False) 
        return super().destroy(request, *args, **kwargs)