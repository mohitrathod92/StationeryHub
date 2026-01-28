import prisma from '../src/lib/prisma.js';

async function seedProducts() {
  try {
    console.log('🌱 Starting database seed...');

    // Create sample products
    const products = [
      {
        name: 'Premium Leather Journal',
        description: 'Handcrafted leather journal with 200 pages of premium paper.',
        price: 29.99,
        category: 'notebooks',
        images: ['https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=400&fit=crop'],
        isActive: true,
        stock: 50,
      },
      {
        name: 'Classic Dotted Notebook',
        description: 'A5 dotted notebook perfect for bullet journaling.',
        price: 14.99,
        category: 'notebooks',
        images: ['https://images.unsplash.com/photo-1557672172-298e090d0f80?w=400&h=400&fit=crop'],
        isActive: true,
        stock: 100,
      },
      {
        name: 'Fine Tip Gel Pen Set',
        description: 'Set of 12 vibrant gel pens with smooth ink flow.',
        price: 12.99,
        category: 'writing',
        images: ['https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop'],
        isActive: true,
        stock: 75,
      },
      {
        name: 'Mechanical Pencil Set',
        description: 'Professional-grade mechanical pencils with lead refills.',
        price: 8.99,
        category: 'writing',
        images: ['https://images.unsplash.com/photo-1608876642117-adf64e543b64?w=400&h=400&fit=crop'],
        isActive: true,
        stock: 120,
      },
      {
        name: 'Calligraphy Brush Pens',
        description: 'Flexible brush pens for beautiful hand lettering.',
        price: 16.99,
        category: 'writing',
        images: ['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop'],
        isActive: true,
        stock: 60,
      },
      {
        name: 'Desk Organizer Set',
        description: 'Bamboo desk organizer with multiple compartments.',
        price: 34.99,
        category: 'office',
        images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop'],
        isActive: true,
        stock: 30,
      },
      {
        name: 'Sticky Notes Collection',
        description: 'Assorted sizes and colors for all your note-taking needs.',
        price: 9.99,
        category: 'office',
        images: ['https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=400&fit=crop'],
        isActive: true,
        stock: 200,
      },
      {
        name: 'Watercolor Paint Set',
        description: 'Professional 24-color watercolor palette.',
        price: 24.99,
        category: 'art',
        images: ['https://images.unsplash.com/photo-1551214012-5d651c3e2b6b?w=400&h=400&fit=crop'],
        isActive: true,
        stock: 40,
      },
      {
        name: 'Colored Pencil Set',
        description: '48 premium colored pencils in a tin case.',
        price: 18.99,
        category: 'art',
        images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop'],
        isActive: true,
        stock: 55,
      },
      {
        name: 'Washi Tape Collection',
        description: '20 rolls of decorative washi tape in various patterns.',
        price: 11.99,
        category: 'art',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'],
        isActive: true,
        stock: 150,
      },
    ];

    console.log(`📝 Creating ${products.length} products...`);
    
    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
    }

    console.log('✅ Products created successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
