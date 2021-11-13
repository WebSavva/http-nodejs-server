const http = require('http');

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

server.start(() => console.log('Routed server is up and running'))