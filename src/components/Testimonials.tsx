import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  date: string;
  verified: boolean;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Chioma Okafor",
      location: "Abuja, FCT",
      rating: 5,
      review: "I bought a beautiful evening dress from Ebeth Boutique for my sister's wedding. The quality is exceptional and the fit was perfect! The staff at the Atlantic Mall store were so helpful. Highly recommend!",
      date: "2 weeks ago",
      verified: true,
    },
    {
      id: 2,
      name: "Adebayo Johnson",
      location: "Wuse, Abuja",
      rating: 5,
      review: "Ordered a designer handbag online and it was delivered the same day! The packaging was elegant and the product exceeded my expectations. Ebeth Boutique is now my go-to store for luxury items.",
      date: "1 month ago",
      verified: true,
    },
    {
      id: 3,
      name: "Fatima Musa",
      location: "Gwarinpa, Abuja",
      rating: 4,
      review: "Great selection of household items. I got a premium kitchen set that has made cooking so much easier. The prices are reasonable for the quality you get. Will definitely shop here again!",
      date: "3 weeks ago",
      verified: true,
    },
    {
      id: 4,
      name: "Emeka Nwosu",
      location: "Maitama, Abuja",
      rating: 5,
      review: "As a man who appreciates quality, I was impressed with their collection of accessories. Got myself a leather wallet and belt set. Top-notch products and excellent customer service!",
      date: "1 week ago",
      verified: true,
    },
    {
      id: 5,
      name: "Aisha Abdullahi",
      location: "Asokoro, Abuja",
      rating: 5,
      review: "I've been shopping at Ebeth Boutique for over a year now. The consistency in quality and service is remarkable. Their weekly deals section always has something amazing. Best boutique in Abuja!",
      date: "2 days ago",
      verified: true,
    },
    {
      id: 6,
      name: "Nneka Obi",
      location: "Jabi, Abuja",
      rating: 5,
      review: "The cocktail dress I bought for my birthday was stunning! Everyone kept asking where I got it from. The WhatsApp customer support was also very responsive. Five stars all the way!",
      date: "1 month ago",
      verified: true,
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating
                ? "fill-gold text-gold"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers across Abuja who trust Ebeth Boutique 
            for quality products and excellent service
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-gold/30 mb-4" />
                    
                    <div className="mb-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    <p className="text-sm md:text-base text-foreground mb-6 line-clamp-4">
                      {testimonial.review}
                    </p>

                    <div className="border-t pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm md:text-base">
                            {testimonial.name}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {testimonial.location}
                          </p>
                        </div>
                        {testimonial.verified && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                            <svg
                              className="h-3 w-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {testimonial.date}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </div>
        </Carousel>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-secondary px-6 py-3 rounded-full">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-gold/20 border-2 border-background flex items-center justify-center text-xs font-semibold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-left ml-2">
              <p className="text-sm font-semibold">5,000+ Happy Customers</p>
              <p className="text-xs text-muted-foreground">Across Abuja & Beyond</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
