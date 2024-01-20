var mssql = require('mssql');

class CategoryRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieve(name = null) {
        try {
            var req = new mssql.Request(this.conn);
            if (name) req.input('name', name);
            var res = await req.query('select * from Kategorie' + (name ? ' where Kategoria = @name' : ''));
            return name ? res.recordset[0] : res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async insert(category) {
        if (!category) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("name", category.Kategoria);
            var res = await req.query('insert into Kategorie (Kategoria) values(@name) select scope_identity() as id');
            return res.recordset[0].id;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async update(category) {
        if (!category || !category.ID) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("id", category.ID);
            req.input("Name", category.Kategoria);
            var ret = await req.query('update Kategorie set Kategoria=@Name where id = @id');
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = CategoryRepository;