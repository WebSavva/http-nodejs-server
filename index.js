const fs = require('fs');

//SYNC
// const res = fs.readFileSync('./index.html', 'utf-8');

// console.log(res);

// fs.writeFileSync('./output.html', '<marquee>Hello World FROM NODE.JS</marquee>');


//ASYNC
fs.readFile('./index.html', 'utf-8', (err, data) => {
    console.log(data);

    fs.writeFile('./output.html', '<h1>Hello World</h1>','utf-8', (err) => {
        console.log(err);
        process.exit(0);
    } );
});
