from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import ProcurementOrder, PriceListing, ProductListing
from .serializers import PriceListingSerializer, ProcurementOrderSerializer, ProductListingSerializer

User = get_user_model()

class ProductListAPIView(APIView):
     def get(self, request):
        items = ProductListing.objects.all()
        serializer = ProductListingSerializer(items, many=True)
        return Response(serializer.data)
     
class PriceListAPIView(APIView):
    def get(self, request):
        items = PriceListing.objects.filter(is_available=True)
        serializer = PriceListingSerializer(items, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PriceListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class OrderListAPIView(APIView):
    def get(self, request):
        order = ProcurementOrder.objects.all()
        serializer = ProcurementOrderSerializer(order, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        payload = request.data.copy()

        # Temporary fallback: auto-assign a default manufacturer if frontend does not send one.
        if not payload.get('MANUFACTURER'):
            manufacturer, _ = User.objects.get_or_create(
                username='default_manufacturer',
                defaults={
                    'CATEGORY': 'MANUFACTURER',
                    'SHOP_NAME': 'Default Manufacturer',
                }
            )
            payload['MANUFACTURER'] = manufacturer.id

        serializer = ProcurementOrderSerializer(data=payload)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


