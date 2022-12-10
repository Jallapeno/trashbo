// import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { CollectResponse } from '../models';
import config from '../../config';

// const prisma = new PrismaClient();

const urlBuscaEnderecoColeta = config.URL_ENDERECO_COLETA
const urlBuscaColetas = config.URL_APENAS_COLETA;

const hoje = new Date();

// lógica do amanhã
const amanha = new Date();
amanha.setDate(hoje.getDate() + 1);
const amanhaSplit = amanha.toLocaleDateString('pt-br', {weekday: "long", month: "long", day: "numeric"}).split("-", 1);
const amanhaSplitStr = String(amanhaSplit[0]);
const amanhaSplitReplace = amanhaSplitStr.replace(/^\w/, (c) => c.toUpperCase()).split(",",1)[0];

export class CollectRepository {

    /* ETAPA 1 - encontra endereço do cep informado - COLETA CONVENCINAL */
    async findAddressCoordinatesByCep(cep: string) {
        // lógica estranha que montei para concatenar a url da api
        const primeiroWkid = encodeURIComponent('{"wkid":102100}');
        const segundoWkid = encodeURIComponent('":102100}}');
        const urlMontada = `${urlBuscaEnderecoColeta}${cep}&f=json&outSR=${primeiroWkid}&outFields=*wkid${segundoWkid}`;
        const response = await axios.get(urlMontada);

        let location = response.data.candidates[0]?.location;
        if(location) {
            let x = location['x'];
            let y = location['y'];
            // retornando as cordenadas da localizacao qualquer coisa veja o retorno no => console.log(location)
            return {
                coordinates: {
                    x: x,
                    y: y
                }
            }
        } else {
            return { 
                coordinates: {
                    x: 0,
                    y: 0
                }
             }
        }
    }

    /* ETAPA 2 - encontra os dados sobre a coleta - COLETA CONVENCINAL */
    async dailyConventionalCollect(x: number, y: number) {
        const primeiroWkid = encodeURIComponent('{"x":'+x+',"y":'+y+',"');
        const segundoWkid = encodeURIComponent('":{"wkid":102100}}');
        const urlMontada = `${urlBuscaColetas}Coleta_Convencional/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${primeiroWkid}spatialReference${segundoWkid}&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100`;
        const response = await axios.get(urlMontada);
        
        const features = response['data']['features'];
        if(features != '') {
            let attributes = features[0]['attributes'];
            let frequencia = attributes['frequencia'];

            let isFrequenciaConvencional = String(frequencia).search(amanhaSplitReplace);
            if(isFrequenciaConvencional != -1) {
                return {
                    frequencia: frequencia,
                    amanha: amanhaSplitReplace,
                    message: `Amanhã terá coleta CONVENCIONAL das ${attributes['horario_inicio']} às ${attributes['horario_termino']}`
                }
            } else {
                return { 
                    frequencia: frequencia,
                    amanha: amanhaSplitReplace,
                    message: 'Amanhã não terá coleta CONVENCIONAL.' 
                };
            }
        } else {
            return { 
                frequencia: '',
                amanha: amanhaSplitReplace,
                message: 'Ainda não há coleta CONVENCIONAL para essa área.' 
            };
        }

    }


    /* ETAPA 1 - encontra endereço do cep informado - COLETA SELETIVA */
    async findAddressCoordinatesOnlySeletiveCollectByCep(cep: string) {
        // lógica estranha que montei para concatenar a url da api
        const primeiroWkid = encodeURIComponent('{"wkid":102100}');
        const urlMontada = `${urlBuscaEnderecoColeta}${cep}&f=json&outSR=${primeiroWkid}&outFields=*&maxLocations=`;
        const response = await axios.get(urlMontada);
        
        let location = response['data']['candidates'][0]['location']
        let x = location['x'];
        let y = location['y'];
        // retornando as cordenadas da localizacao qualquer coisa veja o retorno no => console.log(location)
        return {
            coordinates: {
                x: x,
                y: y
            }
        }
    }

    /* ETAPA 2 - encontra os dados sobre a coleta - COLETA SELETIVA */
    async dailySeletiveCollect(x: number, y: number) {
        const primeiroWkid = encodeURIComponent('{"x":'+x+',"y":'+y+',"');
        const segundoWkid = encodeURIComponent('":{"wkid":102100}}');
        const urlMontada = `${urlBuscaColetas}Coleta_Seletiva/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${primeiroWkid}spatialReference${segundoWkid}&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100'`;

        const response = await axios.get(urlMontada);
        
        const features = response['data']['features'];
        if(features != '') {
            let attributes = features[0]['attributes'];
            let frequencia = attributes['frequencia'];

            let isFrequenciaSeletiva = String(frequencia).search(amanhaSplitReplace);
            if(isFrequenciaSeletiva != -1) {
                return {
                    frequencia: frequencia,
                    message: `Amanhã terá coleta SELETIVA das ${attributes['horario_inicio']} às ${attributes['horario_termino']}`
                }
            } else {
                return { 
                    frequencia: frequencia,
                    message: 'Amanhã não terá coleta SELETIVA.' 
                };
            }
        } else {
            return { 
                frequencia: '',
                message: 'Ainda não há coleta SELETIVA para essa área.' 
            };
        }

    }

}