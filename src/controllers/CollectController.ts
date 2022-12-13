import { CollectResponse } from '../models';
import { CollectRepository, UserRepository } from '../repositories';

const collectRepository = new CollectRepository();
const userRepository = new UserRepository();

export class CollectController {
    async dailyCollect(cep: string) {
        if(cep) {
            const location = await collectRepository.findAddressCoordinatesByCep(cep);
            if(location) {
                const responseConventional = await collectRepository.dailyConventionalCollect(location.coordinates.x, location.coordinates.y);
                const responseSeletive = await collectRepository.dailySeletiveCollect(location.coordinates.x, location.coordinates.y);

                return {
                    convencional: responseConventional.message, 
                    convencionalFrequencia: responseConventional.frequencia,
                    seletiva: responseSeletive.message,
                    seletivaFrequencia: responseSeletive.frequencia,
                    amanha: responseConventional.amanha
                }
            }
        } else {
            return { message: 'CEP nao encontrado :(' }
        }
    }

    async getCollectByPhoneNumber(phoneNumber: string) {
        if(phoneNumber) {
            const user = await userRepository.findUserCepByPhone(phoneNumber);
            if(user) {
                const response = await this.dailyCollect(user.cep);
                return response
            } else {
                return { message: 'Número inválido' }
            }
        } else {
            return { message: 'Erro ao pesquisar coleta' }
        }
    }
}