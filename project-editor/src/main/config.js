import { join } from 'path';
import { tmpdir } from 'os';

export default {
    appName: 'RPGinia project editor',
    appPath: process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file:///${__dirname}/index.html`,
    appDataPath: join(tmpdir(), 'RPGinia project editor')
};