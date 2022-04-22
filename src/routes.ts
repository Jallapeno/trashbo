import { Router } from "express";

const router = Router();

router.get('/', (req, res, next) => res.status(200).send({ 
    title: "Bem vindo bot de lixo com typescript!",
    version: "1.0.0"
}));

export {router};
