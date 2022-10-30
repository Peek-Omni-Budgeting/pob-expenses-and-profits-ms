import * as uuid from 'uuid';

export interface ApplicationOptions {
  name: string;
  listenerCount: number;
}

export class Application_ {
  constructor (protected options: ApplicationOptions) {}

  
}