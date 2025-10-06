"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { Calendar, ShoppingBag, Star, Sparkles, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Book appointments with your favorite stylists in seconds",
    },
    {
      icon: ShoppingBag,
      title: "Shop Products",
      description: "Browse and purchase premium salon products",
    },
    {
      icon: Star,
      title: "Loyalty Rewards",
      description: "Earn points with every visit and redeem exclusive rewards",
    },
    {
      icon: Sparkles,
      title: "Expert Stylists",
      description: "Professional team dedicated to your beauty needs",
    },
  ]

  const services = [
    { name: "Haircut & Styling", price: "From $45", duration: "45 min" },
    { name: "Hair Coloring", price: "From $85", duration: "90 min" },
    { name: "Manicure & Pedicure", price: "From $35", duration: "60 min" },
    { name: "Facial Treatment", price: "From $65", duration: "60 min" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 px-4">
        <div className="container mx-auto text-center space-y-6">
          <Badge className="mb-4" variant="secondary">
            Welcome to LuxeSalon
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance">Your Beauty, Our Passion</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Experience luxury salon services with expert stylists, premium products, and personalized care
          </p>
          <div className="flex gap-4 justify-center pt-4">
            {user ? (
              <>
                <Button size="lg" onClick={() => router.push("/appointments/book")}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/shop")}>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Products
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={() => router.push("/auth/signup")}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/auth/login")}>
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose LuxeSalon</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide exceptional salon services with a focus on quality, convenience, and customer satisfaction
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Services</h2>
            <p className="text-muted-foreground">Explore our most requested salon services</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {service.duration}
                  </div>
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" onClick={() => router.push("/appointments/book")}>
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="py-12 text-center space-y-4">
              <h2 className="text-3xl font-bold">Ready to Transform Your Look?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Book your appointment today and experience the LuxeSalon difference
              </p>
              <Button size="lg" onClick={() => router.push(user ? "/appointments/book" : "/auth/signup")}>
                {user ? "Book Now" : "Get Started"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-bold mb-4">LuxeSalon</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for all your beauty and wellness needs
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/appointments/book" className="text-muted-foreground hover:text-foreground">
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-muted-foreground hover:text-foreground">
                    Shop Products
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-muted-foreground hover:text-foreground">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/loyalty" className="text-muted-foreground hover:text-foreground">
                    Loyalty Program
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Multiple locations
                </li>
                <li>Email: info@luxesalon.com</li>
                <li>Phone: (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 LuxeSalon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
