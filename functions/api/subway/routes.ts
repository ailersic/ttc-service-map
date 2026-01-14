import { PagesFunction, Response } from '@cloudflare/workers-types';
import TtcApi from '../../../models/TtcApi.ts';
import connect, { EnvWithDb } from '../../../prisma/prisma.ts';

export const onRequestGet: PagesFunction<EnvWithDb> = async (context) => {
    return global.Response.json(await new TtcApi(connect(context.env)).getSubwayRoutes()) as unknown as Response;
};