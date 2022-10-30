export class ResourceManager {
  protected resources: any = {};
  protected connections: any = {};

  constructor() {}

  async init () {
    await Promise.all([...Object.keys(this.resources).map((ctorName: any) => {
      this.connections[ctorName] = Reflect.construct(this.resources[ctorName], []);
      return this.connections[ctorName].init();
    })]);
  }

  protected getConnections() {
    return this.connections;
  }

  callStart() {}

  callStop() {}

  MakeResourceDecorator() {
    return function DataSource(ctor: any) {
      Reflect.set(this.resources, ctor.name, ctor);
      return ctor;
    }.bind(this);
  }
}