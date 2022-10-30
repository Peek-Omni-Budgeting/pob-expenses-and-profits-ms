import { Core } from '@Frameworks';
import './servers';

// @ts-ignore
export const { App } = Core;

App
  .init()
  .then(() => {
    App.start().then(() => {
      console.log('We are running!');
    }).catch((e: any) => {
      console.error(e);
      process.exit(-1);
    });
  }).catch((e: any) => {
    console.error(e);
    process.exit(-1);
  });