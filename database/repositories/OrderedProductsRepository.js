var mssql = require('mssql');

class OrderedProductsRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async insert(products, orderId) {
        if (!orderId) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("orderId", orderId);
            products.forEach(async p => {
                req.input("id", p.ProductId);
                req.input("amount", p.Ilosc);
                var res = await req.query('insert into [Ordered Pruducts] (OrderID, ProductID, Ilosc'
                + ") values (@orderId, @id, @amount"
                + ') select scope_identity() as id');
            });

            return res.recordset[0].id;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = OrderedProductsRepository;