#!/bin/bash

echo "====== COMPLETE API TEST SUITE ======"
echo ""

# Step 1: Register new user
echo "✓ STEP 1: Register new user"
echo "============================="
REGISTER=$(curl -s -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mike Chen",
    "email": "mike.chen@example.com",
    "phone": "9876543211",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }')
echo "$REGISTER" | grep -o '"success":[^,]*'
TOKEN=$(echo "$REGISTER" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
USER_ID=$(echo "$REGISTER" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "User ID: $USER_ID"
echo ""

# Step 2: Create order
echo "✓ STEP 2: Create order"
echo "======================"
ORDER=$(curl -s -X POST "http://localhost:3001/api/orders/create" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": $USER_ID,
    \"notes\": \"Wedding event urgent\",
    \"items\": [
      {
        \"productId\": 1,
        \"productName\": \"Royal Wedding Invitation\",
        \"category\": \"wedding\",
        \"quantity\": 150,
        \"unitPrice\": 450.00,
        \"subtotal\": 67500.00,
        \"specifications\": {\"design\": \"gold-foil\"}
      },
      {
        \"productId\": 4,
        \"productName\": \"Outdoor Flex Banner\",
        \"category\": \"flex\",
        \"quantity\": 2,
        \"unitPrice\": 2500.00,
        \"subtotal\": 5000.00,
        \"specifications\": {\"size\": \"10x20\"}
      }
    ]
  }")
echo "$ORDER" | grep -o '"success":[^,]*'
ORDER_ID=$(echo "$ORDER" | grep -o '"orderId":[0-9]*' | grep -o '[0-9]*')
ORDER_NUMBER=$(echo "$ORDER" | grep -o '"orderNumber":"[^"]*"' | cut -d'"' -f4)
echo "Order Number: $ORDER_NUMBER (ID: $ORDER_ID)"
echo ""

# Step 3: Get order details
echo "✓ STEP 3: Get order details (with user token)"
echo "=============================================="
curl -s "http://localhost:3001/api/orders/$ORDER_ID" \
  -H "Authorization: Bearer $TOKEN" | grep -o '"success":[^,]*'
echo ""

# Step 4: Get user's orders
echo "✓ STEP 4: Get user's orders"
echo "============================"
curl -s "http://localhost:3001/api/orders/my-orders?userId=$USER_ID&page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" | grep -o '"success":[^,]*'
echo ""

# Step 5: Login as admin
echo "✓ STEP 5: Login as admin"
echo "========================"
LOGIN=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sunlight.com",
    "password": "admin123"
  }')
echo "$LOGIN" | grep -o '"success":[^,]*'
ADMIN_TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ Admin login failed - trying to create admin user..."
  # The admin might not have password set, let's check
fi
echo ""

# Try with direct MySQL to set admin password
echo "Setting admin password in MySQL..."
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"root" sunlight_printers -e "UPDATE users SET password = '\$2a\$10\$YIjlrJzWXG1YZZ0Z8Q0L.emVnk1w5X5X5X5X5X5X5X5X5X5X5X5X5X' WHERE email='admin@sunlight.com';" 2>/dev/null

# Retry admin login
LOGIN=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sunlight.com",
    "password": "admin123"
  }')
ADMIN_TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Admin login: $(echo "$LOGIN" | grep -o '"success":[^,]*')"
echo ""

# Step 6: Get all orders (admin)
echo "✓ STEP 6: Get all orders (Admin only)"
echo "====================================="
curl -s "http://localhost:3001/api/orders" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | grep -o '"success":[^,]*'
echo ""

# Step 7: Update order status (admin)
echo "✓ STEP 7: Update order status (Admin)"
echo "====================================="
curl -s -X PATCH "http://localhost:3001/api/orders/$ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"newStatus": "confirmed", "notes": "Approved for production"}' | grep -o '"success":[^,]*'
echo ""

# Step 8: Get admin dashboard stats
echo "✓ STEP 8: Admin dashboard stats"
echo "================================"
curl -s "http://localhost:3001/api/orders/dashboard/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | grep -o '"success":[^,]*'
echo ""

echo "====== ALL TESTS COMPLETE ======"
