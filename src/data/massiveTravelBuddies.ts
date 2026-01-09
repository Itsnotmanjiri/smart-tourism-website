// MASSIVE TRAVEL BUDDY DATABASE - 10,000+ ACTIVE TRAVELERS

export interface TravelBuddy {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  avatar: string;
  destination: string;
  travelDates: string;
  budget: string;
  interests: string[];
  travelStyle: string;
  bio: string;
  languages: string[];
  hometown: string;
  verified: boolean;
  rating: number;
  tripsCompleted: number;
  responseRate: number;
  lastActive: string;
  isOnline: boolean;
  lookingFor: string[];
}

const firstNames = [
  'Rahul', 'Priya', 'Amit', 'Sneha', 'Rohan', 'Anjali', 'Arjun', 'Kavya', 'Aditya', 'Divya',
  'Vikram', 'Pooja', 'Karan', 'Riya', 'Nikhil', 'Sakshi', 'Varun', 'Megha', 'Siddharth', 'Nisha',
  'Akash', 'Shreya', 'Harsh', 'Tanvi', 'Yash', 'Isha', 'Kunal', 'Simran', 'Abhishek', 'Ananya',
  'Manish', 'Neha', 'Rajesh', 'Swati', 'Sandeep', 'Ritika', 'Deepak', 'Payal', 'Gaurav', 'Kritika',
  'Vishal', 'Preeti', 'Naveen', 'Shweta', 'Suresh', 'Jyoti', 'Mahesh', 'Rekha', 'Ramesh', 'Geeta',
  'Ashok', 'Sunita', 'Manoj', 'Anita', 'Pankaj', 'Vandana', 'Ravi', 'Sonal', 'Ajay', 'Monika',
  'Sanjay', 'Rashmi', 'Vijay', 'Alka', 'Prakash', 'Usha', 'Dinesh', 'Saroj', 'Sunil', 'Poonam',
  'Krishna', 'Radha', 'Shiva', 'Parvati', 'Aryan', 'Diya', 'Dev', 'Maya', 'Aarav', 'Aadhya'
];

const lastNames = [
  'Sharma', 'Patel', 'Kumar', 'Singh', 'Verma', 'Gupta', 'Reddy', 'Iyer', 'Nair', 'Joshi',
  'Mehta', 'Shah', 'Desai', 'Kulkarni', 'Agarwal', 'Banerjee', 'Chatterjee', 'Mukherjee', 'Roy', 'Das',
  'Kapoor', 'Malhotra', 'Khanna', 'Bhatia', 'Chopra', 'Sethi', 'Arora', 'Sinha', 'Jain', 'Ahluwalia',
  'Rao', 'Menon', 'Pillai', 'Krishnan', 'Subramanian', 'Narayanan', 'Bose', 'Ghosh', 'Dutta', 'Sen'
];

const destinations = [
  'Goa', 'Manali', 'Jaipur', 'Kerala', 'Udaipur', 'Rishikesh', 'Varanasi', 'Amritsar', 'Hampi', 'Darjeeling'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Coimbatore', 'Ludhiana'
];

const interests = [
  'Photography', 'Adventure', 'Food', 'Culture', 'History', 'Nature', 'Nightlife', 'Shopping', 'Yoga', 'Trekking',
  'Beach', 'Mountains', 'Temples', 'Museums', 'Local Cuisine', 'Street Food', 'Wildlife', 'Water Sports', 'Camping', 'Backpacking',
  'Luxury Travel', 'Budget Travel', 'Solo Travel', 'Group Travel', 'Road Trips', 'Train Journeys', 'Cycling', 'Meditation',
  'Art & Craft', 'Music', 'Festivals', 'Architecture', 'Heritage Sites', 'Spiritual', 'Wellness', 'Spa & Massage'
];

const travelStyles = [
  'Backpacker', 'Luxury', 'Adventure', 'Relaxed', 'Cultural', 'Party', 'Spiritual', 'Budget', 'Social', 'Solo'
];

const languages = [
  'Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'
];

const lookingForOptions = [
  'Travel Partner', 'Room Sharing', 'Split Costs', 'Tour Guide', 'Local Friend', 'Adventure Buddy',
  'Photography Partner', 'Food Explorer', 'Shopping Companion', 'Cultural Exchange'
];

const bioTemplates = [
  'Love exploring new places and meeting new people! Looking forward to an amazing trip.',
  'Adventure enthusiast seeking like-minded travelers. Let\'s make memories!',
  'Passionate about photography and local cuisine. Always up for trying new experiences.',
  'First time visiting {destination}! Excited to explore and would love some company.',
  'Frequent traveler who loves sharing experiences and making new friends.',
  'Spiritual seeker looking for peaceful experiences and meaningful connections.',
  'Foodie on a mission to try every local delicacy. Join me!',
  'Nature lover and trekking enthusiast. Let\'s explore together!',
  'Cultural explorer interested in history, art, and local traditions.',
  'Budget traveler looking to maximize experiences while minimizing costs.'
];

function selectRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function selectRandomMultiple<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateTravelDates(): string {
  const today = new Date();
  const daysAhead = Math.floor(Math.random() * 90) + 1; // 1-90 days ahead
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + daysAhead);
  
  const duration = Math.floor(Math.random() * 10) + 2; // 2-12 days
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + duration);
  
  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function generateBudget(): string {
  const budgets = [
    '₹5,000-10,000',
    '₹10,000-15,000',
    '₹15,000-20,000',
    '₹20,000-30,000',
    '₹30,000-50,000',
    '₹50,000+'
  ];
  return selectRandom(budgets);
}

function getLastActive(): string {
  const minutes = Math.floor(Math.random() * 1440); // 0-24 hours in minutes
  
  if (minutes < 5) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 120) return '1 hour ago';
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
  return 'Today';
}

function generateTravelBuddy(index: number): TravelBuddy {
  const firstName = selectRandom(firstNames);
  const lastName = selectRandom(lastNames);
  const name = `${firstName} ${lastName}`;
  const age = Math.floor(Math.random() * 40) + 18; // 18-58
  const gender = Math.random() < 0.48 ? 'Male' : Math.random() < 0.96 ? 'Female' : 'Other';
  
  // Generate avatar - using avatars or real photos
  const avatarType = Math.random() < 0.5 ? 'person' : 'portrait';
  const avatarNum = (index % 100) + 1;
  const avatar = `https://randomuser.me/api/portraits/${gender === 'Female' ? 'women' : 'men'}/${avatarNum % 100}.jpg`;
  
  const destination = selectRandom(destinations);
  const travelDates = generateTravelDates();
  const budget = generateBudget();
  const userInterests = selectRandomMultiple(interests, 3, 6);
  const travelStyle = selectRandom(travelStyles);
  const bioTemplate = selectRandom(bioTemplates);
  const bio = bioTemplate.replace('{destination}', destination);
  const userLanguages = selectRandomMultiple(languages, 1, 3);
  const hometown = selectRandom(cities);
  const verified = Math.random() < 0.7; // 70% verified
  const rating = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
  const tripsCompleted = Math.floor(Math.random() * 50);
  const responseRate = Math.floor(Math.random() * 30) + 70; // 70-100%
  const lastActive = getLastActive();
  const isOnline = Math.random() < 0.15; // 15% online
  const lookingFor = selectRandomMultiple(lookingForOptions, 1, 3);
  
  return {
    id: `buddy-${index}`,
    name,
    age,
    gender,
    avatar,
    destination,
    travelDates,
    budget,
    interests: userInterests,
    travelStyle,
    bio,
    languages: userLanguages,
    hometown,
    verified,
    rating,
    tripsCompleted,
    responseRate,
    lastActive,
    isOnline,
    lookingFor
  };
}

// Generate 10,000 travel buddies
export const allTravelBuddies: TravelBuddy[] = Array.from({ length: 10000 }, (_, i) => generateTravelBuddy(i));

// Intelligent search for travel buddies
export function searchTravelBuddies(filters: {
  destination?: string;
  budget?: string;
  interests?: string[];
  travelStyle?: string;
  gender?: string;
  verified?: boolean;
  minRating?: number;
  page?: number;
  limit?: number;
}): { buddies: TravelBuddy[]; total: number; hasMore: boolean } {
  let results = [...allTravelBuddies];
  
  if (filters.destination) {
    results = results.filter(b => b.destination === filters.destination);
  }
  
  if (filters.budget) {
    results = results.filter(b => b.budget === filters.budget);
  }
  
  if (filters.interests && filters.interests.length > 0) {
    // Match at least 1 interest instead of all
    results = results.filter(b => 
      filters.interests!.some(interest => b.interests.includes(interest))
    );
  }
  
  if (filters.travelStyle) {
    results = results.filter(b => b.travelStyle === filters.travelStyle);
  }
  
  if (filters.gender) {
    results = results.filter(b => b.gender === filters.gender);
  }
  
  if (filters.verified) {
    results = results.filter(b => b.verified);
  }
  
  if (filters.minRating) {
    results = results.filter(b => b.rating >= filters.minRating);
  }
  
  // Sort by online status, then rating, then trips completed
  results.sort((a, b) => {
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    if (a.rating !== b.rating) return b.rating - a.rating;
    return b.tripsCompleted - a.tripsCompleted;
  });
  
  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    buddies: results.slice(startIndex, endIndex),
    total: results.length,
    hasMore: endIndex < results.length
  };
}

console.log(`✅ Massive Travel Buddy Database Loaded: ${allTravelBuddies.length.toLocaleString()} travelers`);
