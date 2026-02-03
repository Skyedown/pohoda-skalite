#!/bin/bash

echo "========================================="
echo "Testing Admin Settings in Docker"
echo "========================================="
echo ""

echo "1. Check if API container is running"
echo "------------------------------------"
docker ps --filter name=pizza-pohoda-api --format "table {{.Names}}\t{{.Status}}"
echo ""

echo "2. Test GET /api/admin-settings"
echo "--------------------------------"
curl -s http://localhost:3001/api/admin-settings | jq '.'
echo ""
echo ""

echo "3. Test POST (set to disabled)"
echo "------------------------------"
curl -s -X POST http://localhost:3001/api/admin-settings \
  -H "Content-Type: application/json" \
  -d '{"mode":"disabled","waitTimeMinutes":60}' | jq '.'
echo ""
echo ""

echo "4. Verify change inside container"
echo "-----------------------------------"
docker exec pizza-pohoda-api cat /app/dist/data/adminSettings.json | jq '.'
echo ""
echo ""

echo "5. Test POST (set to waitTime 90 min)"
echo "---------------------------------------"
curl -s -X POST http://localhost:3001/api/admin-settings \
  -H "Content-Type: application/json" \
  -d '{"mode":"waitTime","waitTimeMinutes":90}' | jq '.'
echo ""
echo ""

echo "6. Verify change inside container"
echo "-----------------------------------"
docker exec pizza-pohoda-api cat /app/dist/data/adminSettings.json | jq '.'
echo ""
echo ""

echo "7. Check file permissions inside container"
echo "-------------------------------------------"
docker exec pizza-pohoda-api ls -la /app/dist/data/
echo ""

echo "8. Check container logs for errors"
echo "-----------------------------------"
docker logs --tail 30 pizza-pohoda-api | grep -i "admin-settings\|error"
echo ""

echo "9. Reset to off"
echo "----------------"
curl -s -X POST http://localhost:3001/api/admin-settings \
  -H "Content-Type: application/json" \
  -d '{"mode":"off","waitTimeMinutes":60}' | jq '.'
echo ""

echo "========================================="
echo "✅ Docker Test Complete!"
echo "========================================="
