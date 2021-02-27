const fs = require('fs');

function renderHTML(path, response) {
        fs.readFile(path,null, function(error,data){
            if (error) {
                response.writeHead(404);
                response.write('File not Found');
            }
            else {
                response.writeHead(200,{'Content-Type': 'text/html'});
                response.write(data);
            }
            response.end();
        });
}

module.exports = {
    handleRequest: function(request, response){

        const path = new URL(request.url, 'http://localhost:8000/').pathname;
        switch (path) {
            case '/':
                renderHTML('./index.html', response)
                break;
        
            case '/login' :
                renderHTML('./login.html', response);
                break;
            
            default:
                response.writeHead(404);
                response.write('File not found');
                response.end();
        }
    }
}