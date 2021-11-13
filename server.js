const http = require('http');
const fs = require('fs');
const path = require('path');

class RoutedServer {
    constructor() {
        this._routesMap = {};
        
        // GLOBAL HANDLER
        this._server = http.createServer((req, res) => {
            const callbacks = this._routesMap[req.url];

            if (!callbacks) {
                res.end('404 error');
                return;
            }

            callbacks.forEach(cb => cb(req, res));
        });
    }

    route(path, cb) {

        if (!this._routesMap[path]) this._routesMap[path] = new Array();

        this._routesMap[path].push(cb);
    }

    start(cb) {
        this._server.listen(8000, cb);
    }
}

// Reading data and storing it in the object as a cache
const products = JSON.parse( fs.readFileSync(path.resolve(__dirname, 'products.json'), 'utf-8') );
const server = new RoutedServer();

server.route('/hello', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    res.end('<marquee>Hello World!</marquee>');
});

server.route('/check', (req, res) => {
    res.end('Double check is required');
});

server.route('/products', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify(products));
});

server.start(() => console.log('Routed server is up and running'))