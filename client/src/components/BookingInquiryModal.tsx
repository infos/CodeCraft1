import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Mail, Phone, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourTitle: string;
  tourId: number;
  tourPrice: number;
}

export default function BookingInquiryModal({ isOpen, onClose, tourTitle, tourId, tourPrice }: BookingInquiryModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelDate: "",
    groupSize: "",
    message: "",
    inquiryType: "booking"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call for booking inquiry
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Inquiry Submitted Successfully",
        description: "Our travel experts will contact you within 24 hours to discuss your heritage tour experience.",
        duration: 5000,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        travelDate: "",
        groupSize: "",
        message: "",
        inquiryType: "booking"
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly at tours@heritage-tours.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Inquiry & Booking Request
          </DialogTitle>
          <DialogDescription>
            Submit your inquiry for <span className="font-semibold">{tourTitle}</span> and our heritage travel experts will create a personalized proposal for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inquiryType">Inquiry Type</Label>
              <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booking">Book This Tour</SelectItem>
                  <SelectItem value="customize">Customize Itinerary</SelectItem>
                  <SelectItem value="group">Group Booking</SelectItem>
                  <SelectItem value="information">More Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Preferred Travel Date
              </Label>
              <Input
                id="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={(e) => handleInputChange("travelDate", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupSize" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Group Size
              </Label>
              <Select value={formData.groupSize} onValueChange={(value) => handleInputChange("groupSize", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Solo Traveler</SelectItem>
                  <SelectItem value="2">Couple</SelectItem>
                  <SelectItem value="3-4">Small Group (3-4)</SelectItem>
                  <SelectItem value="5-8">Medium Group (5-8)</SelectItem>
                  <SelectItem value="9-16">Large Group (9-16)</SelectItem>
                  <SelectItem value="17+">Private Group (17+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Tell us about your interests, accessibility needs, dietary preferences, or any special requests..."
              className="min-h-[100px]"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tour Starting Price:</span>
              <span className="font-semibold text-lg">${tourPrice.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Final pricing depends on group size, travel dates, and customizations. Our experts will provide detailed quotes based on your requirements.
            </p>
          </div>
        </form>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.fullName || !formData.email}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}