var mssql = require('mssql');

class MaterialRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieve(name = null) {
        try {
            var req = new mssql.Request(this.conn);
            if (name) req.input('name', name);
            var res = await req.query('select * from Materialy' + (name ? ' where Material = @name' : ''));
            return name ? res.recordset[0] : res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async insert(material) {
        if (!material) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("name", material.Material);
            var res = await req.query('insert into Materialy (Material) values (@name) select scope_identity() as id');
            return res.recordset[0].id;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async update(material) {
        if (!material || !material.ID) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("id", material.ID);
            req.input("Name", material.Material);
            var ret = await req.query('update Materialy set Material=@Name where id = @id');
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = MaterialRepository;