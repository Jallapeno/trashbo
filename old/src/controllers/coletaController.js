'use strict'
const repository = require('../repositories/coletaRepository');

module.exports = {
    async index(req, res, next) {
        try {
            res.status(200).send({ 
                title: "Bem vindo bot de lixo!",
                version: "1.0.0"
            });
        } catch (error) {
            next(error);
        }
    },

    async coleta(req, res, next) {
        try {
            const cep = req.params.cep;
            if(cep) {
                const response = await repository.buscaEnderecoColetaConvencional(cep);
                const location = response['data']['candidates'][0]['location'];
                const x = location['x'];
                const y = location['y'];
                if(x && y) {
                    const responseConvencional = await repository.coletaConvencional(x, y);
                    const responseSeletiva = await repository.coletaSeletiva(x, y);
                    res.status(200).send({convencional: JSON.parse(responseConvencional), seletiva: JSON.parse(responseSeletiva)});
                } else {
                    res.status(404).send({
                        message: 'Coletas nao encontradas :('
                    });
                    return
                }
            } else {
            res.status(404).send({
                message: 'CEP nao encontrado :('
            });
            return
            }
        } catch (error) {
            console.log(error);
        }
    }
}