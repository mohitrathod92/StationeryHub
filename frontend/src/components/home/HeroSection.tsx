import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, BookOpen, Pen, Palette, Paperclip } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative gradient-hero overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-accent/50 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Premium Quality Stationery
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Your One-Stop Shop for{' '}
              <span className="text-gradient">Premium Stationery</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Discover our curated collection of notebooks, pens, and art supplies. 
              Quality products at affordable prices, delivered to your doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/products">
                <Button size="lg" className="bg-cta text-cta-foreground hover:bg-cta/90 w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/categories">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Categories
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/30 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-card rounded-3xl shadow-elevated overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-6 h-full">
                  <div className="bg-secondary rounded-2xl p-4 flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-primary" />
                  </div>
                  <div className="bg-accent/30 rounded-2xl p-4 flex items-center justify-center">
                    <Pen className="w-20 h-20 text-primary" />
                  </div>
                  <div className="bg-accent/30 rounded-2xl p-4 flex items-center justify-center">
                    <Palette className="w-20 h-20 text-primary" />
                  </div>
                  <div className="bg-secondary rounded-2xl p-4 flex items-center justify-center">
                    <Paperclip className="w-20 h-20 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
    </section>
  );
};

export default HeroSection;