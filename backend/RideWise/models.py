from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.username

class FavoriteRoute(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)  # Updated to refer to User model
    pickup_location = models.CharField(max_length=100)
    destination_location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user} - {self.pickup_location} to {self.destination_location}"

class Trips(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Updated to refer to User model
    pickup_location = models.CharField(max_length=100)
    destination_location = models.CharField(max_length=100)
    distance_km = models.DecimalField(max_digits=10, decimal_places=2)
    time_minutes = models.FloatField()
    surge_multiplier = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    service_name = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.user.username} - {self.pickup_location} to {self.destination_location}"

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Updated to refer to User model
    service_name = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=100)
    rating = models.FloatField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.service_name} - {self.rating}/5"

class CabService(models.Model):
    service_id = models.CharField(max_length=100)
    service_name = models.CharField(max_length=100, default='Uber')
    vehicle_type = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.service_name
