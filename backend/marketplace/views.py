from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProcurementOrder, PriceListing, ProductListing
from .serializers import PriceListingSerializer, ProcurementOrderSerializer, ProductListingSerializer

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
        serializer = PriceListingSerializer(request)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class OrderListAPIView(APIView):
    def get(self, request):
        order = ProcurementOrder.objects.all()
        serializer = ProcurementOrderSerializer(order)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ProcurementOrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


