const os=require('os');

console.log(`memoria libre: ${os.freemem()}`);

const vector = [];
for(let i=0; i<1000000;i++) {
  vector.push(i)
}

console.log(`memoria  después de crear el vector: ${os.freemem()}`);
