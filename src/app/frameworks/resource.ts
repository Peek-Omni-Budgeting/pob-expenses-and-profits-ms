export class ResourceManager {
  protected resouces: any = {};
  protected connections: any = {};

  constructor() {}

  async init () {
    await Promise.all([...Object.keys(this.resouces).map((ctorName: any) => {
      this.connections[ctorName] = Reflect.construct(this.resouces[ctorName], []);
      return this.connections[ctorName].init();
    })]);
  };

  protected getConnections() {
    return this.connections;
  }

  callStart() {};

  callStop() {};

  MakeResourceDecorator() {
    return function DataSource(ctor: any) {
      Reflect.set(this.resouces, ctor.name, ctor);
      return ctor;
    }.bind(this);
  }
}