import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import QRCode from "npm:qrcode";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-95da31c9/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== USER PROFILE ROUTES ====================

// Get user profile
app.get("/make-server-95da31c9/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profile = await kv.get(`profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }
    
    return c.json(profile);
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return c.json({ error: `Failed to fetch profile: ${error.message}` }, 500);
  }
});

// Create/Update user profile
app.post("/make-server-95da31c9/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profileData = await c.req.json();
    
    const profile = {
      ...profileData,
      userId,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`profile:${userId}`, profile);
    return c.json({ success: true, profile });
  } catch (error: any) {
    console.error("Error saving profile:", error);
    return c.json({ error: `Failed to save profile: ${error.message}` }, 500);
  }
});

// ==================== BOOKING WITH QR CODE ROUTES ====================

// Create booking with QR code
app.post("/make-server-95da31c9/bookings", async (c) => {
  try {
    const bookingData = await c.req.json();
    const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate QR code data
    const qrData = JSON.stringify({
      bookingId,
      hotelName: bookingData.hotelName,
      guestName: bookingData.guestName,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      verification: `VERIFIED-${bookingId}`
    });
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 2
    });
    
    const booking = {
      ...bookingData,
      id: bookingId,
      qrCode: qrCodeDataUrl,
      qrData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    // Save booking
    await kv.set(`booking:${bookingId}`, booking);
    
    // Add to user's bookings list
    const userBookings = await kv.get(`user:bookings:${bookingData.userId}`) || [];
    userBookings.push(bookingId);
    await kv.set(`user:bookings:${bookingData.userId}`, userBookings);
    
    // Add to hotel bookings list (for providers)
    const hotelBookings = await kv.get(`hotel:bookings:${bookingData.hotelId}`) || [];
    hotelBookings.push(bookingId);
    await kv.set(`hotel:bookings:${bookingData.hotelId}`, hotelBookings);
    
    return c.json({ success: true, booking });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return c.json({ error: `Failed to create booking: ${error.message}` }, 500);
  }
});

// Get booking with QR code
app.get("/make-server-95da31c9/bookings/:bookingId", async (c) => {
  try {
    const bookingId = c.req.param("bookingId");
    const booking = await kv.get(`booking:${bookingId}`);
    
    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }
    
    return c.json(booking);
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    return c.json({ error: `Failed to fetch booking: ${error.message}` }, 500);
  }
});

// Get user bookings
app.get("/make-server-95da31c9/user/:userId/bookings", async (c) => {
  try {
    const userId = c.req.param("userId");
    const bookingIds = await kv.get(`user:bookings:${userId}`) || [];
    
    const bookings = [];
    for (const id of bookingIds) {
      const booking = await kv.get(`booking:${id}`);
      if (booking) bookings.push(booking);
    }
    
    return c.json(bookings);
  } catch (error: any) {
    console.error("Error fetching user bookings:", error);
    return c.json({ error: `Failed to fetch bookings: ${error.message}` }, 500);
  }
});

// ==================== CARPOOL REAL-TIME SEAT TRACKING ====================

// Create/Update carpool driver
app.post("/make-server-95da31c9/carpool/driver", async (c) => {
  try {
    const driverData = await c.req.json();
    const driverId = driverData.id || `driver-${Date.now()}`;
    
    const driver = {
      ...driverData,
      id: driverId,
      totalSeats: driverData.totalSeats || driverData.seatsAvailable,
      seatsBooked: driverData.seatsBooked || 0,
      seatsAvailable: driverData.seatsAvailable || driverData.totalSeats,
      bookings: [],
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`carpool:driver:${driverId}`, driver);
    return c.json({ success: true, driver });
  } catch (error: any) {
    console.error("Error saving driver:", error);
    return c.json({ error: `Failed to save driver: ${error.message}` }, 500);
  }
});

// Get driver with real-time seat availability
app.get("/make-server-95da31c9/carpool/driver/:driverId", async (c) => {
  try {
    const driverId = c.req.param("driverId");
    const driver = await kv.get(`carpool:driver:${driverId}`);
    
    if (!driver) {
      return c.json({ error: "Driver not found" }, 404);
    }
    
    return c.json(driver);
  } catch (error: any) {
    console.error("Error fetching driver:", error);
    return c.json({ error: `Failed to fetch driver: ${error.message}` }, 500);
  }
});

// Book carpool seat (real-time seat tracking)
app.post("/make-server-95da31c9/carpool/book", async (c) => {
  try {
    const { driverId, userId, userName, seatsRequested, userPhone } = await c.req.json();
    
    const driver = await kv.get(`carpool:driver:${driverId}`);
    
    if (!driver) {
      return c.json({ error: "Driver not found" }, 404);
    }
    
    const seatsAvailable = driver.seatsAvailable !== undefined ? driver.seatsAvailable : driver.totalSeats;
    
    if (seatsAvailable < seatsRequested) {
      return c.json({ error: "Not enough seats available" }, 400);
    }
    
    const bookingId = `carpool-booking-${Date.now()}`;
    const booking = {
      id: bookingId,
      userId,
      userName,
      seatsBooked: seatsRequested,
      phone: userPhone,
      bookingDate: new Date().toISOString()
    };
    
    // Update driver with new booking
    const updatedDriver = {
      ...driver,
      bookings: [...(driver.bookings || []), booking],
      seatsAvailable: seatsAvailable - seatsRequested,
      seatsBooked: (driver.seatsBooked || 0) + seatsRequested
    };
    
    await kv.set(`carpool:driver:${driverId}`, updatedDriver);
    
    return c.json({ success: true, booking, driver: updatedDriver });
  } catch (error: any) {
    console.error("Error booking carpool:", error);
    return c.json({ error: `Failed to book: ${error.message}` }, 500);
  }
});

// Get user's carpool bookings
app.get("/make-server-95da31c9/carpool/user/:userId/bookings", async (c) => {
  try {
    const userId = c.req.param("userId");
    const bookingIds = await kv.get(`user:carpool:${userId}`) || [];
    
    const bookings = [];
    for (const id of bookingIds) {
      const booking = await kv.get(`carpool:booking:${id}`);
      if (booking) bookings.push(booking);
    }
    
    return c.json(bookings);
  } catch (error: any) {
    console.error("Error fetching carpool bookings:", error);
    return c.json({ error: `Failed to fetch bookings: ${error.message}` }, 500);
  }
});

// ==================== DRIVER PORTAL ROUTES ====================

// Driver login
app.post("/make-server-95da31c9/driver/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    // Get driver by email
    const driverKey = `driver:auth:${email}`;
    const driver = await kv.get(driverKey);
    
    if (!driver || driver.password !== password) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
    
    // Return driver data without password
    const { password: _, ...driverData } = driver;
    return c.json({ success: true, driver: driverData });
  } catch (error: any) {
    console.error("Error during driver login:", error);
    return c.json({ error: `Login failed: ${error.message}` }, 500);
  }
});

// Driver signup
app.post("/make-server-95da31c9/driver/signup", async (c) => {
  try {
    const driverData = await c.req.json();
    
    // Check if driver already exists
    const existingDriver = await kv.get(`driver:auth:${driverData.email}`);
    if (existingDriver) {
      return c.json({ error: "Driver already exists with this email" }, 400);
    }
    
    const driverId = `driver-${Date.now()}`;
    const driver = {
      id: driverId,
      ...driverData,
      createdAt: new Date().toISOString(),
      totalRides: 0,
      totalEarnings: 0
    };
    
    // Save driver auth
    await kv.set(`driver:auth:${driverData.email}`, driver);
    
    // Save driver profile
    await kv.set(`carpool:driver:${driverId}`, {
      id: driverId,
      name: driverData.name,
      email: driverData.email,
      phone: driverData.phone,
      carModel: driverData.carModel,
      carNumber: driverData.carNumber,
      totalSeats: driverData.totalSeats || 4,
      rating: 5.0,
      totalTrips: 0,
      verified: false,
      instantBooking: true,
      bookings: []
    });
    
    const { password: _, ...driverResponse } = driver;
    return c.json({ success: true, driver: driverResponse });
  } catch (error: any) {
    console.error("Error during driver signup:", error);
    return c.json({ error: `Signup failed: ${error.message}` }, 500);
  }
});

// Get driver's bookings (for driver portal)
app.get("/make-server-95da31c9/driver/:driverId/bookings", async (c) => {
  try {
    const driverId = c.req.param("driverId");
    const driver = await kv.get(`carpool:driver:${driverId}`);
    
    if (!driver) {
      return c.json({ error: "Driver not found" }, 404);
    }
    
    return c.json({
      bookings: driver.bookings || [],
      seatsAvailable: driver.seatsAvailable || driver.totalSeats,
      seatsBooked: driver.seatsBooked || 0,
      totalSeats: driver.totalSeats
    });
  } catch (error: any) {
    console.error("Error fetching driver bookings:", error);
    return c.json({ error: `Failed to fetch bookings: ${error.message}` }, 500);
  }
});

// List all available carpool drivers
app.get("/make-server-95da31c9/carpool/drivers", async (c) => {
  try {
    // Get all driver keys
    const allKeys = await kv.list({ prefix: "carpool:driver:" });
    const drivers = [];
    
    for (const keyInfo of allKeys.keys) {
      const driver = await kv.get(keyInfo.name);
      if (driver) {
        // Only return drivers with available seats
        const seatsAvailable = driver.seatsAvailable !== undefined ? driver.seatsAvailable : driver.totalSeats;
        drivers.push({
          ...driver,
          seatsAvailable,
          seatsBooked: driver.seatsBooked || 0
        });
      }
    }
    
    return c.json({ drivers, total: drivers.length });
  } catch (error: any) {
    console.error("Error fetching carpool drivers:", error);
    return c.json({ error: `Failed to fetch drivers: ${error.message}` }, 500);
  }
});

// Send message to driver
app.post("/make-server-95da31c9/carpool/message", async (c) => {
  try {
    const { driverId, userId, userName, message } = await c.req.json();
    
    const messageId = `msg-${Date.now()}`;
    const chatMessage = {
      id: messageId,
      userId,
      userName,
      message,
      timestamp: new Date().toISOString()
    };
    
    // Get existing messages for this driver
    const messagesKey = `carpool:messages:${driverId}`;
    const messages = await kv.get(messagesKey) || [];
    messages.push(chatMessage);
    await kv.set(messagesKey, messages);
    
    return c.json({ success: true, message: chatMessage });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return c.json({ error: `Failed to send message: ${error.message}` }, 500);
  }
});

// Get messages for a driver
app.get("/make-server-95da31c9/carpool/:driverId/messages", async (c) => {
  try {
    const driverId = c.req.param("driverId");
    const messages = await kv.get(`carpool:messages:${driverId}`) || [];
    
    return c.json({ messages });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return c.json({ error: `Failed to fetch messages: ${error.message}` }, 500);
  }
});

// ==================== FEEDBACK/REVIEW ROUTES ====================

// Submit review
app.post("/make-server-95da31c9/reviews", async (c) => {
  try {
    const reviewData = await c.req.json();
    const reviewId = `review-${Date.now()}`;
    
    const review = {
      id: reviewId,
      ...reviewData,
      helpful: 0,
      verified: true,
      date: new Date().toISOString()
    };
    
    // Save review
    await kv.set(`review:${reviewId}`, review);
    
    // Add to target's reviews (hotel or buddy)
    const targetKey = `${reviewData.type}:reviews:${reviewData.targetId}`;
    const targetReviews = await kv.get(targetKey) || [];
    targetReviews.push(reviewId);
    await kv.set(targetKey, targetReviews);
    
    // Add to user's reviews
    const userReviews = await kv.get(`user:reviews:${reviewData.userId}`) || [];
    userReviews.push(reviewId);
    await kv.set(`user:reviews:${reviewData.userId}`, userReviews);
    
    return c.json({ success: true, review });
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return c.json({ error: `Failed to submit review: ${error.message}` }, 500);
  }
});

// Get reviews for target (hotel/buddy)
app.get("/make-server-95da31c9/reviews/:type/:targetId", async (c) => {
  try {
    const type = c.req.param("type");
    const targetId = c.req.param("targetId");
    
    const reviewIds = await kv.get(`${type}:reviews:${targetId}`) || [];
    
    const reviews = [];
    for (const id of reviewIds) {
      const review = await kv.get(`review:${id}`);
      if (review) reviews.push(review);
    }
    
    return c.json(reviews);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return c.json({ error: `Failed to fetch reviews: ${error.message}` }, 500);
  }
});

// Mark review as helpful
app.post("/make-server-95da31c9/reviews/:reviewId/helpful", async (c) => {
  try {
    const reviewId = c.req.param("reviewId");
    const review = await kv.get(`review:${reviewId}`);
    
    if (!review) {
      return c.json({ error: "Review not found" }, 404);
    }
    
    review.helpful = (review.helpful || 0) + 1;
    await kv.set(`review:${reviewId}`, review);
    
    return c.json({ success: true, helpful: review.helpful });
  } catch (error: any) {
    console.error("Error marking review as helpful:", error);
    return c.json({ error: `Failed to mark as helpful: ${error.message}` }, 500);
  }
});

// ==================== HOTEL PROVIDER ROUTES ====================

// Get provider bookings
app.get("/make-server-95da31c9/provider/:providerId/bookings", async (c) => {
  try {
    const providerId = c.req.param("providerId");
    
    // Get all hotels for this provider
    const providerHotels = await kv.get(`provider:hotels:${providerId}`) || [];
    
    const allBookings = [];
    for (const hotelId of providerHotels) {
      const hotelBookingIds = await kv.get(`hotel:bookings:${hotelId}`) || [];
      
      for (const bookingId of hotelBookingIds) {
        const booking = await kv.get(`booking:${bookingId}`);
        if (booking) allBookings.push(booking);
      }
    }
    
    return c.json(allBookings);
  } catch (error: any) {
    console.error("Error fetching provider bookings:", error);
    return c.json({ error: `Failed to fetch bookings: ${error.message}` }, 500);
  }
});

// Get provider hotels
app.get("/make-server-95da31c9/provider/:providerId/hotels", async (c) => {
  try {
    const providerId = c.req.param("providerId");
    const hotelIds = await kv.get(`provider:hotels:${providerId}`) || [];
    
    const hotels = [];
    for (const hotelId of hotelIds) {
      const hotel = await kv.get(`hotel:${hotelId}`);
      if (hotel) hotels.push(hotel);
    }
    
    return c.json(hotels);
  } catch (error: any) {
    console.error("Error fetching provider hotels:", error);
    return c.json({ error: `Failed to fetch hotels: ${error.message}` }, 500);
  }
});

// ==================== DIALOGFLOW CHATBOT ROUTE ====================

// Dialogflow webhook
app.post("/make-server-95da31c9/chatbot/dialogflow", async (c) => {
  try {
    const request = await c.req.json();
    
    // Extract query from Dialogflow request
    const queryText = request.queryResult?.queryText || request.message || "";
    const intent = request.queryResult?.intent?.displayName || "Default";
    
    // Process different intents
    let response = "I'm here to help with your travel needs!";
    
    switch (intent) {
      case "booking.hotel":
        response = "I can help you book a hotel. Which destination are you interested in?";
        break;
      case "find.buddy":
        response = "Looking for a travel buddy? I can help match you with compatible travelers!";
        break;
      case "emergency.help":
        response = "For emergencies, please use our SOS feature or call emergency services at 112.";
        break;
      case "carpool.search":
        response = "I can help you find carpools. Where are you traveling from and to?";
        break;
      default:
        // Store chat history
        const chatId = `chat-${Date.now()}`;
        await kv.set(`chat:${chatId}`, {
          query: queryText,
          response,
          timestamp: new Date().toISOString()
        });
    }
    
    return c.json({
      fulfillmentText: response,
      fulfillmentMessages: [
        {
          text: {
            text: [response]
          }
        }
      ]
    });
  } catch (error: any) {
    console.error("Error processing chatbot request:", error);
    return c.json({ 
      fulfillmentText: "Sorry, I encountered an error. Please try again.",
      error: error.message 
    }, 500);
  }
});

// Simple chatbot query (without Dialogflow)
app.post("/make-server-95da31c9/chatbot/query", async (c) => {
  try {
    const { message, userId } = await c.req.json();
    
    // Simple keyword-based responses
    let response = "I'm here to help! You can ask me about hotels, travel buddies, carpools, or emergencies.";
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("hotel") || lowerMessage.includes("book")) {
      response = "I can help you find and book hotels across India. Try searching in our Destinations section!";
    } else if (lowerMessage.includes("buddy") || lowerMessage.includes("friend")) {
      response = "Looking for travel companions? Check out our Travel Buddy Finder to match with like-minded travelers!";
    } else if (lowerMessage.includes("carpool") || lowerMessage.includes("ride")) {
      response = "Need a ride? Our Carpool Finder can help you find shared rides to save money and meet people!";
    } else if (lowerMessage.includes("emergency") || lowerMessage.includes("help") || lowerMessage.includes("sos")) {
      response = "For emergencies, use our SOS Emergency feature or call 112. Stay safe!";
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      response = "All prices are in Indian Rupees (₹). We offer competitive rates on hotels, carpools, and services!";
    }
    
    // Save chat history
    const chatId = `chat-${Date.now()}`;
    await kv.set(`chat:${chatId}`, {
      userId,
      userMessage: message,
      botResponse: response,
      timestamp: new Date().toISOString()
    });
    
    return c.json({ response });
  } catch (error: any) {
    console.error("Error processing chat query:", error);
    return c.json({ error: `Chat query failed: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);