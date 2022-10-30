import * as uuid              from 'uuid';
import { Api, ServerManager } from './server';

export interface ApplicationOptions {
  name: string;
  listenerCount: number;
}

export class Application_ {
  private serverManager = new ServerManager;

  constructor (protected options: ApplicationOptions) {}

  public Server() {
    return this.serverManager.MakeResourceDecorator();
  }

  public async init () {
    await this.serverManager.init();
  }

  public async start () {
    let Exit: (err: any) => Promise<void> = async (err) => {
      try {
        Exit = async (err) => {};
        if (err) console.error(`Stopping application an error ocurred, Error: ${ err }, Message: ${ err.message }, Stack: ${ err.stack }`);

        console.log('Stopping application');
        await this.stop();
        console.log('Shutting down node');
      } catch (shutDownErr: any) {
        console.error(`An error occured during shutdown, Error: ${ shutDownErr }, Message: ${ shutDownErr.message }, Stack: ${ shutDownErr.stack }`);
      }
      finally {
        process.exit(0);
      }
    }

    process.on('SIGINT', Exit);
    process.on('uncaughtException', Exit);

    console.log('Initializing servers and data sources');

    try {
      console.info('Starting servers');
      console.log(this.serverManager.getServers());
      await this.serverManager.callStart();
      console.log('started');
    } catch (err: any) {
      console.error(`Error: ${ err }`);
      process.exit(-1);
    }
  }

  public async stop () {
    console.info('Stopping');
    try {
      console.log('Stopping servers', this.serverManager.getServers());
      const serverStopResults = await this.serverManager.callStop();
      console.log('Servers stopped', serverStopResults);
    } catch (err: any) {
      console.error(`Error stopping servers, Error: ${ err }, Message: ${ err.message }, Stack: ${ err.stack }`);
    }

    console.log('Stopped');
  }

  public Api(ctor: any) {
    return Api(ctor);
  }

  public getServer(name: string | { name: string }) {
    return this.serverManager.getServer(name);
  }
}

export function Application(options: Partial<ApplicationOptions> = {}) {
  if (!options.name) {
    options.name = 'POB-Expenses-And-Profits'
  }
  if (!options.listenerCount) {
    options.listenerCount = 10e6;
  }

  return new Application_(options as ApplicationOptions);
}