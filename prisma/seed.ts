import { seedDatabase } from "../lib/seed";
import { prisma } from "../lib/prisma";

seedDatabase()
  .then(() => console.log("✓ Database seeded"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
