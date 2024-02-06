var mssql = require('mssql');

class User_RoleRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieve(userID) {
        try {
            var req = new mssql.Request(this.conn);
            if (userID) req.input('userID', userID);
            else return;
            var res = await req.query('select * from User_Role WHERE UserID = @userID');
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async insert(roleID, userID) {
        try {
            var req = new mssql.Request(this.conn);
            if (roleID && userID) {
                req.input('roleID', roleID);
                req.input('userID', userID);
            } else return;
            var res = await req.query('INSERT INTO User_role (UserID, RoleID) VALUES (@userID, @roleID) SELECT scope_identity() as id;');
            return res.recordset[0].id;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async delete(userID, roleID) {
        try {
            var req = new mssql.Request(this.conn);
            if (userID && roleID) {
                req.input("userID", userID);
                req.input("roleID", roleID);
            } else return;
            var ret = await req.query('DELETE User_Role WHERE UserID = @userID AND RoleID = @roleID');
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = User_RoleRepository;