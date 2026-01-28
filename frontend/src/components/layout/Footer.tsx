import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-foreground">
                Stationery<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Your one-stop shop for premium stationery. We bring you quality products
              at affordable prices with easy ordering.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Products', 'Categories', 'Cart'].map((link) => (
                <li key={link}>
                  <Link
                    to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📧 support@stationeryhub.com</li>
              <li>📞 +91 7887345082</li>
              <li>📍 123 Stationery Lane, Creative City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} StationeryHub. All rights reserved.</p>
          <p className="mt-1">BSc IT Final Year Project Demo</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;