const http = require('http');
const xml2json = require('node-xml2json');
const iconv = require('iconv-lite');

module.exports = {
    get(){
        return new Promise((resolve, reject) => {
            http.get('http://www.cbr.ru/scripts/XML_daily.asp?date_req=02/03/2002', (resp) => {
                let data = '<?xml version="1.0" encoding="UTF-8"?>';
                resp.on('data', (chunk) => {
                    data += iconv.decode(chunk, 'win1251');
                });
    
                resp.on('end', () => {
                    return resolve(xml2json.parser(data))
                });
            }).on("error", (err) => {
                return reject(err.message);
            });
        });
    }
}