--ustawienia startowe
/*
INSERT Kategorie
(Kategoria)
Values
('piercing'), ('ekspandery'), ('fake'), ('bi¿uteria'), ('pielêgnacja'), ('inne')

INSERT Modele
(Model)
Values
('septum'), ('labret'), ('banan'), ('sztanga'), ('podkowa'), ('kó³ko'), ('element zapasowy'), ('taper'), 
('spirala'), ('zawieszka'), ('tunel'), ('plug'), ('zacisk'), ('naszyjnik'), ('kolczyk'), ('pierœcionek'),
('wisiorek'), ('bransoletka')

INSERT Kolory
(Kolor)
Values
('benzyna'), ('srebrny'), ('z³oty'), ('niebieski'), ('wielokolorowy'), ('b³êkitny'),
('ró¿owy'), ('fioletowy'), ('crystal'), ('czarny')

INSERT Role
(Rola)
Values
('klient'), ('administrator')

Insert Statusy
(Status)
Values
('Zamówienie w realizacji'), ('Zamówienie oczekuje na odbiór'), ('Zamówienie w drodze'), ('Zamówienie dostarczone')

Insert Materialy
(Material)
Values
('stal 316L'), ('tytan G23'), ('z³oto'), ('srebro'), ('akryl'), ('drewno'), ('kamieñ'), ('stop cynku'),
('skóra'), ('ceramika')


Select * from Kolory

INSERT INTO Produkt (Nazwa, Cena, Zdjecie, Kategoria, Model, Grubosc, Dlugosc, Material, Kolor, Stan)
VALUES 
('Banan z grotami 1,2 mm - benzyna', 5.99, (SELECT * FROM OPENROWSET(BULK 'C:\Users\xilin\Desktop\ISIM\WEPPO_projekt\photos\Banan-rb-10mm.jpg', SINGLE_BLOB) AS Zdjecie), 7, 21, 1.2, 10, 1, 1, 100);

*/

Select * from Kolory

INSERT INTO Produkt (Nazwa, Cena, Zdjecie, Kategoria, Model, Grubosc, Dlugosc, Material, Kolor, Stan, [Kolor Cyrkonii])
VALUES 
('Banan z grotami 1,2 mm - benzyna', 9.99, (SELECT * FROM OPENROWSET(BULK 'C:\Users\xilin\Desktop\ISIM\WEPPO_projekt\JS-online-shop\photos\Clicker_Ozd_Crykonia_rozowa.jpg', SINGLE_BLOB) AS Zdjecie), 7, 24, 1.2, 8, 1, 2, 33, 7);
