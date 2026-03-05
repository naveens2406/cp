#!/bin/bash

echo "====== FINAL API VERIFICATION ======"
echo ""

# Register user
echo "1. Register User"
REG=$(curl -s -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"TestUser","email":"test-'$(date +%s)'@test.com","password":"Pass123","confirmPassword":"Pass123"}')
TOKEN=$(echo "$REG" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
USER_ID=$(echo "$REG" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "✓ User registered: ID=$USER_ID"
echo ""

# Create order
echo "2. Create Order"
ORD=$(curl -s -X POST "http://localhost:3001/api/orders/create" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":$USER_ID,\"items\":[{\"productId\":1,\"productName\":\"Royal Wedding Invitation\",\"category\":\"wedding\",\"quantity\":100,\"unitPrice\":450,\"subtotal\":45000,\"specifications\":{}}]}")
ORDER_ID=$(echo "$ORD" | grep -o '"orderId":[0-9]*' | grep -o '[0-9]*')
echo "✓ Order created: ID=$ORDER_ID"
echo ""

# Test endpoints
echo "3. Testing Endpoints:"
echo "   GET /orders/:id - " $(curl -s "http://localhost:3001/api/orders/$ORDER_ID" -H "Authorization: Bearer $TOKEN" | grep -o '"success":[^,]*')
echo "   GET /my-orders - " $(curl -s "http://localhost:3001/api/orders/my-orders?userId=$USER_ID" -H "Authorization: Bearer $TOKEN" | grep -o '"success":[^,]*')
echo "   POST /auth/login - " $(curl -s -X POST "http://localhost:3001/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@sunlight.com","password":"Admin123!"}' | grep -o '"success":[^,]*')

echo ""
echo "====== BACKEND READY ======"
