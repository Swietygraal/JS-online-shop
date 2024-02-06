var mssql = require('mssql');

class UserRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieve() {
        try {
            var req = new mssql.Request(this.conn);
            var res = await req.query('select * from Uzytkownik');
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async retrieveID(id) {
        try {
            var req = new mssql.Request(this.conn);
            if (id) req.input("id", id);
            else return;
            var res = await req.query('select * from Uzytkownik where ID = @id');
            return res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async retrieve_user(email) {
        try {
            var req = new mssql.Request(this.conn);
            if (email) req.input("email", email);
            else return;
            var res = await req.query('select * from Uzytkownik WHERE Email = @email');
            return res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async insert(email, password) {
        try {
            var req = new mssql.Request(this.conn);
            if (email && password) {
                req.input('email', email);
                req.input('password', password);
            } else return;
            var res = await req.query(`INSERT INTO Uzytkownik (Email, Haslo) VALUES (@email, @password);
            DECLARE @user_id int;
            SET @user_id = scope_identity();
            DECLARE @role_id int;
            SET @role_id = (SELECT ID FROM Role WHERE Rola = 'user');
            INSERT INTO User_Role (UserID, RoleID) VALUES (@user_id, @role_id);
            SELECT ID FROM Uzytkownik WHERE Email = @email;`);
            return res.recordset[0].ID;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async update(userID, password) {
        try {
            var req = new mssql.Request(this.conn);
            if (userID && password) {
                req.input("userID", userID);
                req.input("password", password);
            } else return;
            var ret = await req.query('UPDATE Uzytkownik SET Haslo = @password WHERE ID = @userID');
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async delete(userID) {
        try {
            var req = new mssql.Request(this.conn);
            if (userID) req.input("userID", userID);
            else return;
            var ret = await req.query(`DELETE User_Role WHERE UserID = @userID;
            DELETE Uzytkownik WHERE ID = @userID;`);
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = UserRepository;