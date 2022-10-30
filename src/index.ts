process.on('uncaughtException', (err: any) => {
  console.error(err);
});

require('source-map-support').install();