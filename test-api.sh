#!/bin/bash

echo "====== Testing Sunlight Printers API ======"
echo ""

# Test 1: Health check
echo "✓ Test 1: Health Check"
curl -s http://localhost:8000/health
echo ""
echo ""

# Test 2: Create Order
echo "✓ Test 2: Create Order"
ORDER_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/orders/create" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "items": [
      {
        "productId": 1,
        "productName": "Royal Wedding Invitation",
        "category": "wedding",
        "quantity": 100,
        "unitPrice": 450.00,
        "subtotal": 45000.00,
        "specifications": {"paperType": "300gsm Matte"}
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
ORDER_ID=$(echo "$ORDER_RESPONSE" | grep -o '"orderId":[0-9]*' | grep -o '[0-9]*' || echo "1")
echo "Order ID: $ORDER_ID"
echo ""
echo ""

# Test 3: Get My Orders
echo "✓ Test 3: Get My Orders (User 2)"
curl -s "http://localhost:8000/api/orders/my-orders?userId=2&page=1&limit=10"
echo ""
echo ""

# Test 4: Get Order Details
echo "✓ Test 4: Get Order Details"
curl -s "http://localhost:8000/api/orders/$ORDER_ID"
echo ""
echo ""

echo "====== API Tests Complete ======"
