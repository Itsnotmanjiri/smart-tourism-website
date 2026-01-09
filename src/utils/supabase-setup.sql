-- Tourism Platform Database Schema
-- Run this SQL in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  destination_id UUID REFERENCES destinations(id),
  location TEXT NOT NULL,
  price_per_night INTEGER NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  amenities JSONB DEFAULT '[]',
  image_url TEXT,
  available_rooms INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  hotel_id UUID,
  hotel_name TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  rooms INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'confirmed',
  payment_status TEXT DEFAULT 'paid',
  qr_code TEXT,
  booking_reference TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Travel Buddies table
CREATE TABLE IF NOT EXISTS travel_buddies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  destination TEXT NOT NULL,
  travel_dates TEXT NOT NULL,
  interests TEXT[] DEFAULT '{}',
  age_range TEXT,
  budget_range TEXT,
  status TEXT DEFAULT 'active',
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buddy Requests table
CREATE TABLE IF NOT EXISTS buddy_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  buddy_profile_id UUID REFERENCES travel_buddies(id),
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carpools table
CREATE TABLE IF NOT EXISTS carpools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  driver_rating DECIMAL(2,1) DEFAULT 5.0,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  available_seats INTEGER NOT NULL,
  total_seats INTEGER NOT NULL,
  price_per_seat INTEGER NOT NULL,
  vehicle_type TEXT NOT NULL,
  vehicle_number TEXT,
  amenities TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carpool Bookings table
CREATE TABLE IF NOT EXISTS carpool_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  carpool_id UUID REFERENCES carpools(id),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  seats_booked INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  pickup_point TEXT,
  status TEXT DEFAULT 'confirmed',
  payment_status TEXT DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  carpool_id UUID REFERENCES carpools(id),
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget INTEGER,
  travelers INTEGER DEFAULT 1,
  interests TEXT[] DEFAULT '{}',
  activities JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  booking_id UUID,
  category TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  booking_id UUID,
  amount INTEGER NOT NULL,
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SOS Alerts table
CREATE TABLE IF NOT EXISTS sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  message TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  hotel_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  destination_id UUID REFERENCES destinations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hotels_destination_id ON hotels(destination_id);
CREATE INDEX IF NOT EXISTS idx_travel_buddies_status ON travel_buddies(status);
CREATE INDEX IF NOT EXISTS idx_carpools_status ON carpools(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_carpool_id ON chat_messages(carpool_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE carpools ENABLE ROW LEVEL SECURITY;
ALTER TABLE carpool_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (adjust for production!)
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Allow all operations on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow all operations on hotels" ON hotels;
DROP POLICY IF EXISTS "Allow all operations on destinations" ON destinations;
DROP POLICY IF EXISTS "Allow all operations on travel_buddies" ON travel_buddies;
DROP POLICY IF EXISTS "Allow all operations on buddy_requests" ON buddy_requests;
DROP POLICY IF EXISTS "Allow all operations on carpools" ON carpools;
DROP POLICY IF EXISTS "Allow all operations on carpool_bookings" ON carpool_bookings;
DROP POLICY IF EXISTS "Allow all operations on chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "Allow all operations on itineraries" ON itineraries;
DROP POLICY IF EXISTS "Allow all operations on expenses" ON expenses;
DROP POLICY IF EXISTS "Allow all operations on payments" ON payments;
DROP POLICY IF EXISTS "Allow all operations on sos_alerts" ON sos_alerts;
DROP POLICY IF EXISTS "Allow all operations on reviews" ON reviews;
DROP POLICY IF EXISTS "Allow all operations on wishlist" ON wishlist;

CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on hotels" ON hotels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on destinations" ON destinations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on travel_buddies" ON travel_buddies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on buddy_requests" ON buddy_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on carpools" ON carpools FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on carpool_bookings" ON carpool_bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on chat_messages" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on itineraries" ON itineraries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payments" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sos_alerts" ON sos_alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on wishlist" ON wishlist FOR ALL USING (true) WITH CHECK (true);
