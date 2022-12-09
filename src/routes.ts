import { Router } from 'express';
const routes = Router();

const coletaController = require('./controllers/coletaController');

routes.get('/', coletaController.index);
routes.get('/coleta/:cep', coletaController.coleta);

export { routes };