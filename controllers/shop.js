//const Product = require('../database/repositories/ProductRepository.js');

exports.getCart = (req, res) => {
    let cart = req.session.cart;
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].Cena;
    }
    res.render('cart', {cart: cart, total: total});
};

exports.deleteCartItem = (req, res) => {
    let cart = req.session.cart;
    let id = req.body.productID;
    let i;
    for (i = 0; i < cart.length; i++) {
        if (cart[i].ID == id) {
            break;
        }
    }
    cart.splice(i, 1);
    res.redirect('/cart');
};

exports.addCartItem = async (req, res) => {
    let id = req.body.productID;
    await req.conn.connect();
    var product = await req.ProdRepo.retrieve(id);
    req.session.cart.push(product);
    //tu jakiś render albo redirect by się przydał
};