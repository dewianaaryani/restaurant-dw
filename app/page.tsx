import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Phone,
  Star,
  ChefHat,
  Users,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MainNav } from "./components/main-nav";

export default function HomePage() {
  const featuredDishes = [
    {
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with herbs and lemon",
      price: "$28",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
    },
    {
      name: "Beef Wellington",
      description: "Classic beef wellington with mushroom duxelles",
      price: "$45",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
    },
    {
      name: "Truffle Risotto",
      description: "Creamy arborio rice with black truffle",
      price: "$32",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
    },
  ];

  const stats = [
    { icon: ChefHat, label: "Expert Chefs", value: "15+" },
    { icon: Users, label: "Happy Customers", value: "10K+" },
    { icon: Award, label: "Awards Won", value: "25+" },
    { icon: Star, label: "Average Rating", value: "4.8" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <MainNav />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Exceptional Dining
            <span className="block text-orange-600">Experience</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover culinary excellence with our carefully crafted dishes, made
            from the finest ingredients by our award-winning chefs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Reserve a Table
            </Button>
            <Link href="/menu">
              <Button size="lg" variant="outline">
                View Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section id="menu" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Dishes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Taste our chef's special creations, prepared with passion and the
              finest ingredients
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredDishes.map((dish, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={dish.image || "/placeholder.svg"}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-white text-gray-900">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {dish.rating}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{dish.name}</CardTitle>
                    <span className="text-xl font-bold text-orange-600">
                      {dish.price}
                    </span>
                  </div>
                  <CardDescription>{dish.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/menu">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Order Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
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
              <Button className="bg-orange-600 hover:bg-orange-700">
                Learn More About Us
              </Button>
            </div>
            <div className="relative h-96">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Restaurant interior"
                fill
                className="object-cover rounded-lg"
              />
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
                Email: info@bellavista.com
                <br />
                Reservations: book@bellavista.com
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
