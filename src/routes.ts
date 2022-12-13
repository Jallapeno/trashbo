import { Router } from 'express';
const routes = Router();
import { CollectController, UserController } from './controllers'
import { User } from './models';

const userController = new UserController();
const collectController = new CollectController();


routes.get('/', async(req, res) => {
    return await userController.index().then((response) => {
        res.status(200).send(response)
    }).catch((err) => {
        return res.status(res.statusCode || 400).json({
            message: err.message || 'Unexpected error.'
        })
    })
});

routes.post('/users/register', async (req, res) => {
    const body: User = req.body;
    return await userController.register(body).then((response) => {
        res.status(201).send(response)
    }).catch((err) => {
        return res.status(res.statusCode || 400).json({
            message: err.message || 'Unexpected error.'
        })
    })
})

routes.post('/coleta', async(req, res) => {
    const cep: string = req.body.cep;
    return await collectController.dailyCollect(cep).then((response) => {
        res.status(200).send(response)
    }).catch((err) => {
        return res.status(res.statusCode || 400).json({
            message: err.message || 'Unexpected error.'
        })
    })
});

routes.post('/coleta/byPhone', async (req, res) => {
    const phoneNumber: string = req.body.phoneNumber;
    return await collectController.getCollectByPhoneNumber(phoneNumber).then((response) => {
        res.status(200).send(response)
    }).catch((err) => {
        return res.status(res.statusCode || 400).json({
            message: err.message || 'Unexpected error.'
        })
    })
})

export { routes };