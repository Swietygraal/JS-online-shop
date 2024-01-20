// index.js
var http = require('http');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
const port = 3000;

var mssql = require('mssql');
const CategoryRepository = require('./CategoryRepository');
const ColorRepository = require('./ColorRepository');
const MaterialRepository = require('./MaterialRepository');
const ModelRepository = require('./ModelRepository');
var conn = new mssql.ConnectionPool(
  'server=localhost,1433;database=Piercingownia;user id=weppo;password=weppo; TrustServerCertificate=true');
var CategRepo = new CategoryRepository(conn);
var ClrRepo = new ColorRepository(conn);
var MatRepo = new MaterialRepository(conn);
var ModRepo = new ModelRepository(conn);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/admin', async (req, res) => {
  await conn.connect();
  var categories = await CategRepo.retrieve();
  var colors = await ClrRepo.retrieve();
  var materials = await MatRepo.retrieve();
  var models = await ModRepo.retrieve();
  res.render('edit_product', {categories, colors, materials, models});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
