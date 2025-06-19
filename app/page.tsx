import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  Phone,
  ChefHat,
  UtensilsCrossed,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MainNav } from "./components/main-nav";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <MainNav />
      <section className="relative h-screen overflow-hidden">
        {/* Background image with parallax effect */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-fixed">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="mb-6 relative">
            <div className="absolute -inset-1 rounded-full bg-orange-600/20 blur-sm" />
            <ChefHat className="relative h-12 w-12 text-orange-600" />
          </div>

          <div className="overflow-hidden mb-2">
            <h2 className="text-lg font-medium text-orange-500 uppercase tracking-wider animate-fade-in-up">
              Welcome to Dw
            </h2>
          </div>

          <div className="overflow-hidden mb-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white animate-fade-in-up [animation-delay:200ms]">
              Exceptional Dining
              <span className="block text-orange-500 mt-2">Experience</span>
            </h1>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-amber-500 my-6 animate-fade-in-up [animation-delay:400ms]" />

          <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto text-center animate-fade-in-up [animation-delay:600ms]">
            Discover culinary excellence with our carefully crafted dishes, made
            from the finest ingredients by our award-winning chefs.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in-up [animation-delay:800ms]">
            <Badge className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border-0">
              Award Winning
            </Badge>
            <Badge className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border-0">
              Fine Dining
            </Badge>
            <Badge className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border-0">
              Local Ingredients
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:1000ms]">
            <Link href="/menu">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 px-8 rounded-full"
              >
                <UtensilsCrossed className="mr-2 h-5 w-5" /> View Menu
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-white/70 text-sm mb-2">Scroll Down</span>
            <ChevronDown className="h-5 w-5 text-white/70" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-6">
                For over two decades, Dw Restaurant has been serving exceptional
                cuisine in the heart of the city. Our commitment to quality
                ingredients, innovative cooking techniques, and warm hospitality
                has made us a beloved destination for food enthusiasts.
              </p>
              <p className="text-gray-600 mb-8">
                Led by our award-winning head chef, our kitchen team creates
                memorable dining experiences that celebrate both traditional
                flavors and modern culinary artistry.
              </p>
            </div>
            <div className="relative h-96">
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Restaurant interior"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Visit Us Today
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Experience exceptional dining in our elegant atmosphere. We look
              forward to serving you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <MapPin className="h-8 w-8 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-300">
                123 Gourmet Street
                <br />
                Downtown District
                <br />
                New York, NY 10001
              </p>
            </div>
            <div>
              <Clock className="h-8 w-8 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="text-gray-300">
                Mon - Thu: 5:00 PM - 10:00 PM
                <br />
                Fri - Sat: 5:00 PM - 11:00 PM
                <br />
                Sun: 4:00 PM - 9:00 PM
              </p>
            </div>
            <div>
              <Phone className="h-8 w-8 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Contact</h3>
              <p className="text-gray-300">
                Phone: (555) 123-4567
                <br />
                Email: info@dw.com
                <br />
                Reservations: book@dw.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ChefHat className="h-6 w-6 text-orange-400" />
              <span className="text-lg font-semibold">
                Dw Restaurant Restaurant
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Dw Restaurant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
