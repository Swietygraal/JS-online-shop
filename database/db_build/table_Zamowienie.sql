USE [Piercingownia]
GO

/****** Object:  Table [dbo].[Zamowienie]    Script Date: 22.01.2024 13:09:43 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Zamowienie](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Uzytkownik] [int] NOT NULL,
	[Status] [int] NOT NULL,
	[Data_zlozenia] [datetime] NOT NULL,
	[Zmiana_statusu] [datetime] NULL,
 CONSTRAINT [PK_Zamowienie] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Zamowienie]  WITH CHECK ADD  CONSTRAINT [FK_Zamowienie_Statusy] FOREIGN KEY([Status])
REFERENCES [dbo].[Statusy] ([ID])
GO

ALTER TABLE [dbo].[Zamowienie] CHECK CONSTRAINT [FK_Zamowienie_Statusy]
GO

