const venom = require('venom-bot');
const axios = require('axios');

// venom.create({
//   session: 'session-name', //name of session
//   multidevice: false // for version not multidevice use false.(default: true)
// })
// .then((client) => start(client))
// .catch((erro) => {
//   console.log(erro);
// });

async function coletaSeletiva() {
  try {
    const response = await axios.get('http://siggis.slu.df.gov.br/arcgis/rest/services/Coletas/Coleta_Seletiva/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22x%22%3A-5358054.221989251%2C%22y%22%3A-1782967.8718537304%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100');
    const attributes = response['data']['features'][0]['attributes'];
    const horario_inicio = String(attributes['horario_inicio']).slice(11);
    const horario_termino = String(attributes['horario_termino']).slice(11);

    return await JSON.stringify({frequencia: attributes['frequencia'], horario_inicio: horario_inicio, horario_termino: horario_termino})
    // console.log(attributes['frequencia'], horario_inicio, horario_termino);
  } catch (error) {
    console.error(error);
  }
}

async function coletaOrganica() {
  try {
    const response = await axios.get('http://siggis.slu.df.gov.br/arcgis/rest/services/Coletas/Coleta_Convencional/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22x%22%3A-5358054.212658559%2C%22y%22%3A-1782967.867004909%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100');
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

coletaSeletiva().then((res) => {
  const data = JSON.parse(res);
  const isFrequencia = String(data.frequencia).search(amanhaSplitStr.replace(/^\w/, (c) => c.toUpperCase()).split(",",1));
  if(isFrequencia != -1) {
    console.log('Amanhã terá coleta seletiva. Das ' + data.horario_inicio + ' às ' + data.horario_termino);
  } else {
    console.log('Amanhã não tem coleta seletiva');
  }
});

coletaOrganica().then((res) => {
  const data = JSON.parse(res);
  const isFrequencia = String(data.frequencia).search(amanhaSplitStr.replace(/^\w/, (c) => c.toUpperCase()).split(",",1));
  if(isFrequencia != -1) {
    console.log('Amanhã terá coleta de organicos. Das ' + data.horario_inicio + ' às ' + data.horario_termino)
  } else {
    console.log('Amanhã não tem coleta organica');
  }
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
      
//       coletaOrganica().then((res) => {
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