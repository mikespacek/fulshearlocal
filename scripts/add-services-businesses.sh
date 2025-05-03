#!/bin/bash
# Script to add services businesses using Convex CLI

# Services category ID identified from previous run
SERVICES_ID="j97a5mj7hzbc9wh46yd2h6dsb17f7fm7"

echo "Using Services category ID: $SERVICES_ID"

# Add the first services business
echo "Adding Fulshear Postal Services..."
npx convex run businesses:add '{
  "business": {
    "name": "Fulshear Postal Services",
    "address": "8722 FM 359 Rd, Fulshear, TX 77441",
    "phoneNumber": "(281) 346-0254",
    "website": "https://fulshearpostal.com",
    "categoryId": "'$SERVICES_ID'",
    "rating": 4.2,
    "hours": [
      "Monday: 9:00 AM - 5:00 PM",
      "Tuesday: 9:00 AM - 5:00 PM",
      "Wednesday: 9:00 AM - 5:00 PM",
      "Thursday: 9:00 AM - 5:00 PM",
      "Friday: 9:00 AM - 5:00 PM",
      "Saturday: 9:00 AM - 2:00 PM",
      "Sunday: Closed"
    ],
    "latitude": 29.6881,
    "longitude": -95.8793,
    "placeId": "fulshear-postal-001",
    "lastUpdated": '$(date +%s000)'
  }
}'

# Add the second services business
echo "Adding Fulshear Dry Cleaning..."
npx convex run businesses:add '{
  "business": {
    "name": "Fulshear Dry Cleaning",
    "address": "6420 FM 1463, Katy, TX 77494",
    "phoneNumber": "(281) 394-9002",
    "website": "https://fulsheardrycleaners.com",
    "categoryId": "'$SERVICES_ID'",
    "rating": 4.6,
    "hours": [
      "Monday: 7:00 AM - 7:00 PM",
      "Tuesday: 7:00 AM - 7:00 PM",
      "Wednesday: 7:00 AM - 7:00 PM",
      "Thursday: 7:00 AM - 7:00 PM",
      "Friday: 7:00 AM - 7:00 PM",
      "Saturday: 8:00 AM - 5:00 PM",
      "Sunday: Closed"
    ],
    "latitude": 29.7072,
    "longitude": -95.8333,
    "placeId": "fulshear-dry-cleaning-002",
    "lastUpdated": '$(date +%s000)'
  }
}'

echo "Done adding services businesses!" 