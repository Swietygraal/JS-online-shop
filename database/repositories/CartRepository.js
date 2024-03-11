var mssql = require('mssql');

class CartRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieve(userID) {
        try {
            var req = new mssql.Request(this.conn);
            if (userID) req.input('userID', userID);
            else return;
            var res = await req.query('select Produkt.ID, Produkt.Zdjecie, Produkt.Nazwa, Produkt.Cena, Koszyk.Ilosc from Koszyk JOIN Produkt ON Koszyk.ProductID = Produkt.ID WHERE UserID = @userID');
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async insert(productID, userID) {
        try {
            var req = new mssql.Request(this.conn);
            if (productID && userID) {
                req.input('productID', productID);
                req.input('userID', userID);
            } else return;
            var res = await req.query(`IF NOT EXISTS (SELECT 1 FROM Koszyk WHERE UserID = @userID AND ProductID = @productID)
            BEGIN
            INSERT INTO Koszyk (UserID, ProductID, Ilosc) VALUES (@userID, @productID, 1);
            SELECT ID AS id FROM Koszyk WHERE UserID = @userID AND ProductID = @productID;
            END
            ELSE BEGIN 
            UPDATE Koszyk SET Ilosc = Ilosc + 1 WHERE UserID = @userID AND ProductID = @productID;
            SELECT ID AS id FROM Koszyk WHERE UserID = @userID AND ProductID = @productID; END`);
            return res.recordset[0].id;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async update(userID, productID, ilosc) {
        try {
            var req = new mssql.Request(this.conn);
            if (userID && productID && ilosc > 0) {
                req.input("userID", userID);
                req.input("productID", productID);
                req.input("ilosc", ilosc);
            } else return;
            console.log(ilosc);
            var ret = await req.query(`UPDATE Koszyk SET Ilosc = @ilosc WHERE UserID = @userID AND ProductID = @productID;`);
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async delete(userID, productID) {
        try {
            var req = new mssql.Request(this.conn);
            if (userID && productID) {
                req.input("userID", userID);
                req.input("productID", productID);
            } else return;
            var ret = await req.query(`DELETE Koszyk WHERE UserID = @userID AND ProductID = @productID;`);
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = CartRepository;