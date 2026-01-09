import { MapPin, Star } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  description: string;
  popularSeason: string;
}

const destinations: Destination[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2NTQyMjE0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    description: 'The City of Light, known for art, fashion, and culture',
    popularSeason: 'Spring & Fall'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1640871426525-a19540c45a39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwY2l0eXxlbnwxfHx8fDE3NjUzODYwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    description: 'A fascinating blend of tradition and cutting-edge technology',
    popularSeason: 'Spring & Autumn'
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1698466632744-f79b37b88ffd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwaW5kb25lc2lhJTIwYmVhY2h8ZW58MXx8fHwxNzY1NDM4MTU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    description: 'Tropical paradise with beaches, temples, and rice terraces',
    popularSeason: 'April - October'
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1570304816841-906a17d7b067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwc2t5bGluZXxlbnwxfHx8fDE3NjUzODAyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    description: 'The city that never sleeps, full of iconic landmarks',
    popularSeason: 'May - June & September'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1706798636444-d4eb076fb63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGJ1cmolMjBraGFsaWZhfGVufDF8fHx8MTc2NTQyMzY5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    description: 'Modern luxury with stunning architecture and desert adventures',
    popularSeason: 'November - March'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1745016176874-cd3ed3f5bfc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBiaWclMjBiZW58ZW58MXx8fHwxNzY1NDI0Nzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    description: 'Rich history, royal heritage, and vibrant culture',
    popularSeason: 'May - September'
  }
];

interface DestinationsListProps {
  onDestinationSelect: (destinationId: string) => void;
}

export function DestinationsList({ onDestinationSelect }: DestinationsListProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-blue-900 mb-2">Explore Amazing Destinations</h2>
        <p className="text-gray-600">Discover your next adventure with AI-powered recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            onClick={() => onDestinationSelect(destination.id)}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="relative h-48">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{destination.rating}</span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-900" />
                <span className="text-gray-600">{destination.country}</span>
              </div>
              <h3 className="mb-2">{destination.name}</h3>
              <p className="text-gray-600 mb-3">{destination.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-900">Best: {destination.popularSeason}</span>
                <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors">
                  Explore
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}