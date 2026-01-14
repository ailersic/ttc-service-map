import { listLocalDatabases } from '@prisma/adapter-d1';
import 'dotenv/config';
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: `file:${listLocalDatabases().pop()}`,
  },
});