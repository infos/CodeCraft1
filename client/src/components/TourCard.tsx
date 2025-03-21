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
      onClick={() => setLocation(`/tour/${tour.id}`)}
      data-era={tour.era?.toLowerCase().replace(/\s+/g, '-')}
    >
      <div className="aspect-video overflow-hidden rounded-md mb-4">
        <img 
          src={tour.imageUrl || '/placeholder-tour.jpg'} 
          alt={tour.title}
          className="object-cover w-full h-full"
        />
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