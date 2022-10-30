import path from 'path';

process.on('uncaughtException', (err: any) => {
  console.error(err);
});

require('source-map-support').install();
require('module-alias/register');

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '../', './config');
process.env.NODE_ENV = process.env.ENV_NAME;

import { Core } from '@Frameworks';

// @ts-ignore
Core.App = Core.Application.Application({ name: 'POB' });

// Connect to db
// Then
import('./app/index');