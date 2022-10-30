const DEFAULT_API_PORT = 44361;
require('dotenv').config();

const config = module.exports = {
  envName: ENV.ENV_NAME,
  server1: {
    port: DEFAULT_API_PORT || ENV.API_PORT,
    instanceId: ENV.API_INSTANCE_ID,
  }
}