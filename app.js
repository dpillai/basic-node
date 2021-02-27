

let http = require('http');
let module1 = require('./module1');
let module2 = require('./module2');


function onRequest(request, response) {
    response.writeHead(200,{'Content-Type': 'text/plain'});
    response.write(module1.myString);
    module2.myFunction();
    response.end();
}

http.createServer(onRequest).listen(8000)

//ANONYMOUS FUNCION
// function onRequest(request, response) {
//     response.writeHead(200,{'Content-Type': 'text/plain'});
//     response.write(module2.myString);
//     module2.myFunction();
//     response.end();
// }

// http.createServer(function(request, response) {
//     response.writeHead(200,{'Content-Type': 'text/plain'});
//     response.write(module2.myString);
//     module2.myFunction();
//     response.end();
// }).listen(8000)
