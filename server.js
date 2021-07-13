//SIMPLE NODE WEB SERVER COM MODULOS NATIVOS
var http = require('http');
var url = require('url');
var fs = require('fs');
const portNumber = process.env.port || 9091;
const appFolderPath = "/webapp";

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + appFolderPath + q.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }  
    console.log("Servindo arquivo: "+filename);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();    
  });
}).listen(portNumber,()=>{console.log(`Aguardando requisições na porta: ${portNumber}. Acesse aqui: http://localhost:${portNumber}/index.html`)});
