// index.js
var http = require('http');
const express = require('express');
let session = require('express-session')
const app = express();
app.use(express.urlencoded({extended: true}))
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
app.set('view engine', 'ejs');
app.set('views', './views');
const port = 3000;

var mssql = require('mssql');

const CategoryRepository = require('./database/repositories/CategoryRepository');
const ColorRepository = require('./database/repositories/ColorRepository');
const MaterialRepository = require('./database/repositories/MaterialRepository');
const ModelRepository = require('./database/repositories/ModelRepository');
const ProductRepository = require('./database/repositories/ProductRepository');
const CartRepository = require('./database/repositories/CartRepository');

var conn = new mssql.ConnectionPool(
  'server=localhost,1433;database=Piercingownia;user id=weppo;password=weppo; TrustServerCertificate=true');
var CategRepo = new CategoryRepository(conn);
var ClrRepo = new ColorRepository(conn);
var MatRepo = new MaterialRepository(conn);
var ModRepo = new ModelRepository(conn);
var ProdRepo = new ProductRepository(conn);
var CartRepo = new CartRepository(conn);

async function main() {
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

app.get('/', async (req, res) => {
  var products = await ProdRepo.retrieve();
  res.render('index', { products });
});

app.get('/admin', async (req, res) => {
  res.render('admin_panel');
})

app.post('/admin/products', async (req, res) => {
  let products = await ProdRepo.retrieve();
  res.render('admin_products', {products: products});
});

app.get('/admin/products/add_product', async (req, res) => {
  var categories = await CategRepo.retrieve();
  var colors = await ClrRepo.retrieve();
  var materials = await MatRepo.retrieve();
  var models = await ModRepo.retrieve();
  res.render('add_product', {
    categories, colors, materials, models, name: "",
    price: 0, stock: 0, thickness: "", length: "", description: "", message: ""
  });
})

app.get('/edit_product/:id', async (req, res) => {
  var categories = await CategRepo.retrieve();
  var colors = await ClrRepo.retrieve();
  var materials = await MatRepo.retrieve();
  var models = await ModRepo.retrieve();
  var productId = req.params.id;
  var product = await ProdRepo.retrieveID(productId);
  var selectedCategory = await ProdRepo.getCategory(productId);
  var selectedColor = await ProdRepo.getColor(productId);
  var selectedMaterial = await ProdRepo.getMaterial(productId);
  var selectedModel = await ProdRepo.getModel(productId);
  var selectedZirc_color = await ProdRepo.getZircColor(productId);
  res.render('edit_product', {
    categories, colors, materials, models, product, selectedCategory, 
    selectedColor, selectedMaterial, selectedModel, selectedZirc_color
  });
});


app.post('/edit_product/:id', upload.single('photo'), async (req, res) => {
  var productId = req.params.id;
  var product = await ProdRepo.retrieveID(productId);
  product.Nazwa = req.body.name ? req.body.name : product.Nazwa;
  product.Cena = req.body.pric ? parseFloat(req.body.price) : product.Cena;
  product.Stan = req.body.stock ? parseInt(req.body.stock) : product.Stan;
  product.Opis = req.body.description;
  product.Grubosc = parseFloat(req.body.thickness);
  product.Dlugosc = parseFloat(req.body.length);
  product.Zdjecie = req.file ? req.file.path : product.Zdjecie;
  var model = await ModRepo.retrieve(req.body.model);
  product.Model = model.ID;
  var selectedModel = model.Model;
  var material = await MatRepo.retrieve(req.body.materiale);
  product.Material = material.ID;
  var selectedMaterial = material.Material;
  var category = await CategRepo.retrieve(req.body.category);
  product.Kategoria = category.ID;
  var selectedCategory = category.Kategoria;
  var color = await ClrRepo.retrieve(req.body.color);
  product.Kolor = color.ID;
  var selectedColor = color.Kolor;
  var zirc_color = await ClrRepo.retrieve(req.body.zircColor);
  product["Kolor Cyrkonii"] = zirc_color.ID;
  var selectedZirc_color = zirc_color.Kolor;

  var categories = await CategRepo.retrieve();
  var colors = await ClrRepo.retrieve();
  var materials = await MatRepo.retrieve();
  var models = await ModRepo.retrieve();
  var aff = await ProdRepo.update(product);
  res.render('edit_product', {
    categories, colors, materials, models, product, selectedCategory, 
    selectedColor, selectedMaterial, selectedModel, selectedZirc_color
  });
});

app.post('/delete_product/:id', async (req, res) => {
  var productId = req.params.id;
  var aff = await ProdRepo.delete(productId);
  let products = await ProdRepo.retrieve();
  res.render('admin_products', {products: products});
});

app.post('/new_product', upload.single('photo'), async (req, res) => {
  var product = {};
  product.name = req.body.name;
  product.price = parseFloat(req.body.price);
  product.stock = req.body.stock;
  product.desription = req.body.description;
  product.thickness = parseFloat(req.body.thickness);
  product.length = parseFloat(req.body.length);
  product.photo = req.file ? req.file.path : req.file;
  var model = await ModRepo.retrieve(req.body.model);
  product.model = model.ID;
  var material = await MatRepo.retrieve(req.body.materiale);
  product.material = material.ID;
  var category = await CategRepo.retrieve(req.body.category);
  product.category = category.ID;
  var color = await ClrRepo.retrieve(req.body.color);
  product.color = color.ID;
  var zirc_color = await ClrRepo.retrieve(req.body.zircColor);
  product.zirc_color = zirc_color.ID;

  var categories = await CategRepo.retrieve();
  var colors = await ClrRepo.retrieve();
  var materials = await MatRepo.retrieve();
  var models = await ModRepo.retrieve();

  if (product.name && product.price && product.photo && product.stock) {
    var id = await ProdRepo.insert(product);
    res.render("add_product", {
      categories, colors,
      materials, models, name: "",
      price: 0, stock: 0, thickness: "", length: "", description: "", message: "Produkt został dodany"
    });
  }
  else {
    res.render("add_product", {
      categories, colors,
      materials, models, name: "",
      price: 0, stock: 0, thickness: "", length: "", description: "", message: "Wypełnij wymagane pola"
    });
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
  res.render('product', { product, category, color, material, model, zirc_color });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
