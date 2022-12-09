import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { User } from '../models/User';

const prisma = new PrismaClient();

const urlBuscaEnderecoColeta = process.env.URL_ENDERECO_COLETA
const urlBuscaColetas = process.env.URL_APENAS_COLETA;

const hoje = new Date();

// lógica do amanhã
const amanha = new Date();
amanha.setDate(hoje.getDate() + 1);
const amanhaSplit = amanha.toLocaleDateString('pt-br', {weekday: "long", month: "long", day: "numeric"}).split("-", 1);
const amanhaSplitStr = String(amanhaSplit[0]);

export class CollectRepository {
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

    async dailyConventionalCollect(x: any, y: any) {
        const primeiroWkid = encodeURIComponent('{"x":'+x+',"y":'+y+',"');
        const segundoWkid = encodeURIComponent('":{"wkid":102100}}');
        const urlMontada = `${urlBuscaColetas}Coleta_Convencional/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${primeiroWkid}spatialReference${segundoWkid}&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100`;
        const response = await axios.get(urlMontada);

    }

    // encontra endereço do cep informado
    async findAddressConventionalCollect(cep: number) {
        // lógica estranha que montei para concatenar a url da api
        const primeiroWkid = encodeURIComponent('{"wkid":102100}');
        const segundoWkid = encodeURIComponent('":102100}}');
        const urlMontada = `${urlBuscaEnderecoColeta}${cep}&f=json&outSR=${primeiroWkid}&outFields=*wkid${segundoWkid}`;
        const response = await axios.get(urlMontada);
        return response;
    }

}