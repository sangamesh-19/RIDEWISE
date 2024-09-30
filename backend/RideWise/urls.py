from django.urls import path
from .views import (
     TripData, FavoriteRouteViewSet, ReviewViewSet, CabServiceViewSet,   EstimateFareView, Signup, Login, Analytics 
)

# Define the urlpatterns explicitly for each viewset and view
urlpatterns = [
    # signup and login

    path('signup/', Signup.as_view(), name='signup'),
    path('login/', Login.as_view(), name='login'),

    # TripViewSet paths
    path('trips/', TripData.as_view(), name='trip'),

    # FavoriteRouteViewSet paths
    path('favorite_routes/', FavoriteRouteViewSet.as_view(), name='favoriteroute'),

    # ReviewViewSet paths
    path('reviews/', ReviewViewSet.as_view(), name='review-list'),

    # CabServiceViewSet paths
    path('cabservices/', CabServiceViewSet.as_view(), name='cabservice-list'),

    #price estimation
    path('estimate_fare/', EstimateFareView.as_view(), name='estimate_fare'),

    path('analytics/', Analytics.as_view(), name='analytics'),

    
]
