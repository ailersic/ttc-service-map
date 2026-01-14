import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { D1Database } from '@cloudflare/workers-types';

export interface EnvWithDb {
    DB: D1Database;
};

export default function connect(env: EnvWithDb) {
    return new PrismaClient({ adapter: new PrismaD1(env.DB) });
};