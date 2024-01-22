USE [Piercingownia]
GO

/****** Object:  Table [dbo].[Produkt]    Script Date: 22.01.2024 13:08:25 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Produkt](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Nazwa] [nvarchar](80) NOT NULL,
	[Cena] [money] NOT NULL,
	[Zdjecie] [varbinary](max) NOT NULL,
	[Kategoria] [int] NULL,
	[Model] [int] NULL,
	[Grubosc] [float] NULL,
	[Dlugosc] [int] NULL,
	[Material] [int] NULL,
	[Kolor] [int] NULL,
	[Kolor Cyrkonii] [int] NULL,
	[Stan] [int] NOT NULL,
	[Opis] [nvarchar](max) NULL,
 CONSTRAINT [PK_Produkt] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Produkt]  WITH CHECK ADD  CONSTRAINT [FK_Produkt_Kategorie] FOREIGN KEY([Kategoria])
REFERENCES [dbo].[Kategorie] ([ID])
GO

ALTER TABLE [dbo].[Produkt] CHECK CONSTRAINT [FK_Produkt_Kategorie]
GO

ALTER TABLE [dbo].[Produkt]  WITH CHECK ADD  CONSTRAINT [FK_Produkt_Kolory1] FOREIGN KEY([Kolor Cyrkonii])
REFERENCES [dbo].[Kolory] ([ID])
GO

ALTER TABLE [dbo].[Produkt] CHECK CONSTRAINT [FK_Produkt_Kolory1]
GO

ALTER TABLE [dbo].[Produkt]  WITH CHECK ADD  CONSTRAINT [FK_Produkt_Materialy] FOREIGN KEY([Material])
REFERENCES [dbo].[Materialy] ([ID])
GO

ALTER TABLE [dbo].[Produkt] CHECK CONSTRAINT [FK_Produkt_Materialy]
GO

ALTER TABLE [dbo].[Produkt]  WITH CHECK ADD  CONSTRAINT [FK_Produkt_Modele] FOREIGN KEY([Model])
REFERENCES [dbo].[Modele] ([ID])
GO

ALTER TABLE [dbo].[Produkt] CHECK CONSTRAINT [FK_Produkt_Modele]
GO

