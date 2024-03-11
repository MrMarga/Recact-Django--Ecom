
from django.urls import path

from base.views import products_views as views

urlpatterns = [  
               
    
    path('',views.getProducts,name='products'),
    
    path('upload/',views.uploadImageProduct,name='product-image'),
    
    path('create/',views.createProduct,name='product-create'),
    
    
    
     
    path('<str:pk>/review',views.createProductReview,name='create-review'), 
    
    path('<str:pk>/',views.getProductById,name='product'), 
    
    path('update/<str:pk>/',views.updateProduct,name='product-update'), 
    
    path('delete/<str:pk>/',views.deleteProduct,name='product-delete'),
    
      
]