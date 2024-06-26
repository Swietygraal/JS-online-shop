USE [master]
GO

/****** Object:  Database [Piercingownia]    Script Date: 22.01.2024 13:05:06 ******/
CREATE DATABASE [Piercingownia]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Piercingownia', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Piercingownia.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Piercingownia_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Piercingownia_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Piercingownia].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [Piercingownia] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [Piercingownia] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [Piercingownia] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [Piercingownia] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [Piercingownia] SET ARITHABORT OFF 
GO

ALTER DATABASE [Piercingownia] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [Piercingownia] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [Piercingownia] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [Piercingownia] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [Piercingownia] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [Piercingownia] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [Piercingownia] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [Piercingownia] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [Piercingownia] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [Piercingownia] SET  DISABLE_BROKER 
GO

ALTER DATABASE [Piercingownia] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [Piercingownia] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [Piercingownia] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [Piercingownia] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [Piercingownia] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [Piercingownia] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [Piercingownia] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [Piercingownia] SET RECOVERY FULL 
GO

ALTER DATABASE [Piercingownia] SET  MULTI_USER 
GO

ALTER DATABASE [Piercingownia] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [Piercingownia] SET DB_CHAINING OFF 
GO

ALTER DATABASE [Piercingownia] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO

ALTER DATABASE [Piercingownia] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO

ALTER DATABASE [Piercingownia] SET DELAYED_DURABILITY = DISABLED 
GO

ALTER DATABASE [Piercingownia] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO

ALTER DATABASE [Piercingownia] SET QUERY_STORE = ON
GO

ALTER DATABASE [Piercingownia] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO

ALTER DATABASE [Piercingownia] SET  READ_WRITE 
GO

