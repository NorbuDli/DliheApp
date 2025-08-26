import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <section className="text-center py-16">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4 animate-fade-in-down">
            Welcome to AppSched
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Your all-in-one solution for managing your daily needs. From stocking up on essentials to keeping track of your college attendance, we've got you covered.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex-row items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">Minimart</CardTitle>
                <CardDescription>Shop for your essentials</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Browse our curated selection of products. Add items to your cart and get ready for a seamless shopping experience.
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/minimart">
                  Start Shopping <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex-row items-center gap-4">
              <div className="bg-accent/20 p-3 rounded-full">
                <Calculator className="h-8 w-8 text-accent" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">Attendance Tracker</CardTitle>
                <CardDescription>Never miss a class goal</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Upload your timetable, track your attendance, and project your final percentage with our AI-powered calculator.
              </p>
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/attendance">
                  Calculate Attendance <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
