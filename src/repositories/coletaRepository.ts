import axios from "axios";
import { IColetaResponse } from "../interfaces/IColeta";
import endpointsConfig from "../endpoints.config";

export class ColetaRepository {
    async buscaEnderecoColeta(cep: string): Promise<any> {
        const primeiroWkid = encodeURIComponent('{"wkid":102100}');
        const segundoWkid = encodeURIComponent('":102100}}');
        const urlMontada = endpointsConfig.UrlEnderecoColeta+cep+'&f=json&outSR='+primeiroWkid+'&outFields=*wkid'+segundoWkid;
        return await axios.get(urlMontada);
    }
}