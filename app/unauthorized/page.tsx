import { Button } from "@/components/ui/button";
import { ShieldX, Home, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* Background image with parallax effect */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-fixed">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-orange-500/15 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -inset-2 rounded-full bg-red-600/20 blur-sm" />
            <div className="relative flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20">
                <ShieldX className="h-16 w-16 text-red-400" />
              </div>
            </div>
          </div>

          <div className="overflow-hidden mb-4">
            <h2 className="text-lg font-medium text-red-400 uppercase tracking-wider animate-fade-in-up">
              Access Restricted
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8 animate-fade-in-up [animation-delay:600ms]">
            <div className="flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-orange-400 mr-2" />
              <span className="text-orange-400 font-semibold">
                Private Area
              </span>
            </div>
            <p className="text-xl text-gray-100 mb-4">
              You don&apos;t have permission to access this exclusive area of
              our restaurant.
            </p>
            <p className="text-gray-300">
              This section is reserved for authorized personnel.
            </p>
          </div>

          <div className="space-y-4 animate-fade-in-up [animation-delay:800ms]">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 px-8 rounded-sm"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Return Home
                </Button>
              </Link>

              <Link href="/menu">
                <Button size="lg" variant="outline">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  View Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
