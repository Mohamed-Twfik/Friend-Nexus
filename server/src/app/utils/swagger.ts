import swaggerJsdoc from 'swagger-jsdoc';
import { version } from "../../../package.json";
import { Application } from 'express';
import catchErrors from './catchErrors';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Friend Nexus Documentation',
      version,
      description: 'Friend Nexus Chat REST API',
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          schema: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
  },
  apis: ['./src/app/routes/*.ts'],
}

const specs = swaggerJsdoc(options);

export default (app: Application) => {
  app.use('/', swaggerUi.serve, swaggerUi.setup(specs));

  app.use('/docsInJson', catchErrors(async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(specs);
  }));
}