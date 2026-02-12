import { listLocalDatabases } from '@prisma/adapter-d1';
import 'dotenv/config';
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: './migrations',
  },
//   datasource: {
//     url: `file:${listLocalDatabases().pop()}`,
//   },
});