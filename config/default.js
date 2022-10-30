const DEFAULT_API_PORT = 44361;
require('dotenv').config();

const ENV = process.env;

const config = module.exports = {
  envName: ENV.ENV_NAME,
  server1: {
    port: DEFAULT_API_PORT || ENV.API_PORT,
    instanceId: ENV.API_INSTANCE_ID,
    commitSha: ENV.API_COMMIT_SHA,
  },
  corsWhiteList: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
  ]
}