import { Request, Response } from "express";
import { User } from '../models/User';
import { UserRepository } from "../repositories";

const userRepository = new UserRepository()

export class UserController {
    async index() {
        return await {message: "Bem vindo bot de lixo!", version: "0.0.1"}
    }

    async register(req: User) {
        const newUser = await userRepository.registerUser(req);
        console.log(newUser);
        if(newUser) {
            return await {
                message: 'Cadastrado com sucesso!',
                feature: newUser
            }
        }
    }
    
}