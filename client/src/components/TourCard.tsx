import { useLocation } from "wouter";
import { Tour } from "@shared/schema";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const [, setLocation] = useLocation();

  return (
    <div 
      className="bg-white border border-[#ddd] p-4 mb-4 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.1)] cursor-pointer"
      onClick={() => setLocation(`/tours/${tour.id}`)}
      data-era={tour.era?.toLowerCase().replace(/\s+/g, '-')}
    >
      <div className="w-1/2 mx-auto mb-4">
        <div className="aspect-video overflow-hidden rounded-md">
          <img 
            src={tour.imageUrl || '/placeholder-tour.jpg'} 
            alt={tour.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">{tour.title}</h2>
      <p className="text-gray-600 mb-4">{tour.description}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">Duration: {tour.duration} days</span>
        <span className="font-bold">${tour.price}</span>
      </div>
    </div>
  );
}