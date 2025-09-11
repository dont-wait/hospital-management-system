"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Shield, Clock, Users, Star, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to MediCare Hospital
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your health is our priority. Experience world-class medical care
            with our dedicated team of professionals, state-of-the-art
            facilities, and comprehensive healthcare services.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Welcome back,{" "}
                {user?.profile
                  ? "pt_firstname" in user.profile
                    ? `${user.profile.pt_firstname} ${user.profile.pt_lastname}`
                    : `${user.profile.ep_firstname} ${user.profile.ep_lastname}`
                  : "User"}
                !
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user?.role.role_description.toLowerCase() === "doctor" && (
                  <Link href="/doctor">
                    <Button size="lg">
                      Go to Doctor Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {user?.role.role_description.toLowerCase() === "patient" && (
                  <Link href="/patient">
                    <Button size="lg">
                      Go to Patient Portal
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose MediCare Hospital?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Expert Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our team of experienced doctors and specialists provide the
                  highest quality medical care.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>24/7 Emergency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Round-the-clock emergency services ensure you get help when
                  you need it most.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Comprehensive Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  From preventive care to specialized treatments, we offer a
                  full range of medical services.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle>Patient Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Consistently rated 5 stars by our patients for exceptional
                  care and service.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Cardiology",
              "Neurology",
              "Orthopedics",
              "Pediatrics",
              "Oncology",
              "Emergency Medicine",
              "Surgery",
              "Radiology",
              "Laboratory Services",
            ].map((service) => (
              <Card key={service} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{service}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Specialized care and treatment in {service.toLowerCase()}{" "}
                    with state-of-the-art equipment.
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Experience Quality Healthcare?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of patients who trust MediCare Hospital for their
              healthcare needs.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Register Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
