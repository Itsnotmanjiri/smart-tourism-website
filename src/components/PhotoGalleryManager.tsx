import { useState, useRef } from 'react';
import { Camera, Upload, X, Heart, MessageCircle, Share2, MapPin, Calendar, Users, Download, Trash2, Edit, Image as ImageIcon, Grid, List } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { toast } from 'sonner@2.0.3';

interface TravelPhoto {
  id: string;
  url: string;
  thumbnail?: string;
  caption: string;
  location: string;
  destination: string;
  date: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  userId: string;
  userName: string;
  userAvatar?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

interface PhotoGalleryManagerProps {
  currentUserId?: string;
  currentUserName?: string;
  onBack?: () => void;
}

export function PhotoGalleryManager({ 
  currentUserId = 'user123', 
  currentUserName = 'You',
  onBack 
}: PhotoGalleryManagerProps) {
  const [photos, setPhotos] = useState<TravelPhoto[]>(getMockPhotos());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<TravelPhoto | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDestination, setFilterDestination] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    caption: '',
    location: '',
    destination: '',
    tags: '',
    file: null as File | null,
    preview: null as string | null,
  });

  const destinations = ['All', 'Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Agra', 'Kerala', 'Manali'];

  function getMockPhotos(): TravelPhoto[] {
    return [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        caption: 'Stunning view of Taj Mahal at sunrise! 🌅',
        location: 'Taj Mahal',
        destination: 'Agra',
        date: '2026-01-01',
        tags: ['monument', 'sunrise', 'unesco'],
        likes: 245,
        comments: [
          { id: 'c1', userId: 'u2', userName: 'Priya Kumar', text: 'Absolutely beautiful! 😍', timestamp: '2026-01-01T10:00:00Z' },
          { id: 'c2', userId: 'u3', userName: 'Raj Singh', text: 'Great shot!', timestamp: '2026-01-01T11:00:00Z' },
        ],
        userId: 'u1',
        userName: 'Amit Sharma',
        userAvatar: '👨‍💼',
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
        caption: 'India Gate lit up at night 🇮🇳',
        location: 'India Gate',
        destination: 'Delhi',
        date: '2026-01-05',
        tags: ['monument', 'night', 'lights'],
        likes: 189,
        comments: [],
        userId: 'u2',
        userName: 'Priya Kumar',
        userAvatar: '👩‍💼',
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        caption: 'Beach paradise in Goa! 🏖️',
        location: 'Baga Beach',
        destination: 'Goa',
        date: '2026-01-10',
        tags: ['beach', 'sunset', 'ocean'],
        likes: 312,
        comments: [
          { id: 'c3', userId: 'u1', userName: 'Amit Sharma', text: 'Looks amazing! Planning to visit soon.', timestamp: '2026-01-10T15:00:00Z' },
        ],
        userId: 'u3',
        userName: 'Raj Singh',
        userAvatar: '👨',
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
        caption: 'The magnificent Red Fort 🏰',
        location: 'Red Fort',
        destination: 'Delhi',
        date: '2026-01-03',
        tags: ['fort', 'history', 'architecture'],
        likes: 156,
        comments: [],
        userId: 'u4',
        userName: 'Neha Patel',
        userAvatar: '👩',
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
        caption: 'Pink City vibes! 💗',
        location: 'Hawa Mahal',
        destination: 'Jaipur',
        date: '2025-12-28',
        tags: ['palace', 'pink', 'rajasthan'],
        likes: 278,
        comments: [
          { id: 'c4', userId: 'u5', userName: 'Rohan Verma', text: 'Jaipur is on my bucket list!', timestamp: '2025-12-28T12:00:00Z' },
        ],
        userId: 'u5',
        userName: 'Sanjay Mehta',
        userAvatar: '👨‍🦱',
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
        caption: 'Backwaters of Kerala - pure serenity 🛶',
        location: 'Alleppey Backwaters',
        destination: 'Kerala',
        date: '2025-12-25',
        tags: ['backwaters', 'nature', 'boat'],
        likes: 421,
        comments: [
          { id: 'c5', userId: 'u2', userName: 'Priya Kumar', text: 'This looks so peaceful! 🌿', timestamp: '2025-12-25T16:00:00Z' },
          { id: 'c6', userId: 'u3', userName: 'Raj Singh', text: 'Added to my travel list!', timestamp: '2025-12-25T17:00:00Z' },
        ],
        userId: 'u6',
        userName: 'Lakshmi Iyer',
        userAvatar: '👩‍🦰',
      },
    ];
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setUploadForm({
        ...uploadForm,
        file,
        preview: URL.createObjectURL(file),
      });
      setShowUploadModal(true);
    }
  };

  const handleUpload = () => {
    if (!uploadForm.file || !uploadForm.caption || !uploadForm.location || !uploadForm.destination) {
      toast.error('Please fill all required fields');
      return;
    }

    const newPhoto: TravelPhoto = {
      id: Date.now().toString(),
      url: uploadForm.preview!,
      caption: uploadForm.caption,
      location: uploadForm.location,
      destination: uploadForm.destination,
      date: new Date().toISOString().split('T')[0],
      tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t),
      likes: 0,
      comments: [],
      userId: currentUserId,
      userName: currentUserName,
      userAvatar: '😊',
    };

    setPhotos([newPhoto, ...photos]);
    
    // Save to localStorage
    const savedPhotos = JSON.parse(localStorage.getItem('travelPhotos') || '[]');
    localStorage.setItem('travelPhotos', JSON.stringify([newPhoto, ...savedPhotos]));

    toast.success('Photo uploaded successfully! 📸');
    setShowUploadModal(false);
    setUploadForm({
      caption: '',
      location: '',
      destination: '',
      tags: '',
      file: null,
      preview: null,
    });
  };

  const handleLike = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ));
    toast.success('Liked! ❤️');
  };

  const handleComment = (photoId: string, text: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: currentUserName,
      text,
      timestamp: new Date().toISOString(),
    };

    setPhotos(photos.map(photo =>
      photo.id === photoId
        ? { ...photo, comments: [...photo.comments, newComment] }
        : photo
    ));

    toast.success('Comment added! 💬');
  };

  const handleShare = (photo: TravelPhoto) => {
    if (navigator.share) {
      navigator.share({
        title: photo.caption,
        text: `Check out this photo from ${photo.location}, ${photo.destination}!`,
        url: window.location.href,
      }).then(() => {
        toast.success('Shared successfully! 🎉');
      }).catch(() => {
        toast.error('Share cancelled');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDelete = (photoId: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      setPhotos(photos.filter(p => p.id !== photoId));
      toast.success('Photo deleted');
    }
  };

  const filteredPhotos = filterDestination === 'all' 
    ? photos 
    : photos.filter(p => p.destination.toLowerCase() === filterDestination.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl mb-2 flex items-center gap-2">
              <Camera className="w-8 h-8 text-blue-900" />
              Travel Gallery
            </h2>
            <p className="text-gray-600">Share your travel moments and explore others' experiences</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-blue-900 to-purple-900"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Destination Filter */}
          <div className="flex gap-2 flex-wrap">
            {destinations.map(dest => (
              <Badge
                key={dest}
                onClick={() => setFilterDestination(dest.toLowerCase())}
                className={`cursor-pointer ${
                  filterDestination === dest.toLowerCase()
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dest} ({dest === 'All' ? photos.length : photos.filter(p => p.destination === dest).length})
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map(photo => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {/* Photo */}
              <div
                className="relative aspect-square cursor-pointer group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* User Info */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{photo.userAvatar}</span>
                  <div className="flex-1">
                    <p className="text-sm">{photo.userName}</p>
                    <p className="text-xs text-gray-500">{photo.date}</p>
                  </div>
                  {photo.userId === currentUserId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(photo.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>

                {/* Caption */}
                <p className="mb-2">{photo.caption}</p>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{photo.location}, {photo.destination}</span>
                </div>

                {/* Tags */}
                {photo.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-3">
                    {photo.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(photo.id)}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {photo.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {photo.comments.length}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(photo)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPhotos.map(photo => (
            <Card key={photo.id} className="p-4">
              <div className="flex gap-4">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{photo.userAvatar}</span>
                      <div>
                        <p className="text-sm">{photo.userName}</p>
                        <p className="text-xs text-gray-500">{photo.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleLike(photo.id)}>
                        <Heart className="w-4 h-4 mr-1" /> {photo.likes}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedPhoto(photo)}>
                        <MessageCircle className="w-4 h-4 mr-1" /> {photo.comments.length}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleShare(photo)}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="mb-2">{photo.caption}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{photo.location}, {photo.destination}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredPhotos.length === 0 && (
        <Card className="p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl mb-2">No photos yet</h3>
          <p className="text-gray-600 mb-4">Be the first to share your travel experiences!</p>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Your First Photo
          </Button>
        </Card>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl">Upload Photo</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {uploadForm.preview && (
                <img
                  src={uploadForm.preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Caption *</label>
                  <Textarea
                    value={uploadForm.caption}
                    onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
                    placeholder="Describe your photo..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Location *</label>
                    <Input
                      value={uploadForm.location}
                      onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                      placeholder="e.g., Taj Mahal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Destination *</label>
                    <select
                      value={uploadForm.destination}
                      onChange={(e) => setUploadForm({ ...uploadForm, destination: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select...</option>
                      {destinations.filter(d => d !== 'All').map(dest => (
                        <option key={dest} value={dest}>{dest}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Tags (comma separated)</label>
                  <Input
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    placeholder="e.g., monument, sunset, unesco"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpload} className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
        />
      )}
    </div>
  );
}

// Photo Detail Modal Component
function PhotoDetailModal({
  photo,
  onClose,
  onLike,
  onComment,
  onShare,
  currentUserId,
  currentUserName,
}: {
  photo: TravelPhoto;
  onClose: () => void;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onShare: (photo: TravelPhoto) => void;
  currentUserId: string;
  currentUserName: string;
}) {
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(photo.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full h-[90vh] flex bg-white rounded-lg overflow-hidden">
        {/* Left - Photo */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <img
            src={photo.url}
            alt={photo.caption}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Right - Details */}
        <div className="w-96 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{photo.userAvatar}</span>
              <div>
                <p className="text-sm">{photo.userName}</p>
                <p className="text-xs text-gray-500">{photo.date}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <p className="mb-3">{photo.caption}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{photo.location}, {photo.destination}</span>
              </div>
              {photo.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {photo.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div>
              <h4 className="mb-3">Comments ({photo.comments.length})</h4>
              <div className="space-y-3">
                {photo.comments.map(comment => (
                  <div key={comment.id} className="flex gap-2">
                    <span className="text-lg">😊</span>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{comment.userName}</span>{' '}
                        {comment.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t p-4 space-y-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => onLike(photo.id)}>
                <Heart className="w-5 h-5 mr-2" />
                {photo.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-5 h-5 mr-2" />
                {photo.comments.length}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onShare(photo)}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Comment Input */}
            <div className="flex gap-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
              />
              <Button onClick={handleSubmitComment} disabled={!commentText.trim()}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}