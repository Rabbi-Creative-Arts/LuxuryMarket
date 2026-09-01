import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema-v2.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: process.env["DATABASE_URL"],
  },
});