const { version } = require('../package.json');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Protoblox API documentation',
    version,
  },
  servers: [
    {
      url: `${process.env.VERIFY_URL}/api/v1`,
    },
  ],
};

module.exports = swaggerDef;
