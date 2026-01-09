// MASSIVE TRAVEL BUDDIES DATABASE - 100 TRAVELERS (10 PER CITY)
// Production-ready realistic traveler profiles

export interface TravelBuddy {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  avatar: string;
  hometown: string;
  destination: string;
  travelDates: string;
  budget: string;
  travelStyle: string;
  interests: string[];
  languages: string[];
  bio: string;
  rating: number;
  tripsCompleted: number;
  verified: boolean;
  responseRate: number;
  lastActive: string;
  isOnline: boolean;
  lookingFor: string[];
}

const cities = ['Goa', 'Manali', 'Jaipur', 'Kerala', 'Udaipur', 'Rishikesh', 'Varanasi', 'Amritsar', 'Hampi', 'Darjeeling'];

const maleNames = [
  'Rahul', 'Amit', 'Vikram', 'Arjun', 'Karan', 'Rohit', 'Aditya', 'Sanjay', 'Varun', 'Ravi',
  'Ajay', 'Nikhil', 'Pranav', 'Harish', 'Suresh', 'Manoj', 'Deepak', 'Vivek', 'Ankit', 'Gaurav'
];

const femaleNames = [
  'Priya', 'Neha', 'Anjali', 'Kavita', 'Simran', 'Pooja', 'Deepika', 'Meera', 'Ishita', 'Sunita',
  'Divya', 'Ritu', 'Aarti', 'Swati', 'Nisha', 'Sneha', 'Tanvi', 'Riya', 'Shruti', 'Anushka'
];

const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Mehta', 'Verma', 'Kumar', 'Reddy', 'Gupta', 'Malhotra', 'Nair',
  'Joshi', 'Desai', 'Saxena', 'Rao', 'Iyer', 'Chopra', 'Khanna', 'Bhatia', 'Sethi', 'Agarwal'
];

const hometowns = [
  'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Chandigarh', 'Lucknow'
];

const travelStyles = ['Backpacker', 'Luxury', 'Adventure', 'Relaxed', 'Cultural', 'Party', 'Spiritual', 'Budget'];

const budgetRanges = [
  '₹5,000-10,000', '₹10,000-15,000', '₹15,000-20,000', '₹20,000-30,000', '₹30,000-50,000'
];

const interestsPool = [
  'Photography', 'Adventure Sports', 'Food', 'Culture', 'History', 'Nature', 'Nightlife',
  'Shopping', 'Yoga', 'Trekking', 'Beach', 'Mountains', 'Wildlife', 'Art', 'Music'
];

const languagesPool = [
  ['Hindi', 'English'],
  ['Hindi', 'English', 'Marathi'],
  ['Hindi', 'English', 'Tamil'],
  ['Hindi', 'English', 'Telugu'],
  ['Hindi', 'English', 'Punjabi'],
  ['Hindi', 'English', 'Bengali'],
  ['Hindi', 'English', 'Gujarati']
];

const lookingForOptions = [
  ['Travel Partner', 'Split Costs'],
  ['Explore Together', 'Local Insights'],
  ['Adventure Buddy', 'Photography Partner'],
  ['Cultural Exchange', 'Language Practice'],
  ['Party Companion', 'Nightlife Guide']
];

// Generate 100 travel buddies (10 per city)
export const allTravelBuddies: TravelBuddy[] = [];

cities.forEach((city, cityIndex) => {
  for (let i = 0; i < 10; i++) {
    const isMale = Math.random() > 0.4;
    const firstName = isMale ? maleNames[Math.floor(Math.random() * maleNames.length)] : femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const age = 22 + Math.floor(Math.random() * 18);
    const rating = 3.5 + (Math.random() * 1.5);
    const tripsCompleted = 5 + Math.floor(Math.random() * 45);
    
    // Generate travel dates (next 30 days)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + (i * 3));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (3 + (i % 4)));
    
    const buddyId = `buddy-${cityIndex * 10 + i + 1}`;
    
    // Random interests (3-6)
    const numInterests = 3 + Math.floor(Math.random() * 4);
    const shuffled = [...interestsPool].sort(() => 0.5 - Math.random());
    const interests = shuffled.slice(0, numInterests);
    
    allTravelBuddies.push({
      id: buddyId,
      name,
      age,
      gender: isMale ? 'Male' : 'Female',
      avatar: isMale 
        ? `https://randomuser.me/api/portraits/men/${(cityIndex * 10 + i) % 70}.jpg`
        : `https://randomuser.me/api/portraits/women/${(cityIndex * 10 + i) % 70}.jpg`,
      hometown: hometowns[i % hometowns.length],
      destination: city,
      travelDates: `${startDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`,
      budget: budgetRanges[i % budgetRanges.length],
      travelStyle: travelStyles[i % travelStyles.length],
      interests,
      languages: languagesPool[i % languagesPool.length],
      bio: `${age} year old ${isMale ? 'guy' : 'girl'} from ${hometowns[i % hometowns.length]} looking to explore ${city}. Love ${interests.slice(0, 2).join(' and ')}. Let's make this trip memorable!`,
      rating: parseFloat(rating.toFixed(1)),
      tripsCompleted,
      verified: Math.random() > 0.2,
      responseRate: 75 + Math.floor(Math.random() * 25),
      lastActive: i % 3 === 0 ? 'Online now' : i % 3 === 1 ? '2 hours ago' : 'Yesterday',
      isOnline: i % 3 === 0,
      lookingFor: lookingForOptions[i % lookingForOptions.length]
    });
  }
});

// Search function
export function searchTravelBuddies(params: {
  destination?: string;
  budget?: string;
  interests?: string[];
  travelStyle?: string;
  gender?: string;
  verified?: boolean;
  minRating?: number;
  page?: number;
  limit?: number;
}) {
  let filtered = [...allTravelBuddies];

  if (params.destination) {
    filtered = filtered.filter(b => b.destination === params.destination);
  }

  if (params.budget) {
    filtered = filtered.filter(b => b.budget === params.budget);
  }

  if (params.interests && params.interests.length > 0) {
    filtered = filtered.filter(b =>
      params.interests!.some(interest => b.interests.includes(interest))
    );
  }

  if (params.travelStyle) {
    filtered = filtered.filter(b => b.travelStyle === params.travelStyle);
  }

  if (params.gender) {
    filtered = filtered.filter(b => b.gender === params.gender);
  }

  if (params.verified) {
    filtered = filtered.filter(b => b.verified);
  }

  if (params.minRating) {
    filtered = filtered.filter(b => b.rating >= params.minRating);
  }

  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    buddies: filtered.slice(startIndex, endIndex),
    total: filtered.length,
    hasMore: endIndex < filtered.length
  };
}

// Get buddy by ID
export function getBuddyById(id: string): TravelBuddy | undefined {
  return allTravelBuddies.find(b => b.id === id);
}

// Get buddies by destination
export function getBuddiesByDestination(destination: string): TravelBuddy[] {
  return allTravelBuddies.filter(b => b.destination === destination);
}

export { cities as availableCities };
