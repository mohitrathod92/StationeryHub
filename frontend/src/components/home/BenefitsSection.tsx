import { Shield, Truck, CreditCard, Headphones } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Quality Products',
    description: 'Carefully curated premium stationery from trusted brands.',
  },
  {
    icon: CreditCard,
    title: 'Affordable Prices',
    description: 'Best prices without compromising on quality.',
  },
  {
    icon: Truck,
    title: 'Easy Ordering',
    description: 'Simple checkout with cash on delivery option.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our team is here to help you anytime.',
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-card">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                  <IconComponent className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;