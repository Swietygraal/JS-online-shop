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

app.get('/', async (req, res) => {
    var products = await ProdRepo.retrieve();
    res.render('index', {products});
});

app.get('/admin', async (req, res) => {
  var categories = await CategRepo.retrieve();
  var colors = await ClrRepo.retrieve();
  var materials = await MatRepo.retrieve();
  var models = await ModRepo.retrieve();
  res.render('edit_product', {categories, colors, materials, models});
});

app.get('/konto', async (req, res) => {
  
});

app.get('/produkt/:id', async (req, res) => {
  var productId = req.params.id;
  var product = await ProdRepo.retrieveID(productId);
  var category = await ProdRepo.getCategory(productId);
  var color = await ProdRepo.getColor(productId);
  var material = await ProdRepo.getMaterial(productId);
  var model = await ProdRepo.getModel(productId);
  var zirc_color = await ProdRepo.getZircColor(productId);
  res.render('product', {product, category, color, material, model, zirc_color});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
