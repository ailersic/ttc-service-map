import { cpSync } from 'node:fs';

cpSync('./public', './build/public', { recursive: true });