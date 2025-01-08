const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API Documentation',
      version: '1.0.0',
      description: 'API documentation for the e-commerce application.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Định dạng token
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Áp dụng Bearer Authentication cho tất cả các endpoint
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/userRoutes.js'),
    path.join(__dirname, '../routes/productRoutes.js'),
    path.join(__dirname, '../routes/reviewRoutes.js'),
    path.join(__dirname, '../routes/cartRoutes.js'),
    path.join(__dirname, '../routes/orderRoutes.js'),
    path.join(__dirname, '../routes/paymentRoutes.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
