import { PrismaClient } from '@prisma/client';
import { User } from "../models";

const prisma = new PrismaClient();

export class UserRepository {
    async registerUser(user: User) {

        const body: any = user

        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                phoneNumber: body.phoneNumber,
                cep: body.cep,
                active: true
            }
        });
        
        return newUser;
    }

    async findUserCepByPhone(phoneNumber: string) {
        const user = await prisma.user.findUnique({
            where: {
                phoneNumber: phoneNumber
            },
            select: {
                cep: true
            }
        })
        return user;
    }
}