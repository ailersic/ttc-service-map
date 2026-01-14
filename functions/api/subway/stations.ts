import { PagesFunction, Response } from '@cloudflare/workers-types';
import connect, { EnvWithDb } from '../../../prisma/prisma.ts';
import TtcApi from '../../../models/TtcApi.ts';

export const onRequestGet: PagesFunction<EnvWithDb> = async (context) => {
    return global.Response.json(await new TtcApi(connect(context.env)).getSubwayStations()) as unknown as Response;
};