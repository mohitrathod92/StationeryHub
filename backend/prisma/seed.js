import prisma from '../src/lib/prisma.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Sample products with multiple images
    const products = [
      {
        name: 'Premium Leather Notebook',
        description: 'Luxurious A5 leather-bound notebook with 200 pages of high-quality paper. Perfect for journaling, sketching, or professional note-taking.',
        price: 29.99,
        discount: 15,
        stock: 50,
        category: 'notebooks',
        rating: 4.8,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
          'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80'
        ]
      },
      {
        name: 'Colorful Gel Pen Set',
        description: 'Set of 12 vibrant gel pens with smooth ink flow. Includes metallic and neon colors. Perfect for bullet journaling and creative writing.',
        price: 15.99,
        discount: 20,
        stock: 100,
        category: 'pens',
        rating: 4.6,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80',
          'https://images.unsplash.com/photo-1592318829370-21a6cf0e800f?w=800&q=80',
          'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80'
        ]
      },
      {
        name: 'Sticky Notes Collection',
        description: 'Assorted pack of colorful sticky notes in various sizes. Includes 6 pads with 100 sheets each. Great for organization and reminders.',
        price: 8.99,
        discount: 0,
        stock: 75,
        category: 'sticky-notes',
        rating: 4.5,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1594672484898-7728232cdc0e?w=800&q=80',
          'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80'
        ]
      },
      {
        name: 'Professional Stapler',
        description: 'Heavy-duty metal stapler with ergonomic design. Holds up to 200 staples and can staple up to 25 sheets at once.',
        price: 12.50,
        discount: 10,
        stock: 40,
        category: 'office-supplies',
        rating: 4.7,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&q=80',
          'https://images.unsplash.com/photo-1569396116180-210c182bedb8?w=800&q=80',
          'https://images.unsplash.com/photo-1601972599720-5ce27f8d5837?w=800&q=80'
        ]
      },
      {
        name: 'Watercolor Paint Set',
        description: '24-color professional watercolor paint set with brush. High-quality pigments perfect for artists and hobbyists.',
        price: 34.99,
        discount: 25,
        stock: 30,
        category: 'art-supplies',
        rating: 4.9,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
          'https://images.unsplash.com/photo-1572045544883-89fde69d7b78?w=800&q=80',
          'https://images.unsplash.com/photo-1596548438137-d51ea5c83d4e?w=800&q=80'
        ]
      },
      {
        name: 'Spiral Sketchbook',
        description: 'Large A4 spiral-bound sketchbook with 120 pages of thick drawing paper. Ideal for pencil, charcoal, and ink drawings.',
        price: 18.99,
        discount: 0,
        stock: 60,
        category: 'notebooks',
        rating: 4.6,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=800&q=80',
          'https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=800&q=80'
        ]
      },
      {
        name: 'Mechanical Pencil Set',
        description: 'Pack of 3 premium 0.5mm mechanical pencils with refill leads and erasers. Perfect for technical drawing and writing.',
        price: 9.99,
        discount: 15,
        stock: 85,
        category: 'pens',
        rating: 4.7,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1593087788049-33c5be7e2a0c?w=800&q=80',
          'https://images.unsplash.com/photo-1561151970-328c4e1e0b3b?w=800&q=80',
          'https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=800&q=80'
        ]
      },
      {
        name: 'Desk Organizer Set',
        description: 'Modern 5-piece desk organizer set including pen holder, paper tray, and drawer organizers. Keep your workspace tidy.',
        price: 24.99,
        discount: 20,
        stock: 45,
        category: 'office-supplies',
        rating: 4.8,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1587556930200-e5f47c8f5a01?w=800&q=80',
          'https://images.unsplash.com/photo-1629899954881-131a5e75e70f?w=800&q=80'
        ]
      },
      {
        name: 'Highlighter Set',
        description: 'Set of 6 pastel highlighters with chisel tips. Perfect for color-coding notes and studying.',
        price: 7.99,
        discount: 0,
        stock: 90,
        category: 'pens',
        rating: 4.5,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1606041011872-596597976b25?w=800&q=80',
          'https://images.unsplash.com/photo-1592428122043-ba4ed588ecdb?w=800&q=80',
          'https://images.unsplash.com/photo-1611532736573-f6c9e6f2e44d?w=800&q=80'
        ]
      },
      {
        name: 'Washi Tape Collection',
        description: 'Set of 20 decorative washi tapes in various patterns and colors. Perfect for scrapbooking and crafts.',
        price: 16.99,
        discount: 10,
        stock: 55,
        category: 'sticky-notes',
        rating: 4.7,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1606302754520-1f1e7d776dd0?w=800&q=80',
          'https://images.unsplash.com/photo-1587049352846-4a222e784422?w=800&q=80'
        ]
      }
    ];

    // Delete existing products
    console.log('🗑️  Clearing existing products...');
    await prisma.product.deleteMany({});

    // Create products
    console.log('📦 Creating sample products...');
    for (const productData of products) {
      await prisma.product.create({
        data: productData
      });
    }

    console.log(`✅ Created ${products.length} sample products with multiple images!`);
    console.log('✅ Database seed completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
