var mssql = require('mssql');

class ColorRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieve(name = null) {
        try {
            var req = new mssql.Request(this.conn);
            if (name) req.input('name', name);
            var res = await req.query('select * from Kolory' + (name ? ' where Kolor = @name' : ''));
            return name ? res.recordset[0] : res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async insert(color) {
        if (!color) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("name", color.Kolor);
            var res = await req.query('insert into Kolory (Kolor) values (@name) select scope_identity() as id');
            return res.recordset[0].id;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async update(color) {
        if (!color || !color.ID) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("id", color.ID);
            req.input("Name", color.Kolor);
            var ret = await req.query('update Kolory set Kolor=@Name where id = @id');
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = ColorRepository;