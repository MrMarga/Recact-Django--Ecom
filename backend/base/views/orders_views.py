from django.shortcuts import render

from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from rest_framework.response import Response


from base.models import Product,Order,OrderItem,ShippingAddress
from base.products import products
from base.serializers import OrderSerializer
from rest_framework import status
from datetime import datetime
from django.utils.timezone import now


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    
    orderItems = data['orderItems']
    
    if orderItems and len(orderItems) == 0:
        return Response({'detail':'No Order Items'},status=status.HTTP_400_BAD_REQUEST)
    else:
        #(1) Create Order
        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice'],   
        )
        
        #(2) Shipping Address
        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode = data['shippingAddress']['postalCode'],
            country = data['shippingAddress']['country'], 
        )
        
        #(3) Create order items and set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])
            
            item = OrderItem.objects.create(
                product = product,
                order = order,
                name = product.name,
                qty = i['qty'],
                price = i['price'],
                image = product.image.url,
            )
        
            #(4) Update Stock
            product.countInStock -= item.qty 
            product.save()
            
        serializer =  OrderSerializer(order, many=False)
      
        return Response(serializer.data)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])   
def getMyOrders(request):
    user = request.user
    orders = Order.objects.filter(user=user)  
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data) 



@api_view(['GET'])
@permission_classes([IsAdminUser])   
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data) 




@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteOrder(request, pk):
    try:
        order = Order.objects.get(_id=pk)
    except Order.DoesNotExist:
        return Response('Order not found', status=404)

    # Check if the user has permission to delete this order
    if order.user != request.user:
        return Response('You do not have permission to delete this order', status=403)

    order.delete()
    return Response('Order was deleted', status=204)
   
  

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    
    user = request.user
    
    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail':'Not authorized to view this order'},
            status= status.HTTP_400_BAD_REQUEST)
            
    except:
        return Response({'detail':'Order does not exists'},
            status= status.HTTP_400_BAD_REQUEST)
        
        

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderPaid(request, pk):
    order = Order.objects.get(_id = pk)
    
    order.isPaid = True
    order.paidAt = now()
    order.save()
    
    return Response('Order Is Paid')
    


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id = pk)
    
    order.isDelivered = True
    order.deliveredAt = now()
    order.save()

    return Response('Order was delivered')
    
    