import { useState, useEffect } from 'react';
import { X, Star, MapPin, Wifi, Users, Calendar, Shield, Award, ThumbsUp, MessageSquare, User, CheckCircle, TrendingUp, Camera } from 'lucide-react';
import { Hotel } from '../data/massiveProperHotels';
import { globalState } from '../utils/globalState';
import { ProperHotelBooking } from './ProperHotelBooking';
import { getHotelReviews, getHotelAverageRatings, addHotelReview, markReviewHelpful, HotelReview } from '../utils/reviewsData';

interface Props {
  hotel: Hotel;
  onClose: () => void;
}