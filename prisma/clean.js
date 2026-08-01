const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database: Removing all demo users, vendors, and delivery records...');
  
  const deletedDeliveries = await prisma.delivery.deleteMany({});
  console.log(`Deleted ${deletedDeliveries.count} delivery records.`);

  const deletedVendors = await prisma.vendor.deleteMany({});
  console.log(`Deleted ${deletedVendors.count} vendor records.`);

  const deletedUsers = await prisma.user.deleteMany({});
  console.log(`Deleted ${deletedUsers.count} user accounts.`);

  console.log('Database is now completely clean!');
}

main()
  .catch((e) => {
    console.error('Cleanup error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
