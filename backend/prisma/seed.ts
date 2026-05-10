const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create a default user
  const farmer = await prisma.user.upsert({
    where: { email: 'farmer@dragonsolar.com' },
    update: {},
    create: {
      email: 'farmer@dragonsolar.com',
      name: 'Adarsh',
      role: 'FARMER',
    },
  });

  console.log(`Created user: ${farmer.name}`);

  // Create products
  const products = [
    { name: 'Premium Red Dragon Fruit', price: 5.99, unit: 'kg', quantity: 100, farmerId: farmer.id },
    { name: 'White Flesh Dragon Fruit', price: 4.50, unit: 'kg', quantity: 150, farmerId: farmer.id },
    { name: 'Yellow Dragon Fruit (Palora)', price: 8.99, unit: 'kg', quantity: 50, farmerId: farmer.id },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('Created products');

  // Create guide steps (We can actually store steps in a separate table, or just keep them static and store progress.
  // Wait, in my previous guide.ts I had static steps. The schema has GuideProgress. Let's just create a GuideStep table too to make it robust, or just keep it simple.
  // Actually, keeping steps static in the code and only storing progress in DB is fine for a skeleton.
  
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
