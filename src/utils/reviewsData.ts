// COMPREHENSIVE REVIEWS DATABASE - Production-Ready Review System
// This stores all reviews for hotels and travel buddies with realistic data

export interface HotelReview {
  id: string;
  hotelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  cleanliness: number;
  service: number;
  value: number;
  location: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  stayDuration: string;
  roomType: string;
  photos?: string[];
}

export interface BuddyReview {
  id: string;
  buddyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  communication: number;
  reliability: number;
  friendliness: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  tripDestination: string;
  tripDate: string;
}

// Common Indian names for realistic reviews
const indianNames = [
  'Priya Sharma', 'Rahul Kumar', 'Anita Desai', 'Vikram Singh', 'Sneha Patel',
  'Arjun Reddy', 'Divya Iyer', 'Karthik Menon', 'Pooja Gupta', 'Aditya Joshi',
  'Meera Nair', 'Rohan Kapoor', 'Kavya Krishnan', 'Siddharth Shah', 'Riya Malhotra',
  'Akash Verma', 'Nisha Agarwal', 'Varun Mehta', 'Shreya Rao', 'Nikhil Bose',
  'Anjali Chopra', 'Deepak Pandey', 'Tanvi Saxena', 'Harsh Mittal', 'Priyanka Das',
  'Sanjay Kulkarni', 'Preeti Tiwari', 'Manish Bhatt', 'Sonal Jain', 'Rajesh Sinha',
  'Neha Goyal', 'Amit Thakur', 'Swati Banerjee', 'Gaurav Dubey', 'Ritika Singh',
  'Ashish Chawla', 'Lakshmi Iyengar', 'Mohit Arora', 'Pallavi Rane', 'Vikas Soni'
];

const avatars = ['👨‍💼', '👩‍💼', '👨', '👩', '🧑', '👴', '👵', '👨‍🎓', '👩‍🎓', '🧔', '👱‍♀️', '👱‍♂️'];

// Positive review templates
const positiveComments = [
  'Absolutely amazing experience! The property exceeded all expectations. Staff was incredibly helpful and the location was perfect.',
  'One of the best stays I\'ve ever had. Everything from check-in to check-out was seamless. Highly recommend!',
  'Wonderful property with excellent amenities. The rooms were spotless and the service was outstanding.',
  'Great value for money! The staff went above and beyond to make our stay comfortable. Will definitely return.',
  'Beautiful property in a prime location. The attention to detail was impressive and the breakfast was delicious.',
  'Exceeded expectations in every way. The room was spacious, clean, and well-maintained. Staff was very professional.',
  'Perfect getaway! The ambiance was lovely and the facilities were top-notch. Couldn\'t have asked for more.',
  'Highly impressed with the service quality. The property is well-maintained and the location is convenient.',
  'Outstanding hospitality! Every staff member was courteous and helpful. The room was exactly as described.',
  'Fantastic stay! The property offers great amenities and the surrounding area has plenty to explore.',
];

const goodComments = [
  'Very good property overall. A few minor issues but nothing major. Would recommend to friends.',
  'Enjoyed our stay here. The property is well-located and staff is friendly. Good value for the price.',
  'Nice place with comfortable rooms. Service was prompt and the amenities were adequate.',
  'Good experience overall. The property met our expectations and staff was accommodating.',
  'Decent stay with good facilities. Location is convenient and rooms are comfortable.',
  'Pleasant experience. The property is clean and well-maintained. Staff is helpful.',
  'Good property for the price. Rooms are spacious and the location is accessible.',
  'Satisfactory stay. The amenities were good and check-in process was smooth.',
];

const averageComments = [
  'Average stay. The property is okay but could use some improvements. Service was decent.',
  'It was alright. Nothing exceptional but nothing terrible either. Fair for the price.',
  'Moderate experience. Some aspects were good while others could be better.',
  'Okay property. Met basic expectations but didn\'t wow us. Staff was helpful though.',
];

// Generate seed hotel reviews for popular hotels
export function generateSeedHotelReviews(): HotelReview[] {
  const reviews: HotelReview[] = [];
  const hotelIds = Array.from({ length: 100 }, (_, i) => `hotel-${i + 1}`);
  
  // Generate 3-8 reviews per hotel for first 50 hotels
  hotelIds.slice(0, 50).forEach((hotelId, index) => {
    const reviewCount = Math.floor(Math.random() * 6) + 3; // 3-8 reviews
    
    for (let i = 0; i < reviewCount; i++) {
      const rating = Math.random() > 0.7 ? 5 : Math.random() > 0.4 ? 4 : Math.random() > 0.2 ? 3 : 2;
      const cleanliness = rating + (Math.random() > 0.5 ? 0 : -1);
      const service = rating + (Math.random() > 0.5 ? 0 : -1);
      const value = rating + (Math.random() > 0.5 ? 0 : 1);
      const location = rating + (Math.random() > 0.5 ? 0 : 1);
      
      const userName = indianNames[Math.floor(Math.random() * indianNames.length)];
      const daysAgo = Math.floor(Math.random() * 180) + 1; // Reviews from last 6 months
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      let comment = '';
      if (rating === 5) {
        comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
      } else if (rating === 4) {
        comment = goodComments[Math.floor(Math.random() * goodComments.length)];
      } else {
        comment = averageComments[Math.floor(Math.random() * averageComments.length)];
      }
      
      reviews.push({
        id: `hotel-review-${hotelId}-${i}`,
        hotelId,
        userId: `user-${Math.floor(Math.random() * 1000)}`,
        userName,
        userAvatar: avatars[Math.floor(Math.random() * avatars.length)],
        rating: Math.min(5, Math.max(1, rating)),
        cleanliness: Math.min(5, Math.max(1, cleanliness)),
        service: Math.min(5, Math.max(1, service)),
        value: Math.min(5, Math.max(1, value)),
        location: Math.min(5, Math.max(1, location)),
        comment,
        date: date.toISOString(),
        helpful: Math.floor(Math.random() * 15),
        verified: Math.random() > 0.3,
        stayDuration: ['1 night', '2 nights', '3 nights', '1 week'][Math.floor(Math.random() * 4)],
        roomType: ['Deluxe Room', 'Suite', 'Standard Room', 'Premium Room'][Math.floor(Math.random() * 4)]
      });
    }
  });
  
  return reviews;
}

// Generate seed buddy reviews
const buddyPositiveComments = [
  'Amazing travel companion! Very reliable and fun to travel with. We had a great time exploring together.',
  'Fantastic buddy! Great communication throughout and very flexible with plans. Highly recommend.',
  'One of the best travel experiences! They were friendly, punctual, and great company.',
  'Excellent travel partner. Made the trip so much more enjoyable. Would love to travel together again!',
  'Super friendly and organized. They knew all the best spots and were very considerate.',
  'Great person to travel with! Very respectful and fun. Made lasting memories together.',
  'Perfect travel buddy! Communication was excellent and we had similar interests. Amazing trip!',
  'Really enjoyed traveling with them. Very reliable and great at planning. Highly recommend!',
  'Wonderful experience! They were easy-going and made the trip stress-free and fun.',
  'Best travel buddy I could ask for! Very friendly and we had an amazing time together.',
];

const buddyGoodComments = [
  'Good travel companion. We had a nice trip together and they were reliable.',
  'Pleasant experience traveling together. Good communication and respectful.',
  'Nice person to travel with. We enjoyed exploring together.',
  'Good buddy overall. Trip went smoothly and we had fun.',
  'Enjoyed the trip. They were friendly and considerate.',
];

export function generateSeedBuddyReviews(): BuddyReview[] {
  const reviews: BuddyReview[] = [];
  const buddyIds = Array.from({ length: 150 }, (_, i) => `buddy-${i + 1}`);
  
  // Generate 2-5 reviews per buddy for first 80 buddies
  buddyIds.slice(0, 80).forEach((buddyId) => {
    const reviewCount = Math.floor(Math.random() * 4) + 2; // 2-5 reviews
    
    for (let i = 0; i < reviewCount; i++) {
      const rating = Math.random() > 0.65 ? 5 : Math.random() > 0.3 ? 4 : 3;
      const communication = rating + (Math.random() > 0.5 ? 0 : -1);
      const reliability = rating + (Math.random() > 0.5 ? 0 : -1);
      const friendliness = rating + (Math.random() > 0.5 ? 1 : 0);
      
      const userName = indianNames[Math.floor(Math.random() * indianNames.length)];
      const daysAgo = Math.floor(Math.random() * 120) + 1;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const comment = rating >= 4 
        ? buddyPositiveComments[Math.floor(Math.random() * buddyPositiveComments.length)]
        : buddyGoodComments[Math.floor(Math.random() * buddyGoodComments.length)];
      
      const destinations = ['Goa', 'Manali', 'Jaipur', 'Kerala', 'Udaipur', 'Rishikesh', 'Ladakh', 'Himachal'];
      
      reviews.push({
        id: `buddy-review-${buddyId}-${i}`,
        buddyId,
        userId: `user-${Math.floor(Math.random() * 1000)}`,
        userName,
        userAvatar: avatars[Math.floor(Math.random() * avatars.length)],
        rating: Math.min(5, Math.max(1, rating)),
        communication: Math.min(5, Math.max(1, communication)),
        reliability: Math.min(5, Math.max(1, reliability)),
        friendliness: Math.min(5, Math.max(1, friendliness)),
        comment,
        date: date.toISOString(),
        helpful: Math.floor(Math.random() * 12),
        verified: Math.random() > 0.25,
        tripDestination: destinations[Math.floor(Math.random() * destinations.length)],
        tripDate: new Date(date.getTime() - 86400000 * 7).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      });
    }
  });
  
  return reviews;
}

// Initialize reviews in localStorage if not present
export function initializeReviews() {
  if (!localStorage.getItem('hotelReviews')) {
    const seedHotelReviews = generateSeedHotelReviews();
    localStorage.setItem('hotelReviews', JSON.stringify(seedHotelReviews));
  }
  
  if (!localStorage.getItem('buddyReviews')) {
    const seedBuddyReviews = generateSeedBuddyReviews();
    localStorage.setItem('buddyReviews', JSON.stringify(seedBuddyReviews));
  }
}

// Get hotel reviews
export function getHotelReviews(hotelId: string): HotelReview[] {
  const allReviews = JSON.parse(localStorage.getItem('hotelReviews') || '[]');
  return allReviews.filter((r: HotelReview) => r.hotelId === hotelId);
}

// Get buddy reviews
export function getBuddyReviews(buddyId: string): BuddyReview[] {
  const allReviews = JSON.parse(localStorage.getItem('buddyReviews') || '[]');
  return allReviews.filter((r: BuddyReview) => r.buddyId === buddyId);
}

// Calculate average ratings for a hotel
export function getHotelAverageRatings(hotelId: string) {
  const reviews = getHotelReviews(hotelId);
  if (reviews.length === 0) {
    return {
      overall: 0,
      cleanliness: 0,
      service: 0,
      value: 0,
      location: 0,
      count: 0
    };
  }
  
  return {
    overall: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length,
    cleanliness: reviews.reduce((acc, r) => acc + r.cleanliness, 0) / reviews.length,
    service: reviews.reduce((acc, r) => acc + r.service, 0) / reviews.length,
    value: reviews.reduce((acc, r) => acc + r.value, 0) / reviews.length,
    location: reviews.reduce((acc, r) => acc + r.location, 0) / reviews.length,
    count: reviews.length
  };
}

// Calculate average ratings for a buddy
export function getBuddyAverageRatings(buddyId: string) {
  const reviews = getBuddyReviews(buddyId);
  if (reviews.length === 0) {
    return {
      overall: 0,
      communication: 0,
      reliability: 0,
      friendliness: 0,
      count: 0
    };
  }
  
  return {
    overall: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length,
    communication: reviews.reduce((acc, r) => acc + r.communication, 0) / reviews.length,
    reliability: reviews.reduce((acc, r) => acc + r.reliability, 0) / reviews.length,
    friendliness: reviews.reduce((acc, r) => acc + r.friendliness, 0) / reviews.length,
    count: reviews.length
  };
}

// Add a new hotel review
export function addHotelReview(review: HotelReview) {
  const allReviews = JSON.parse(localStorage.getItem('hotelReviews') || '[]');
  allReviews.push(review);
  localStorage.setItem('hotelReviews', JSON.stringify(allReviews));
}

// Add a new buddy review
export function addBuddyReview(review: BuddyReview) {
  const allReviews = JSON.parse(localStorage.getItem('buddyReviews') || '[]');
  allReviews.push(review);
  localStorage.setItem('buddyReviews', JSON.stringify(allReviews));
}

// Mark review as helpful
export function markReviewHelpful(reviewId: string, type: 'hotel' | 'buddy') {
  const storageKey = type === 'hotel' ? 'hotelReviews' : 'buddyReviews';
  const allReviews = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const review = allReviews.find((r: any) => r.id === reviewId);
  if (review) {
    review.helpful += 1;
    localStorage.setItem(storageKey, JSON.stringify(allReviews));
  }
}
