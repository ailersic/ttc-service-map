import { replaceInFileSync } from 'replace-in-file';

try {
    replaceInFileSync({
        files: 'node_modules/unzipper/lib/Open/index.js',
        from: `const { GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');`,
        to: 'const GetObjectCommand = null, HeadObjectCommand = null; // This method is non-functional',
    });
} catch {}