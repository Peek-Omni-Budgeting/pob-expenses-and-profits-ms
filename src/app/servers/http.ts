import express          from 'express';
import config           from 'config';
import Cors             from 'cors';
import helmet           from 'helmet';
import { createServer } from 'http';
import v8               from 'v8';
import * as uuid        from 'uuid';

import { Core }         from '@Frameworks';
// @ts-ignore
const { App } = Core;

const formatMemoryUsage = (data: any) => `${ Math.round(data / 1024 / 1024 * 100) / 100 } MB`;
const memoryData = process.memoryUsage();
const nodeJsStats = v8.getHeapStatistics();
const server1: any = config.get('server1');
const corsWhiteList: string[] = config.get('corsWhiteList');

const memoryUsage = {
  rss: `${ formatMemoryUsage(memoryData.rss) } -> Resident Set Size - total memory allocated for the process execution`,
  heapTotal: `${ formatMemoryUsage(memoryData.heapTotal) } -> total size of the allocated heap`,
  heapUsed: `${ formatMemoryUsage(memoryData.heapUsed) } -> actual memory used during the execution`,
  external: `${ formatMemoryUsage(memoryData.external) } -> VB external memory`,
};

const serverStats = {
  started: new Date(),
  uptime: 0,
  instance: server1.instanceId,
  build: server1.commitSha,
  nodeJsStats: nodeJsStats,
  memoryUsage: memoryUsage,
}

const expressApp = express();

expressApp.use(helmet());
expressApp.set('trust proxy', 1);

// Set correlation id
expressApp.use('/', async (req, res, next) => {
  let correlationId: any = req.headers['x-correlation-id'];
  if (!correlationId) {
    correlationId = uuid.v4();
  }
  res.setHeader('x-correlation-id', correlationId);
  // @ts-ignore
  req.context = {
    correlationId: correlationId,
  }
  next();
});

const corsOptions = {
  origin: [corsWhiteList],
  credentials: true,
  'Access-Control-Allow-Credentials': true,
}

expressApp.use('/', [
  // @ts-ignore
  Cors(corsOptions),
  express.json({limit: '50mb'}),
  express.urlencoded({extended: true}),
  // cookies
  (req: any, res: any, next: Function) => {
    req.res = res,
    req.req = req,
    // log shit
    // @ts-ignore
    console.log(JSON.stringify({
      originalUrl: req.originalUrl,
      ip: req.connection?.remoteAddress,
      params: req.params,
      path: req.path,
      method: req.method,
      query: req.query,
      url: req.url,
      body: req.body,
      headers: req.headers,
      correlationId: req.context.correlationId
    }));
    return next();
  }
]);

expressApp.use('/health', (_, res) => {
  res.status(200).json(serverStats);
});


// login stuff
// hosted stuff?
// token stuff?

const router = express.Router();

// Make express app with decorators

expressApp.use('/v1', async (req, res, next) => {
  // @ts-ignore
  if (corsWhiteList.indexOf(req.headers.origin) !== -1) {
    res.set({
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true,
    });
  }
});

@App.Server()
export class Http {
  app: any;

  constructor(protected options = { port: config.get('server1.port') }) {}

  init () {
    this.app = createServer(expressApp);
    // attach routers
    expressApp.use('v1', router);
  }

  listen () {
    return new Promise((resolve, reject) => {
      this.app?.listen(this.options.port, (e: any) => {
        if (e) {
          reject(e);
        }
        console.log(`running on ${ this.options.port }`);
        resolve(true);
      });
    });
  }

  public async close () {
    try {
      console.info('Closing server: Http');

      // Add anything like socket io connections or thread/pools that need to close in future

      console.info('Server Closed: Http');
      return 'Http succesfully closed';
    } catch (err: any) {
      console.error('Error closing Server: Http', err);
      return 'Http Errored Closing';
    }
  }
}