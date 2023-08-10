from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .models import Products, Purchase, Card
from .serializers import ProductSerializer, PurchaseSerializer, CardSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action
from .permissions import ReadOnly
from rest_framework import viewsets, permissions, status
from rest_framework.filters import SearchFilter
import random
import string

class ProductViewSet(ModelViewSet) :
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [ReadOnly]
    
    # 검색 기능 
    filter_backends = [SearchFilter]
    search_fields = ['name']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.recent_searches = []  # 검색어를 저장할 배열

    def add_to_recent_searches(self, query):
        if query :
            self.recent_searches.insert(0, query)
            if len(self.recent_searches) > 5:
                self.recent_searches.pop()

    # 검색 결과에 접근할 때마다 검색어를 배열에 추가
    def list(self, request, *args, **kwargs):
        search_query = self.request.query_params.get('search', None)
        self.add_to_recent_searches(search_query)
        return super().list(request, *args, **kwargs)
    
    # products/카테고리명(ex.cate1)/ : 카테고리 별로 출력 
    @action(detail=False, methods=['get'])
    def list_by_category(self, request, category=None):
        products = Products.objects.filter(category=category)
        serializer = self.serializer_class(products, many=True)
        return Response(serializer.data)

    # detail ) products/카테고리명/product_id/ : 각 항목의 detail
    @action(detail=True, methods=['get'])
    def product_detail(self, request, category=None, product_id=None):
        product = get_object_or_404(Products, category=category, product_id=product_id)
        data = {
            'id': product.product_id,
            'name': product.name,
            'price': product.price,
            'image' : product.image.url, 
            'category' : product.category,
        }
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def recent_searches_list(self, request):
        return Response(self.recent_searches)

# main -> 카테고리 별 두 개씩 가져오는 부분
class MainProductListView(APIView):
    def get(self, request, *args, **kwargs):
        categories = ['cate1', 'cate2', 'cate3', 'cate4', 'cate5', 'cate6']
        products_list = []

        for category in categories:
            products = Products.objects.filter(category=category)[:2]
            serializer = ProductSerializer(products, many=True)
            products_list.extend(serializer.data)

        return Response(products_list, status=status.HTTP_200_OK)

class CardPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.is_authenticated
        return True
    
class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [CardPermission]

    def create(self, request, *args, **kwargs):
        num = ''.join(random.choices(string.digits, k=16))
        cvc = ''.join(random.choices(string.digits, k=3))
        pw = ''.join(random.choices(string.digits, k=4))
        
        serializer = self.get_serializer(data={
            'num': num,
            'cvc': cvc,
            'pw': pw,
            'customer': request.user.id,  # 또는 적절한 user 식별자
        })
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({"message": "Card created successfully"}, status=status.HTTP_201_CREATED)

    
# Purchase 
class PurchaseViewSet(ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer

    def create(self, request, *args, **kwargs):
        # request Body ) 프론트에서 받아올 것들 3개 -> 개수 / 결제 타입 / 상품 product_id
        count = int(request.data.get('count'))
        purchase_type = request.data.get('purchase_type')
        custom_product_id = request.data.get('product')
        register = request.data.get('register') # 카드 등록 여부 프론트 한테 받아옵니다 (True, False)
        if register == None : 
            register = False # 만약 못 받아오면 우선 -> False가 되도록 !! 
        
        if register == False and purchase_type == "type2" :
            return Response({"message" : "카드가 등록되지 않았습니다."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not request.user.is_authenticated :
            return Response({"message" : "로그인을 해주세요."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # 커스텀 product_id로 상품을 조회하고 나머지 필드 값 설정
        product = Products.objects.get(product_id=custom_product_id)
        total = int(product.price * count)

        purchase = Purchase(
            image=product.image,
            name=product.name,
            price=product.price,
            category=product.category,
            count=count,
            total=total,
            customer=request.user,
            product=product,
            purchase_type=purchase_type,
            register=register 
        )
        purchase.save()

        serializer = self.serializer_class(purchase)
        return Response(serializer.data)


# 마이페이지
# 카드 부분 정보 가져오는 코드는 써놨어요 ! 근데 지금 우선 회원가입을 하자마자 -> 카드 생성 ! 이 작업이 안되서 아직 카드를 못 불러오네요 ㅜㅜ
# 그 부분 되면 주석 풀고 /mypage/ 실행 했을 때 나오는지 확인 후 api 명세서 수정부탁해요 !! 
class UserProfileCardPurchasesView(APIView):
    # permission_classes = [CardPermission]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"message": "로그인을 해주세요."}, status=status.HTTP_401_UNAUTHORIZED)

        user = request.user

        profile_data = {
            'id' : user.id,
            'name' : user.name,
            'email': user.email,
            'phone': user.phone,
        }

        # cards = Card.objects.filter(customer=user)
        # card_serializer = CardSerializer(cards, many=True)

        purchases = Purchase.objects.filter(customer=user)
        purchase_serializer = PurchaseSerializer(purchases, many=True)

        data = {
            'profile': profile_data,
            # 'card': card_serializer.data,
            'purchases': purchase_serializer.data,
        }

        return Response(data, status=status.HTTP_200_OK)