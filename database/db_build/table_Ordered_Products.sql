USE [Piercingownia]
GO

/****** Object:  Table [dbo].[Ordered_Products]    Script Date: 22.01.2024 13:08:11 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Ordered_Products](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OrderID] [int] NOT NULL,
	[ProductID] [int] NOT NULL,
	[Ilosc] [int] NOT NULL,
 CONSTRAINT [PK_Ordered_Products] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Ordered_Products]  WITH CHECK ADD  CONSTRAINT [FK_Ordered_Products_Produkt] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Produkt] ([ID])
GO

ALTER TABLE [dbo].[Ordered_Products] CHECK CONSTRAINT [FK_Ordered_Products_Produkt]
GO

ALTER TABLE [dbo].[Ordered_Products]  WITH CHECK ADD  CONSTRAINT [FK_Ordered_Products_Zamowienie] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Zamowienie] ([ID])
GO

ALTER TABLE [dbo].[Ordered_Products] CHECK CONSTRAINT [FK_Ordered_Products_Zamowienie]
GO

