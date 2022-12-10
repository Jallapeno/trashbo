import { CollectResponse } from '../models';
import { CollectRepository } from '../repositories';

const collectRepository = new CollectRepository();

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
        
    }
}