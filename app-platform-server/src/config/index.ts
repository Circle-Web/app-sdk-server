import { join } from 'path';
const yaml = require('js-yaml');
const fs = require('fs');
const configFileNameObj = {
    dev: 'dev-temp',
    test: 'test-temp',
    production: 'prod-temp'
}

const env = process.env.NODE_ENV



export default () => {
    return yaml.load(fs.readFileSync(join(__dirname, `./${configFileNameObj[env]}.yml`), 'utf8')) as Record<string, any>
}
