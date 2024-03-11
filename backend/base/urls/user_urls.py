from django.urls import path

from base.views import users_views as views

urlpatterns = [   
    path('login/',views.MyTokenObtainPair.as_view(), name='token_obtain_pair'),
     
    path('register/',views.registerUser,name='register'),
    path('profile/',views.getUserProfile,name='user-profile'),
    path('profile/update/',views.updateUserProfile,name='user-profile-update'),
    path('',views.getUsers,name='users'),
    
    
    path('<str:pk>/',views.getUserById,name='get-update-user'),
    
    path('update/<str:pk>/',views.updateUser,name='update-user'),
    
    path('delete/<str:pk>/',views.deleteUser,name='delete-user'),
]
