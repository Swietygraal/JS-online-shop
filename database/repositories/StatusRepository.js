var mssql = require('mssql');

class StatusRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieve(name = null) {
        try {
            var req = new mssql.Request(this.conn);
            if (name) req.input('name', name);
            var res = await req.query('select * from Statusy' + (name ? ' where Status = @name' : ''));
            return name ? res.recordset[0] : res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async retrieveID(id) {
        try {
            var req = new mssql.Request(this.conn);
            if (id) req.input('id', id);
            else return;
            var res = await req.query('select * from Statusy where ID = @id');
            return res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async insert(status) {
        if (!status) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("name", status.Status);
            var res = await req.query('insert into Statusy (Status) values(@name) select scope_identity() as id');
            return res.recordset[0].id;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async update(status) {
        if (!status || !status.ID) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("id", status.ID);
            req.input("Name", status.Status);
            var ret = await req.query('update Statusy set Status=@Name where id = @id');
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = StatusRepository;