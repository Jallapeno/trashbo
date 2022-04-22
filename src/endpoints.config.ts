export default {
    UrlEnderecoColeta: process.env.URL_ENDERECO_COLETA ?? 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=',
    UrlApenasColeta: process.env.URL_APENAS_COLETA ?? 'http://siggis.slu.df.gov.br/arcgis/rest/services/Coletas/'
}