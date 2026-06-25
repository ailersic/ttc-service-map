import { listLocalDatabases } from '@prisma/adapter-d1';
import 'dotenv/config';
import { defineConfig } from "prisma/config";

const url = `file:${listLocalDatabases()[0]}`;

// DEBUG
// console.log('local databases:', listLocalDatabases());
// console.log('datasource url:', url);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: './migrations',
  },
  datasource: { url },
});
