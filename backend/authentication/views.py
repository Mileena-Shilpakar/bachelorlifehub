from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.db import transaction
from .models import User, Profile
from .serializers import LoginSerializer, UserSerializer, ProfileSerializer
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

# for handling user login
class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            # Check if the user exists and authenticate
            user = User.objects.filter(email=email).first()
            if not user:
                return Response(
                    {"detail": "User with this email does not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = authenticate(email=email, password=password)
            if user is not None and user.is_active:
                # Generate refresh and access tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                response_data = {
                    "detail": "User logged in successfully.",
                    "refresh_token": str(refresh),
                    "access_token": access_token,
                    "user":{
                        "first_name": user.first_name,
                        "last_name":  user.last_name,
                        "email":      user.email
                    }
                    
                }
                return Response(response_data, status=status.HTTP_200_OK)

            return Response(
                {"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# for handling user registration
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            # Handle user creation within a transaction to ensure rollback on error
            with transaction.atomic():
                user = serializer.save()

                # Generate the refresh and access tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                response_data = {
                    "detail": "User registered successfully.",
                    "refresh_token": str(refresh),
                    "access_token": access_token,
                    "user":{
                        "first_name": user.first_name,
                        "last_name":  user.last_name,
                        "email":      user.email, 
                    }
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RetrieveUserAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()

    def get_object(self):
        return self.queryset.get(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile) 
        return Response(serializer.data, status=status.HTTP_200_OK)