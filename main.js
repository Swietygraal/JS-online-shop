var http = require('http');
const express = require('express');
let session = require('express-session')
const bcrypt = require('bcryptjs');
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
const UserRepository = require('./database/repositories/UserRepository');
const User_RoleRepository = require('./database/repositories/User_RoleRepository');
const RoleRepository = require('./database/repositories/RoleRepository');
const StatusRepository = require('./database/repositories/StatusRepository');
const OrderRepository = require('./database/repositories/OrderRepository');
const OrderedProductsRepository = require('./database/repositories/OrderedProductsRepository');

var conn = new mssql.ConnectionPool(
  'server=localhost,1433;database=Piercingownia;user id=weppo;password=weppo; TrustServerCertificate=true');
var CategRepo = new CategoryRepository(conn);
var ClrRepo = new ColorRepository(conn);
var MatRepo = new MaterialRepository(conn);
var ModRepo = new ModelRepository(conn);
var ProdRepo = new ProductRepository(conn);
var CartRepo = new CartRepository(conn);
var UserRepo = new UserRepository(conn);
var User_RoleRepo = new User_RoleRepository(conn);
var RoleRepo = new RoleRepository(conn);
var StatRepo = new StatusRepository(conn);
var OrderRepo = new OrderRepository(conn);
var OrderProdRepo = new OrderedProductsRepository(conn);

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
      user_role: ['guest'],
      user_ID: 0
    }
  }
  next();
});

app.get('/', async (req, res) => {
  var products = await ProdRepo.retrieve();
  res.render('index', { products });
});

app.get('/admin', async (req, res) => {
  if (req.session.account.user_role.includes('admin'))
    res.render('admin_panel');
});

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
});

app.get('/admin/orders', async (req, res) => {
  var orders = await OrderRepo.retrieve();
  orders.forEach(o => {
    var user = UserRepo.retrieveID(o.Uzytkownik);
    o.user = user.Email;
    var status = StatRepo.retrieveID(o.Status);
    o.status = status.Status;
  });
  var statusy = await StatRepo.retrieve();
  console.log(statusy);
  res.render('admin_orders', {
    orders, statusy
  });
});

app.get('/account/orders', async (req, res) => {
  var orders = await OrderRepo.retrieveUser(req.session.account.user_ID);
  orders.forEach(async o => {
    var status = await StatRepo.retrieveID(o.Status);
    o.status = status.Status;
    var user = await UserRepo.retrieveID(o.Uzytkownik);
    o.user = user.Email;
  });
  res.render('account_orders', {
    orders
  });
});

app.get('/order', async (req, res) => {
  var order = {};
  var status = await StatRepo.retrieve('Zamówienie w realizacji');
  var statusID = status.ID;
  var user = req.session.account.user_ID;
  var orderId = await OrderRepo.insert(user, statusID);
  var order = await OrderRepo.retrieveID(orderId);
  var Nazwa_statusu = 'Zamówienie w realizacji';
  var products = await CartRepo.retrieve(user);
  console.log(products);
  await OrderProdRepo.insert(products, orderId);
  products.forEach(async p => {
    await CartRepo.delete(user, p.ID);
  })
  res.render('order', {
    order, products, Nazwa_statusu
  });
});

app.get('/order/:id', async (req, res) => {
  var orderId = req.params.id;
  var order;
  order = await OrderRepo.retrieveID(orderId);
  order.Nazwa_statusu = await StatRepo.retrieveID(order.Status);
  var products = await OrderRepo.getOrderProducts(orderId);
  products.forEach(async p => {
    var amount = p.Ilosc;
    p = await ProdRepo.retrieveID(p.ProductID);
    p.Ilosc = amount;
  });
  res.render('order', {
    order, products
  });
});

app.post('/status_change/:id', async (req, res) => {
  var orderId = req.params.id;
  var statusId;
  var status;
  console.log("plamkajaka");
  console.log(req.body);
  status = await StatRepo.retrieve(req.body.status);
  statusId = status.ID;
  console.log("tereferekuku");
  console.log(req.body.status);
  console.log(statusId);
  await OrderRepo.updateStatus(orderId, statusId);

  var orders = await OrderRepo.retrieve();
  orders.forEach(async o => {
    var user = await UserRepo.retrieveID(o.Uzytkownik);
    o.user = user.Email;
    var status = await StatRepo.retrieveID(o.Status);
    o.status = status.Status;
    console.log(o);
  });
  var statusy = await StatRepo.retrieve();
  res.render('admin_orders', {
    orders, statusy
  });
});

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
  product.Cena = req.body.price ? parseFloat(req.body.price) : product.Cena;
  product.Stan = req.body.stock ? parseInt(req.body.stock) : product.Stan;
  product.Opis = req.body.description;
  product.Grubosc = parseFloat(req.body.thickness);
  product.Dlugosc = parseFloat(req.body.length);
  product.Zdjecie = req.file ? req.file.path : product.Zdjecie;
  var model = await ModRepo.retrieve(req.body.model);
  product.Model = model.ID;
  var selectedModel = model.Model;
  var material = await MatRepo.retrieve(req.body.material);
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

app.post('/search', async (req, res) => {
  var q = req.body.query;
  console.log(q);
  var products = await ProdRepo.search(q);
  (console.log(products));
  res.render('product_list', { products });
});

app.post('/admin/users', async (req, res) => {
  var users = await UserRepo.retrieve();
  res.render('admin_users', {users: users});
});

app.get('/account', async (req, res) => {
  if (req.session.account.user_role.includes('guest'))
    res.redirect('/login');
  else
    res.render('user_panel', {ID: req.session.account.user_ID});
});

app.get('/login', async (req, res) => {
  res.render('login', {message: ""});
});

app.post('/login', async (req, res) => {
  var email = String(req.body.log_email);
  var pwd = String(req.body.log_password);
  var user = await UserRepo.retrieve_user(email);
  if (user) {
    if (bcrypt.compareSync(pwd, user.Haslo)) {
      req.session.account.user_ID = user.ID;
      req.session.account.user_role = [];
      var roles = await User_RoleRepo.retrieve(user.ID);
      for (let i = 0; i < roles.length; i++) {
        var role = await RoleRepo.retrieve_role(roles[i].RoleID)
        req.session.account.user_role.push(role);
      }
      res.render('user_panel', {ID: user.ID});
    } else res.render('login', {message: "Nieprawidłowe hasło"});
  } else res.render('login', {message: "Użytkownik nie istnieje"});
})

app.post('/register', async (req, res) => {
  var email = String(req.body.reg_email);
  var pwd = String(req.body.reg_password);
  var user = await UserRepo.retrieve_user(email);
  if (!user) {
    var salt = bcrypt.genSaltSync();
    var hash = bcrypt.hashSync(pwd, salt);
    var id = await UserRepo.insert(email, hash);
    req.session.account.user_ID = id;
    var roleID = await RoleRepo.retrieve_ID("user");
    await User_RoleRepo.insert(roleID, id);
    req.session.account.user_role = ['user'];
    res.render('user_panel', {ID: id});
  } else res.render('login', {message: "Użytkownik już istnieje"});
});


app.get('/cart', async (req, res) => {
  if (req.session.account.user_role.includes('guest'))
    res.redirect('/login');
  else {
    var cart = await CartRepo.retrieve(req.session.account.user_ID);
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].Cena * cart[i].Ilosc;
    }
    res.render('cart', {cart: cart, total: total});
  }
});

app.post('/cart_edit', async (req, res) => {
  var id = req.body.productID;
  var amount = req.body.amount;
  var temp = await CartRepo.update(req.session.account.user_ID, id, amount);
  var cart = await CartRepo.retrieve(req.session.account.user_ID);
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].Cena * cart[i].Ilosc;
  }
  res.render('cart', {cart: cart, total: total});
});

app.post('/cart_delete', async (req, res) => {
  var id = req.body.productID;
  var temp = await CartRepo.delete(req.session.account.user_ID, id);
  var cart = await CartRepo.retrieve(req.session.account.user_ID);
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].Cena * cart[i].Ilosc;
  }
  res.render('cart', {cart: cart, total: total});
});

app.post('/cart_add', async (req, res) => {
  var id = req.body.productID;
  var temp = await CartRepo.insert(id, req.session.account.user_ID);
  var cart = await CartRepo.retrieve(req.session.account.user_ID);
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].Cena * cart[i].Ilosc;
  }
  res.render('cart', {cart: cart, total: total});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
