# Create your views here.
from .models import *
from rest_framework import generics, status
from .serializers import *
from django.shortcuts import redirect,render
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated

#회원가입 중복확인_최종
class UserRegistration(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#이메일 반환
class FindUserEmailView(APIView):
    def post(self, request, format=None):
        serializer = UserEmailSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            phone = serializer.validated_data['phone']
            
            try:
                user = User.objects.get(name=name, phone=phone)
                return Response({'email': user.email})
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        else:
            return Response(serializer.errors, status=400)

#비밀번호 반환   
class GetUserPasswordView(APIView):
    def post(self, request, format=None):
        serializer = UserPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            phone = serializer.validated_data['phone']
            name = serializer.validated_data['name']
            
            try:
                user = User.objects.get(email=email, phone=phone, name=name)
                return Response({'password': user.password})
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        else:
            return Response(serializer.errors, status=400)

#회원정보 확인
class UserExistence(APIView):
      def post(self, request, format=None):
        serializer = UserExistenceSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            # 유효성 검사를 통과한 경우
            return Response({'message': '사용자 정보가 일치합니다.'})
        else:
            # 유효성 검사를 통과하지 못한 경우
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 비밀번호 수정
class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]

    @method_decorator(login_required)
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data['new_password']

            user.set_password(new_password)
            user.save()
            return Response({"message": "비밀번호가 업데이트되었습니다."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#프로필
    # class UserProfileUpdateView(generics.UpdateAPIView):
#     queryset = UserProfile.objects.all()
#     serializer_class = UserProfileSerializer

#     def perform_update(self, serializer):
#         # 패스워드를 변경하려면 따로 처리해야 함
#         password = serializer.validated_data.get('password')
#         if password:
#             instance = serializer.save()
#             instance.user.set_password(password)
#             instance.user.save()
#         else:
#             serializer.save()