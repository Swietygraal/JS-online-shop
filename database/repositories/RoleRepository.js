var mssql = require('mssql');

class RoleRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieve_role(ID) {
        try {
            var req = new mssql.Request(this.conn);
            if (ID) req.input('ID', ID);
            else return;
            var res = await req.query('select Rola from Role WHERE ID = @ID');
            return res.recordset[0].Rola;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async retrieve_ID(name) {
        try {
            var req = new mssql.Request(this.conn);
            if (name) req.input('name', name);
            else return;
            var res = await req.query('select ID from Role WHERE Rola = @name');
            return res.recordset[0].ID;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
}

module.exports = RoleRepository;