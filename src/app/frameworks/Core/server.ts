import { ResourceManager } from './resource';

export interface Server {
  new(options: object, ...args: any[]): any;

  services: any;

  init(): any;

  listen(): any;

  close(): any;
}

export class ServerManager extends ResourceManager {
  constructor() {
    super();
  }

  createTimeoutRejection(t: number, name: string) {
    return new Promise(reject => {
      setTimeout(reject, t, `${ name } Timeout on Close`);
    });
  }

  callStart() {
    return Promise.all(Object.keys(this.connections).map((con) => {
      return this.connections[con].listen();
    }));
  }

  callStop() {
    return Promise.all(Object.keys(this.connections).map((con) => {
      const Timeout: number = this.connections[con]._closeTimeout ? this.connections[con]._closeTimeout : 5000;
      return Promise.race([this.connections[con].close(), this.createTimeoutRejection(Timeout, con)]);
    }));
  }

  getServer(name: string | { name: string }) {
    if (typeof name === 'string') {
      return this.connections[name];
    }
    return this.connections[name.name];
  }

  getServers(extended = false) {
    if (extended) return this.connections;

    return Object.keys(this.connections);
  }

  MakeResourceDecorator(): (ctor: any) => any {
    const soup = super.MakeResourceDecorator();
    return function (ctor: any) {
      Reflect.set(ctor.prototype, 'services', []);
      return soup(ctor);
    }.bind(this);
  }
}

export function Api(ctor: any) {
  return function ApiInner(srvCtor: any) {
    const arr = Reflect.get(srvCtor.prototype, 'services');
    arr.push(ctor.expressRouter);
    Reflect.set(srvCtor.prototype, 'services', arr);
    return srvCtor;
  }
}