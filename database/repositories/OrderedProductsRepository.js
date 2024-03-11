var mssql = require('mssql');

class OrderedProductsRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async insert(products, orderId) {
        if (!orderId) return;
        try {           
            products.forEach(async p => {
                var req = new mssql.Request(this.conn);
                req.input("orderId", orderId);
                req.input("id", p.ID);
                req.input("amount", p.Ilosc);
                var res = await req.query('insert into [Ordered_Products] (OrderID, ProductID, Ilosc'
                + ") values (@orderId, @id, @amount"
                + ') select scope_identity() as id');
            });

            return;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = OrderedProductsRepository;