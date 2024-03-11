from django.urls import path
from base.views import orders_views as views

urlpatterns = [
    path('',views.getOrders,name='orders-add'),  
    path('add/',views.addOrderItems,name='orders-add'),   
    path('myorders/',views.getMyOrders,name='myorders'),
    
    path('delete/<str:pk>/',views.deleteOrder,name='delete-order'),
    
    path('<str:pk>/deliver/',views.updateOrderToDelivered,name='order-delivered'),
    
    path('<str:pk>/',views.getOrderById,name='user-order'),
    path('<str:pk>/pay/',views.updateOrderPaid,name='pay'),
    
    
    path('delete/<str:pk>/',views.deleteOrder,name='delete-order'),
]