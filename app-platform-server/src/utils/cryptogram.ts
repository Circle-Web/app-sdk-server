// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

export function md5(buffer: any) {
    const hash = crypto.createHash('md5');
    hash.update(buffer, 'utf8');
    const md5 = hash.digest('hex');
    return md5
}
