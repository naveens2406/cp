#!/bin/bash

echo "====== Testing Authentication & All Order Endpoints ======"
echo ""

# Test 1: Register new user
echo "TEST 1: POST /api/auth/register - Register new user"
echo "====================================================="
REGISTER_RESPONSE=$(curl -s -X POST "http://localhost:8001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "phone": "9876543210",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }')
echo "$REGISTER_RESPONSE"
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "User ID: $USER_ID, Token: ${TOKEN:0:50}..."
echo ""
echo ""

# Test 2: Create order with new user
echo "TEST 2: POST /api/orders/create - Create order"
echo "================================================"
ORDER_RESPONSE=$(curl -s -X POST "http://localhost:8001/api/orders/create" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": $USER_ID,
    \"notes\": \"Urgent order\",
    \"items\": [
      {
        \"productId\": 3,
        \"productName\": \"Event Poster Design\",
        \"category\": \"poster\",
        \"quantity\": 50,
        \"unitPrice\": 350.00,
        \"subtotal\": 17500.00,
        \"specifications\": {\"size\": \"A2\", \"color\": \"full-color\"}
      }
    ]
  }")
echo "$ORDER_RESPONSE"
ORDER_ID=$(echo "$ORDER_RESPONSE" | grep -o '"orderId":[0-9]*' | grep -o '[0-9]*' | head -1)
echo "Created Order ID: $ORDER_ID"
echo ""
echo ""

# Test 3: Get order details (with token)
echo "TEST 3: GET /api/orders/:id - Get order details (with token)"
echo "============================================================="
curl -s "http://localhost:8001/api/orders/$ORDER_ID" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# Test 4: Get my orders (with token)
echo "TEST 4: GET /api/orders/my-orders - Get user's orders (with token)"
echo "=================================================================="
curl -s "http://localhost:8001/api/orders/my-orders?userId=$USER_ID&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# Test 5: Login with existing admin user
echo "TEST 5: POST /api/auth/login - Login as admin"
echo "=============================================="
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sunlight.com",
    "password": "admin123"
  }')
echo "$LOGIN_RESPONSE"
ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Admin Token: ${ADMIN_TOKEN:0:50}..."
echo ""
echo ""

# Test 6: Get all orders (admin only)
echo "TEST 6: GET /api/orders - Get all orders (Admin only, with token)"
echo "================================================================="
curl -s "http://localhost:8001/api/orders" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
echo ""
echo ""

# Test 7: Update order status (admin only)
echo "TEST 7: PATCH /api/orders/:id/status - Update order status (Admin only)"
echo "========================================================================"
curl -s -X PATCH "http://localhost:8001/api/orders/$ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"newStatus": "confirmed", "notes": "Order confirmed and ready for production"}'
echo ""
echo ""

# Test 8: Get dashboard stats (admin only)
echo "TEST 8: GET /api/orders/dashboard/stats - Admin dashboard stats"
echo "==============================================================="
curl -s "http://localhost:8001/api/orders/dashboard/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
echo ""
echo ""

echo "====== All Tests Complete ======"
