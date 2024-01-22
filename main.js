// index.js
var http = require('http');
const express = require('express');
let session = require('express-session')
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
const port = 3000;

var mssql = require('mssql');

const CategoryRepository = require('./database/repositories/CategoryRepository');
const ColorRepository = require('./database/repositories/ColorRepository');
const MaterialRepository = require('./database/repositories/MaterialRepository');
const ModelRepository = require('./database/repositories/ModelRepository');
const ProductRepository = require('./database/repositories/ProductRepository');

var conn = new mssql.ConnectionPool(
  'server=localhost,1433;database=Piercingownia;user id=weppo;password=weppo; TrustServerCertificate=true');
var CategRepo = new CategoryRepository(conn);
var ClrRepo = new ColorRepository(conn);
var MatRepo = new MaterialRepository(conn);
var ModRepo = new ModelRepository(conn);
var ProdRepo = new ProductRepository(conn);

const shopRoutes = require("./routes/shop");

async function main(){
  await conn.connect();
}

main();

app.use(express.static('public'));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  if (!req.session.account) {
    req.session.account = {
      type: "guest"
    }
  }
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
})


app.use(shopRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/admin', async (req, res) => {
  var categories = await CategRepo.retrieve();
  var colors = await ClrRepo.retrieve();
  var materials = await MatRepo.retrieve();
  var models = await ModRepo.retrieve();
  res.render('edit_product', {categories, colors, materials, models});
});

app.get('/konto', async (req, res) => {
  var product = await ProdRepo.retrieve(1);
  res.render('product', {product});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
