#!/bin/bash

echo "====== Testing All 6 Sunlight Printers API Endpoints ======"
echo ""

# Test 1: Create Order
echo "TEST 1: POST /api/orders/create - Create new order"
echo "=================================================="
ORDER_RESPONSE=$(curl -s -X POST "http://localhost:8001/api/orders/create" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "notes": "Urgent order for wedding",
    "items": [
      {
        "productId": 1,
        "productName": "Royal Wedding Invitation",
        "category": "wedding",
        "quantity": 100,
        "unitPrice": 450.00,
        "subtotal": 45000.00,
        "specifications": {"paperType": "300gsm Matte", "color": "gold"}
      },
      {
        "productId": 2,
        "productName": "Corporate Visiting Cards",
        "category": "visiting",
        "quantity": 500,
        "unitPrice": 199.00,
        "subtotal": 99500.00,
        "specifications": {"paperType": "250gsm Matte"}
      }
    ]
  }')
echo "$ORDER_RESPONSE"
ORDER_ID=$(echo "$ORDER_RESPONSE" | grep -o '"orderId":[0-9]*' | grep -o '[0-9]*' | head -1)
ORDER_NUMBER=$(echo "$ORDER_RESPONSE" | grep -o '"orderNumber":"[^"]*"' | cut -d'"' -f4)
echo "Created Order ID: $ORDER_ID, Order Number: $ORDER_NUMBER"
echo ""
echo ""

# Test 2: Get Order Details (public endpoint)
echo "TEST 2: GET /api/orders/:id - Get order details"
echo "=================================================="
curl -s "http://localhost:8001/api/orders/$ORDER_ID"
echo ""
echo ""

# Test 3: Get My Orders
echo "TEST 3: GET /api/orders/my-orders?userId=X - Get user's orders"
echo "=================================================="
curl -s "http://localhost:8001/api/orders/my-orders?userId=2&page=1&limit=10"
echo ""
echo ""

# Test 4: Get All Orders (Admin - requires token)
echo "TEST 4: GET /api/orders - Get all orders (PROTECTED - requires token)"
echo "=================================================="
curl -s -X GET "http://localhost:8001/api/orders" \
  -H "Content-Type: application/json"
echo ""
echo ""

# Test 5: Update Order Status (Admin - requires token)
echo "TEST 5: PATCH /api/orders/:id/status - Update order status (PROTECTED)"
echo "=================================================="
curl -s -X PATCH "http://localhost:8001/api/orders/$ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -d '{"newStatus": "confirmed", "notes": "Order confirmed by admin"}' 
echo ""
echo ""

# Test 6: Get Dashboard Stats (Admin - requires token)
echo "TEST 6: GET /api/orders/dashboard/stats - Admin dashboard stats (PROTECTED)"
echo "=================================================="
curl -s -X GET "http://localhost:8001/api/orders/dashboard/stats" \
  -H "Content-Type: application/json"
echo ""
echo ""

echo "====== API Tests Complete ======"
