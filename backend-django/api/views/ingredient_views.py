"""
Ingredient Views (Admin)
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from ..models import Ingredient
from ..viewmodels import IngredientSerializer


class IngredientViewSet(viewsets.ModelViewSet):
    """
    GET    /ingredients/           - List all ingredients
    GET    /ingredients/<id>/      - Get single ingredient
    POST   /ingredients/           - Create ingredient
    PUT    /ingredients/<id>/      - Update ingredient
    DELETE /ingredients/<id>/      - Delete ingredient
    """
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'origin', 'description']
    ordering_fields = ['name', 'category', 'cost_per_unit', 'stock_quantity']
    ordering = ['category', 'name']
