// index.js
var http = require('http');
const express = require('express');
let session = require('express-session')
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
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
  res.render('add_product', {categories, colors, materials, models, name:"", 
              price: 0, stock: 0, thickness:"", length:"", description: "", message:""});
});

app.post('/new_product', upload.single('photo'), async (req, res) => {
  var product = {};
  product.name = req.session.name;
  product.price = req.session.price;
  product.stock = req.session.stock;
  product.desription = req.session.description;
  product.thickness = req.session.thickness;
  product.length = req.session.length;
  product.photo = req.file.path;
  product.model = await ModRepo.retrieve(req.session.selectModel).ID;
  product.material = await MatRepo.retrieve(req.session.selectMateriale).ID;
  product.category = await CategRepo.retrieve(req.session.selectCategory).ID;
  product.color = await ClrRepo.retrieve(req.session.selectColor).ID;
  product.zirc_color = await ClrRepo.retrieve(req.session.selectZircColor).ID;

  var categories = await CategRepo.retrieve();
  var colors = await ClrRepo.retrieve();
  var materials = await MatRepo.retrieve();
  var models = await ModRepo.retrieve();
  
  if(product.name && product.price && product.photo && product.stock){
    var id = await ProdRepo.insert(product);
    res.render("add_product",  {categories, colors, 
              materials, models, name:"", 
              price: 0, stock: 0, thickness:"", length:"", description: "", message:"Produkt został dodany"});
  }
  else {
    res.render("add_product",  {categories, colors, 
      materials, models, name:"", 
      price: 0, stock: 0, thickness:"", length:"", description: "", message:"Wypełnij wymagane pola"});
  }
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
