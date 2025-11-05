USE [TaskDb]
GO

/****** Object:  Table [dbo].[TaskItems]    Script Date: 06/11/2025 01:39:46 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TaskItems](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TaskName] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[IsCompleted] [bit] NOT NULL,
	[CreatedDate] [datetime2](7) NOT NULL,
	[AsigneeeId] [int] NOT NULL,
 CONSTRAINT [PK_TaskItems] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


