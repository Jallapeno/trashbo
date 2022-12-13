import axios from 'axios';
import config from '../../config';

const urlBuscaEnderecoColeta = config.URL_ENDERECO_COLETA
const urlBuscaColetas = config.URL_APENAS_COLETA;

// logica do hoje
const hoje = new Date();
const hojeSplit = hoje.toLocaleDateString('pt-br', {weekday: "long", month: "long", day: "numeric"}).split("-", 1);
const hojeSplitStr = String(hojeSplit[0]);
const hojeSplitReplace = hojeSplitStr.replace(/^\w/, (c) => c.toUpperCase()).split(",",1)[0];

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

            let isFrequenciaConvencionalAmanha = String(frequencia).search(amanhaSplitReplace);
            let isFrequenciaConvencionalHoje = String(frequencia).search(hojeSplitReplace);
            
            let convencionalAmanha: string = '';
            let convencionalHoje: string = '';

            if(isFrequenciaConvencionalAmanha != -1) {
                convencionalAmanha = `Amanhã terá coleta CONVENCIONAL das ${attributes['horario_inicio']} às ${attributes['horario_termino']}`;
            } else {
                convencionalAmanha = 'Amanhã não terá coleta CONVENCIONAL.';
            }

            if(isFrequenciaConvencionalHoje != -1) {
                convencionalHoje = `Hoje terá coleta CONVENCIONAL das ${attributes['horario_inicio']} às ${attributes['horario_termino']}`;
            } else {
                convencionalHoje = 'Hoje não terá coleta CONVENCIONAL.';
            }

            return {
                frequencia: frequencia,
                amanha: amanhaSplitReplace,
                hoje: hojeSplitReplace,
                message: {
                    hoje: convencionalHoje,
                    amanha: convencionalAmanha
                }
            }
            
        } else {
            return { 
                frequencia: '',
                amanha: amanhaSplitReplace,
                hoje: hojeSplitReplace,
                message: {
                    hoje: '',
                    amanha: 'Ainda não há coleta CONVENCIONAL para essa área.' 
                }
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

            let isFrequenciaSeletivaAmanha = String(frequencia).search(amanhaSplitReplace);
            let isFrequenciaSeletivaHoje = String(frequencia).search(hojeSplitReplace);

            let seletivalAmanha: string = '';
            let seletivaHoje: string = '';

            if(isFrequenciaSeletivaAmanha != -1) {
                seletivalAmanha = `Amanhã terá coleta SELETIVA das ${attributes['horario_inicio']} às ${attributes['horario_termino']}`;
            } else {
                seletivalAmanha = 'Amanhã não terá coleta SELETIVA.';
            }

            if(isFrequenciaSeletivaHoje != -1) {
                seletivaHoje = `Hoje terá coleta SELETIVA das ${attributes['horario_inicio']} às ${attributes['horario_termino']}`
            } else {
                seletivaHoje = 'Hoje não terá coleta SELETIVA.' 
            }

            return {
                frequencia: frequencia,
                message: {
                    hoje: seletivaHoje,
                    amanha: seletivalAmanha
                }
            }

        } else {
            return { 
                frequencia: '',
                message: {
                    hoje: '',
                    amanha: 'Ainda não há coleta SELETIVA para essa área.' 
                }
            };
        }

    }

}