import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,
  dataApiUrl: 'https://cwfr-stijn-robben.azurewebsites.net',
  mongo:
    'mongodb+srv://stijnrobben:kQpnsI921rmhN7Gr@stijns-burgers.qxgfnqv.mongodb.net/?retryWrites=true&w=majority&appName=stijns-burgers',
  neo4j: {
      schema: 'neo4j',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'stijns-burgers-neo4j',
      database: 'neo4j',
    },
};