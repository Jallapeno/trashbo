# TrashBot versão com TypeScript (Em desenvolvimento)

### O bot que irá te avisar quando tem coleta seletiva ou convencional

#### informações úteis abaixo

### Endpoind busca enderecos
http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=72240-606&f=json&outSR=%7B%22wkid%22%3A102100%7D&outFields=*wkid%22%3A102100%7D%7D

### Endpoins coleta convencional
https://siggis.slu.df.gov.br/arcgis/rest/services/Coletas/Coleta_Convencional/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22x%22%3A-5357414.687033424%2C%22y%22%3A-1783415.049043646%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100

### Endpoind coleta seletiva
https://siggis.slu.df.gov.br/arcgis/rest/services/Coletas/Coleta_Seletiva/FeatureServer/1/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22x%22%3A-5358054.221989251%2C%22y%22%3A-1782967.8718537304%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryPoint&inSR=102100&outFields=*&outSR=102100
