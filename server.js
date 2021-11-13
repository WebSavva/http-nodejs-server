const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const formatPage = require('./utils');

class RoutedServer {
  constructor() {
    this._routesMap = {};

    // GLOBAL HANDLER
    this._server = http.createServer((req, res) => {
      const { pathname, query = {} } = url.parse(req.url, true);
      req.searchParams = query;

      const callbacks = this._routesMap[pathname];

      if (!callbacks) {
        res.writeHead(404);
        res.end('404 error');
        return;
      }

      callbacks.forEach((cb) => cb(req, res));
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
const products = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'model', 'products.json'), 'utf-8')
);
const productsPage = fs.readFileSync(
  path.resolve(__dirname, 'templates', 'products.html'),
  'utf-8'
);
const productCard = fs.readFileSync(
  path.resolve(__dirname, 'templates', 'product-card.html'),
  'utf-8'
);
const productPage = fs.readFileSync(
  path.resolve(__dirname, 'templates', 'product.html'),
  'utf-8'
);
const server = new RoutedServer();

server.route('/hello', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
  });

  res.end('<marquee>Hello World!</marquee>');
});

server.route('/check', (req, res) => {
  res.end('Double check is required');
});

server.route('/products', (req, res) => {
  const { id: requestedId } = req.searchParams;

  res.writeHead(200, {
    'Content-Type': 'text/html',
  });

  if (requestedId) {
    const requestedProduct = products.find(({ id }) => +requestedId === id);
    let response;

    if (requestedProduct) {
      res.end(formatPage(productPage, requestedProduct));
    } else {
      res.writeHead(404);
      res.end('<h1>Such product is not found</h1>');
    }
  } else {
    const productsHtml = products.map(formatPage.bind(null, productCard));

    res.end(
      formatPage(productsPage, {
        products: productsHtml.join(''),
      })
    );
  }
});

server.start(() => console.log('Routed server is up and running'));
