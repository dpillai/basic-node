//let url = require('url');

module.exports = {
    handleRequest: function(request, response){
        response.writeHead(200,{'Content-Type': 'text/html'});

        const path = new URL(request.url, 'http://localhost:8000/').pathname;
        response.write(path);
        response.end();
    }
}