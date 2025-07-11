import { useLocation } from "wouter";
import { Tour } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const [, setLocation] = useLocation();

  return (
    <div 
      className="bg-white border border-gray-200 p-0 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={() => setLocation(`/tours/${tour.id}`)}
      data-era={tour.era?.toLowerCase().replace(/\s+/g, '-')}
    >
      {/* Product Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={tour.imageUrl || '/placeholder-tour.jpg'} 
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-6">
        {/* Era Badge */}
        {tour.era && (
          <Badge variant="secondary" className="mb-3 px-2 py-1 text-xs">
            {tour.era}
          </Badge>
        )}
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
          {tour.title}
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {tour.description}
        </p>
        
        {/* Tour Details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{tour.duration} days</span>
          </div>
          {tour.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{tour.location}</span>
            </div>
          )}
        </div>
        
        {/* Pricing - Apple Style */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-light text-gray-900">
              ${tour.price}
            </span>
            <div className="text-sm text-gray-500">
              or ${Math.round(tour.price / 12)}/mo. for 12 mo.
            </div>
          </div>
          <div className="text-right">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}