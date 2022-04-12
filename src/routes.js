'use strict'
const express = require('express')
const routes = express.Router()
const coletaController = require('./controllers/coletaController');

routes.get('/', coletaController.index);
routes.get('/coleta/:cep', coletaController.coleta);

module.exports = routes