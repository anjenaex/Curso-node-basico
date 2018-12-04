const http=require('http');

const servidor = http.createServer((peticion,respuesta) => {
  respuesta.writeHead(200, {'content-Type': 'text/html'});

  respuesta.write(`<!doctype html>
	                     <html>
	                     <head></head>
	                     <body>
	                      <h1>Sitio en desarrollo</h1>
	                     </body>
	                     </html>`);
	  respuesta.end();
});

servidor.listen(8888);

console.log('Servidor web iniciado');

