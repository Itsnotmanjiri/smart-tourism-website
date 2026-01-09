import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Award, TrendingUp, Shield, CheckCircle, Camera, X, Upload, Filter, Calendar, User, MapPin, Hotel as HotelIcon, Users, Car, Sparkles, Heart, Flag, Share2, ImageIcon, Video, Smile, Frown, Meh, Eye, BarChart3 } from 'lucide-react';
import { globalState } from '../utils/globalState';
import { allHotels as massiveProperHotels } from '../data/massiveProperHotels';
import { allTravelBuddies as massiveProperBuddies } from '../data/massiveProperBuddies';
import { toast } from 'sonner@2.0.3';

interface Review {
  id: string;
  type: 'hotel' | 'buddy' | 'carpool' | 'driver';
  targetId: string;
  targetName: string;
  targetLocation?: string;
  targetImage?: string;
  
  // Overall rating
  rating: number;
  
  // Detailed ratings (category-specific)
  cleanliness?: number;
  service?: number;
  value?: number;
  location?: number;
  amenities?: number;
  food?: number;
  
  // Travel buddy ratings
  communication?: number;
  reliability?: number;
  friendliness?: number;
  compatibility?: number;
  
  // Driver/Carpool ratings
  driving?: number;
  vehicle?: number;
  punctuality?: number;
  safety?: number;
  
  // Review content
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  tips: string[];
  
  // Media
  photos: string[];
  videos?: string[];
  
  // Metadata
  date: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  tripDate?: string;
  stayDuration?: string;
  roomType?: string;
  travelType?: 'solo' | 'couple' | 'family' | 'friends' | 'business';
  
  // Engagement
  helpful: number;
  notHelpful: number;
  helpfulVotes: string[]; // User IDs who voted helpful
  notHelpfulVotes: string[]; // User IDs who voted not helpful
  reportCount: number;
  
  // Verification
  verified: boolean;
  verifiedPurchase: boolean;
  
  // Response from provider
  providerResponse?: {
    message: string;
    date: string;
    providerName: string;
  };
}

interface Props {
  onBack: () => void;
}

export function WorldClassReviewSystem({ onBack }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'hotel' | 'buddy' | 'carpool'>('all');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful' | 'photos'>('recent');
  const [reviewType, setReviewType] = useState<'hotel' | 'buddy' | 'carpool' | 'driver'>('hotel');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [availableTargets, setAvailableTargets] = useState<any>({
    hotel: [],
    buddy: [],
    carpool: [],
    driver: []
  });
  
  const [formData, setFormData] = useState({
    targetId: '',
    targetName: '',
    targetLocation: '',
    rating: 5,
    cleanliness: 5,
    service: 5,
    value: 5,
    location: 5,
    amenities: 5,
    food: 5,
    communication: 5,
    reliability: 5,
    friendliness: 5,
    compatibility: 5,
    driving: 5,
    vehicle: 5,
    punctuality: 5,
    safety: 5,
    title: '',
    comment: '',
    pros: ['', '', ''],
    cons: ['', '', ''],
    tips: ['', '', ''],
    travelType: 'solo' as const,
    roomType: '',
    stayDuration: '',
  });

  useEffect(() => {
    loadReviews();
    generateDummyReviews();
    loadAvailableTargets();
  }, []);

  const loadAvailableTargets = () => {
    try {
      // Load real hotels from provider hotels and tourist hotels
      const providerHotels = JSON.parse(localStorage.getItem('providerHotels') || '[]');
      const touristHotels = JSON.parse(localStorage.getItem('touristHotels') || '[]');
      
      // Combine all hotels (prioritize provider hotels, then tourist hotels, then mock data)
      const allHotels = [...providerHotels, ...touristHotels, ...massiveProperHotels.slice(0, 20)];
      
      // Remove duplicates by ID
      const uniqueHotels = allHotels.filter((hotel, index, self) => 
        index === self.findIndex((h) => h.id === hotel.id)
      );

      const hotelTargets = uniqueHotels.map(h => ({
        id: h.id,
        name: h.name,
        location: h.destination || h.location || h.city || 'India',
        image: (h.images && h.images.length > 0) ? h.images[0] : 
               (h.image ? h.image : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400')
      }));

      // Load real carpool drivers from localStorage
      const driverProfiles = JSON.parse(localStorage.getItem('driverProfiles') || '[]');
      
      const carpoolTargets = driverProfiles.map((d: any) => ({
        id: d.id,
        name: d.name,
        location: `${d.from || 'Unknown'} - ${d.to || 'Unknown'}`,
        image: d.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
      }));

      // Add some mock drivers if no real ones exist
      if (carpoolTargets.length === 0) {
        carpoolTargets.push(
          { id: 'driver-1', name: 'Rajesh Kumar', location: 'Mumbai-Pune', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
          { id: 'driver-2', name: 'Amit Singh', location: 'Delhi-Jaipur', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' }
        );
      }

      // Load real travel buddies
      const buddyTargets = massiveProperBuddies.slice(0, 20).map(b => ({ 
        id: b.id, 
        name: b.name, 
        location: (b.preferredDestinations && b.preferredDestinations.length > 0) ? b.preferredDestinations[0] : 'India', 
        image: b.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'
      }));

      setAvailableTargets({
        hotel: hotelTargets,
        buddy: buddyTargets,
        carpool: carpoolTargets,
        driver: carpoolTargets // Same as carpool
      });

      console.log('📝 Review System - Loaded targets:', {
        hotels: hotelTargets.length,
        buddies: buddyTargets.length,
        drivers: carpoolTargets.length
      });
    } catch (error) {
      console.error('Error loading review targets:', error);
      toast.error('Error loading review options');
    }
  };

  const loadReviews = () => {
    const stored = localStorage.getItem('worldClassReviews');
    if (stored) {
      setReviews(JSON.parse(stored));
    }
  };

  const saveReviews = (newReviews: Review[]) => {
    localStorage.setItem('worldClassReviews', JSON.stringify(newReviews));
    setReviews(newReviews);
  };

  const generateDummyReviews = () => {
    const existing = localStorage.getItem('worldClassReviews');
    if (existing) return;

    // Safety check - ensure we have data before creating dummy reviews
    if (!massiveProperHotels || massiveProperHotels.length < 2) return;
    if (!massiveProperBuddies || massiveProperBuddies.length < 1) return;

    const dummyReviews: Review[] = [
      {
        id: 'rev-1',
        type: 'hotel',
        targetId: massiveProperHotels[0]?.id || 'hotel-1',
        targetName: massiveProperHotels[0]?.name || 'Luxury Hotel',
        targetLocation: massiveProperHotels[0]?.destination || 'India',
        targetImage: (massiveProperHotels[0]?.images && massiveProperHotels[0].images.length > 0) ? massiveProperHotels[0].images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        rating: 5,
        cleanliness: 5,
        service: 5,
        value: 4,
        location: 5,
        amenities: 5,
        food: 5,
        title: 'Absolutely Outstanding Experience!',
        comment: 'This hotel exceeded all our expectations. From the moment we arrived, the staff was incredibly welcoming. The rooms were spotless, modern, and had breathtaking views. The food was restaurant-quality, and the location was perfect for exploring. Would highly recommend to anyone!',
        pros: ['Immaculate cleanliness', 'Exceptional staff service', 'Prime location with great views'],
        cons: ['WiFi could be faster', 'Breakfast starts a bit late', 'Pool area gets crowded'],
        tips: ['Book ocean-view rooms in advance', 'Try the rooftop restaurant at sunset', 'Ask for early check-in availability'],
        photos: [
          'https://images.unsplash.com/photo-1668228831907-1721b7166ce4?w=800',
          'https://images.unsplash.com/photo-1652881389205-9f85f82888c8?w=800',
          'https://images.unsplash.com/photo-1534612899740-55c821a90129?w=800'
        ],
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'user-1',
        userName: 'Priya Mehta',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        tripDate: '15-20 December 2025',
        stayDuration: '5 nights',
        roomType: 'Deluxe Sea View',
        travelType: 'family',
        helpful: 156,
        notHelpful: 3,
        helpfulVotes: [],
        notHelpfulVotes: [],
        reportCount: 0,
        verified: true,
        verifiedPurchase: true,
        providerResponse: {
          message: 'Thank you so much for your wonderful review, Priya! We\'re thrilled you enjoyed your stay. We\'ve noted your feedback about WiFi and pool timing. Hope to see you again soon!',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          providerName: 'Hotel Manager - ' + (massiveProperHotels[0]?.name || 'Hotel')
        }
      },
      {
        id: 'rev-2',
        type: 'hotel',
        targetId: massiveProperHotels[1]?.id || 'hotel-2',
        targetName: massiveProperHotels[1]?.name || 'Budget Hotel',
        targetLocation: massiveProperHotels[1]?.destination || 'India',
        targetImage: (massiveProperHotels[1]?.images && massiveProperHotels[1].images.length > 0) ? massiveProperHotels[1].images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        rating: 4,
        cleanliness: 5,
        service: 4,
        value: 5,
        location: 3,
        amenities: 4,
        food: 4,
        title: 'Great Value for Money',
        comment: 'Had a wonderful stay here. The hotel offers excellent facilities at a very reasonable price. Rooms were clean and comfortable. Only downside is it\'s a bit far from the main attractions, but they offer complimentary shuttle service.',
        pros: ['Excellent value proposition', 'Very clean rooms', 'Friendly staff', 'Good complimentary shuttle'],
        cons: ['Bit far from city center', 'Limited restaurant menu', 'No gym facility'],
        tips: ['Use the shuttle service - very convenient', 'Book directly for better rates', 'Try the local cuisine recommendations from staff'],
        photos: [
          'https://images.unsplash.com/photo-1652881389205-9f85f82888c8?w=800',
          'https://images.unsplash.com/photo-1637730826933-54287f79e1c3?w=800'
        ],
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'user-2',
        userName: 'Rahul Verma',
        tripDate: '10-13 December 2025',
        stayDuration: '3 nights',
        roomType: 'Standard Double',
        travelType: 'couple',
        helpful: 89,
        notHelpful: 5,
        helpfulVotes: [],
        notHelpfulVotes: [],
        reportCount: 0,
        verified: true,
        verifiedPurchase: true
      },
      {
        id: 'rev-3',
        type: 'buddy',
        targetId: massiveProperBuddies[0]?.id || 'buddy-1',
        targetName: massiveProperBuddies[0]?.name || 'Travel Buddy',
        targetLocation: (massiveProperBuddies[0]?.preferredDestinations && massiveProperBuddies[0].preferredDestinations.length > 0) ? massiveProperBuddies[0].preferredDestinations[0] : 'India',
        targetImage: massiveProperBuddies[0]?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        rating: 5,
        communication: 5,
        reliability: 5,
        friendliness: 5,
        compatibility: 5,
        title: 'Best Travel Buddy Ever!',
        comment: 'Traveled with this person to Manali and it was an amazing experience. Very organized, fun to be around, and respectful of personal space. We had similar interests and the trip was perfectly balanced between adventure and relaxation.',
        pros: ['Excellent communication', 'Very punctual', 'Great sense of humor', 'Respectful and considerate'],
        cons: ['Wakes up quite early', 'Prefers planned itinerary over spontaneity'],
        tips: ['Discuss budget beforehand', 'Share food preferences early', 'Be clear about morning routines'],
        photos: [
          'https://images.unsplash.com/photo-1674457210496-9dc8efe20ee9?w=800'
        ],
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'user-3',
        userName: 'Sneha Kapoor',
        tripDate: '1-7 December 2025',
        travelType: 'friends',
        helpful: 67,
        notHelpful: 1,
        helpfulVotes: [],
        notHelpfulVotes: [],
        reportCount: 0,
        verified: true,
        verifiedPurchase: true
      },
      {
        id: 'rev-4',
        type: 'carpool',
        targetId: 'driver-1',
        targetName: 'Rajesh Kumar',
        targetLocation: 'Mumbai-Pune',
        targetImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        rating: 5,
        driving: 5,
        vehicle: 5,
        punctuality: 5,
        safety: 5,
        communication: 5,
        title: 'Professional and Safe Driver',
        comment: 'Excellent carpool experience! Rajesh is a very skilled driver who prioritizes safety. The car was clean and comfortable. He was exactly on time for pickup and maintained perfect speed throughout. Highly recommend!',
        pros: ['Very safe driver', 'Clean and comfortable vehicle', 'Punctual pickup', 'Smooth driving'],
        cons: ['Prefers minimal conversation', 'No music allowed'],
        tips: ['Book in advance for weekend trips', 'Confirm pickup location clearly', 'Carry water as no stops for short trips'],
        photos: [],
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'user-4',
        userName: 'Arjun Malhotra',
        tripDate: '28 December 2025',
        travelType: 'business',
        helpful: 92,
        notHelpful: 2,
        helpfulVotes: [],
        notHelpfulVotes: [],
        reportCount: 0,
        verified: true,
        verifiedPurchase: true,
        providerResponse: {
          message: 'Thank you for the wonderful review, Arjun! Safety is always my top priority. Looking forward to our next ride!',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          providerName: 'Rajesh Kumar'
        }
      }
    ];

    saveReviews(dummyReviews);
  };

  const submitReview = () => {
    if (!formData.targetId || !formData.title || !formData.comment) {
      toast.error('Please fill all required fields');
      return;
    }

    // Safety check for available targets
    const targetsForType = availableTargets[reviewType];
    if (!targetsForType || targetsForType.length === 0) {
      toast.error('No targets available for this review type');
      return;
    }

    const selectedTarget = targetsForType.find(t => t.id === formData.targetId);
    if (!selectedTarget) {
      toast.error('Please select a valid target');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      type: reviewType,
      targetId: formData.targetId,
      targetName: selectedTarget.name,
      targetLocation: selectedTarget.location,
      targetImage: selectedTarget.image,
      rating: formData.rating,
      ...(reviewType === 'hotel' && {
        cleanliness: formData.cleanliness,
        service: formData.service,
        value: formData.value,
        location: formData.location,
        amenities: formData.amenities,
        food: formData.food,
      }),
      ...(reviewType === 'buddy' && {
        communication: formData.communication,
        reliability: formData.reliability,
        friendliness: formData.friendliness,
        compatibility: formData.compatibility,
      }),
      ...((reviewType === 'carpool' || reviewType === 'driver') && {
        driving: formData.driving,
        vehicle: formData.vehicle,
        punctuality: formData.punctuality,
        safety: formData.safety,
        communication: formData.communication,
      }),
      title: formData.title,
      comment: formData.comment,
      pros: formData.pros.filter(p => p.trim()),
      cons: formData.cons.filter(c => c.trim()),
      tips: formData.tips.filter(t => t.trim()),
      photos: uploadedPhotos,
      date: new Date().toISOString(),
      userId: userData.email || 'guest',
      userName: userData.name || 'Guest User',
      travelType: formData.travelType,
      roomType: formData.roomType,
      stayDuration: formData.stayDuration,
      helpful: 0,
      notHelpful: 0,
      helpfulVotes: [],
      notHelpfulVotes: [],
      reportCount: 0,
      verified: true,
      verifiedPurchase: true
    };

    saveReviews([newReview, ...reviews]);
    setShowAddForm(false);
    setUploadedPhotos([]);
    toast.success('Review submitted successfully! 🎉');
    
    // Reset form
    setFormData({
      targetId: '',
      targetName: '',
      targetLocation: '',
      rating: 5,
      cleanliness: 5,
      service: 5,
      value: 5,
      location: 5,
      amenities: 5,
      food: 5,
      communication: 5,
      reliability: 5,
      friendliness: 5,
      compatibility: 5,
      driving: 5,
      vehicle: 5,
      punctuality: 5,
      safety: 5,
      title: '',
      comment: '',
      pros: ['', '', ''],
      cons: ['', '', ''],
      tips: ['', '', ''],
      travelType: 'solo',
      roomType: '',
      stayDuration: '',
    });
  };

  const voteHelpful = (reviewId: string, helpful: boolean) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.email || 'guest';
    
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        const alreadyVotedHelpful = (review.helpfulVotes || []).includes(userId);
        const alreadyVotedNotHelpful = (review.notHelpfulVotes || []).includes(userId);

        if (helpful) {
          if (alreadyVotedHelpful) {
            // Remove helpful vote
            return {
              ...review,
              helpful: Math.max(0, (review.helpful || 0) - 1),
              helpfulVotes: (review.helpfulVotes || []).filter(id => id !== userId)
            };
          } else {
            // Add helpful vote, remove not helpful if exists
            return {
              ...review,
              helpful: (review.helpful || 0) + 1,
              notHelpful: alreadyVotedNotHelpful ? Math.max(0, (review.notHelpful || 0) - 1) : (review.notHelpful || 0),
              helpfulVotes: [...(review.helpfulVotes || []), userId],
              notHelpfulVotes: (review.notHelpfulVotes || []).filter(id => id !== userId)
            };
          }
        } else {
          if (alreadyVotedNotHelpful) {
            // Remove not helpful vote
            return {
              ...review,
              notHelpful: Math.max(0, (review.notHelpful || 0) - 1),
              notHelpfulVotes: (review.notHelpfulVotes || []).filter(id => id !== userId)
            };
          } else {
            // Add not helpful vote, remove helpful if exists
            return {
              ...review,
              notHelpful: (review.notHelpful || 0) + 1,
              helpful: alreadyVotedHelpful ? Math.max(0, (review.helpful || 0) - 1) : (review.helpful || 0),
              notHelpfulVotes: [...(review.notHelpfulVotes || []), userId],
              helpfulVotes: (review.helpfulVotes || []).filter(id => id !== userId)
            };
          }
        }
      }
      return review;
    });

    saveReviews(updatedReviews);
  };

  const filteredReviews = reviews
    .filter(r => filterType === 'all' || r.type === filterType)
    .filter(r => filterRating === 'all' || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'helpful') return b.helpful - a.helpful;
      if (sortBy === 'photos') return (b.photos?.length || 0) - (a.photos?.length || 0);
      return 0;
    });

  const getRatingEmoji = (rating: number) => {
    if (rating >= 4.5) return <Smile className="w-5 h-5 text-green-600" />;
    if (rating >= 3) return <Meh className="w-5 h-5 text-yellow-600" />;
    return <Frown className="w-5 h-5 text-red-600" />;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <HotelIcon className="w-4 h-4" />;
      case 'buddy': return <Users className="w-4 h-4" />;
      case 'carpool':
      case 'driver': return <Car className="w-4 h-4" />;
      default: return null;
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rounded = Math.round(r.rating);
      if (rounded >= 1 && rounded <= 5) dist[rounded as keyof typeof dist]++;
    });
    return dist;
  };

  const ratingDist = getRatingDistribution();
  const totalReviews = reviews.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 text-white px-6 py-8">
        <button onClick={onBack} className="mb-4 flex items-center gap-2 text-white/80 hover:text-white">
          <X className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              World-Class Reviews
            </h1>
            <p className="text-blue-200">Experience the most advanced review system in tourism</p>
          </div>
          <button
            onClick={() => {
              loadAvailableTargets(); // Refresh targets when opening form
              setShowAddForm(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-xl hover:shadow-2xl transition-all flex items-center gap-2"
          >
            <Award className="w-5 h-5" />
            Write Review
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 text-yellow-300 mb-1">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-2xl">{calculateAverageRating()}</span>
            </div>
            <p className="text-sm text-blue-200">Average Rating</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-5 h-5 text-green-300" />
              <span className="text-2xl">{totalReviews}</span>
            </div>
            <p className="text-sm text-blue-200">Total Reviews</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-blue-300" />
              <span className="text-2xl">{reviews.filter(r => r.verifiedPurchase).length}</span>
            </div>
            <p className="text-sm text-blue-200">Verified</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-5 h-5 text-pink-300" />
              <span className="text-2xl">{reviews.filter(r => r.photos && r.photos.length > 0).length}</span>
            </div>
            <p className="text-sm text-blue-200">With Photos</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-900" />
            <h3 className="text-gray-900">Filters & Sort</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Review Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-900"
              >
                <option value="all">All Types</option>
                <option value="hotel">Hotels</option>
                <option value="buddy">Travel Buddies</option>
                <option value="carpool">Carpools & Drivers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Rating</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-900"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-900"
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rating</option>
                <option value="helpful">Most Helpful</option>
                <option value="photos">With Photos</option>
              </select>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm text-gray-600 mb-3">Rating Distribution</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDist[rating as keyof typeof ratingDist];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm text-gray-600">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share your experience!</p>
              <button
                onClick={() => {
                  loadAvailableTargets(); // Refresh targets when opening form
                  setShowAddForm(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-xl hover:shadow-xl transition-all"
              >
                Write First Review
              </button>
            </div>
          ) : (
            filteredReviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                {/* Review Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Target Image */}
                    {review.targetImage && (
                      <img
                        src={review.targetImage}
                        alt={review.targetName}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-lg text-xs flex items-center gap-1">
                              {getTypeIcon(review.type)}
                              {review.type.charAt(0).toUpperCase() + review.type.slice(1)}
                            </span>
                            {review.verifiedPurchase && (
                              <span className="px-3 py-1 bg-green-100 text-green-900 rounded-lg text-xs flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg text-gray-900">{review.targetName}</h3>
                          {review.targetLocation && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {review.targetLocation}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl text-gray-900">{review.rating.toFixed(1)}</span>
                            {getRatingEmoji(review.rating)}
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Detailed Ratings */}
                      {review.type === 'hotel' && (
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Clean</p>
                            <p className="font-medium text-gray-900">{review.cleanliness || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Service</p>
                            <p className="font-medium text-gray-900">{review.service || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Value</p>
                            <p className="font-medium text-gray-900">{review.value || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="font-medium text-gray-900">{review.location || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Amenities</p>
                            <p className="font-medium text-gray-900">{review.amenities || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Food</p>
                            <p className="font-medium text-gray-900">{review.food || 0}/5</p>
                          </div>
                        </div>
                      )}

                      {review.type === 'buddy' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Communication</p>
                            <p className="font-medium text-gray-900">{review.communication || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Reliability</p>
                            <p className="font-medium text-gray-900">{review.reliability || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Friendliness</p>
                            <p className="font-medium text-gray-900">{review.friendliness || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Compatibility</p>
                            <p className="font-medium text-gray-900">{review.compatibility || 0}/5</p>
                          </div>
                        </div>
                      )}

                      {(review.type === 'carpool' || review.type === 'driver') && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Driving</p>
                            <p className="font-medium text-gray-900">{review.driving || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Vehicle</p>
                            <p className="font-medium text-gray-900">{review.vehicle || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Punctuality</p>
                            <p className="font-medium text-gray-900">{review.punctuality || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Safety</p>
                            <p className="font-medium text-gray-900">{review.safety || 0}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Communication</p>
                            <p className="font-medium text-gray-900">{review.communication || 0}/5</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Title */}
                  <h3 className="text-xl text-gray-900 mb-2">{review.title}</h3>

                  {/* Review Content */}
                  <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

                  {/* Pros, Cons, Tips */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {review.pros && review.pros.length > 0 && (
                      <div className="bg-green-50 rounded-xl p-4">
                        <h4 className="text-sm text-green-900 mb-2 flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4" />
                          Pros
                        </h4>
                        <ul className="space-y-1">
                          {review.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-green-800">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {review.cons && review.cons.length > 0 && (
                      <div className="bg-red-50 rounded-xl p-4">
                        <h4 className="text-sm text-red-900 mb-2 flex items-center gap-2">
                          <ThumbsDown className="w-4 h-4" />
                          Cons
                        </h4>
                        <ul className="space-y-1">
                          {review.cons.map((con, i) => (
                            <li key={i} className="text-sm text-red-800">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {review.tips && review.tips.length > 0 && (
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="text-sm text-blue-900 mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Tips
                        </h4>
                        <ul className="space-y-1">
                          {review.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-blue-800">• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Camera className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{review.photos.length} Photos</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {review.photos.slice(0, 6).map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt={`Review photo ${i + 1}`}
                            className="w-full h-32 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedReview(review)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {review.userName}
                    </div>
                    {review.tripDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {review.tripDate}
                      </div>
                    )}
                    {review.travelType && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-900 rounded-lg text-xs">
                        {review.travelType.charAt(0).toUpperCase() + review.travelType.slice(1)}
                      </span>
                    )}
                    {review.roomType && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-xs">
                        {review.roomType}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => voteHelpful(review.id, true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                          (review.helpfulVotes || []).includes(JSON.parse(localStorage.getItem('userData') || '{}').email || 'guest')
                            ? 'bg-green-100 text-green-900'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful || 0})
                      </button>
                      <button
                        onClick={() => voteHelpful(review.id, false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                          (review.notHelpfulVotes || []).includes(JSON.parse(localStorage.getItem('userData') || '{}').email || 'guest')
                            ? 'bg-red-100 text-red-900'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Not Helpful ({review.notHelpful || 0})
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Flag className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Provider Response */}
                  {review.providerResponse && (
                    <div className="mt-4 bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-900" />
                        <span className="text-sm text-blue-900">Response from {review.providerResponse.providerName}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{review.providerResponse.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.providerResponse.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Review Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
              <h2 className="text-2xl flex items-center gap-2">
                <Award className="w-6 h-6" />
                Write a Review
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setUploadedPhotos([]);
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Review Type Selection */}
              <div>
                <label className="block text-gray-900 mb-3">What would you like to review?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['hotel', 'buddy', 'carpool', 'driver'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setReviewType(type);
                        setFormData({ ...formData, targetId: '', targetName: '' });
                      }}
                      className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        reviewType === type
                          ? 'border-indigo-900 bg-indigo-50 text-indigo-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {getTypeIcon(type)}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-900">Select {reviewType === 'hotel' ? 'Hotel' : reviewType === 'buddy' ? 'Travel Buddy' : 'Driver'}</label>
                  <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {availableTargets[reviewType]?.length || 0} available
                  </span>
                </div>
                <select
                  value={formData.targetId}
                  onChange={(e) => {
                    const selected = availableTargets[reviewType].find(t => t.id === e.target.value);
                    setFormData({
                      ...formData,
                      targetId: e.target.value,
                      targetName: selected?.name || '',
                      targetLocation: selected?.location || ''
                    });
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-900"
                >
                  <option value="">Choose...</option>
                  {availableTargets[reviewType].map(target => (
                    <option key={target.id} value={target.id}>
                      {target.name} - {target.location}
                    </option>
                  ))}
                </select>
                {availableTargets[reviewType]?.length === 0 && (
                  <p className="text-sm text-amber-600 mt-2 bg-amber-50 p-3 rounded-xl">
                    ℹ️ No {reviewType === 'hotel' ? 'hotels' : reviewType === 'buddy' ? 'travel buddies' : 'drivers'} available yet. 
                    {reviewType === 'hotel' && ' Hotel providers need to add properties first.'}
                    {(reviewType === 'carpool' || reviewType === 'driver') && ' Users need to register as drivers first.'}
                  </p>
                )}
              </div>

              {/* Overall Rating */}
              <div>
                <label className="block text-gray-900 mb-2">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-xl text-gray-900">{formData.rating}.0</span>
                </div>
              </div>

              {/* Category-specific ratings */}
              {reviewType === 'hotel' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['cleanliness', 'service', 'value', 'location', 'amenities', 'food'].map(category => (
                    <div key={category}>
                      <label className="block text-sm text-gray-600 mb-2 capitalize">{category}</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setFormData({ ...formData, [category]: star })}
                          >
                            <Star
                              className={`w-5 h-5 ${star <= formData[category as keyof typeof formData] ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {reviewType === 'buddy' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['communication', 'reliability', 'friendliness', 'compatibility'].map(category => (
                    <div key={category}>
                      <label className="block text-sm text-gray-600 mb-2 capitalize">{category}</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setFormData({ ...formData, [category]: star })}
                          >
                            <Star
                              className={`w-5 h-5 ${star <= formData[category as keyof typeof formData] ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(reviewType === 'carpool' || reviewType === 'driver') && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['driving', 'vehicle', 'punctuality', 'safety', 'communication'].map(category => (
                    <div key={category}>
                      <label className="block text-sm text-gray-600 mb-2 capitalize">{category}</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setFormData({ ...formData, [category]: star })}
                          >
                            <Star
                              className={`w-5 h-5 ${star <= formData[category as keyof typeof formData] ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Title */}
              <div>
                <label className="block text-gray-900 mb-2">Review Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Sum up your experience in one line"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-900"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-gray-900 mb-2">Detailed Review</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your detailed experience..."
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-900"
                />
              </div>

              {/* Pros, Cons, Tips */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-900 mb-2">Pros (What you liked)</label>
                  {formData.pros.map((pro, i) => (
                    <input
                      key={i}
                      type="text"
                      value={pro}
                      onChange={(e) => {
                        const newPros = [...formData.pros];
                        newPros[i] = e.target.value;
                        setFormData({ ...formData, pros: newPros });
                      }}
                      placeholder={`Pro ${i + 1}`}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 mb-2"
                    />
                  ))}
                </div>

                <div>
                  <label className="block text-gray-900 mb-2">Cons (Areas to improve)</label>
                  {formData.cons.map((con, i) => (
                    <input
                      key={i}
                      type="text"
                      value={con}
                      onChange={(e) => {
                        const newCons = [...formData.cons];
                        newCons[i] = e.target.value;
                        setFormData({ ...formData, cons: newCons });
                      }}
                      placeholder={`Con ${i + 1}`}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 mb-2"
                    />
                  ))}
                </div>

                <div>
                  <label className="block text-gray-900 mb-2">Tips (For future travelers)</label>
                  {formData.tips.map((tip, i) => (
                    <input
                      key={i}
                      type="text"
                      value={tip}
                      onChange={(e) => {
                        const newTips = [...formData.tips];
                        newTips[i] = e.target.value;
                        setFormData({ ...formData, tips: newTips });
                      }}
                      placeholder={`Tip ${i + 1}`}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 mb-2"
                    />
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-900 mb-2">Travel Type</label>
                  <select
                    value={formData.travelType}
                    onChange={(e) => setFormData({ ...formData, travelType: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-900"
                  >
                    <option value="solo">Solo</option>
                    <option value="couple">Couple</option>
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                {reviewType === 'hotel' && (
                  <>
                    <div>
                      <label className="block text-gray-900 mb-2">Room Type (Optional)</label>
                      <input
                        type="text"
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        placeholder="e.g., Deluxe Room"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-900"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-900 mb-2">Stay Duration (Optional)</label>
                      <input
                        type="text"
                        value={formData.stayDuration}
                        onChange={(e) => setFormData({ ...formData, stayDuration: e.target.value })}
                        placeholder="e.g., 3 nights"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-900"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Photo Upload Section */}
              <div>
                <label className="block text-gray-900 mb-2">Add Photos (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-3">Photos make reviews 10x more helpful!</p>
                  <button
                    type="button"
                    onClick={() => {
                      // Simulate photo upload with stock images
                      const stockImages = [
                        'https://images.unsplash.com/photo-1668228831907-1721b7166ce4?w=800',
                        'https://images.unsplash.com/photo-1652881389205-9f85f82888c8?w=800',
                        'https://images.unsplash.com/photo-1534612899740-55c821a90129?w=800',
                        'https://images.unsplash.com/photo-1637730826933-54287f79e1c3?w=800'
                      ];
                      const randomImage = stockImages[Math.floor(Math.random() * stockImages.length)];
                      setUploadedPhotos([...uploadedPhotos, randomImage]);
                      toast.success('Photo added! (Demo)');
                    }}
                    className="px-6 py-3 bg-indigo-100 text-indigo-900 rounded-xl hover:bg-indigo-200 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Upload className="w-5 h-5" />
                    Add Demo Photo
                  </button>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {uploadedPhotos.map((photo, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={photo}
                          alt={`Upload ${i + 1}`}
                          className="w-full h-24 object-cover rounded-xl"
                        />
                        <button
                          onClick={() => setUploadedPhotos(uploadedPhotos.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  submitReview();
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg cursor-pointer"
              >
                <Award className="w-6 h-6" />
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50" onClick={() => setSelectedReview(null)}>
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl">Review Photos</h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedReview.photos?.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-64 object-cover rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
