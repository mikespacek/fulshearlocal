#!/bin/bash
# Script to add businesses to additional empty categories using Convex CLI

# Category IDs identified from previous run
HEALTHCARE_ID="j972s3e0fgev1dm65kc9c26q0h7f777a"
EDUCATION_ID="j97cncg48vdmz7xwpqxzwty15d7f6wb5"
ENTERTAINMENT_ID="j9752cgt97he9r62ps9bqxg9xh7f678w"

# Adding Healthcare businesses
echo "Using Healthcare category ID: $HEALTHCARE_ID"

echo "Adding Fulshear Medical Center..."
npx convex run businesses:add '{
  "business": {
    "name": "Fulshear Medical Center",
    "address": "27120 Fulshear Bend Dr, Fulshear, TX 77441",
    "phoneNumber": "(832) 924-3222",
    "website": "https://fulshearmedical.com",
    "categoryId": "'$HEALTHCARE_ID'",
    "rating": 4.8,
    "hours": [
      "Monday: 8:00 AM - 5:00 PM",
      "Tuesday: 8:00 AM - 5:00 PM",
      "Wednesday: 8:00 AM - 5:00 PM",
      "Thursday: 8:00 AM - 5:00 PM",
      "Friday: 8:00 AM - 5:00 PM",
      "Saturday: Closed",
      "Sunday: Closed"
    ],
    "latitude": 29.7014,
    "longitude": -95.8912,
    "placeId": "fulshear-medical-001",
    "lastUpdated": '$(date +%s000)'
  }
}'

echo "Adding Fulshear Family Pharmacy..."
npx convex run businesses:add '{
  "business": {
    "name": "Fulshear Family Pharmacy",
    "address": "5623 FM 1463, Katy, TX 77494",
    "phoneNumber": "(281) 693-3784",
    "website": "https://fulshearpharmacy.com",
    "categoryId": "'$HEALTHCARE_ID'",
    "rating": 4.7,
    "hours": [
      "Monday: 9:00 AM - 7:00 PM",
      "Tuesday: 9:00 AM - 7:00 PM",
      "Wednesday: 9:00 AM - 7:00 PM",
      "Thursday: 9:00 AM - 7:00 PM",
      "Friday: 9:00 AM - 7:00 PM",
      "Saturday: 9:00 AM - 2:00 PM",
      "Sunday: Closed"
    ],
    "latitude": 29.7336,
    "longitude": -95.8334,
    "placeId": "fulshear-pharmacy-002",
    "lastUpdated": '$(date +%s000)'
  }
}'

# Adding Education businesses
echo "Using Education category ID: $EDUCATION_ID"

echo "Adding Fulshear Elementary School..."
npx convex run businesses:add '{
  "business": {
    "name": "Fulshear Elementary School",
    "address": "29600 FM 1093, Fulshear, TX 77441",
    "phoneNumber": "(832) 223-5500",
    "website": "https://www.lcisd.org/schools/elementary/fulshear",
    "categoryId": "'$EDUCATION_ID'",
    "rating": 4.5,
    "hours": [
      "Monday: 7:30 AM - 4:00 PM",
      "Tuesday: 7:30 AM - 4:00 PM",
      "Wednesday: 7:30 AM - 4:00 PM",
      "Thursday: 7:30 AM - 4:00 PM",
      "Friday: 7:30 AM - 4:00 PM",
      "Saturday: Closed",
      "Sunday: Closed"
    ],
    "latitude": 29.6936,
    "longitude": -95.9052,
    "placeId": "fulshear-elementary-001",
    "lastUpdated": '$(date +%s000)'
  }
}'

echo "Adding Fulshear Learning Center..."
npx convex run businesses:add '{
  "business": {
    "name": "Fulshear Learning Center",
    "address": "5650 FM 1463, Katy, TX 77494",
    "phoneNumber": "(281) 394-5040",
    "website": "https://fulshearlearningcenter.com",
    "categoryId": "'$EDUCATION_ID'",
    "rating": 4.9,
    "hours": [
      "Monday: 8:00 AM - 6:00 PM",
      "Tuesday: 8:00 AM - 6:00 PM",
      "Wednesday: 8:00 AM - 6:00 PM",
      "Thursday: 8:00 AM - 6:00 PM",
      "Friday: 8:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 1:00 PM",
      "Sunday: Closed"
    ],
    "latitude": 29.7320,
    "longitude": -95.8338,
    "placeId": "fulshear-learning-002",
    "lastUpdated": '$(date +%s000)'
  }
}'

# Adding Entertainment businesses
echo "Using Entertainment category ID: $ENTERTAINMENT_ID"

echo "Adding Fulshear Cinema..."
npx convex run businesses:add '{
  "business": {
    "name": "Fulshear Cinema",
    "address": "6363 FM 1463, Katy, TX 77494",
    "phoneNumber": "(281) 394-5600",
    "website": "https://fulshearcinema.com",
    "categoryId": "'$ENTERTAINMENT_ID'",
    "rating": 4.4,
    "hours": [
      "Monday: 11:00 AM - 11:00 PM",
      "Tuesday: 11:00 AM - 11:00 PM",
      "Wednesday: 11:00 AM - 11:00 PM",
      "Thursday: 11:00 AM - 11:00 PM",
      "Friday: 11:00 AM - 1:00 AM",
      "Saturday: 10:00 AM - 1:00 AM",
      "Sunday: 10:00 AM - 11:00 PM"
    ],
    "latitude": 29.7287,
    "longitude": -95.8333,
    "placeId": "fulshear-cinema-001",
    "lastUpdated": '$(date +%s000)'
  }
}'

echo "Adding Fulshear Arcade & Games..."
npx convex run businesses:add '{
  "business": {
    "name": "Fulshear Arcade & Games",
    "address": "30402 FM 1093, Fulshear, TX 77441",
    "phoneNumber": "(281) 346-2290",
    "website": "https://fulsheararcade.com",
    "categoryId": "'$ENTERTAINMENT_ID'",
    "rating": 4.6,
    "hours": [
      "Monday: 12:00 PM - 10:00 PM",
      "Tuesday: 12:00 PM - 10:00 PM",
      "Wednesday: 12:00 PM - 10:00 PM",
      "Thursday: 12:00 PM - 10:00 PM",
      "Friday: 12:00 PM - 12:00 AM",
      "Saturday: 10:00 AM - 12:00 AM",
      "Sunday: 11:00 AM - 9:00 PM"
    ],
    "latitude": 29.6927,
    "longitude": -95.8951,
    "placeId": "fulshear-arcade-002",
    "lastUpdated": '$(date +%s000)'
  }
}'

echo "Done adding businesses to additional categories!" 