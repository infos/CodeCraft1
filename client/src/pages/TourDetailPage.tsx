import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Clock, Users } from "lucide-react";
import { Link } from "wouter";

interface TourSite {
  name: string;
  description: string;
}

interface TourHotel {
  name: string;
  location: string;
  description: string;
}

interface TourItineraryDay {
  day: number;
  title: string;
  sites: TourSite[];
  hotel: TourHotel;
}

interface TourDetails {
  id: number;
  title: string;
  duration: string;
  description: string;
  itinerary: TourItineraryDay[];
}

export default function TourDetailPage() {
  const [match, params] = useRoute("/tours/:id");
  const tourId = params?.id;

  const { data: tour, isLoading, error } = useQuery<TourDetails>({
    queryKey: [`/api/tours/${tourId}/details`],
    enabled: !!tourId,
  });

  // Debug logging
  console.log("TourDetailPage - tourId:", tourId);
  console.log("TourDetailPage - tour data:", tour);
  console.log("TourDetailPage - isLoading:", isLoading);
  console.log("TourDetailPage - error:", error);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-300 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tour Not Found</h1>
          <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist.</p>
          <Link href="/copy-of-eras">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/copy-of-eras">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </Link>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {tour.duration}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Heritage Tour
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{tour.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{tour.description}</p>
          </div>
        </div>

        {/* Itinerary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Day-by-Day Itinerary</h2>
          
          {tour.itinerary && tour.itinerary.length > 0 ? (
            tour.itinerary.map((day) => (
              <Card key={day.day} className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <div className="bg-white text-amber-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {day.day}
                    </div>
                    {day.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Sites */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        Sites to Visit
                      </h4>
                      <div className="space-y-3">
                        {day.sites && day.sites.map((site, index) => (
                          <div key={index} className="border-l-2 border-amber-200 pl-4">
                            <h5 className="font-medium text-gray-800">{site.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{site.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Hotel */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-600" />
                        Accommodation
                      </h4>
                      {day.hotel && (
                        <div className="bg-amber-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-800">{day.hotel.name}</h5>
                          <p className="text-sm text-amber-600 font-medium mt-1">{day.hotel.location}</p>
                          <p className="text-sm text-gray-600 mt-2">{day.hotel.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No detailed itinerary available for this tour.</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Book This Tour?</h3>
          <p className="text-gray-600 mb-4">Contact our heritage travel specialists to customize your itinerary.</p>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            Contact Travel Specialist
          </Button>
        </div>
      </div>
    </div>
  );
}