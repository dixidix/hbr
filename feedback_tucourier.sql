-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-02-2017 a las 02:29:46
-- Versión del servidor: 10.1.16-MariaDB
-- Versión de PHP: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `feedback_tucourier`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `airway_bill`
--

CREATE TABLE `airway_bill` (
  `airwayId` int(11) NOT NULL,
  `ventaId` int(11) NOT NULL,
  `number` int(150) NOT NULL,
  `quantity` int(150) NOT NULL,
  `weight` float DEFAULT NULL,
  `price` float DEFAULT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0',
  `state` int(11) NOT NULL DEFAULT '0',
  `warehouseId` int(11) DEFAULT NULL,
  `warehouse_enter` float DEFAULT '0',
  `warehouse_aditional_weight` float DEFAULT '0',
  `warehouse_aditional_charges` float DEFAULT '0',
  `warehouse_total` float DEFAULT '0',
  `shipment_international` float DEFAULT '0',
  `shipment_total` float DEFAULT '0',
  `arrivalDate` varchar(150) DEFAULT NULL,
  `leaveDate` varchar(150) DEFAULT NULL,
  `paymentGatewayUrl` varchar(150) DEFAULT NULL,
  `paymentButton` text,
  `token` varchar(150) DEFAULT NULL,
  `successUrl` text,
  `billing_total` float DEFAULT '0',
  `hbr_postal_provider` varchar(150) DEFAULT NULL,
  `hbr_tracking` varchar(150) DEFAULT NULL,
  `paymentMethod` int(11) DEFAULT NULL,
  `transfer_account_number` varchar(150) DEFAULT NULL,
  `transfer_account_holder_name` varchar(150) DEFAULT NULL,
  `transfer_bank_name` varchar(150) DEFAULT NULL,
  `transfer_bank_address` varchar(150) DEFAULT NULL,
  `paymentDesc` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `airway_bill`
--

INSERT INTO `airway_bill` (`airwayId`, `ventaId`, `number`, `quantity`, `weight`, `price`, `deleted`, `state`, `warehouseId`, `warehouse_enter`, `warehouse_aditional_weight`, `warehouse_aditional_charges`, `warehouse_total`, `shipment_international`, `shipment_total`, `arrivalDate`, `leaveDate`, `paymentGatewayUrl`, `paymentButton`, `token`, `successUrl`, `billing_total`, `hbr_postal_provider`, `hbr_tracking`, `paymentMethod`, `transfer_account_number`, `transfer_account_holder_name`, `transfer_bank_name`, `transfer_bank_address`, `paymentDesc`) VALUES
(1, 11, 1, 8, 34, 34, 0, 3, 18, 25, 52, 25, 102, 25, 850, '1486436400', '1486263600', NULL, 'null', '', 'null', 952, 'DHL', '123ASD-FASD1123-12312FFD', 2, 'AccN', 'AccH', 'BankName', 'BankAddress', 'Desc'),
(2, 8, 1, 4, 16, 16, 0, 1, 18, 0, 0, 0, 0, 0, 0, '', '', NULL, '', '', '', 0, '', '', 0, '', '', '', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `airway_bill_product`
--

CREATE TABLE `airway_bill_product` (
  `awb_productId` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `airwayId` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `price` float NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` float NOT NULL,
  `real_weight` float NOT NULL,
  `total_weight` float NOT NULL,
  `userId` int(11) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `airway_bill_product`
--

INSERT INTO `airway_bill_product` (`awb_productId`, `product_id`, `airwayId`, `category_id`, `name`, `price`, `quantity`, `total_price`, `real_weight`, `total_weight`, `userId`, `deleted`) VALUES
(1, 32, 1, 3, '434322fgrthhs', 3, 3, 9, 3, 9, 1, 0),
(2, 31, 1, 1, '434322fgrthhs', 5, 5, 25, 5, 25, 1, 0),
(3, 20, 2, 1, 'asadads', 4, 4, 16, 4, 16, 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(100) NOT NULL,
  `ventaId` int(11) NOT NULL,
  `whId` int(11) DEFAULT NULL,
  `establishment` varchar(150) NOT NULL,
  `number` varchar(150) NOT NULL,
  `provider` varchar(150) NOT NULL,
  `quantity` int(10) NOT NULL,
  `remaining_quantity` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `totalprice` double NOT NULL,
  `totalweight` double NOT NULL,
  `trackingnumber` varchar(150) NOT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `userId` int(150) NOT NULL,
  `bill_file_name` varchar(150) NOT NULL,
  `bill_file_path` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `bills`
--

INSERT INTO `bills` (`bill_id`, `ventaId`, `whId`, `establishment`, `number`, `provider`, `quantity`, `remaining_quantity`, `timestamp`, `totalprice`, `totalweight`, `trackingnumber`, `deleted`, `userId`, `bill_file_name`, `bill_file_path`) VALUES
(1, 1, 11, 'AAAAAAA', 'AAAAA', 'AAAAAA', 3, 3, '0000-00-00 00:00:00', 9, 9, 'AAAAAA', 0, 1, 'QATEST.pdf', '/dist/files/1486247506926/fd69e0667aa580e1fff7639d74bf685c4716abc83d7ca48cbb28335e8a8d2d6e.pdf'),
(2, 1, 11, 'BBBBBBB', 'BBBBBBB', 'BBBBBBB', 3, 3, '0000-00-00 00:00:00', 9, 9, 'BBBBBBB', 0, 1, 'QATEST.pdf', '/dist/files/1486247529219/0c9821a75fdb0d5455e1a34cb271311295e08fb6d35f8a2f375e085057a8465f.pdf'),
(3, 2, 11, 'CCCCCC', 'CCCCCC', 'CCCCCC', 7, 7, '0000-00-00 00:00:00', 25, 19, 'CCCCCC', 0, 1, 'QATEST.pdf', '/dist/files/1486247582149/13533111e1ed6c844bc364a703ba693482bf11c3c270afb29164c9b85b80d691.pdf'),
(4, 2, 11, 'DDDDD', 'DDDDD', 'DDDDD', 4, 4, '0000-00-00 00:00:00', 16, 16, 'DDDDD', 0, 1, 'QATEST.pdf', '/dist/files/1486247582186/9b48bea31639427791ed4ad0d7885f2a08a57f336bdfea07101207900d0963c1.pdf'),
(5, 3, 11, 'FFFFFF', 'FFFFFF', 'FFFFFF', 9, 9, '0000-00-00 00:00:00', 41, 41, 'FFFFFF', 0, 1, '', ''),
(6, 3, 11, 'RRRRRRRR', 'RRRRRRRR', 'RRRRRRRRq', 12, 12, '0000-00-00 00:00:00', 144, 144, 'RRRRRRRR', 0, 1, '', ''),
(7, 4, 11, 'QW', 'QW', 'QW', 6, 6, '0000-00-00 00:00:00', 9, 6, 'QW', 0, 1, '', ''),
(8, 4, 11, 'BBBBBBB', 'BBBBBBB', 'BBBBBBB', 5, 5, '0000-00-00 00:00:00', 25, 25, 'BBBBBBB', 0, 1, '', ''),
(9, 5, 11, 'UUUUUU', 'UUUUUU', 'UUUUUU', 61, 61, '0000-00-00 00:00:00', 311, 311, 'UUUUUU', 0, 1, '', ''),
(10, 5, 11, 'UYYYYY', 'UYYYYY', 'UYYYYY', 6, 6, '0000-00-00 00:00:00', 36, 36, 'UYYYYY', 0, 1, '', ''),
(11, 6, 11, 'XXXXXXXXX', 'XXXXXXXXX', 'XXXXXXXXX', 58, 58, '0000-00-00 00:00:00', 284, 284, 'XXXXXXXXX', 0, 1, '', ''),
(12, 6, 11, 'HHHHHHH', 'HHHHHHH', 'HHHHHHH', 4, 4, '0000-00-00 00:00:00', 16, 16, 'HHHHHHH', 0, 1, '', ''),
(13, 7, 11, 'JJJJJJJJJJJ', 'JJJJJJJJJJJ', 'JJJJJJJJJJJ', 55, 55, '0000-00-00 00:00:00', 3025, 275, 'JJJJJJJJJJJ', 0, 1, '', ''),
(14, 7, 11, 'DDDDDD', 'DDDDDD', 'DDDDDD', 3, 3, '0000-00-00 00:00:00', 6, 6, 'DDDDDD', 0, 1, '', ''),
(15, 8, 18, 'THTHT', '123123', 'asdasd', 4, 0, '2017-02-05 19:29:54', 16, 16, 'asdasd', 0, 1, 'QATEST.pdf', '/dist/files/1486306432546/5b854b5f42c598fbc39237de459ae8072e8a548ed2dd4a00a89dfc751c23f09d.pdf'),
(16, 9, 10, 'RRRRRRR', 'RRRRRRR', 'RRRRRRR', 6, 6, '0000-00-00 00:00:00', 26, 26, 'RRRRRRR', 0, 1, 'QATEST.pdf', '/dist/files/1486307512488/92dd580cdd3b800d11e6124ca01e0e017db32aa7f404823e41aabd816ec1d042.pdf'),
(17, 9, 10, 'HHHHHH', 'HHHHHH', 'HHHHHH', 8, 8, '0000-00-00 00:00:00', 40, 40, 'HHHHHH', 0, 1, 'QATEST.pdf', '/dist/files/1486307512519/10519b2e05fb14e0e595521c3e443527147ab2cd6c76ddcb2c88388ad1a7e9a1.pdf'),
(18, 10, 10, 'ERAQWE', 'ERAQWE', 'ERAQWE', 9, 9, '0000-00-00 00:00:00', 41, 41, 'ERAQWE', 0, 1, 'QATEST.pdf', '/dist/files/1486307575963/ef57f22d3f492d410292ad9217b0b98ac653e7d05495fdd039d647d4f7299621.pdf'),
(19, 10, 10, 'XXXXXXX', 'XXXXXXX', 'XXXXXXX', 10, 10, '0000-00-00 00:00:00', 50, 50, 'XXXXXXX', 0, 1, 'QATEST.pdf', '/dist/files/1486307575990/216df7ded5cad6b2784b870bd1c7dc5b3ec30956bbb8f99742520880bd72960d.pdf'),
(20, 11, 10, 'CCCC', 'CCCC', 'CCCC', 7, 7, '0000-00-00 00:00:00', 25, 25, 'CCCC', 0, 1, 'QATEST.pdf', '/dist/files/1486307714756/ff7a2fb5c4141b7b8b726ee0668cd72c2f85a58e0abf8bf6f39ef61ea5c081e3.pdf'),
(21, 11, 18, '434322fgrthhs', '434322fgrthhs', '434322fgrthhs', 8, 0, '2017-02-05 19:28:34', 34, 34, '434322fgrthhs', 0, 1, 'QATEST.pdf', '/dist/files/1486307714789/fd2d722c840bfc8ee6df344a6caea974937d78a55fb8fb797203c17b56e0fbe5.pdf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(150) NOT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `deleted`) VALUES
(1, 'indumentaria', 0),
(2, 'Electrónica', 0),
(3, 'Electroblancos', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `bill_id` int(100) NOT NULL,
  `category_id` int(100) NOT NULL,
  `name` varchar(150) NOT NULL,
  `price` float NOT NULL,
  `quantity` int(100) NOT NULL,
  `remaining_quantity` int(11) DEFAULT NULL,
  `totalprice` float NOT NULL,
  `totalweight` float NOT NULL,
  `weight` float NOT NULL,
  `real_weight` float NOT NULL,
  `userId` int(11) NOT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`product_id`, `bill_id`, `category_id`, `name`, `price`, `quantity`, `remaining_quantity`, `totalprice`, `totalweight`, `weight`, `real_weight`, `userId`, `deleted`) VALUES
(1, 1, 1, 'AAAAAAAA', 3, 3, 3, 9, 9, 3, 3, 1, 0),
(2, 2, 2, 'BBBBBBB', 3, 3, 3, 9, 9, 3, 3, 1, 0),
(3, 3, 2, 'CCCCCC', 3, 3, 3, 9, 3, 1, 1, 1, 0),
(4, 3, 3, 'CCCCCC', 4, 4, 4, 16, 16, 4, 4, 1, 0),
(5, 4, 2, 'DDDDD', 4, 4, 4, 16, 16, 4, 4, 1, 0),
(6, 0, 1, 'FFFFFF', 4, 4, 4, 16, 16, 4, 4, 1, 0),
(7, 0, 3, 'GGGGG', 5, 5, 5, 25, 25, 5, 5, 1, 0),
(8, 0, 2, 'RRRRRRRR', 12, 12, 12, 144, 144, 12, 12, 1, 0),
(9, 0, 2, 'QW', 1, 3, 3, 3, 0, 0, 0, 1, 0),
(10, 0, 3, 'QW', 2, 3, 3, 6, 6, 2, 2, 1, 0),
(11, 0, 2, 'BBBBBBB', 5, 5, 5, 25, 25, 5, 5, 1, 0),
(12, 9, 2, 'UUUUUU', 5, 55, 55, 275, 275, 5, 5, 1, 0),
(13, 9, 3, 'UUUUUU', 6, 6, 6, 36, 36, 6, 6, 1, 0),
(14, 10, 2, 'UYYYYY', 6, 6, 6, 36, 36, 6, 6, 1, 0),
(15, 11, 2, 'XXXXXXXXX', 5, 55, 55, 275, 275, 5, 5, 1, 0),
(16, 11, 2, 'XXXXXXXXXq', 3, 3, 3, 9, 9, 3, 3, 1, 0),
(17, 12, 2, 'HHHHHHH', 4, 4, 4, 16, 16, 4, 4, 1, 0),
(18, 13, 2, 'JJJJJJJJJJJ', 55, 55, 55, 3025, 275, 5, 5, 1, 0),
(19, 14, 2, 'DDDDDD', 2, 3, 3, 6, 6, 2, 2, 1, 0),
(20, 15, 1, 'asadads', 4, 4, 0, 16, 16, 4, 4, 1, 0),
(21, 16, 1, 'RRRRRRR', 5, 5, 5, 25, 25, 5, 5, 1, 0),
(22, 16, 3, 'QQQQQQQ', 1, 1, 1, 1, 1, 1, 1, 1, 0),
(23, 17, 2, 'HHHHHH', 6, 6, 6, 36, 36, 6, 6, 1, 0),
(24, 17, 3, 'HHHHHH', 2, 2, 2, 4, 4, 2, 2, 1, 0),
(25, 18, 1, 'ERAQWE', 4, 4, 4, 16, 16, 4, 4, 1, 0),
(26, 18, 2, 'ERAQWE', 5, 5, 5, 25, 25, 5, 5, 1, 0),
(27, 19, 2, 'XXXXXXX', 5, 5, 5, 25, 25, 5, 5, 1, 0),
(28, 19, 3, 'XXXXXXX', 5, 5, 5, 25, 25, 5, 5, 1, 0),
(29, 20, 1, 'CCCC', 4, 4, 4, 16, 16, 4, 4, 1, 0),
(30, 20, 3, 'FFFF', 3, 3, 3, 9, 9, 3, 3, 1, 0),
(31, 21, 1, '434322fgrthhs', 5, 5, 0, 25, 25, 5, 5, 1, 0),
(32, 21, 3, '434322fgrthhs', 3, 3, 0, 9, 9, 3, 3, 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(65) NOT NULL,
  `lastname` varchar(65) NOT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `company_real_name` varchar(150) DEFAULT NULL,
  `warehouse_name` varchar(150) DEFAULT NULL,
  `tel` varchar(100) NOT NULL,
  `cel` int(15) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` char(32) NOT NULL,
  `sskey` char(32) DEFAULT NULL,
  `codeType` int(1) NOT NULL,
  `idCode` varchar(150) DEFAULT NULL,
  `deleted` int(1) DEFAULT '0',
  `address` varchar(300) NOT NULL,
  `localidad` varchar(100) NOT NULL,
  `postalcode` varchar(10) NOT NULL,
  `registerToken` varchar(255) NOT NULL,
  `registertimestamp` bigint(20) NOT NULL,
  `isAdmin` int(1) NOT NULL DEFAULT '0',
  `isPremium` int(1) DEFAULT '0',
  `client_type` int(1) NOT NULL DEFAULT '0',
  `showTutorial` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `company_name`, `company_real_name`, `warehouse_name`, `tel`, `cel`, `email`, `password`, `sskey`, `codeType`, `idCode`, `deleted`, `address`, `localidad`, `postalcode`, `registerToken`, `registertimestamp`, `isAdmin`, `isPremium`, `client_type`, `showTutorial`) VALUES
(1, 'Nicolas', 'Sigal', NULL, NULL, NULL, '12345', 12345, 'nico@nico.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '00000001', 0, 'tabanera 33853', 'mendozaa', '55000', '0d75211910d3131a7d2472c4c41cead1', 1475968389, 0, 1, 0, 0),
(2, 'Santiago', 'Lloret', NULL, NULL, NULL, '1234', 0, 'santi', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '12345678', 0, 'tabanera 3385', 'mendoza', '5500', '308192ed9a7cf69af0c004179844ace7', 1475968761, 1, 0, 0, 0),
(3, 'Roberto', 'Gomez', NULL, NULL, NULL, '4998877', 153997755, 'dix.inferno@gmail.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 2, '7895761231', 0, 'cadetes chilenos 173', 'mendoza', '5500', 'c417aee12cc67a34d94aabdfd93377b4', 1477164242, 0, 0, 0, 0),
(7, '', '', 'pepe', 'pepe s.a.', NULL, '1231231', 12312312, 'pepe@pepetransf.com.ar', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '12312312312', 0, 'asdds 123123', 'mendoza', '5500', '4574ae68157b6fd29a41000e75343e16', 1480195796, 0, 0, 1, 0),
(8, 'part', 'part', '', '', NULL, '123123', 123123123, 'part@part.com', 'c30cc3ceb47f9c2a6217e6b731d27293', NULL, 2, '123123123123123', 0, 'part 1231', 'part', '5500', 'aa586af0a185a06981497e4a186aff9d', 1480196869, 0, 0, 0, 0),
(9, '', '', 'empr', 'empr', NULL, '123123123', 123123123, 'empr@empr.com.ar', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '123', 0, 'empr 12312', 'empr', '5500', '9e697d04d234dfe09ebf4e796ed6ee5d', 1480197163, 0, 0, 1, 0),
(10, '', '', NULL, NULL, 'warehouseName', '123123', 123123123, 'warehouse', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '271231231239', 0, 'direccion 123', 'localidad', '5500', '', 0, 0, 0, 2, 0),
(11, '', '', '', '', 'warehouse24', '121234', 1231234, 'warehouse2@wh.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '001001', 0, 'warehouse2 123', 'warehouse2', '5500', 'e4089965145a467a30a1ee10549a0697', 1480370689, 0, 0, 2, 0),
(12, '', '', '', '', 'warehouse', '123123', 123123, 'warehouse3@wh.com', '063b4b5e985ac41e8c4de510be40e305', NULL, 1, '003002', 0, 'warehouse3 123', 'warehouse3', '5567', '5aea3132bbcae7ed9d05e8d9611b8701', 1480370757, 0, 0, 2, 0),
(13, '', '', '', '', 'wh4', '123123', 123123, 'wh4@wh4.com', '25bfc0fa206722704da7bd56a78779d7', NULL, 1, '004004', 0, 'wh4 123', 'wh4', '5500', 'f9a37600bf0ffe63763a94ad45f62bf4', 1480370961, 0, 0, 2, 0),
(14, 'asddas', 'asdasd', '', '', '', '23423', 234234, '2342@asdasd.com', '202cb962ac59075b964b07152d234b70', NULL, 1, '234234234', 0, 'asdasd', 'asdasd', 'asdasd', '15b343ac9f6e5e036431602b00fd1531', 1482677259, 0, 0, 0, 0),
(15, 'Johanna', 'Belmonte', '', '', '', '1234567', 0, 'joyb@gmail.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 2, '1234676191201', 0, 'Housssay 1234', 'Mendoza', '5500', '779752f7130cfc752f725962e9c7b59d', 1486299310, 0, 0, 0, 0),
(16, 'test', 'user', '', '', '', '123123', 153010101, 'testuser@t.com', 'd41d8cd98f00b204e9800998ecf8427e', NULL, 1, '01-31023101-97', 0, 'Tb123', 'City', '5101', 'c5baaac5165d489d0b040f9a95ddb3bd', 1486303440, 0, 0, 0, 0),
(17, '', '', 'test', 'company', '', '123123', 123123, 'testcompany@t.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '01-123123-07', 0, 'tb123', 'city', '1234', 'aa82fd04110d86306f718f0fcf32d8d8', 1486303498, 0, 0, 1, 0),
(18, '', '', '', '', 'JoyWh', '1234567', 0, 'joy@warehouse.com', '21232f297a57a5a743894a0e4a801fc3', 'fbb7c006e7aa4f7346739a9d09d5b555', 1, '123456789', 0, 'asd 123', 'asd', '5500', '68051467787f06d30d74dd23d6ba135f', 1486306384, 0, 0, 2, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `parcial_price` float NOT NULL,
  `total` double NOT NULL,
  `total_quantity` int(10) NOT NULL,
  `total_remaining_quantity` int(11) NOT NULL,
  `timestamp` varchar(150) NOT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `venta_state` int(11) NOT NULL DEFAULT '0',
  `totalweight` double DEFAULT NULL,
  `guide_amount` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `uid`, `parcial_price`, `total`, `total_quantity`, `total_remaining_quantity`, `timestamp`, `deleted`, `venta_state`, `totalweight`, `guide_amount`) VALUES
(1, 1, 18, 18, 6, 6, '1486247506906', 0, 0, 18, 0),
(2, 1, 41, 41, 11, 11, '1486247582130', 0, 0, 35, 0),
(3, 1, 185, 185, 21, 21, '1486250908240', 0, 0, 185, 0),
(4, 1, 34, 34, 11, 11, '1486250996129', 0, 0, 31, 0),
(5, 1, 347, 347, 67, 67, '1486251204183', 0, 0, 347, 0),
(6, 1, 300, 300, 62, 62, '1486251374863', 0, 0, 300, 0),
(7, 1, 3031, 3031, 58, 58, '1486251446189', 0, 0, 281, 0),
(8, 1, 16, 16, 4, 0, '1486306432529', 0, 0, 16, 1),
(9, 1, 66, 66, 14, 14, '1486307512457', 0, 0, 66, 0),
(10, 1, 91, 91, 19, 19, '1486307575945', 0, 0, 91, 0),
(11, 1, 59, 59, 15, 0, '1486307714737', 0, 0, 59, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `airway_bill`
--
ALTER TABLE `airway_bill`
  ADD PRIMARY KEY (`airwayId`);

--
-- Indices de la tabla `airway_bill_product`
--
ALTER TABLE `airway_bill_product`
  ADD PRIMARY KEY (`awb_productId`);

--
-- Indices de la tabla `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `airway_bill`
--
ALTER TABLE `airway_bill`
  MODIFY `airwayId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `airway_bill_product`
--
ALTER TABLE `airway_bill_product`
  MODIFY `awb_productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
