var mssql = require('mssql');

class ModelRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieve(name = null) {
        try {
            var req = new mssql.Request(this.conn);
            if (name) req.input('name', name);
            var res = await req.query('select * from Modele' + (name ? ' where Model = @name' : ''));
            return name ? res.recordset[0] : res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async insert(model) {
        if (!model) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("name", model.Model);
            var res = await req.query('insert into Modele (Model) values(@name) select scope_identity() as id');
            return res.recordset[0].id;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async update(model) {
        if (!model || !model.ID) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("id", model.ID);
            req.input("Name", model.Model);
            var ret = await req.query('update Modele set Model=@Name where id = @id');
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = ModelRepository;