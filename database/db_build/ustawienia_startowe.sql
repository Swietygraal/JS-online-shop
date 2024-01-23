--ustawienia startowe
/*
INSERT Kategorie
(Kategoria)
Values
('piercing'), ('ekspandery'), ('fake'), ('bi�uteria'), ('piel�gnacja'), ('inne')

INSERT Modele
(Model)
Values
('septum'), ('labret'), ('banan'), ('sztanga'), ('podkowa'), ('k�ko'), ('element zapasowy'), ('taper'), 
('spirala'), ('zawieszka'), ('tunel'), ('plug'), ('zacisk'), ('naszyjnik'), ('kolczyk'), ('pier�cionek'),
('wisiorek'), ('bransoletka')

INSERT Kolory
(Kolor)
Values
('benzyna'), ('srebrny'), ('z�oty'), ('niebieski'), ('wielokolorowy'), ('b��kitny'),
('r�owy'), ('fioletowy'), ('crystal'), ('czarny')

INSERT Role
(Rola)
Values
('klient'), ('administrator')

Insert Statusy
(Status)
Values
('Zam�wienie w realizacji'), ('Zam�wienie oczekuje na odbi�r'), ('Zam�wienie w drodze'), ('Zam�wienie dostarczone')

Insert Materialy
(Material)
Values
('stal 316L'), ('tytan G23'), ('z�oto'), ('srebro'), ('akryl'), ('drewno'), ('kamie�'), ('stop cynku'),
('sk�ra'), ('ceramika')


Select * from Kolory

INSERT INTO Produkt (Nazwa, Cena, Zdjecie, Kategoria, Model, Grubosc, Dlugosc, Material, Kolor, Stan)
VALUES 
('Banan z grotami 1,2 mm - benzyna', 5.99, (SELECT * FROM OPENROWSET(BULK 'C:\Users\xilin\Desktop\ISIM\WEPPO_projekt\photos\Banan-rb-10mm.jpg', SINGLE_BLOB) AS Zdjecie), 7, 21, 1.2, 10, 1, 1, 100);

*/

Select * from Kolory

INSERT INTO Produkt (Nazwa, Cena, Zdjecie, Kategoria, Model, Grubosc, Dlugosc, Material, Kolor, Stan, [Kolor Cyrkonii])
VALUES 
('Banan z grotami 1,2 mm - benzyna', 9.99, (SELECT * FROM OPENROWSET(BULK 'C:\Users\xilin\Desktop\ISIM\WEPPO_projekt\JS-online-shop\photos\Clicker_Ozd_Crykonia_rozowa.jpg', SINGLE_BLOB) AS Zdjecie), 7, 24, 1.2, 8, 1, 2, 33, 7);
