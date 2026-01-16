"""
Address Views
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from ..models import Address
from ..viewmodels import AddressSerializer


class AddressViewSet(viewsets.ModelViewSet):
    """
    GET    /addresses/              - List user addresses
    POST   /addresses/              - Create new address
    GET    /addresses/<id>/         - Get single address
    PUT    /addresses/<id>/         - Update address
    DELETE /addresses/<id>/         - Delete address
    PUT    /addresses/<id>/default/ - Set as default
    """
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user, is_active=True)

    @action(detail=True, methods=['put'])
    def default(self, request, pk=None):
        address = self.get_object()
        
        # Remove default from all other addresses
        Address.objects.filter(user=request.user, is_default=True).update(is_default=False)
        
        # Set this as default
        address.is_default = True
        address.save()
        
        return Response(AddressSerializer(address).data)

    def destroy(self, request, pk=None):
        """Soft delete - just mark as inactive"""
        address = self.get_object()
        address.is_active = False
        address.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
