const fs = require('fs');

fs.readFile('../4-ejercicio/archivo1.txt', (error,datos) => {
	  if (error)
		    console.log(error);
	  else
		    console.log(datos.toString());
});

console.log('última línea del programa');
