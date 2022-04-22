import { Request, Response } from "express";
import { ColetaRepository } from "../repositories/coletaRepository";

export class ColetaController {

    constructor(
        private coletaRepository: ColetaRepository
    ) {}

    async buscaEnderecoColeta(request: Request, response: Response): Promise<any> {
        const { cep } = request.params;
        try {
            const response = this.coletaRepository.buscaEnderecoColeta(cep);
            const location = response['data']['candidates'][0]['location'];
            const x = location['x'];
            const y = location['y'];
            if(x && y) {

            }

        } catch (error) {
            
        }
    }
}