USE [Piercingownia]
GO

/****** Object:  Table [dbo].[Materialy]    Script Date: 22.01.2024 13:07:42 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Materialy](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Material] [nvarchar](30) NOT NULL,
 CONSTRAINT [PK_Materialy] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
