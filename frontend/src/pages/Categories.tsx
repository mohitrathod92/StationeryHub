import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { categories } from '@/data/products';
import { ArrowRight } from 'lucide-react';

const Categories = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Browse Categories
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully organized collection of stationery products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group block animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-card rounded-2xl p-8 h-full card-hover border border-border/50 flex flex-col items-center text-center">
                    <div className="mb-6 transition-transform group-hover:scale-110">
                      <IconComponent className="w-20 h-20 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {category.description}
                    </p>
                    <div className="flex items-center text-primary font-medium mt-auto">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;