#!/bin/bash
# 🧪 Integration Tests for withdrawal-secure.php API
# Tests real HTTP requests with various payloads

API_URL="http://localhost:8000/api/withdrawal-secure.php"
PASS_COUNT=0
FAIL_COUNT=0

echo "🧪 WITHDRAWAL SECURE API - INTEGRATION TESTS"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
pass_test() {
    echo -e "${GREEN}✅ PASS:${NC} $1"
    ((PASS_COUNT++))
}

fail_test() {
    echo -e "${RED}❌ FAIL:${NC} $1"
    ((FAIL_COUNT++))
}

info_test() {
    echo -e "${YELLOW}ℹ️  INFO:${NC} $1"
}

# Test 1: Missing fields
echo "TEST 1: Missing Required Fields"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{}')

if echo "$RESPONSE" | grep -q "Missing required fields"; then
    pass_test "Missing fields rejected"
else
    fail_test "Missing fields should be rejected"
fi
echo ""

# Test 2: Invalid JSON
echo "TEST 2: Invalid JSON Format"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{invalid json}')

if echo "$RESPONSE" | grep -q "Invalid request format"; then
    pass_test "Invalid JSON rejected"
else
    fail_test "Invalid JSON should be rejected"
fi
echo ""

# Test 3: SQL Injection attempt
echo "TEST 3: SQL Injection Protection"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": "123 OR 1=1--",
    "wallet_address": "7xKXtg2CZHJRLZqgcrJwFWP3UhB3wxyBqLKHBHuT5Rwb",
    "amount": 10000
  }')

if echo "$RESPONSE" | grep -q "Authentication failed\|Invalid"; then
    pass_test "SQL injection blocked"
else
    fail_test "SQL injection NOT blocked"
fi
echo ""

# Test 4: Invalid wallet address
echo "TEST 4: Invalid Wallet Address"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "wallet_address": "invalid_wallet",
    "amount": 10000
  }')

if echo "$RESPONSE" | grep -q "Invalid wallet address"; then
    pass_test "Invalid wallet address rejected"
else
    fail_test "Invalid wallet address should be rejected"
fi
echo ""

# Test 5: Negative amount
echo "TEST 5: Negative Amount Protection"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "wallet_address": "7xKXtg2CZHJRLZqgcrJwFWP3UhB3wxyBqLKHBHuT5Rwb",
    "amount": -1000
  }')

if echo "$RESPONSE" | grep -q "Amount must be positive\|Invalid amount"; then
    pass_test "Negative amount rejected"
else
    fail_test "Negative amount should be rejected"
fi
echo ""

# Test 6: Amount below minimum
echo "TEST 6: Amount Below Minimum"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "wallet_address": "7xKXtg2CZHJRLZqgcrJwFWP3UhB3wxyBqLKHBHuT5Rwb",
    "amount": 500
  }')

if echo "$RESPONSE" | grep -q "Minimum withdrawal is 1,000 TAMA"; then
    pass_test "Amount below minimum rejected"
else
    fail_test "Amount below minimum should be rejected"
fi
echo ""

# Test 7: Amount above maximum
echo "TEST 7: Amount Above Maximum"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "wallet_address": "7xKXtg2CZHJRLZqgcrJwFWP3UhB3wxyBqLKHBHuT5Rwb",
    "amount": 2000000
  }')

if echo "$RESPONSE" | grep -q "Maximum withdrawal is 1,000,000 TAMA"; then
    pass_test "Amount above maximum rejected"
else
    fail_test "Amount above maximum should be rejected"
fi
echo ""

# Test 8: Invalid HTTP method
echo "TEST 8: Invalid HTTP Method (GET)"
RESPONSE=$(curl -s -X GET "$API_URL")

if echo "$RESPONSE" | grep -q "Method not allowed"; then
    pass_test "GET method rejected"
else
    fail_test "GET method should be rejected"
fi
echo ""

# Test 9: CORS preflight
echo "TEST 9: CORS Preflight (OPTIONS)"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$API_URL")

if [ "$HTTP_CODE" = "200" ]; then
    pass_test "OPTIONS method allowed for CORS"
else
    fail_test "OPTIONS method should return 200"
fi
echo ""

# Test 10: Integer overflow
echo "TEST 10: Integer Overflow Protection"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "wallet_address": "7xKXtg2CZHJRLZqgcrJwFWP3UhB3wxyBqLKHBHuT5Rwb",
    "amount": "999999999999999999999"
  }')

if echo "$RESPONSE" | grep -q "Invalid amount\|out of range"; then
    pass_test "Integer overflow blocked"
else
    fail_test "Integer overflow should be blocked"
fi
echo ""

# Test 11: Wallet with invalid characters
echo "TEST 11: Wallet Address with Invalid Characters"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "wallet_address": "Invalid0OIl!!!@@@111111111111111111",
    "amount": 10000
  }')

if echo "$RESPONSE" | grep -q "Invalid wallet address"; then
    pass_test "Invalid characters in wallet rejected"
else
    fail_test "Invalid characters should be rejected"
fi
echo ""

# Test 12: Empty telegram_id
echo "TEST 12: Empty telegram_id"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": "",
    "wallet_address": "7xKXtg2CZHJRLZqgcrJwFWP3UhB3wxyBqLKHBHuT5Rwb",
    "amount": 10000
  }')

if echo "$RESPONSE" | grep -q "Missing telegram_id\|Authentication failed"; then
    pass_test "Empty telegram_id rejected"
else
    fail_test "Empty telegram_id should be rejected"
fi
echo ""

# Summary
echo ""
echo "=============================================="
echo "TEST SUMMARY"
echo "=============================================="
echo "Total Tests: $((PASS_COUNT + FAIL_COUNT))"
echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"

if [ $FAIL_COUNT -eq 0 ]; then
    echo ""
    echo "🎉 ALL INTEGRATION TESTS PASSED!"
    exit 0
else
    echo ""
    echo "⚠️ SOME INTEGRATION TESTS FAILED!"
    exit 1
fi
