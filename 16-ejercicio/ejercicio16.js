const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mysql=require('mysql');

const conexion=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'base1'
});

conexion.connect(error => {
  if (error)
    console.log('Problemas de conexion con mysql');
});


const mime = {
   'html': 'text/html',
   'css': 'text/css',
   'jpg': 'image/jpg',
   'ico': 'image/x-icon',
   'mp3': 'audio/mpeg3',
   'mp4': 'video/mp4'
};

const servidor=http.createServer((peticion,respuesta) => {
  const objetourl = url.parse(peticion.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(peticion,respuesta,camino);
});

servidor.listen(8888);


function encaminar (peticion,respuesta,camino) {

  switch (camino) {
    case 'public/creartabla': {
      crear(respuesta);
      break;
    }
    case 'public/alta': {
      alta(peticion,respuesta);
      break;
    }
    case 'public/listado': {
      listado(respuesta);
      break;
    }
    case 'public/consultaporcodigo': {
      consulta(peticion,respuesta);
      break;
    }
      default : {
        fs.stat(camino, error => {
          if (!error) {
              fs.readFile(camino,(error,contenido) => {
            if (error) {
              respuesta.writeHead(500, {'Content-Type': 'text/plain'});
              respuesta.write('Error interno');
              respuesta.end();
            } else {
              const vec = camino.split('.');
              const extension=vec[vec.length-1];
              const mimearchivo=mime[extension];
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
    }
  }
}


function crear(respuesta) {
  conexion.query('drop table if exists articulos', (error,resultado) => {
    if (error)
      console.log(error);
  });
  conexion.query(`create table articulos (
                                           codigo int primary key auto_increment,
                                           descripcion varchar(50),
                                           precio float
                                         )`, (error,resultado) => {
    if (error) {
      console.log(error);
      return;
    }
  });
  respuesta.writeHead(200, {'Content-Type': 'text/html'});
  respuesta.write(`<!doctype html><html><head></head><body>
                  Se creo la tabla<br><a href="index.html">Retornar</a></body></html>`);
  respuesta.end();
}


function alta(peticion,respuesta) {
  let info='';
  peticion.on('data', datosparciales => {
    info += datosparciales;
  });
  peticion.on('end', () => {
    const formulario = querystring.parse(info);
    const registro={
      descripcion:formulario['descripcion'],
      precio:formulario['precio']
    };
    conexion.query('insert into articulos set ?',registro, (error,resultado) => {
      if (error) {
        console.log(error);
        return;
      }
    });
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    respuesta.write(`<!doctype html><html><head></head><body>
                    Se cargo el articulo<br><a href="index.html">Retornar</a></body></html>`);
    respuesta.end();
  });
}


function listado(respuesta) {
  conexion.query('select codigo,descripcion,precio from articulos', (error,filas) => {
    if (error) {
      console.log('error en el listado');
      return;
    }
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    let datos='';
    for(let f=0;f<filas.length;f++){
      datos+='Codigo:'+filas[f].codigo+'<br>';
      datos+='Descripcion:'+filas[f].descripcion+'<br>';
      datos+='Precio:'+filas[f].precio+'<hr>';
    }
    respuesta.write('<!doctype html><html><head></head><body>');
    respuesta.write(datos);
    respuesta.write('<a href="index.html">Retornar</a>');
    respuesta.write('</body></html>');
    respuesta.end();
  });
}


function consulta(peticion,respuesta) {
  let info='';
  peticion.on('data', datosparciales => {
    info += datosparciales;
  });
  peticion.on('end', () => {
    const formulario = querystring.parse(info);
    const dato=[formulario['codigo']];
    conexion.query('select descripcion,precio from articulos where codigo=?',dato, (error,filas) => {
      if (error) {
        console.log('error en la consulta');
        return;
      }
      respuesta.writeHead(200, {'Content-Type': 'text/html'});
      let datos='';
      if (filas.length>0) {
        datos+='Descripcion:'+filas[0].descripcion+'<br>';
        datos+='Precio:'+filas[0].precio+'<hr>';
      } else {
        datos='No existe un artículo con dicho codigo.';
      }
      respuesta.write('<!doctype html><html><head></head><body>');
      respuesta.write(datos);
        respuesta.write('<a href="index.html">Retornar</a>');
      respuesta.write('</body></html>');
      respuesta.end();
    });
  });
}

console.log('Servidor web iniciado');
