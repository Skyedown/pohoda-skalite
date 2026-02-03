#!/bin/bash

echo "========================================="
echo "Testing Admin Settings API"
echo "========================================="
echo ""

API_URL="http://localhost:3001"

echo "1. Testing GET /api/admin-settings"
echo "-----------------------------------"
curl -s $API_URL/api/admin-settings | jq '.'
echo ""
echo ""

echo "2. Testing POST /api/admin-settings (set to disabled)"
echo "------------------------------------------------------"
curl -s -X POST $API_URL/api/admin-settings \
  -H "Content-Type: application/json" \
  -d '{"mode":"disabled","waitTimeMinutes":60}' | jq '.'
echo ""
echo ""

echo "3. Verify settings changed (GET again)"
echo "---------------------------------------"
curl -s $API_URL/api/admin-settings | jq '.'
echo ""
echo ""

echo "4. Testing POST /api/admin-settings (set to waitTime)"
echo "-------------------------------------------------------"
curl -s -X POST $API_URL/api/admin-settings \
  -H "Content-Type: application/json" \
  -d '{"mode":"waitTime","waitTimeMinutes":90}' | jq '.'
echo ""
echo ""

echo "5. Verify settings changed (GET again)"
echo "---------------------------------------"
curl -s $API_URL/api/admin-settings | jq '.'
echo ""
echo ""

echo "6. Testing POST /api/admin-settings (set back to off)"
echo "------------------------------------------------------"
curl -s -X POST $API_URL/api/admin-settings \
  -H "Content-Type: application/json" \
  -d '{"mode":"off","waitTimeMinutes":60}' | jq '.'
echo ""
echo ""

echo "7. Final verification (GET again)"
echo "----------------------------------"
curl -s $API_URL/api/admin-settings | jq '.'
echo ""
echo ""

echo "8. Check the actual file on disk"
echo "---------------------------------"
if [ -f "dist/data/adminSettings.json" ]; then
  echo "File contents:"
  cat dist/data/adminSettings.json | jq '.'
else
  echo "⚠️  File not found at dist/data/adminSettings.json"
fi
echo ""

echo "========================================="
echo "✅ Test Complete!"
echo "========================================="
