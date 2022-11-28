'use strict'
const global = require('../config');
const axios = require('axios');
const urlBuscaEnderecoColeta = global.URL_ENDERECO_COLETA;
const urlBuscaColetas = global.URL_APENAS_COLETA;

const hoje = new Date();
const amanha = new Date();
amanha.setDate(hoje.getDate() + 1);
const amanhaSplit = amanha.toLocaleDateString('pt-br', {weekday: "long", month: "long", day: "numeric"}).split("-", 1);
const amanhaSplitStr = String(amanhaSplit[0]);

exports.buscaEnderecoColetaConvencional = async(cep) => {
    const primeiroWkid = encodeURIComponent('{"wkid":102100}');
    const segundoWkid = encodeURIComponent('":102100}}');
    const urlMontada = urlBuscaEnderecoColeta+cep+'&f=json&outSR='+primeiroWkid+'&outFields=*wkid'+segundoWkid;
    const response = await axios.get(urlMontada);
    return response;
};

exports.coletaConvencional = async(x, y) => {
    const primeiroWkid = encodeURIComponent('{"x":'+x+',"y":'+y+',"');
    const segundoWkid = encodeURIComponent('":{"wkid":102100}}');
    const urlMontada = urlBuscaColetas+'Coleta_Convencional/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry='+primeiroWkid+'spatialReference'+segundoWkid+'&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100';
    const response = await axios.get(urlMontada);
    const features = response['data']['features'];
    console.log(features);
    if(features != '') {
        const attributes = features[0]['attributes'];
        // const horario_inicio = String(attributes['horario_inicio']).slice(11);
        // const horario_termino = String(attributes['horario_termino']).slice(11);
        const isFrequenciaConvencional = String(attributes['frequencia']).search(amanhaSplitStr.replace(/^\w/, (c) => c.toUpperCase()).split(",",1));
        if(isFrequenciaConvencional != -1) {
            return await JSON.stringify({message: 'Amanhã terá coleta CONVENCIONAL. Das ' + attributes['horario_inicio'] + ' às ' + attributes['horario_termino']});
        } else {
            return await JSON.stringify({message: 'Amanhã terá não coleta CONVENCIONAL.'});
        }
    } else {
        return await JSON.stringify({message: 'Ainda não há coleta CONVENCIONAL para essa área :('});
    }
};

exports.buscaEnderecoColetaSeletiva = async(cep) => {
    const primeiroWkid = encodeURIComponent('{"wkid":102100}');
    const urlMontada = urlBuscaEnderecoColeta+cep+'&f=json&outSR='+primeiroWkid+'&outFields=*&maxLocations=';
    const response = await axios.get(urlMontada);
    return response;
};

exports.coletaSeletiva = async(x, y) => {
    const primeiroWkid = encodeURIComponent('{"x":'+x+',"y":'+y+',"');
    const segundoWkid = encodeURIComponent('":{"wkid":102100}}');
    const urlMontada = urlBuscaColetas+'Coleta_Seletiva/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry='+primeiroWkid+'spatialReference'+segundoWkid+'&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100';
    const response = await axios.get(urlMontada);
    const features = response['data']['features'];
    console.log(features);
    if(features != '') {
        const attributes = features[0]['attributes'];
        // const horario_inicio = String(attributes['horario_inicio']).slice(11);
        // const horario_termino = String(attributes['horario_termino']).slice(11);
        const isFrequenciaSeletiva = String(attributes['frequencia']).search(amanhaSplitStr.replace(/^\w/, (c) => c.toUpperCase()).split(",",1));
        if(isFrequenciaSeletiva != -1) {
            return await JSON.stringify({message: 'Amanhã terá coleta SELETIVA. Das ' + attributes['horario_inicio'] + ' às ' + attributes['horario_termino']});
        } else {
            return await JSON.stringify({message: 'Amanhã terá não coleta SELETIVA.'});
        }        
    } else {
        return await JSON.stringify({message: 'Ainda não há coleta SELETIVA para essa área :('});
    }
};