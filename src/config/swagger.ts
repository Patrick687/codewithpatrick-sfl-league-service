import serviceConfig from './serviceConfig';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SFL League Service API',
      version: '1.0.0',
      description: 'Survivor Fantasy League - League Management Service',
    },
    servers: [
      {
        url: `http://${serviceConfig.SERVER_HOST}:${serviceConfig.SERVER_PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['../routes/*.ts'],
};

export default swaggerOptions;