// index.js
var http = require('http');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
