const http=require('http');
const url=require('url');
const fs=require('fs');

const mime = require('mime');

const servidor=http.createServer((peticion, respuesta) => {
  const objetourl = url.parse(peticion.url);
  let camino='static'+objetourl.pathname;
  if (camino=='static/')
    camino='static/index.html';
  fs.stat(camino, error => {
    if (!error) {
      fs.readFile(camino, (error,contenido) => {
        if (error) {
          respuesta.writeHead(500, {'Content-Type': 'text/plain'});
          respuesta.write('Error interno');
          respuesta.end();
        } else {
          const tipo = mime.getType(camino);
          console.log(tipo);
          respuesta.writeHead(200, {'Content-Type': mimearchivo});
          respuesta.write(contenido);
          respuesta.end();
        }
	  });
    } else {
      respuesta.writeHead(404, {'Content-Type': 'text/html'});
      respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');
      respuesta.end();
    }
  });
});

servidor.listen(8888);

console.log('Servidor web iniciado');
