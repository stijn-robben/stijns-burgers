import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,
  dataApiUrl: 'http://localhost:3000/api',
  mongo:
    'mongodb+srv://stijnrobben:kQpnsI921rmhN7Gr@stijns-burgers.qxgfnqv.mongodb.net/?retryWrites=true&w=majority&appName=stijns-burgers',
};