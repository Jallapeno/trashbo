const venom = require('venom-bot');
const axios = require('axios');

const urlBuscaEnderecoColetaConvencional = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=';
const urlBuscaEnderecoColetaSeletiva = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine='

const urlBuscaColetas = 'http://siggis.slu.df.gov.br/arcgis/rest/services/Coletas/'


// venom.create({
//   session: 'session-name', //name of session
//   multidevice: false // for version not multidevice use false.(default: true)
// })
// .then((client) => start(client))
// .catch((erro) => {
//   console.log(erro);
// });

// URL que busca o endereco
/* 
  https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?
  SingleLine=72241-606 ===> valor inserido pelo usuario
  &f=json ===> campo estatico
  &outSR={"wkid":102100} ===> campo estatico em observacao
  &outFields=* ===> campo estativo
  &distance=50000 ===> campo opcional
  &location={"x":-5358732.826157182,"y":-1782885.3379671336,"spatialReference":{"wkid":102100,"latestWkid":3857}} ===> campo opcional
  &maxLocations=6 ===> campo opcional
*/

// URL que busca os dados da coleta
/* 
  https://siggis.slu.df.gov.br/arcgis/rest/services/Coletas/Coleta_Convencional/FeatureServer/1/query?
  f=json
  &returnGeometry=true
  &spatialRel=esriSpatialRelIntersects
  &geometry={"x":-5358054.221989251,"y":-1782967.8718537304,"spatialReference":{"wkid":102100}}
  &geometryType=esriGeometryPoint
  &inSR=102100
  &outFields=*
  &outSR=102100
*/

/*
  https://siggis.slu.df.gov.br/arcgis/rest/services/Coletas/Coleta_Seletiva/FeatureServer/1/query?
  f=json
  &returnGeometry=true
  &spatialRel=esriSpatialRelIntersects
  &geometry={"x":-5358054.221989251,"y":-1782967.8718537304,"spatialReference":{"wkid":102100}}
  &geometryType=esriGeometryPoint
  &inSR=102100
  &outFields=*
  &outSR=102100
*/

// Endpoind busca enderecos
// http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=72240-606&f=json&outSR=%7B%22wkid%22%3A102100%7D&outFields=*wkid%22%3A102100%7D%7D

// Endpoins coleta convencional
// https://siggis.slu.df.gov.br/arcgis/rest/services/Coletas/Coleta_Convencional/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22x%22%3A-5357414.687033424%2C%22y%22%3A-1783415.049043646%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100

// Endpoind coleta seletiva
// https://siggis.slu.df.gov.br/arcgis/rest/services/Coletas/Coleta_Seletiva/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22x%22%3A-5358054.221989251%2C%22y%22%3A-1782967.8718537304%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100

async function buscaEnderecoColetaConvencional(cep) {
  try {
    const primeiroWkid = encodeURIComponent('{"wkid":102100}');
    const segundoWkid = encodeURIComponent('":102100}}');
    const urlMontada = urlBuscaEnderecoColetaConvencional+cep+'&f=json&outSR='+primeiroWkid+'&outFields=*wkid'+segundoWkid;
    const response = await axios.get(urlMontada);
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function coletaConvencional(x, y) {
  try {
    const primeiroWkid = encodeURIComponent('{"x":'+x+',"y":'+y+',"');
    const segundoWkid = encodeURIComponent('":{"wkid":102100}}');
    const urlMontada = urlBuscaColetas+'Coleta_Convencional/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry='+primeiroWkid+'spatialReference'+segundoWkid+'&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100';
    const response = await axios.get(urlMontada);
    const attributes = response['data']['features'][0]['attributes'];
    const horario_inicio = String(attributes['horario_inicio']).slice(11);
    const horario_termino = String(attributes['horario_termino']).slice(11);

    return await JSON.stringify({frequencia: attributes['frequencia'], horario_inicio: horario_inicio, horario_termino: horario_termino})
    // console.log(attributes['frequencia'], horario_inicio, horario_termino);
  } catch (error) {
    console.error(error);
  }
}

async function buscaEnderecoColetaSeletiva(cep) {
  try {
    const primeiroWkid = encodeURIComponent('{"wkid":102100}');
    const urlMontada = urlBuscaEnderecoColetaConvencional+cep+'&f=json&outSR='+primeiroWkid+'&outFields=*&maxLocations=';
    const response = await axios.get(urlMontada);
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function coletaSeletiva(x, y) {
  try {
    const primeiroWkid = encodeURIComponent('{"x":'+x+',"y":'+y+',"');
    const segundoWkid = encodeURIComponent('":{"wkid":102100}}');
    const urlMontada = urlBuscaColetas+'Coleta_Seletiva/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry='+primeiroWkid+'spatialReference'+segundoWkid+'&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100';
    const response = await axios.get(urlMontada);
    const attributes = response['data']['features'][0]['attributes'];
    const horario_inicio = String(attributes['horario_inicio']).slice(11);
    const horario_termino = String(attributes['horario_termino']).slice(11);

    return await JSON.stringify({frequencia: attributes['frequencia'], horario_inicio: horario_inicio, horario_termino: horario_termino})
    // console.log(attributes['frequencia'], horario_inicio, horario_termino);
  } catch (error) {
    console.error(error);
  }
}

const hoje = new Date();
const amanha = new Date();
amanha.setDate(hoje.getDate() + 1);

const amanhaSplit = amanha.toLocaleDateString('pt-br', {weekday: "long", month: "long", day: "numeric"}).split("-", 1);
const amanhaSplitStr = String(amanhaSplit[0]);

buscaEnderecoColetaConvencional('72241606').then((x) => {
  coletaConvencional(x['data']['candidates'][0]['location']['x'],x['data']['candidates'][0]['location']['y']).then((res) => {
    const data = JSON.parse(res);
    const isFrequencia = String(data.frequencia).search(amanhaSplitStr.replace(/^\w/, (c) => c.toUpperCase()).split(",",1));
    if(isFrequencia != -1) {
      console.log('Amanhã terá coleta CONVENCIONAL. Das ' + data.horario_inicio + ' às ' + data.horario_termino);
    } else {
      console.log('Amanhã não tem coleta CONVENCIONAL');
    }
  });
});

buscaEnderecoColetaSeletiva('72241606').then((x) => {
  coletaSeletiva(x['data']['candidates'][0]['location']['x'],x['data']['candidates'][0]['location']['y']).then((res) => {
    const data = JSON.parse(res);
    const isFrequencia = String(data.frequencia).search(amanhaSplitStr.replace(/^\w/, (c) => c.toUpperCase()).split(",",1));
    if(isFrequencia != -1) {
      console.log('Amanhã terá coleta SELETIVA. Das ' + data.horario_inicio + ' às ' + data.horario_termino)
    } else {
      console.log('Amanhã não tem coleta SELETIVA');
    }
  });
});

// function start(client) {
//   client.onMessage((message) => {

//     if (message.body === 'Hi' && message.isGroupMsg === false) {
//       client
//         .sendText(message.from, 'Welcome Venom 🕷')
//         .then((result) => {
//           console.log('Result: ', result); //return object success
//         })
//         .catch((erro) => {
//           console.error('Error when sending: ', erro); //return object error
//         });
//     }

//     if (message.body === 'Coleta' && message.isGroupMsg === false) {

//       coletaSeletiva().then((res) => {
//         const data = JSON.parse(res);
//         const isFrequencia = String(data.frequencia).search(amanhaSplitStr.replace(/^\w/, (c) => c.toUpperCase()).split(",",1));
//         if(isFrequencia != -1) {
//           client.sendText(message.from, 
//             'Hoje terá coleta seletiva.\nDas ' + data.horario_inicio + ' às ' + data.horario_termino)
//           .then((result) => {
//             console.log('Result: ', result); //return object success
//           })
//           .catch((erro) => {
//             console.error('Error when sending: ', erro); //return object error
//           });
//         }
//       });
      
//       coletaConvencional().then((res) => {
//         const data = JSON.parse(res);
//         const isFrequencia = String(data.frequencia).search(amanhaSplitStr.replace(/^\w/, (c) => c.toUpperCase()).split(",",1));
//         if(isFrequencia != -1) {
//           client.sendText(message.from, 
//             'Hoje terá coleta de organicos.\nDas ' + data.horario_inicio + ' às ' + data.horario_termino)
//           .then((result) => {
//             console.log('Result: ', result); //return object success
//           })
//           .catch((erro) => {
//             console.error('Error when sending: ', erro); //return object error
//           });
//         }
//       });

//     }
//   });
// }