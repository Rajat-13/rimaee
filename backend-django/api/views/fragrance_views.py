"""
Fragrance Views (Admin)
"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from ..models import Fragrance, FragranceImage
from ..viewmodels import FragranceSerializer, FragranceListSerializer


class FragranceViewSet(viewsets.ModelViewSet):
    """
    GET    /fragrances/           - List all fragrances (paginated)
    GET    /fragrances/<id>/      - Get single fragrance
    POST   /fragrances/           - Create fragrance
    PUT    /fragrances/<id>/      - Update fragrance
    DELETE /fragrances/<id>/      - Delete fragrance
    """
    queryset = Fragrance.objects.all()
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status', 'is_active', 'concentration']
    search_fields = ['name', 'sku', 'description']
    ordering_fields = ['price', 'created_at', 'stock_quantity', 'name']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return FragranceListSerializer
        return FragranceSerializer


class FragranceImageUploadView(APIView):
    """POST /fragrances/<id>/images/ - Upload fragrance images"""
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk):
        try:
            fragrance = Fragrance.objects.get(pk=pk)
        except Fragrance.DoesNotExist:
            return Response(
                {'error': 'Fragrance not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        images = request.FILES.getlist('images')
        is_cover = request.data.get('is_cover', False) == 'true'
        
        created_images = []
        for idx, image in enumerate(images):
            # If this is cover, unset other covers
            if is_cover and idx == 0:
                FragranceImage.objects.filter(fragrance=fragrance, is_cover=True).update(is_cover=False)
            
            img = FragranceImage.objects.create(
                fragrance=fragrance,
                image=image,
                is_cover=(is_cover and idx == 0),
                order=fragrance.images.count()
            )
            created_images.append({
                'id': img.id,
                'url': img.image.url,
                'is_cover': img.is_cover
            })
        
        return Response({'images': created_images}, status=status.HTTP_201_CREATED)


class FragranceImageDeleteView(APIView):
    """DELETE /fragrances/<id>/images/<img_id>/ - Delete fragrance image"""
    permission_classes = [IsAdminUser]

    def delete(self, request, pk, img_id):
        try:
            image = FragranceImage.objects.get(pk=img_id, fragrance_id=pk)
            image.image.delete()  # Delete file
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except FragranceImage.DoesNotExist:
            return Response(
                {'error': 'Image not found'},
                status=status.HTTP_404_NOT_FOUND
            )
