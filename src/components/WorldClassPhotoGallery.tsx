import { useState, useEffect } from 'react';
import {
  Camera, Upload, Heart, MessageCircle, Share2, Download, X, MapPin, Calendar,
  Filter, Grid, List, Search, Star, Award, TrendingUp, Users, Eye, Bookmark,
  Send, MoreVertical, Flag, Edit, Trash2, Image as ImageIcon, Play, Pause,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, ArrowLeft, Sparkles,
  Globe, Lock, CheckCircle, AlertCircle, Clock, Hash, AtSign, ThumbsUp,
  ImagePlus, Layers, Palette, Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { dataService, STORAGE_KEYS } from '../utils/dataService';

interface Photo {
  id: string;
  url: string;
  userId: string;
  userName: string;
  userAvatar: string;
  caption: string;
  location: string;
  locationCoords?: { lat: number; lng: number };
  tags: string[];
  category: string;
  likes: number;
  comments: Comment[];
  shares: number;
  views: number;
  uploadDate: string;
  featured: boolean;
  private: boolean;
  verified: boolean;
  rating: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

interface PhotoGalleryProps {
  onBack?: () => void;
  currentUserId?: string;
}

export function WorldClassPhotoGallery({ onBack, currentUserId = 'user123' }: PhotoGalleryProps) {
  const [view, setView] = useState<'grid' | 'list' | 'masonry'>('masonry');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [activeTab, setActiveTab] = useState<'explore' | 'my-photos' | 'favorites' | 'upload'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    caption: '',
    location: '',
    tags: '',
    category: 'Travel',
    private: false,
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const [zoom, setZoom] = useState(1);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const categories = [
    { id: 'all', label: 'All', icon: '🌍', count: 0 },
    { id: 'Travel', label: 'Travel', icon: '✈️', count: 0 },
    { id: 'Nature', label: 'Nature', icon: '🏞️', count: 0 },
    { id: 'Food', label: 'Food', icon: '🍽️', count: 0 },
    { id: 'Architecture', label: 'Architecture', icon: '🏛️', count: 0 },
    { id: 'Culture', label: 'Culture', icon: '🎭', count: 0 },
    { id: 'Adventure', label: 'Adventure', icon: '⛰️', count: 0 },
    { id: 'Wildlife', label: 'Wildlife', icon: '🦁', count: 0 },
    { id: 'Beach', label: 'Beach', icon: '🏖️', count: 0 },
  ];

  const indianDestinations = [
    'Delhi', 'Mumbai', 'Bangalore', 'Goa', 'Jaipur', 'Agra', 
    'Kerala', 'Varanasi', 'Udaipur', 'Manali', 'Rishikesh',
    'Taj Mahal', 'Gateway of India', 'Red Fort', 'Amber Fort',
    'Hawa Mahal', 'Backwaters', 'Ganges River', 'Lake Pichola'
  ];

  useEffect(() => {
    loadPhotos();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [photos, searchQuery, selectedCategory, sortBy, activeTab]);

  const loadPhotos = () => {
    const saved = dataService.getData<Photo[]>(STORAGE_KEYS.PHOTOS) || [];
    if (saved.length === 0) {
      const samplePhotos = generateSamplePhotos();
      setPhotos(samplePhotos);
      dataService.saveData(STORAGE_KEYS.PHOTOS, samplePhotos);
    } else {
      setPhotos(saved);
    }
  };

  const loadFavorites = () => {
    const saved = dataService.getData<string[]>('user-favorites') || [];
    setFavorites(saved);
  };

  const generateSamplePhotos = (): Photo[] => {
    const users = [
      { id: 'u1', name: 'Priya Sharma', avatar: '👩' },
      { id: 'u2', name: 'Rahul Kumar', avatar: '👨' },
      { id: 'u3', name: 'Anjali Patel', avatar: '👩‍🦱' },
      { id: 'u4', name: 'Arjun Singh', avatar: '👨‍🦰' },
      { id: 'u5', name: 'Sneha Reddy', avatar: '👩‍🦳' },
    ];

    const captions = [
      'Magical sunrise at the Taj Mahal! 🌅',
      'Street food adventures in Old Delhi 🍛',
      'Sunset vibes at Goa beach 🏖️',
      'Houseboat experience in Kerala backwaters',
      'Morning chai with this view ☕',
      'Colors of Rajasthan 🎨',
      'Wildlife safari in Ranthambore 🐯',
      'Spiritual journey at Varanasi ghats',
      'Mountain calling from Manali ⛰️',
      'Architecture goals at Hawa Mahal',
    ];

    const allPhotos: Photo[] = [];
    
    for (let i = 0; i < 50; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const category = categories[Math.floor(Math.random() * (categories.length - 1)) + 1];
      const location = indianDestinations[Math.floor(Math.random() * indianDestinations.length)];
      
      // Use Picsum Photos with seed for consistent, beautiful images
      const imageUrl = `https://picsum.photos/seed/${i + 100}/800/600`;
      
      allPhotos.push({
        id: `photo-${i}`,
        url: imageUrl,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        caption: captions[Math.floor(Math.random() * captions.length)],
        location: location,
        locationCoords: { lat: 28.6139 + Math.random() * 10, lng: 77.2090 + Math.random() * 10 },
        tags: generateTags(category.id),
        category: category.id,
        likes: Math.floor(Math.random() * 5000),
        comments: generateComments(),
        shares: Math.floor(Math.random() * 500),
        views: Math.floor(Math.random() * 10000),
        uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        featured: Math.random() > 0.8,
        private: false,
        verified: Math.random() > 0.5,
        rating: 3.5 + Math.random() * 1.5,
      });
    }

    return allPhotos;
  };

  const generateTags = (category: string): string[] => {
    const baseTags = ['india', 'travel', 'photography', 'explore'];
    const categoryTags: Record<string, string[]> = {
      'Travel': ['wanderlust', 'adventure', 'vacation'],
      'Nature': ['landscape', 'mountains', 'scenic'],
      'Food': ['foodie', 'cuisine', 'delicious'],
      'Architecture': ['heritage', 'historic', 'monument'],
      'Culture': ['festival', 'tradition', 'culture'],
      'Adventure': ['trekking', 'hiking', 'extreme'],
      'Wildlife': ['animals', 'safari', 'nature'],
      'Beach': ['ocean', 'sunset', 'coastal'],
    };
    
    return [...baseTags, ...(categoryTags[category] || [])];
  };

  const generateComments = (): Comment[] => {
    const commentTexts = [
      'Absolutely stunning! 😍',
      'This is on my bucket list!',
      'Beautiful capture! 📸',
      'Which camera did you use?',
      'Travel goals! ✨',
      'Incredible shot!',
      'When did you visit?',
      'This is amazing!',
    ];

    const users = [
      { id: 'c1', name: 'Travel Enthusiast', avatar: '🧳' },
      { id: 'c2', name: 'Photo Lover', avatar: '📷' },
      { id: 'c3', name: 'Adventure Seeker', avatar: '🏔️' },
    ];

    const count = Math.floor(Math.random() * 8);
    return Array(count).fill(null).map((_, i) => {
      const user = users[Math.floor(Math.random() * users.length)];
      return {
        id: `comment-${i}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        likes: Math.floor(Math.random() * 50),
      };
    });
  };

  const filterPhotos = () => {
    let filtered = [...photos];

    // Filter by tab
    if (activeTab === 'my-photos') {
      filtered = filtered.filter(p => p.userId === currentUserId);
    } else if (activeTab === 'favorites') {
      filtered = filtered.filter(p => favorites.includes(p.id));
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.caption.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query)) ||
        p.userName.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'trending') {
      filtered.sort((a, b) => (b.likes + b.views + b.shares) - (a.likes + a.views + a.shares));
    } else {
      filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }

    // Featured first
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    setFilteredPhotos(filtered);
  };

  const handleLike = (photoId: string) => {
    const updated = photos.map(p => 
      p.id === photoId ? { ...p, likes: p.likes + 1 } : p
    );
    setPhotos(updated);
    dataService.saveData(STORAGE_KEYS.PHOTOS, updated);
    toast.success('Liked! ❤️');
  };

  const handleFavorite = (photoId: string) => {
    const newFavorites = favorites.includes(photoId)
      ? favorites.filter(id => id !== photoId)
      : [...favorites, photoId];
    
    setFavorites(newFavorites);
    dataService.saveData('user-favorites', newFavorites);
    toast.success(favorites.includes(photoId) ? 'Removed from favorites' : 'Added to favorites! ⭐');
  };

  const handleComment = (photoId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUserId,
      userName: 'You',
      userAvatar: '👤',
      text: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    const updated = photos.map(p =>
      p.id === photoId ? { ...p, comments: [...p.comments, comment] } : p
    );
    
    setPhotos(updated);
    dataService.saveData(STORAGE_KEYS.PHOTOS, updated);
    setNewComment('');
    toast.success('Comment posted! 💬');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
        setUploadFile(file);
      };
      reader.readAsDataURL(file);
      toast.success('Photo selected! 📷');
    }
  };

  const handleUpload = () => {
    if (!uploadData.caption || !uploadData.location) {
      toast.error('Please fill caption and location');
      return;
    }

    // Use the uploaded image preview or generate a gradient placeholder
    const imageUrl = uploadPreview || `data:image/svg+xml,${encodeURIComponent(`<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(#grad)"/><text x="50%" y="45%" text-anchor="middle" font-size="48" fill="white" opacity="0.9" font-family="Arial">📸</text><text x="50%" y="55%" text-anchor="middle" font-size="24" fill="white" opacity="0.8" font-family="Arial">${uploadData.location}</text></svg>`)}`;

    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      url: imageUrl,
      userId: currentUserId,
      userName: 'You',
      userAvatar: '👤',
      caption: uploadData.caption,
      location: uploadData.location,
      tags: uploadData.tags.split(',').map(t => t.trim()).filter(Boolean),
      category: uploadData.category,
      likes: 0,
      comments: [],
      shares: 0,
      views: 0,
      uploadDate: new Date().toISOString(),
      featured: false,
      private: uploadData.private,
      verified: false,
      rating: 0,
    };

    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    dataService.saveData(STORAGE_KEYS.PHOTOS, updated);
    
    setShowUploadModal(false);
    setUploadData({ caption: '', location: '', tags: '', category: 'Travel', private: false });
    setUploadPreview('');
    setUploadFile(null);
    setActiveTab('my-photos');
    toast.success('Photo uploaded successfully! 📸');
  };

  const handleShare = (photo: Photo) => {
    const updated = photos.map(p =>
      p.id === photo.id ? { ...p, shares: p.shares + 1 } : p
    );
    setPhotos(updated);
    dataService.saveData(STORAGE_KEYS.PHOTOS, updated);
    toast.success('Photo shared! 🔗');
  };

  const handleDownload = (photo: Photo) => {
    toast.success('Photo downloaded! 📥');
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (date: string): string => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  // Render Photo Grid
  const renderPhotoGrid = () => (
    <div className={
      view === 'grid' 
        ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
        : view === 'list'
        ? 'space-y-6'
        : 'columns-2 md:columns-3 lg:columns-4 gap-4'
    }>
      {filteredPhotos.map((photo) => (
        <div
          key={photo.id}
          className={`group relative ${view === 'masonry' ? 'mb-4' : ''} cursor-pointer`}
          onClick={() => setSelectedPhoto(photo)}
        >
          <div className="relative overflow-hidden rounded-xl bg-gray-100">
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{photo.userAvatar}</span>
                  <span className="text-sm">{photo.userName}</span>
                  {photo.verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                </div>
                <p className="text-sm line-clamp-2 mb-2">{photo.caption}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {formatNumber(photo.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {photo.comments.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatNumber(photo.views)}
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Badge */}
            {photo.featured && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <Award className="w-3 h-3" />
                Featured
              </div>
            )}
          </div>

          {view === 'list' && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{photo.userAvatar}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{photo.userName}</span>
                    {photo.verified && <CheckCircle className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-xs text-gray-600">{formatDate(photo.uploadDate)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(photo.id);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <Bookmark className={`w-5 h-5 ${favorites.includes(photo.id) ? 'fill-blue-900 text-blue-900' : 'text-gray-600'}`} />
                </button>
              </div>
              <p className="text-sm mb-2">{photo.caption}</p>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <MapPin className="w-3 h-3" />
                <span>{photo.location}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(photo.id);
                  }}
                  className="flex items-center gap-1 hover:text-red-600 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  {formatNumber(photo.likes)}
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {photo.comments.length}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  {formatNumber(photo.shares)}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Render Photo Detail Modal
  const renderPhotoDetail = () => {
    if (!selectedPhoto) return null;

    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
        <div className="max-w-7xl w-full h-full max-h-screen flex flex-col md:flex-row gap-4">
          {/* Image Section */}
          <div className="flex-1 relative flex items-center justify-center">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={() => setZoom(Math.max(1, zoom - 0.25))}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => handleDownload(selectedPhoto)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
            </div>

            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-96 bg-white rounded-xl flex flex-col max-h-[600px] md:max-h-full">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPhoto.userAvatar}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{selectedPhoto.userName}</span>
                    {selectedPhoto.verified && <CheckCircle className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-xs text-gray-600">{formatDate(selectedPhoto.uploadDate)}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Caption */}
              <div>
                <p className="text-sm">{selectedPhoto.caption}</p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{selectedPhoto.location}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedPhoto.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-900 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {formatNumber(selectedPhoto.likes)} likes
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatNumber(selectedPhoto.views)} views
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  {formatNumber(selectedPhoto.shares)} shares
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => handleLike(selectedPhoto.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <Heart className="w-5 h-5" />
                  Like
                </button>
                <button
                  onClick={() => handleShare(selectedPhoto)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={() => handleFavorite(selectedPhoto.id)}
                  className="p-2 border-2 border-gray-300 rounded-xl hover:border-blue-900 transition-all"
                >
                  <Bookmark className={`w-5 h-5 ${favorites.includes(selectedPhoto.id) ? 'fill-blue-900 text-blue-900' : ''}`} />
                </button>
              </div>

              {/* Comments */}
              <div className="pt-4 border-t">
                <h4 className="text-sm mb-3">
                  Comments ({selectedPhoto.comments.length})
                </h4>
                <div className="space-y-3 mb-4">
                  {selectedPhoto.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <span className="text-xl">{comment.userAvatar}</span>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-xl p-3">
                          <p className="text-xs mb-1">{comment.userName}</p>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                          <span>{formatDate(comment.timestamp)}</span>
                          <button className="hover:text-blue-900">Like</button>
                          <button className="hover:text-blue-900">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleComment(selectedPhoto.id)}
                  />
                  <button
                    onClick={() => handleComment(selectedPhoto.id)}
                    className="p-2 bg-blue-900 text-white rounded-xl hover:bg-blue-950 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Upload Modal
  const renderUploadModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Upload Photo
            </h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Preview */}
            <div 
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-900 transition-all relative overflow-hidden"
            >
              {uploadPreview ? (
                <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImagePlus className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 10MB</p>
                </div>
              )}
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm mb-1">Caption *</label>
              <textarea
                value={uploadData.caption}
                onChange={(e) => setUploadData(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="Tell your story..."
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm mb-1">Location *</label>
              <select
                value={uploadData.location}
                onChange={(e) => setUploadData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none bg-white"
              >
                <option value="">Select location</option>
                {indianDestinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm mb-1">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.slice(1).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setUploadData(prev => ({ ...prev, category: cat.id }))}
                    className={`p-2 rounded-xl border-2 transition-all text-center ${
                      uploadData.category === cat.id
                        ? 'border-blue-900 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <p className="text-xs">{cat.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={uploadData.tags}
                onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="travel, india, photography"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none"
              />
            </div>

            {/* Privacy */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="private"
                checked={uploadData.private}
                onChange={(e) => setUploadData(prev => ({ ...prev, private: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="private" className="text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Make this photo private
              </label>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              className="w-full bg-gradient-to-r from-blue-900 to-purple-900 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl flex items-center gap-3">
                <Camera className="w-7 h-7" />
                Photo Gallery
              </h1>
              <p className="text-white/80 text-sm">Share your travel memories</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-white text-blue-900 px-4 py-2 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photos, locations, tags..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:bg-white/20 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[180px] z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'explore', label: 'Explore', icon: Globe },
              { id: 'my-photos', label: 'My Photos', icon: Camera },
              { id: 'favorites', label: 'Favorites', icon: Bookmark },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === id
                    ? 'border-blue-900 text-blue-900'
                    : 'border-transparent text-gray-600 hover:text-blue-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="text-sm">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none bg-white text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>

              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('masonry')}
                  className={`p-2 rounded-lg transition-all ${view === 'masonry' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Layers className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-600 mb-2">No photos found</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'my-photos' 
                ? 'Upload your first photo to get started!'
                : 'Try different filters or search terms'}
            </p>
            {activeTab === 'my-photos' && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-blue-900 to-purple-900 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Photo
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''} found
            </div>
            {renderPhotoGrid()}
          </>
        )}
      </div>

      {/* Modals */}
      {selectedPhoto && renderPhotoDetail()}
      {showUploadModal && renderUploadModal()}
    </div>
  );
}