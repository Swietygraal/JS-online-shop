//const Product = require('../database/repositories/ProductRepository.js');

exports.getCart = (req, res) => {
    let cart = req.session.cart;
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].Cena;
    }
    res.render('cart', {cart: cart, total: total});
};