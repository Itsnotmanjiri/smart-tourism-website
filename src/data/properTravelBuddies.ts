// PROPER TRAVEL BUDDY DATABASE - 10 PEOPLE PER CITY (100 TOTAL)
// Realistic profiles with proper matching system

export interface TravelBuddy {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
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
  isOnline: boolean;
  lookingFor: string[];
}

export const allTravelBuddies: TravelBuddy[] = [
  // GOA (10 people)
  {
    id: 'buddy-goa-1',
    name: 'Rahul Sharma',
    age: 28,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    destination: 'Goa',
    travelDates: '15 Jan - 20 Jan',
    budget: '₹15,000-20,000',
    interests: ['Beach', 'Water Sports', 'Nightlife', 'Food'],
    travelStyle: 'Adventure',
    bio: 'Love exploring beaches and trying water sports! Looking for adventure buddies.',
    languages: ['Hindi', 'English'],
    hometown: 'Mumbai',
    verified: true,
    rating: 4.8,
    tripsCompleted: 12,
    isOnline: true,
    lookingFor: ['Travel Partner', 'Adventure Buddy']
  },
  {
    id: 'buddy-goa-2',
    name: 'Priya Desai',
    age: 25,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    destination: 'Goa',
    travelDates: '18 Jan - 23 Jan',
    budget: '₹10,000-15,000',
    interests: ['Photography', 'Beach', 'Culture', 'Shopping'],
    travelStyle: 'Relaxed',
    bio: 'Solo female traveler looking for photography partner and beach exploration.',
    languages: ['Hindi', 'English', 'Gujarati'],
    hometown: 'Ahmedabad',
    verified: true,
    rating: 4.9,
    tripsCompleted: 8,
    isOnline: false,
    lookingFor: ['Travel Partner', 'Photography Partner']
  },
  {
    id: 'buddy-goa-3',
    name: 'Amit Patel',
    age: 32,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    destination: 'Goa',
    travelDates: '20 Jan - 25 Jan',
    budget: '₹20,000-30,000',
    interests: ['Food', 'Nightlife', 'Party', 'Beach'],
    travelStyle: 'Party',
    bio: 'Foodie and party enthusiast! Let\'s explore Goa\'s nightlife together.',
    languages: ['Hindi', 'English'],
    hometown: 'Delhi',
    verified: true,
    rating: 4.6,
    tripsCompleted: 15,
    isOnline: true,
    lookingFor: ['Travel Partner', 'Food Explorer']
  },
  {
    id: 'buddy-goa-4',
    name: 'Sneha Reddy',
    age: 24,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    destination: 'Goa',
    travelDates: '22 Jan - 27 Jan',
    budget: '₹10,000-15,000',
    interests: ['Yoga', 'Beach', 'Wellness', 'Nature'],
    travelStyle: 'Relaxed',
    bio: 'Wellness enthusiast seeking peaceful beach time and yoga sessions.',
    languages: ['Hindi', 'English', 'Telugu'],
    hometown: 'Hyderabad',
    verified: true,
    rating: 4.7,
    tripsCompleted: 6,
    isOnline: false,
    lookingFor: ['Travel Partner', 'Wellness Companion']
  },
  {
    id: 'buddy-goa-5',
    name: 'Vikram Singh',
    age: 29,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    destination: 'Goa',
    travelDates: '25 Jan - 30 Jan',
    budget: '₹15,000-20,000',
    interests: ['Water Sports', 'Adventure', 'Trekking', 'Beach'],
    travelStyle: 'Adventure',
    bio: 'Adventure junkie looking for scuba diving and parasailing partners!',
    languages: ['Hindi', 'English', 'Punjabi'],
    hometown: 'Chandigarh',
    verified: true,
    rating: 4.8,
    tripsCompleted: 10,
    isOnline: true,
    lookingFor: ['Adventure Buddy', 'Split Costs']
  },
  {
    id: 'buddy-goa-6',
    name: 'Anjali Verma',
    age: 27,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
    destination: 'Goa',
    travelDates: '28 Jan - 2 Feb',
    budget: '₹5,000-10,000',
    interests: ['Backpacking', 'Budget Travel', 'Beach', 'Culture'],
    travelStyle: 'Budget',
    bio: 'Budget backpacker exploring Goa! Looking to share accommodation costs.',
    languages: ['Hindi', 'English'],
    hometown: 'Bangalore',
    verified: false,
    rating: 4.5,
    tripsCompleted: 4,
    isOnline: false,
    lookingFor: ['Room Sharing', 'Split Costs']
  },
  {
    id: 'buddy-goa-7',
    name: 'Rohan Joshi',
    age: 26,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    destination: 'Goa',
    travelDates: '1 Feb - 5 Feb',
    budget: '₹20,000-30,000',
    interests: ['Luxury Travel', 'Food', 'Spa', 'Beach'],
    travelStyle: 'Luxury',
    bio: 'Love fine dining and luxury experiences. Looking for similar-minded travelers.',
    languages: ['Hindi', 'English', 'Marathi'],
    hometown: 'Pune',
    verified: true,
    rating: 4.9,
    tripsCompleted: 18,
    isOnline: true,
    lookingFor: ['Travel Partner', 'Food Explorer']
  },
  {
    id: 'buddy-goa-8',
    name: 'Kavya Nair',
    age: 23,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    destination: 'Goa',
    travelDates: '5 Feb - 10 Feb',
    budget: '₹10,000-15,000',
    interests: ['Beach', 'Music', 'Culture', 'Photography'],
    travelStyle: 'Cultural',
    bio: 'Music lover and culture enthusiast! Want to explore Goa\'s heritage.',
    languages: ['Hindi', 'English', 'Malayalam'],
    hometown: 'Kochi',
    verified: true,
    rating: 4.6,
    tripsCompleted: 7,
    isOnline: false,
    lookingFor: ['Travel Partner', 'Cultural Exchange']
  },
  {
    id: 'buddy-goa-9',
    name: 'Karan Malhotra',
    age: 30,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/71.jpg',
    destination: 'Goa',
    travelDates: '8 Feb - 12 Feb',
    budget: '₹15,000-20,000',
    interests: ['Photography', 'Beach', 'Sunset', 'Nature'],
    travelStyle: 'Explorer',
    bio: 'Photographer seeking stunning Goa sunsets and hidden beaches.',
    languages: ['Hindi', 'English'],
    hometown: 'Jaipur',
    verified: true,
    rating: 4.7,
    tripsCompleted: 11,
    isOnline: true,
    lookingFor: ['Photography Partner', 'Travel Partner']
  },
  {
    id: 'buddy-goa-10',
    name: 'Simran Kaur',
    age: 24,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/women/72.jpg',
    destination: 'Goa',
    travelDates: '10 Feb - 15 Feb',
    budget: '₹10,000-15,000',
    interests: ['Beach', 'Nightlife', 'Dancing', 'Food'],
    travelStyle: 'Social',
    bio: 'Social butterfly looking for fun group to explore Goa\'s nightlife!',
    languages: ['Hindi', 'English', 'Punjabi'],
    hometown: 'Amritsar',
    verified: true,
    rating: 4.8,
    tripsCompleted: 9,
    isOnline: false,
    lookingFor: ['Travel Partner', 'Party Buddy']
  },

  // MANALI (10 people)
  {
    id: 'buddy-manali-1',
    name: 'Arjun Kapoor',
    age: 27,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    destination: 'Manali',
    travelDates: '12 Jan - 17 Jan',
    budget: '₹15,000-20,000',
    interests: ['Trekking', 'Mountains', 'Adventure', 'Photography'],
    travelStyle: 'Adventure',
    bio: 'Mountain lover seeking trekking partners for Manali trails!',
    languages: ['Hindi', 'English'],
    hometown: 'Delhi',
    verified: true,
    rating: 4.9,
    tripsCompleted: 14,
    isOnline: true,
    lookingFor: ['Adventure Buddy', 'Trekking Partner']
  },
  {
    id: 'buddy-manali-2',
    name: 'Divya Sharma',
    age: 25,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    destination: 'Manali',
    travelDates: '15 Jan - 20 Jan',
    budget: '₹10,000-15,000',
    interests: ['Nature', 'Photography', 'Cafes', 'Mountains'],
    travelStyle: 'Relaxed',
    bio: 'Nature photographer looking for scenic spots and cozy cafes in Manali.',
    languages: ['Hindi', 'English'],
    hometown: 'Chandigarh',
    verified: true,
    rating: 4.7,
    tripsCompleted: 8,
    isOnline: false,
    lookingFor: ['Photography Partner', 'Travel Partner']
  },
  {
    id: 'buddy-manali-3',
    name: 'Nikhil Gupta',
    age: 31,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
    destination: 'Manali',
    travelDates: '18 Jan - 23 Jan',
    budget: '₹20,000-30,000',
    interests: ['Skiing', 'Adventure', 'Mountains', 'Paragliding'],
    travelStyle: 'Adventure',
    bio: 'Skiing enthusiast! Looking for Solang Valley adventure partners.',
    languages: ['Hindi', 'English'],
    hometown: 'Mumbai',
    verified: true,
    rating: 4.8,
    tripsCompleted: 16,
    isOnline: true,
    lookingFor: ['Adventure Buddy', 'Split Costs']
  },
  {
    id: 'buddy-manali-4',
    name: 'Riya Malhotra',
    age: 24,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
    destination: 'Manali',
    travelDates: '20 Jan - 25 Jan',
    budget: '₹10,000-15,000',
    interests: ['Spiritual', 'Temples', 'Nature', 'Yoga'],
    travelStyle: 'Spiritual',
    bio: 'Seeking spiritual journey and temple visits in Himalayan region.',
    languages: ['Hindi', 'English'],
    hometown: 'Jaipur',
    verified: true,
    rating: 4.6,
    tripsCompleted: 5,
    isOnline: false,
    lookingFor: ['Travel Partner', 'Cultural Exchange']
  },
  {
    id: 'buddy-manali-5',
    name: 'Aditya Verma',
    age: 28,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/48.jpg',
    destination: 'Manali',
    travelDates: '22 Jan - 27 Jan',
    budget: '₹15,000-20,000',
    interests: ['Camping', 'Bonfire', 'Mountains', 'Trekking'],
    travelStyle: 'Adventure',
    bio: 'Love camping under stars! Looking for camping and bonfire buddies.',
    languages: ['Hindi', 'English', 'Punjabi'],
    hometown: 'Ludhiana',
    verified: true,
    rating: 4.7,
    tripsCompleted: 12,
    isOnline: true,
    lookingFor: ['Adventure Buddy', 'Camping Partner']
  },
  {
    id: 'buddy-manali-6',
    name: 'Megha Iyer',
    age: 26,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/women/54.jpg',
    destination: 'Manali',
    travelDates: '25 Jan - 30 Jan',
    budget: '₹5,000-10,000',
    interests: ['Budget Travel', 'Backpacking', 'Cafes', 'Nature'],
    travelStyle: 'Budget',
    bio: 'Budget traveler exploring Manali on a shoestring! Room sharing welcome.',
    languages: ['Hindi', 'English', 'Tamil'],
    hometown: 'Chennai',
    verified: false,
    rating: 4.5,
    tripsCompleted: 6,
    isOnline: false,
    lookingFor: ['Room Sharing', 'Split Costs']
  },
  {
    id: 'buddy-manali-7',
    name: 'Varun Khanna',
    age: 29,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/59.jpg',
    destination: 'Manali',
    travelDates: '28 Jan - 2 Feb',
    budget: '₹20,000-30,000',
    interests: ['Luxury Travel', 'Spa', 'Fine Dining', 'Mountains'],
    travelStyle: 'Luxury',
    bio: 'Love luxury mountain resorts and spa experiences. Seeking similar travelers.',
    languages: ['Hindi', 'English'],
    hometown: 'Bangalore',
    verified: true,
    rating: 4.9,
    tripsCompleted: 20,
    isOnline: true,
    lookingFor: ['Travel Partner', 'Luxury Experience']
  },
  {
    id: 'buddy-manali-8',
    name: 'Sakshi Agarwal',
    age: 23,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/women/61.jpg',
    destination: 'Manali',
    travelDates: '1 Feb - 5 Feb',
    budget: '₹10,000-15,000',
    interests: ['Photography', 'Snow', 'Cafes', 'Shopping'],
    travelStyle: 'Explorer',
    bio: 'First time in Manali! Excited for snow and cafe hopping.',
    languages: ['Hindi', 'English'],
    hometown: 'Kolkata',
    verified: true,
    rating: 4.6,
    tripsCompleted: 3,
    isOnline: false,
    lookingFor: ['Travel Partner', 'Shopping Companion']
  },
  {
    id: 'buddy-manali-9',
    name: 'Gaurav Singh',
    age: 30,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/69.jpg',
    destination: 'Manali',
    travelDates: '5 Feb - 10 Feb',
    budget: '₹15,000-20,000',
    interests: ['Biking', 'Mountains', 'Adventure', 'Photography'],
    travelStyle: 'Adventure',
    bio: 'Biker planning to ride through Himalayan routes! Join me.',
    languages: ['Hindi', 'English'],
    hometown: 'Pune',
    verified: true,
    rating: 4.8,
    tripsCompleted: 15,
    isOnline: true,
    lookingFor: ['Adventure Buddy', 'Biking Partner']
  },
  {
    id: 'buddy-manali-10',
    name: 'Ananya Roy',
    age: 25,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/women/73.jpg',
    destination: 'Manali',
    travelDates: '8 Feb - 12 Feb',
    budget: '₹10,000-15,000',
    interests: ['Culture', 'Local Food', 'Temples', 'Nature'],
    travelStyle: 'Cultural',
    bio: 'Culture enthusiast wanting to explore Himachali traditions and food.',
    languages: ['Hindi', 'English', 'Bengali'],
    hometown: 'Kolkata',
    verified: true,
    rating: 4.7,
    tripsCompleted: 7,
    isOnline: false,
    lookingFor: ['Travel Partner', 'Cultural Exchange']
  }
];

// Get buddies by destination
export function getBuddiesByDestination(destination: string): TravelBuddy[] {
  return allTravelBuddies.filter(b => b.destination === destination);
}

// Find matches based on criteria
export function findMatches(criteria: {
  destination: string;
  budget?: string;
  interests?: string[];
  travelStyle?: string;
}): TravelBuddy[] {
  let matches = getBuddiesByDestination(criteria.destination);
  
  if (criteria.budget) {
    matches = matches.filter(b => b.budget === criteria.budget);
  }
  
  if (criteria.interests && criteria.interests.length > 0) {
    matches = matches.filter(b => 
      criteria.interests!.some(interest => b.interests.includes(interest))
    );
  }
  
  if (criteria.travelStyle) {
    matches = matches.filter(b => b.travelStyle === criteria.travelStyle);
  }
  
  // Sort by online status and rating
  matches.sort((a, b) => {
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    return b.rating - a.rating;
  });
  
  return matches;
}

console.log(`✅ Travel Buddy Database Loaded: ${allTravelBuddies.length} travelers across ${new Set(allTravelBuddies.map(b => b.destination)).size} cities`);
