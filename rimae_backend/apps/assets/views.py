from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Asset
from .serializers import AssetSerializer
from apps.accounts.views import IsAdmin

class AssetListCreateView(generics.ListCreateAPIView):
    serializer_class = AssetSerializer
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]
    queryset = Asset.objects.all()
    filterset_fields = ['asset_type', 'folder']
    search_fields = ['name']
    
    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        serializer.save(
            created_by=self.request.user,
            file_size=file.size if file else 0,
            mime_type=file.content_type if file else ''
        )

class AssetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AssetSerializer
    permission_classes = [IsAdmin]
    queryset = Asset.objects.all()
