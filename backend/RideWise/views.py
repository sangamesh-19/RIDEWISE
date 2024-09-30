from rest_framework import viewsets,status
from .models import  Trips, FavoriteRoute, Review,CabService, User
from .serializers import TripSerializer, FavoriteRouteSerializer, ReviewSerializer, CabServiceSerializer,UserSerializer
from django.conf import settings
from django.views import View
import requests
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from django.http import JsonResponse, HttpResponse
from urllib.parse import urlencode
from django.utils.decorators import method_decorator
import json,random,time
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from django.db.models import Count, Avg, Func
from django.utils.timezone import localtime
from random import randint, uniform, choice
import decimal
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models.functions import ExtractHour


class FavoriteRouteViewSet(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        pickup_location = request.data.get('pickup_location')
        destination_location = request.data.get('destination_location')
        
        try:
            # Check if user exists
            user_exists = User.objects.filter(user_id=user_id).exists()
            if not user_exists:
                return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if the route already exists for the user
            route_exists = FavoriteRoute.objects.filter(
                user_id=user_id,
                pickup_location=pickup_location,
                destination_location=destination_location
            ).exists()
            
            if route_exists:
                return Response({'error': 'Route already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate and save the new route
            serializer = FavoriteRouteSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    def get(self, request):
        user_id = request.query_params.get('user_id')
        try:
            # Fetch all favorite routes for the given user_id
            favorite_routes = FavoriteRoute.objects.filter(user_id=user_id)
            serializer = FavoriteRouteSerializer(favorite_routes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except FavoriteRoute.DoesNotExist:
            return Response({'error': 'Favorite routes not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReviewViewSet(APIView):
    queryset = Review.objects.all()
    serializer = ReviewSerializer

    def post(self, request):
        user_id = request.data.get('user_id')
        service_name = request.data.get('service_name')  # Get service_name from payload
        try:
            user_exists = User.objects.filter(id=user_id).exists()
            if not user_exists:
                return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the first CabService object with matching service_name
            cab_services = CabService.objects.filter(service_name=service_name)
            if not cab_services.exists():
                return Response({'error': 'Service does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Assuming we take the first match
            cab_service = cab_services.first()
            
            # Update service_id in request.data with the matching service_id from CabService
            request.data['service_id'] = cab_service.service_id
            
            serializer = ReviewSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        user_id = request.data.get('user_id')
        try:
            review = Review.objects.get(user_id=user_id)
            serializer = ReviewSerializer(review)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CabServiceViewSet(APIView):
    def get(self, request):
        service_name = request.query_params.get('service_name', None)
        try:
            if service_name:
                cab_services = CabService.objects.filter(service_name=service_name)
            else:
                cab_services = CabService.objects.all()
                
            serializer = CabServiceSerializer(cab_services, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Signup(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password or not email:
            return Response({'error': 'Please provide username, password, and email'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create the user
            user = User.objects.create(
                username=username,
                email=email,
                password=password  # Consider hashing the password
            )
            
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': f'Failed to create user: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @method_decorator(csrf_exempt, name='dispatch')
class Login(APIView):
    def post(self, request):
        body = request.data
        username = body.get('username')
        password = body.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Please provide username and password'}, status=400)

        try:
            user = User.objects.get(username=username)
            if user.password == password:  # Ensure to hash passwords in production
                return JsonResponse({'message': 'Login successful', 'user_id': user.user_id, 'username': user.username}, status=200)
            else:
                return JsonResponse({'error': 'Invalid username or password'}, status=401)

        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)
# Fare estimation API
# Uber Pricing
UBER_PRICING = {
    'auto': {'base_rate': 24, 'per_km_rate': 8, 'per_min_rate': 1, 'operating_fee': 10},
    'go': {'base_rate': 40, 'per_km_rate': 11, 'per_min_rate': 1.5, 'operating_fee': 15},
    'moto': {'base_rate': 20, 'per_km_rate': 5, 'per_min_rate': 1, 'operating_fee': 7},
    'premier': {'base_rate': 60, 'per_km_rate': 20, 'per_min_rate': 2.5, 'operating_fee': 20},
    'uberxl': {'base_rate': 80, 'per_km_rate': 24, 'per_min_rate': 3, 'operating_fee': 25},
    'gosedan': {'base_rate': 50, 'per_km_rate': 14, 'per_min_rate': 2, 'operating_fee': 18},
    'uberxs': {'base_rate': 30, 'per_km_rate': 10, 'per_min_rate': 1.2, 'operating_fee': 12},
    'pool': {'base_rate': 20, 'per_km_rate': 8, 'per_min_rate': 1, 'operating_fee': 10},
    'xlplus': {'base_rate': 90, 'per_km_rate': 25, 'per_min_rate': 3.5, 'operating_fee': 30}
}

# Ola Pricing
OLA_PRICING = {
    'prime_sedan': {'base_rate': 50, 'base_distance': 1.9, 'per_km_rate': 14, 'per_min_rate': 2, 'operating_fee': 18},
    'mini': {'base_rate': 30, 'base_distance': 1.9, 'per_km_rate': 10, 'per_min_rate': 1.2, 'operating_fee': 12},
    'auto': {'base_rate': 25, 'base_distance': 2, 'per_km_rate': 8, 'per_min_rate': 1, 'operating_fee': 10},
    'share': {'base_rate': 20, 'base_distance': 1.9, 'per_km_rate': 7, 'per_min_rate': 1, 'operating_fee': 8},
    'rentals': {'base_rate': 300, 'base_distance': 10, 'per_km_rate': 15, 'per_min_rate': 2.5, 'operating_fee': 50},
    'outstation': {'base_rate': 1000, 'base_distance': 50, 'per_km_rate': 18, 'per_min_rate': 3, 'operating_fee': 100},
    'luxury': {'base_rate': 200, 'base_distance': 1.9, 'per_km_rate': 25, 'per_min_rate': 4, 'operating_fee': 50},
    'taxi_for_sure': {'base_rate': 40, 'base_distance': 1.9, 'per_km_rate': 12, 'per_min_rate': 1.5, 'operating_fee': 15}
}

# Namma Yatri Pricing

# Rapido Pricing
RAPIDO_PRICING = {
    'auto': {'base_rate': 20, 'per_km_rate': 6, 'per_min_rate': 0.8, 'operating_fee': 8},
    'bike': {'base_rate': 15, 'per_km_rate': 5, 'per_min_rate': 0.5, 'operating_fee': 5},
}

NAMMA_YATRI_PRICING = {
    'non_ac_mini': {'base_rate': 35, 'per_km_rate': 12, 'per_min_rate': 1.2, 'operating_fee': 15},
    'ac_mini': {'base_rate': 45, 'per_km_rate': 15, 'per_min_rate': 1.5, 'operating_fee': 20},
    'sedan': {'base_rate': 55, 'per_km_rate': 18, 'per_min_rate': 2, 'operating_fee': 25},
    'xl_cab': {'base_rate': 75, 'per_km_rate': 22, 'per_min_rate': 2.5, 'operating_fee': 30},
}
DEFAULT_SURGE_MULTIPLIER = 1.0
def calculate_fare(pricing, distance_km, time_min, surge_multiplier=DEFAULT_SURGE_MULTIPLIER):
    base_rate = pricing['base_rate']
    if 'base_distance' in pricing:
        base_distance = pricing['base_distance']
        distance_cost = 0 if distance_km <= base_distance else (distance_km - base_distance) * pricing['per_km_rate']
    else:
        distance_cost = distance_km * pricing['per_km_rate']
    
    time_cost = time_min * pricing['per_min_rate']
    total_fare = base_rate + distance_cost + time_cost + pricing['operating_fee']
    total_fare *= surge_multiplier
    
    return round(total_fare, 2)

def apply_variability(fare, max_variability=15):
    variability = random.uniform(-max_variability, max_variability)
    return round(fare + variability, 2)

class EstimateFareView(APIView):
    def post(self, request):
        try:
            body = json.loads(request.body)
            user_id = body.get('user_id')
            distance_km = float(body.get('distance_km'))
            time_min = float(body.get('time_min'))
            surge_multiplier = float(body.get('surge_multiplier', DEFAULT_SURGE_MULTIPLIER))
            
            # Seed random number generator for consistent variability during the request
            random.seed(f"{user_id}-{distance_km}-{time_min}-{time.time()}")
            
            # Check if the user exists
            if not User.objects.filter(user_id=user_id).exists():
                return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
            # Generate base fare estimates
            uber_fares = {
                'auto': calculate_fare(UBER_PRICING['auto'], distance_km, time_min, surge_multiplier),
                'go': calculate_fare(UBER_PRICING['go'], distance_km, time_min, surge_multiplier),
                'moto': calculate_fare(UBER_PRICING['moto'], distance_km, time_min, surge_multiplier),
                'premier': calculate_fare(UBER_PRICING['premier'], distance_km, time_min, surge_multiplier),
                'uberxl': calculate_fare(UBER_PRICING['uberxl'], distance_km, time_min, surge_multiplier),
                'gosedan': calculate_fare(UBER_PRICING['gosedan'], distance_km, time_min, surge_multiplier),
                'uberxs': calculate_fare(UBER_PRICING['uberxs'], distance_km, time_min, surge_multiplier),
                'pool': calculate_fare(UBER_PRICING['pool'], distance_km, time_min, surge_multiplier),
                'xlplus': calculate_fare(UBER_PRICING['xlplus'], distance_km, time_min, surge_multiplier)
            }
            
            ola_fares = {
                'prime_sedan': calculate_fare(OLA_PRICING['prime_sedan'], distance_km, time_min, surge_multiplier),
                'mini': calculate_fare(OLA_PRICING['mini'], distance_km, time_min, surge_multiplier),
                'auto': calculate_fare(OLA_PRICING['auto'], distance_km, time_min, surge_multiplier),
                'share': calculate_fare(OLA_PRICING['share'], distance_km, time_min, surge_multiplier),
                'rentals': calculate_fare(OLA_PRICING['rentals'], distance_km, time_min, surge_multiplier),
                'outstation': calculate_fare(OLA_PRICING['outstation'], distance_km, time_min, surge_multiplier),
                'luxury': calculate_fare(OLA_PRICING['luxury'], distance_km, time_min, surge_multiplier),
                'taxi_for_sure': calculate_fare(OLA_PRICING['taxi_for_sure'], distance_km, time_min, surge_multiplier)
            }
            
            namma_yatri_fares = {
                'non_ac_mini': calculate_fare(NAMMA_YATRI_PRICING['non_ac_mini'], distance_km, time_min, surge_multiplier),
                'ac_mini': calculate_fare(NAMMA_YATRI_PRICING['ac_mini'], distance_km, time_min, surge_multiplier),
                'sedan': calculate_fare(NAMMA_YATRI_PRICING['sedan'], distance_km, time_min, surge_multiplier),
                'xl_cab': calculate_fare(NAMMA_YATRI_PRICING['xl_cab'], distance_km, time_min, surge_multiplier)
            }
            
            rapido_fares = {
                'auto': calculate_fare(RAPIDO_PRICING['auto'], distance_km, time_min, surge_multiplier),
                'bike': calculate_fare(RAPIDO_PRICING['bike'], distance_km, time_min, surge_multiplier)
            }
            
            # Apply variability ensuring the difference is within the max limit
            max_difference = 15
            fares = {
                'uber': {service: apply_variability(fare, max_difference) for service, fare in uber_fares.items()},
                'ola': {service: apply_variability(fare, max_difference) for service, fare in ola_fares.items()},
                'namma_yatri': {service: apply_variability(fare, max_difference) for service, fare in namma_yatri_fares.items()},
                'rapido': {service: apply_variability(fare, max_difference) for service, fare in rapido_fares.items()}
            }
            
            # Ensure the difference between similar services is within the specified range
            for service in uber_fares.keys():
                if service in ola_fares and abs(fares['uber'][service] - fares['ola'][service]) > max_difference:
                    average_fare = (fares['uber'][service] + fares['ola'][service]) / 2
                    fares['uber'][service] = round(average_fare + random.uniform(-max_difference / 2, max_difference / 2), 2)
                    fares['ola'][service] = round(average_fare - random.uniform(-max_difference / 2, max_difference / 2), 2)
            
            response = {
                'distance_km': distance_km,
                'time_min': time_min,
                'surge_multiplier': surge_multiplier,
                'fares': fares
            }
            return Response(response)
        except (ValueError, TypeError, json.JSONDecodeError):
            return Response({'error': 'Invalid input, please provide valid JSON with numeric values for distance, time, and surge multiplier'}, status=status.HTTP_400_BAD_REQUEST)

class TripData(APIView):

    def post(self, request):
        body = json.loads(request.body)
        user_id = body.get('user_id')
        pickup_location = body.get('pickup_location')
        destination_location = body.get('destination_location')
        distance_km = body.get('distance_km')
        time_minutes = body.get('time_minutes')
        surge_multiplier = body.get('surge_multiplier')
        service_name = body.get('service_name')
        vehicle_type = body.get('vehicle_type')
        price = body.get('price')

        if not user_id or not pickup_location or not destination_location or not distance_km or not time_minutes or not surge_multiplier or not service_name or not vehicle_type or not price:
            return Response({'error': 'Please provide all the required data'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(user_id=user_id)  # Fetch the User instance

            trip = Trips.objects.create(
                user_id=user.user_id,  # Assign the User instance
                pickup_location=pickup_location,
                destination_location=destination_location,
                distance_km=distance_km,
                time_minutes=time_minutes,
                surge_multiplier=surge_multiplier,
                service_name=service_name,
                vehicle_type=vehicle_type,
                price=price
            )
            return Response({'message': 'Trip data stored successfully'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Failed to store trip data: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            try:
                user = User.objects.get(user_id=user_id)
                trips = Trips.objects.filter(user_id=user_id)
            except User.DoesNotExist:
                return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            trips = Trips.objects.all()
            
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TruncHour(Func):
    function = 'DATE_TRUNC'
    template = "%(function)s('hour', %(expressions)s)"

class Analytics(APIView):

    def get(self, request):
        # Total trips by service
        total_trips = Trips.objects.values('service_name').annotate(count=Count('id')).order_by('-count')
        
        # Average price by service
        avg_price = Trips.objects.values('service_name').annotate(avg_price=Avg('price')).order_by('-avg_price')
        
        # Average rating by service
        avg_rating = Review.objects.values('service_name').annotate(avg_rating=Avg('rating')).order_by('-avg_rating')
        
        service_usage_by_vehicle = Trips.objects.values('service_name', 'vehicle_type').annotate(count=Count('id')).order_by('-count')
        # Peak usage times
        peak_usage = Trips.objects.annotate(hour=ExtractHour('date')) \
                                  .values('service_name', 'hour') \
                                  .annotate(count=Count('id')) \
                                  .order_by('service_name', 'hour')
        
        # Initialize a dictionary to store counts per hour per service
        service_counts = {service_name: {hour: 0 for hour in range(24)} for service_name in ['Ola', 'Uber', 'Rapido']}
        
        # Populate hour counts with actual data
        for item in peak_usage:
            service_name = item['service_name']
            hour = item['hour']
            service_counts[service_name][hour] = item['count']
        
        # Format peak usage times for display
        formatted_peak_usage = []
        for service_name, counts_per_hour in service_counts.items():
            for hour, count in counts_per_hour.items():
                formatted_peak_usage.append({
                    'service_name': service_name,
                    'hour': f'{hour:02d}:00',
                    'count': count
                })
        
        
        average_ratings = Review.objects.values('service_name').annotate(avg_rating=Avg('rating')).order_by('-avg_rating')

        popular_routes = Trips.objects.values('pickup_location', 'destination_location').annotate(count=Count('id')).order_by('-count')
        
        # Service comparison
        trip_data = Trips.objects.values('service_name').annotate(
            avg_price=Avg('price'),
            avg_distance=Avg('distance_km'),
            avg_duration=Avg('time_minutes')
        ).order_by('-avg_price')
        
        rating_data = Review.objects.values('service_name').annotate(avg_rating=Avg('rating')).order_by('-avg_rating')

        response_data = {
            'total_trips_by_service': total_trips,
            'average_price_by_service': avg_price,
            'average_rating_by_service': avg_rating,
            'peak_usage_times': peak_usage,
            'popular_routes': popular_routes,
            'peak_usage_times_per_service': formatted_peak_usage,
            'service_usage_by_vehicle': service_usage_by_vehicle,
            'average_ratings':average_ratings,
            'service_comparison': {
                'trip_data': trip_data,
                'rating_data': rating_data
            }
        }

        return Response(response_data)

    
