var mssql = require('mssql');

class OrderRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieveID(id) {
        try {
            var req = new mssql.Request(this.conn);
            if (id) req.input('id', id);
            else return;
            var res = await req.query('select * from Zamowienie where ID = @id');
            return res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async retrieveUser(userId) {
        try {
            var req = new mssql.Request(this.conn);
            if (id) req.input('id', userId);
            else return;
            var res = await req.query('select * from Zamowienie where Uzytkownik = @id');
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async getStatus(id) {
        try {
            var req = new mssql.Request(this.conn);
            var res = await req.query('select Statusy.Status from Zamowienie JOIN Statusy on Zamowienie.Status = Statusy.ID');
            return res.recordset[0] ? res.recordset[0].Status : res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async getOrderProducts(id) {
        try {
            var req = new mssql.Request(this.conn);
            var res = await req.query('select [Ordered Products].ProductID, [Ordered Products].Ilosc from Zamowienie JOIN [Ordered Products] on Zamowienie.ID = [Ordered Products].OrderID');
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async insert(order) {
        if (!order || !order.user || !order.status || !order.date) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("user", order.user);
            req.input("status", order.status);
           // req.input("date", order.date);
            req.input("change_date", order.change_date);

            var res = await req.query('insert into Zamowienie (Uzytkownik, Status, Data_zlozenia'
            + (order.change_date ? ', Zmiana_statusu' : '') 
            + ") values (@user, @status, GETDATE()"
            + (order.change_date ? ', @change_date' : '')
            + ') select scope_identity() as id');

            return res.recordset[0].id;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async updateStatus(order, statusId) {
        if (!order || !order.ID) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("id", order.ID);
            req.input("status", statusId);

            var ret = await req.query('update Zamowienie set Status=@status, Zmiana_statusu=GETDATE() where ID = @id');
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = OrderRepository;