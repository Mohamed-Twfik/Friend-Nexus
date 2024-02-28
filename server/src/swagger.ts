import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from "express";

const options = {
  swaggerDefinition: {
    restapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'My REST API',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['**/dist*.js'],
}

const specs = swaggerJsdoc(options)

export default (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}