# 🧪 API Testing Guide

## Quick Test Your Backend

All these endpoints are LIVE and ready to test right now!

---

## 1. Health Check

**Test if backend is running:**

```bash
curl https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/health
```

**Expected Response:**
```json
{"status":"ok"}
```

---

## 2. User Profile APIs

### Create/Update Profile

```bash
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/profile/test@example.com \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91 98765 43210",
    "location": "Mumbai, India",
    "dateOfBirth": "1995-01-01",
    "nationality": "India",
    "bio": "Passionate traveler",
    "interests": ["Travel", "Photography", "Food"],
    "profileImage": "https://i.pravatar.cc/300?img=68"
  }'
```

### Get Profile

```bash
curl https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/profile/test@example.com \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 3. Booking with QR Code

### Create Booking

```bash
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test@example.com",
    "hotelId": "hotel-123",
    "hotelName": "Taj Hotel Mumbai",
    "guestName": "Test User",
    "checkIn": "2025-02-01",
    "checkOut": "2025-02-05",
    "guests": 2,
    "roomType": "Deluxe",
    "totalPrice": 15000,
    "paymentStatus": "completed"
  }'
```

**Response includes:**
```json
{
  "success": true,
  "booking": {
    "id": "booking-1735934123456-abc123",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
    "qrData": "{\"bookingId\":\"...\",\"hotelName\":\"...\"}",
    "...other booking details..."
  }
}
```

### Get User's Bookings

```bash
curl https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/user/test@example.com/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 4. Carpool APIs

### Create Driver

```bash
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/carpool/driver \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Driver",
    "from": "Goa",
    "to": "Mumbai",
    "departureDate": "2025-02-10",
    "departureTime": "08:00",
    "carModel": "Toyota Innova",
    "carNumber": "MH 12 AB 1234",
    "totalSeats": 4,
    "pricePerSeat": 800,
    "rating": 4.8,
    "verified": true
  }'
```

### Get Driver Info

```bash
curl https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/carpool/driver/driver-123 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response shows real-time seat availability:**
```json
{
  "id": "driver-123",
  "totalSeats": 4,
  "seatsBooked": 2,
  "seatsAvailable": 2,
  "bookings": [...]
}
```

### Book Carpool

```bash
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/carpool/book \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "driver-123",
    "userId": "test@example.com",
    "userName": "Test User",
    "seatsRequested": 2,
    "phone": "+91 98765 43210"
  }'
```

**If seats available:**
```json
{
  "success": true,
  "booking": {...},
  "driver": {
    "id": "driver-123",
    "seatsAvailable": 0,
    "seatsBooked": 4
  }
}
```

**If not enough seats:**
```json
{
  "error": "Only 1 seats available. You requested 2 seats."
}
```

---

## 5. Driver Portal APIs

### Driver Signup

```bash
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/driver/signup \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Driver",
    "email": "john@driver.com",
    "password": "securepassword123",
    "phone": "+91 98765 43210",
    "carModel": "Toyota Innova",
    "carNumber": "MH 12 AB 1234",
    "totalSeats": 4
  }'
```

### Driver Login

```bash
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/driver/login \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@driver.com",
    "password": "securepassword123"
  }'
```

### Get Driver's Bookings

```bash
curl https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/driver/driver-123/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "bookings": [
    {
      "id": "carpool-booking-123",
      "userId": "test@example.com",
      "userName": "Test User",
      "seatsBooked": 2,
      "bookingDate": "2025-01-03T10:30:00Z"
    }
  ],
  "seatsAvailable": 2,
  "seatsBooked": 2,
  "totalSeats": 4
}
```

---

## 6. Review APIs

### Submit Review

```bash
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/reviews \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "hotel",
    "targetId": "hotel-123",
    "targetName": "Taj Hotel Mumbai",
    "targetLocation": "Mumbai",
    "userId": "test@example.com",
    "userName": "Test User",
    "rating": 5,
    "cleanliness": 5,
    "service": 5,
    "value": 4,
    "location": 5,
    "comment": "Excellent stay! Would recommend.",
    "photos": []
  }'
```

### Get Reviews for Hotel

```bash
curl https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/reviews/hotel/hotel-123 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Mark Review as Helpful

```bash
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/reviews/review-123/helpful \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## 7. Chatbot APIs

### Send Chat Message

```bash
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/chatbot/query \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about hotels in Goa",
    "userId": "test@example.com"
  }'
```

**Response:**
```json
{
  "response": "I can help you find and book hotels across India. Try searching in our Destinations section!"
}
```

### Dialogflow Webhook

```bash
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/chatbot/dialogflow \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "queryResult": {
      "queryText": "I need a hotel",
      "intent": {
        "displayName": "booking.hotel"
      }
    }
  }'
```

**Response:**
```json
{
  "fulfillmentText": "I can help you book a hotel. Which destination are you interested in?",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["I can help you book a hotel. Which destination are you interested in?"]
      }
    }
  ]
}
```

---

## 8. Provider APIs

### Get Provider's Hotels

```bash
curl https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/provider/provider-123/hotels \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get Provider's Bookings

```bash
curl https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/provider/provider-123/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔑 Authorization Token

The `publicAnonKey` for this project is:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWlja3plemdva3NnYW1wdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjcxMDQsImV4cCI6MjA4MzAwMzEwNH0.U3JyRb7yrUkOn07MJQHR15mvbdU6FQX4RCiYjh2CQnY
```

Use this in all your API calls:
```bash
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🧪 Postman Collection

### Import these into Postman:

**1. Create Environment:**
- Variable: `baseUrl`
- Value: `https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9`
- Variable: `token`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**2. Create Requests:**
- Method: POST/GET as specified above
- URL: `{{baseUrl}}/profile/test@example.com`
- Headers: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- Body: Raw JSON as shown in examples

---

## 📊 Test Scenarios

### Scenario 1: Complete User Journey
```bash
# 1. Create profile
curl -X POST .../profile/user1@test.com -d '{...profile data...}'

# 2. Create booking (get QR code)
curl -X POST .../bookings -d '{...booking data...}'

# 3. Get bookings (see QR code)
curl .../user/user1@test.com/bookings

# 4. Submit review
curl -X POST .../reviews -d '{...review data...}'

# 5. Send chat message
curl -X POST .../chatbot/query -d '{"message":"help"}'
```

### Scenario 2: Carpool Flow
```bash
# 1. Create driver (4 seats)
curl -X POST .../carpool/driver -d '{...driver with 4 seats...}'

# 2. Check availability
curl .../carpool/driver/driver-123
# Response: seatsAvailable: 4

# 3. Book 2 seats
curl -X POST .../carpool/book -d '{"seatsRequested": 2}'

# 4. Check availability again
curl .../carpool/driver/driver-123
# Response: seatsAvailable: 2 ✅

# 5. Try booking 3 seats (should fail)
curl -X POST .../carpool/book -d '{"seatsRequested": 3}'
# Response: "Only 2 seats available" ✅
```

### Scenario 3: Driver Portal
```bash
# 1. Driver signup
curl -X POST .../driver/signup -d '{...driver credentials...}'

# 2. Driver login
curl -X POST .../driver/login -d '{"email":"...","password":"..."}'

# 3. Get bookings (empty initially)
curl .../driver/driver-123/bookings
# Response: bookings: []

# 4. User books carpool (as user)
curl -X POST .../carpool/book -d '{...}'

# 5. Check driver bookings again
curl .../driver/driver-123/bookings
# Response: bookings: [{ userName: "...", seats: 2 }] ✅
```

---

## 🎯 Expected Behaviors

### ✅ Success Cases
- Profile creation returns `{success: true, profile: {...}}`
- Booking creation includes `qrCode` field
- Seat booking updates `seatsAvailable` immediately
- Driver can see passenger bookings
- Reviews persist and can be retrieved
- Chatbot returns intelligent responses

### ❌ Error Cases
- Booking 3 seats when only 2 available → 400 error
- Login with wrong password → 401 error
- Invalid data format → 500 error with message
- Missing required fields → Error response

---

## 🚀 Quick Smoke Test

Run these 5 commands to verify everything works:

```bash
# 1. Health check
curl https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/health

# 2. Create profile
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/profile/test@test.com \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWlja3plemdva3NnYW1wdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjcxMDQsImV4cCI6MjA4MzAwMzEwNH0.U3JyRb7yrUkOn07MJQHR15mvbdU6FQX4RCiYjh2CQnY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com"}'

# 3. Get profile
curl https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/profile/test@test.com \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWlja3plemdva3NnYW1wdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjcxMDQsImV4cCI6MjA4MzAwMzEwNH0.U3JyRb7yrUkOn07MJQHR15mvbdU6FQX4RCiYjh2CQnY"

# 4. Send chat message
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/chatbot/query \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWlja3plemdva3NnYW1wdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjcxMDQsImV4cCI6MjA4MzAwMzEwNH0.U3JyRb7yrUkOn07MJQHR15mvbdU6FQX4RCiYjh2CQnY" \
  -H "Content-Type: application/json" \
  -d '{"message":"hello","userId":"test@test.com"}'

# 5. Submit review
curl -X POST https://qiyickzezgoksgampvae.supabase.co/functions/v1/make-server-95da31c9/reviews \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWlja3plemdva3NnYW1wdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjcxMDQsImV4cCI6MjA4MzAwMzEwNH0.U3JyRb7yrUkOn07MJQHR15mvbdU6FQX4RCiYjh2CQnY" \
  -H "Content-Type: application/json" \
  -d '{"type":"hotel","targetId":"h1","targetName":"Test","userId":"test@test.com","userName":"Test","rating":5,"comment":"Great!"}'
```

If all 5 return JSON responses (not errors), **everything is working!** ✅

---

**ALL APIS ARE LIVE AND FUNCTIONAL RIGHT NOW!** 🚀
