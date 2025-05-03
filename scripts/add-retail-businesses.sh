#!/bin/bash
# Script to add retail businesses using Convex CLI

# Retail category ID identified from previous run
RETAIL_ID="j977p3kfxc23xyczsdty2eadtn7f6pjg"

echo "Using Retail category ID: $RETAIL_ID"

# Add the first retail business
echo "Adding Fulshear Fashion Boutique..."
npx convex run businesses:add '{
  "business": {
    "name": "Fulshear Fashion Boutique",
    "address": "3425 FM 1463 Rd, Katy, TX 77494",
    "phoneNumber": "(281) 394-5885",
    "website": "https://fulshearboutique.com",
    "categoryId": "'$RETAIL_ID'",
    "rating": 4.7,
    "hours": [
      "Monday: 10:00 AM - 6:00 PM",
      "Tuesday: 10:00 AM - 6:00 PM",
      "Wednesday: 10:00 AM - 6:00 PM",
      "Thursday: 10:00 AM - 6:00 PM",
      "Friday: 10:00 AM - 7:00 PM",
      "Saturday: 10:00 AM - 5:00 PM",
      "Sunday: Closed"
    ],
    "latitude": 29.7072,
    "longitude": -95.8420,
    "placeId": "fulshear-fashion-boutique-001",
    "lastUpdated": '$(date +%s000)'
  }
}'

# Add the second retail business
echo "Adding Fulshear Hardware Store..."
npx convex run businesses:add '{
  "business": {
    "name": "Fulshear Hardware Store",
    "address": "30402 FM 1093, Fulshear, TX 77441",
    "phoneNumber": "(281) 533-0002",
    "website": "https://fulshearhardware.com",
    "categoryId": "'$RETAIL_ID'",
    "rating": 4.5,
    "hours": [
      "Monday: 7:00 AM - 7:00 PM",
      "Tuesday: 7:00 AM - 7:00 PM",
      "Wednesday: 7:00 AM - 7:00 PM",
      "Thursday: 7:00 AM - 7:00 PM",
      "Friday: 7:00 AM - 7:00 PM",
      "Saturday: 8:00 AM - 6:00 PM",
      "Sunday: 9:00 AM - 5:00 PM"
    ],
    "latitude": 29.6933,
    "longitude": -95.8973,
    "placeId": "fulshear-hardware-002",
    "lastUpdated": '$(date +%s000)'
  }
}'

echo "Done adding retail businesses!" 