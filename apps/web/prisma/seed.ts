import "dotenv/config";

import { PrismaClient, UserRole } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

console.log("DATABASE_URL =", process.env.DATABASE_URL);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "admin@luxurymarket.com";

  const existing = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    console.log("✅ Admin already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(
    "Admin123!",
    12
  );

  await prisma.user.create({
    data: {
      firstName: "Luxury",
      lastName: "Administrator",
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("");
  console.log("================================");
  console.log("ADMIN ACCOUNT CREATED");
  console.log("================================");
  console.log("Email: admin@luxurymarket.com");
  console.log("Password: Admin123!");
  console.log("================================");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });