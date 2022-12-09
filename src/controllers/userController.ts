import { Request, Response } from "express";
import { User } from '../models/User';
import { CollectRepository } from '../repositories/collectRepository';

const collectRepository = new CollectRepository()

export class UserController {
    index(res: Response) { 
        try {
            res.status(200).send({ 
                message: "Bem vindo bot de lixo!",
                version: "0.0.1"
            });
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }

    async register(req: User, res: Response) {
        try {
            const newUser = await collectRepository.registerUser(req);
            console.log(newUser);
            if(newUser) {
                return res.status(200).send({
                    message: 'Cadastrado com sucesso!',
                    feature: newUser
                })
            }
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }

    async dailyCollect(req: Request, res: Response) {
        try {
               
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }

    
}