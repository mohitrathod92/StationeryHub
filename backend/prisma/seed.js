import prisma from '../src/lib/prisma.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Database is now ready for admin to add products via the API
    // No dummy/sample products are created by default
    console.log('✅ Database seed completed!');
    console.log('📝 Use the Admin Panel to add products via the API');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
