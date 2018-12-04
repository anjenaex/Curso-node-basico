const http=require('http');
const url=require('url');

const servidor=http.createServer((peticion,respuesta) => {
	  const objetourl = url.parse(peticion.url);
	  console.log('camino completo del recurso y parametros:'+objetourl.path);
	  console.log('solo el camino y nombre del recurso     :'+objetourl.pathname)
	  console.log('parametros del recurso                  :'+objetourl.query)
	  respuesta.writeHead(200, {'Content-Type': 'text/html'});
	  respuesta.write('<!doctype html><html><head></head><body>Hola mundo</body></html>');
	  respuesta.end();
});

servidor.listen(8888);

console.log('Servidor web iniciado');

