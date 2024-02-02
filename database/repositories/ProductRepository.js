var mssql = require('mssql');

class ProductRepository {
    constructor(conn) {
        this.conn = conn;
    }
    async retrieve(name = null) {
        try {
            var req = new mssql.Request(this.conn);
            if (name) req.input('name', name);
            var res = await req.query('select * from Produkt' + (name ? 'where Nazwa = %@name%' : ''));
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
            if (id) req.input('id', id);
            else return;
            var res = await req.query('select * from Produkt where ID = @id');
            return res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async getCategory(id) {
        try {
            var req = new mssql.Request(this.conn);
            var res = await req.query('select Kategorie.Kategoria from Produkt JOIN Kategorie on Produkt.Kategoria = Kategorie.ID');
            return res.recordset[0] ? res.recordset[0].Kategoria : res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async getColor(id) {
        try {
            var req = new mssql.Request(this.conn);
            var res = await req.query('select Kolory.Kolor from Produkt JOIN Kolory on Produkt.Kolor = Kolory.ID');
            return res.recordset[0] ? res.recordset[0].Kolor : res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async getZircColor(id) {
        try {
            var req = new mssql.Request(this.conn);
            var res = await req.query('select Kolory.Kolor from Produkt JOIN Kolory on Produkt.[Kolor Cyrkonii] = Kolory.ID');
            return res.recordset[0] ? res.recordset[0].Kolor : res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async getMaterial(id) {
        try {
            var req = new mssql.Request(this.conn);
            var res = await req.query('select Materialy.Material from Produkt JOIN Materialy on Produkt.Material = Materialy.ID');
            return res.recordset[0] ? res.recordset[0].Material : res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async getModel(id) {
        try {
            var req = new mssql.Request(this.conn);
            var res = await req.query('select Modele.Model from Produkt JOIN Modele on Produkt.Model = Modele.ID');
            return res.recordset[0] ? res.recordset[0].Model : res.recordset[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async insert(Product) {
        if (!Product || !Product.name || !Product.price || !Product.photo || !Product.stock) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("name", Product.name);
            req.input("price", Product.price);
            req.input("photo", Product.photo);
            req.input("stock", Product.stock);
            req.input("category", Product.category);
            req.input("model", Product.model);
            req.input("thickness", Product.thickness);
            req.input("length", Product.length);
            req.input("material", Product.material);
            req.input("color", Product.color);
            req.input("zirc_color", Product.zirc_color);
            req.input("description", Product.description);
            var res = await req.query('insert into Produkt (Nazwa, Cena, Zdjecie, Stan'
            + (Product.category ? ', Kategoria' : '') + (Product.model ? ', Model' : '')
            + (Product.thickness ? ', Grubosc' : '') + (Product.length ? ', Dlugosc' : '')
            + (Product.material ? ', Material' : '') + (Product.color ? ', Kolor' : '')
            + (Product.zirc_color ? ', [Kolor Cyrkonii]' : '') + (Product.description ? ', Opis' : '')
            + ") values (@name, @price,(SELECT * FROM OPENROWSET(BULK @photo, SINGLE_BLOB) AS Zdjecie), @stock"
            + (Product.category ? ', @category' : '') + (Product.model ? ', @model' : '')
            + (Product.thickness ? ', @thickness' : '') + (Product.length ? ', @length' : '')
            + (Product.material ? ', @material' : '') + (Product.color ? ', @color' : '')
            + (Product.zirc_color ? ', @zirc_color' : '') + (Product.description ? ', @description' : '')
            + ') select scope_identity() as id');

            return res.recordset[0].id;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async update(Product) {
        if (!Product || !Product.ID) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("id", Product.ID);
            req.input("name", Product.name);
            req.input("price", Product.price);
            req.input("photo", Product.photo);
            req.input("stock", Product.stock);
            req.input("category", Product.category);
            req.input("model", Product.model);
            req.input("thickness", Product.thickness);
            req.input("length", Product.length);
            req.input("material", Product.material);
            req.input("color", Product.color);
            req.input("zirc_color", Product.zirc_color);
            req.input("description", Product.description);
            var ret = await req.query('update Produkt set Nazwa=@name, Cena=@price, Stan=@stock, '
            + 'Zdjecie=@photo, Kategoria=@category, Model=@model, '
            + 'Grubosc=@thickness, Dlugosc=@length, Material=@material, Kolor=@color, '
            + '[Kolor Cyrkonii]=@zirc_color, Opis=@description where ID = @id');
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async delete(Product) {
        if (!Product || !Product.ID) return;
        try {
            var req = new mssql.Request(this.conn);
            req.input("id", Product.ID);
            var ret = await req.query('delete Produkt where ID = @id');
            return ret.rowsAffected[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = ProductRepository;