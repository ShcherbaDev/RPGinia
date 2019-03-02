import { join } from 'path';
import { tmpdir } from 'os';

const config = {
    appName: 'RPGinia project editor',
    appPath: process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file:///${__dirname}/index.html`,
    appDataPath: join(tmpdir(), 'RPGinia project editor')
};

export default config;