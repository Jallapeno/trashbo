'use strict'
const global = require('../config');
const axios = require('axios');
const urlBuscaEnderecoColeta = global.URL_ENDERECO_COLETA;
const urlBuscaColetas = global.URL_APENAS_COLETA;

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
    const attributes = response['data']['features'][0]['attributes'];
    const horario_inicio = String(attributes['horario_inicio']).slice(11);
    const horario_termino = String(attributes['horario_termino']).slice(11);
    return await JSON.stringify({frequencia: attributes['frequencia'], horario_inicio: horario_inicio, horario_termino: horario_termino});
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
    const attributes = response['data']['features'][0]['attributes'];
    const horario_inicio = String(attributes['horario_inicio']).slice(11);
    const horario_termino = String(attributes['horario_termino']).slice(11);
    return await JSON.stringify({frequencia: attributes['frequencia'], horario_inicio: horario_inicio, horario_termino: horario_termino});
};