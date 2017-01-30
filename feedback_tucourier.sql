-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-01-2017 a las 15:40:08
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

INSERT INTO `airway_bill` (`airwayId`, `ventaId`, `number`, `quantity`, `weight`, `price`, `deleted`, `state`, `warehouse_enter`, `warehouse_aditional_weight`, `warehouse_aditional_charges`, `warehouse_total`, `shipment_international`, `shipment_total`, `arrivalDate`, `leaveDate`, `paymentGatewayUrl`, `paymentButton`, `token`, `successUrl`, `billing_total`, `hbr_postal_provider`, `hbr_tracking`, `paymentMethod`, `transfer_account_number`, `transfer_account_holder_name`, `transfer_bank_name`, `transfer_bank_address`, `paymentDesc`) VALUES
(1, 1, 1, 35, 350, 350, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(2, 1, 1, 30, 300, 4500, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(3, 1, 2, 35, 525, 525, 1, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 1, 2, 5, 50, 750, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(5, 1, 1, 15, 225, 225, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(6, 1, 1, 35, 350, 350, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(7, 1, 2, 15, 150, 850, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(8, 1, 3, 9, 90, 790, 1, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 1, 2, 50, 750, 750, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(10, 1, 3, 15, 150, 2250, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(11, 1, 2, 10, 100, 1500, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(12, 1, 2, 50, 500, 500, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(13, 1, 5, 13, 130, 130, 1, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 1, 1, 10, 100, 100, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(15, 1, 3, 20, 200, 3000, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(16, 1, 2, 13, 130, 130, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(17, 1, 1, 20, 200, 3000, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(18, 1, 2, 15, 150, 2250, 1, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 1, 2, 30, 450, 450, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(20, 1, 1, 50, 500, 500, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(21, 1, 4, 20, 300, 300, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(22, 1, 2, 25, 250, 250, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(23, 1, 1, 65, 775, 4275, 0, 2, 25, 25, 25, 75, 25, 19375, '1487732400', NULL, '', NULL, '', '', 19450, 'DHL', '112HASG-112HASG-112HASG', 2, '12345671-12345671-12345671-12345671', 'Santiago Lloret', 'Banco Rio', 'Av. Corrientes 123 Capital Federal sucursal 3', 'Esta todo ok, en cuanto comprobemos el pago enviamos la información de tracking'),
(24, 1, 2, 10, 100, 1500, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(25, 1, 2, 35, 525, 525, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(26, 1, 4, 15, 225, 225, 1, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 1, 3, 68, 680, 680, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(28, 1, 2, 78, 780, 2180, 0, 2, 25, 25, 25, 75, 25, 19500, '1485831600', '1485831600', '', '<meta charset=\\"utf-8\\">\\r\\n<link href=\\"https://portal.todopago.com.ar/app/css/boton.css\\" rel=\\"stylesheet\\">\\r\\n<div class=\\"boton-todopago-css\\">\\r\\n  <a href=''https://forms.todopago.com.ar/formulario/commands?command=formulario&m=ab5dccd549ac52973c529671505f12f4#utm_source=134722&utm_medium=boton_de_pago&utm_campaign=web''>\\r\\n    <div class=\\"col-md-4 col-sm-4 col-xs-12 tipo-boton-class boton_solo\\" id=\\"htmlBoton\\" style=\\"display: block;\\"> <input type=\\"button\\" id=\\"vistaPreviaBoton\\" class=\\"btn aviso-boton-texto disabled\\" value=\\"Pagar\\" style=\\"border: 1px solid;\\"> </div>\\r\\n  </a>\\r\\n</div>', '', 'http://tucourier.com.ar/hbr-selfie/dashboard/shopping/checkout/success/10c4933a71e44fddcf2a1f3b29dfe7bb', 19575, 'DHL', '123123-123123-123123', 2, '', '', '', '', ''),
(29, 1, 3, 15, 150, 150, 1, 0, 0, 0, 0, 0, 0, 0, '', NULL, '', NULL, '', '', 0, '', '', NULL, NULL, NULL, NULL, NULL, NULL),
(30, 1, 3, 65, 775, 775, 0, 2, 25, 25, 25, 75, 25, 19375, '1485831600', '1485831600', '', '<meta charset=\\"utf-8\\">\\r\\n<link href=\\"https://portal.todopago.com.ar/app/css/boton.css\\" rel=\\"stylesheet\\">\\r\\n<div class=\\"boton-todopago-css\\">\\r\\n  <a href=''https://forms.todopago.com.ar/formulario/commands?command=formulario&m=ab5dccd549ac52973c529671505f12f4#utm_source=134722&utm_medium=boton_de_pago&utm_campaign=web''>\\r\\n    <div class=\\"col-md-4 col-sm-4 col-xs-12 tipo-boton-class boton_solo\\" id=\\"htmlBoton\\" style=\\"display: block;\\"> <input type=\\"button\\" id=\\"vistaPreviaBoton\\" class=\\"btn aviso-boton-texto disabled\\" value=\\"Pagar\\" style=\\"border: 1px solid;\\"> </div>\\r\\n  </a>\\r\\n</div>', '', 'http://tucourier.com.ar/hbr-selfie/dashboard/shopping/checkout/success/e9e981e7a0b514ca60c2217bdfa175a8', 19450, 'DHL', 'AHFA1231-TAJSOA1-1553123-ASXTG', 1, '', '', '', '', ''),
(31, 2, 1, 3, 3.8, 4197, 0, 3, 15, 15, 15, 45, 150, 570, '1487818800', '1487818800', NULL, '<meta charset=\\"utf-8\\">\\r\\n<link href=\\"https://portal.todopago.com.ar/app/css/boton.css\\" rel=\\"stylesheet\\">\\r\\n<div class=\\"boton-todopago-css\\">\\r\\n  <a href=''https://forms.todopago.com.ar/formulario/commands?command=formulario&m=bd2c491bbb0fdc1fd490ed4ee15f49c7#utm_source=134722&utm_medium=boton_de_pago&utm_campaign=web''>\\r\\n    <div class=\\"col-md-4 col-sm-4 col-xs-12 tipo-boton-class boton_solo\\" id=\\"htmlBoton\\" style=\\"display: block;\\">\\r\\n      <input type=\\"button\\" id=\\"vistaPreviaBoton\\" class=\\"btn aviso-boton-texto disabled\\" value=\\"Pagar\\" style=\\"border: 1px solid;\\">\\r\\n    </div>\\r\\n  </a>\\r\\n</div>', '', 'http://tucourier.com.ar/hbr-selfie/dashboard/shopping/checkout/success/a9928c9150d6300126c6449092b103b2', 615, 'DHL', 'HBR-126664-ABGT-112', 1, '', '', '', '', ''),
(32, 2, 2, 5, 7.3, 4058, 0, 3, 45, 23, 65, 133, 15, 109.5, '1487818800', '1485831600', NULL, '<meta charset=\\"utf-8\\">\\r\\n<link href=\\"https://portal.todopago.com.ar/app/css/boton.css\\" rel=\\"stylesheet\\">\\r\\n<div class=\\"boton-todopago-css\\">\\r\\n  <a href=''https://forms.todopago.com.ar/formulario/commands?command=formulario&m=bd2c491bbb0fdc1fd490ed4ee15f49c7#utm_source=134722&utm_medium=boton_de_pago&utm_campaign=web''>\\r\\n    <div class=\\"col-md-4 col-sm-4 col-xs-12 tipo-boton-class boton_solo\\" id=\\"htmlBoton\\" style=\\"display: block;\\">\\r\\n      <input type=\\"button\\" id=\\"vistaPreviaBoton\\" class=\\"btn aviso-boton-texto disabled\\" value=\\"Pagar\\" style=\\"border: 1px solid;\\">\\r\\n    </div>\\r\\n  </a>\\r\\n</div>', '', 'http://tucourier.com.ar/hbr-selfie/dashboard/shopping/checkout/success/2ea6fc1b49ee3e74c4a145e713e801f4', 242.5, 'DHL', 'HBR-123-123123-123123', 1, '', '', '', '', ''),
(33, 2, 3, 3, 3.6, 2540, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
(1, 3, 1, 3, 'dddddddd', 10, 35, 980, 10, 980, 1, 1),
(2, 1, 2, 2, 'bbbbbbbbbbbbbbb', 150, 30, 5250, 10, 350, 1, 1),
(3, 2, 3, 1, 'aaaaaaaa', 15, 35, 750, 15, 750, 1, 1),
(4, 1, 4, 2, 'bbbbbbbbbbbbbbb', 150, 5, 5250, 10, 350, 1, 1),
(5, 2, 5, 1, 'aaaaaaaa', 15, 15, 750, 15, 750, 1, 1),
(6, 3, 6, 3, 'dddddddd', 10, 35, 980, 10, 980, 1, 1),
(7, 4, 7, 1, 'ccccccccc', 10, 10, 250, 10, 250, 1, 1),
(8, 1, 7, 2, 'bbbbbbbbbbbbbbb', 150, 5, 5250, 10, 350, 1, 1),
(9, 4, 8, 1, 'ccccccccc', 10, 4, 250, 10, 250, 1, 1),
(10, 1, 8, 2, 'bbbbbbbbbbbbbbb', 150, 5, 5250, 10, 350, 1, 1),
(11, 2, 9, 1, 'aaaaaaaa', 15, 50, 750, 15, 750, 1, 1),
(12, 1, 10, 2, 'bbbbbbbbbbbbbbb', 150, 15, 5250, 10, 350, 1, 1),
(13, 1, 11, 2, 'bbbbbbbbbbbbbbb', 150, 10, 5250, 10, 350, 1, 1),
(14, 3, 12, 3, 'dddddddd', 10, 50, 980, 10, 980, 1, 1),
(15, 3, 13, 3, 'dddddddd', 10, 13, 980, 10, 980, 1, 1),
(16, 4, 14, 1, 'ccccccccc', 10, 10, 250, 10, 250, 1, 1),
(17, 1, 15, 2, 'bbbbbbbbbbbbbbb', 150, 20, 5250, 10, 350, 1, 1),
(18, 3, 16, 3, 'dddddddd', 10, 13, 980, 10, 980, 1, 1),
(19, 1, 17, 2, 'bbbbbbbbbbbbbbb', 150, 20, 5250, 10, 350, 1, 1),
(20, 1, 18, 2, 'bbbbbbbbbbbbbbb', 150, 15, 5250, 10, 350, 1, 1),
(21, 2, 19, 1, 'aaaaaaaa', 15, 30, 750, 15, 750, 1, 1),
(22, 3, 20, 3, 'dddddddd', 10, 50, 980, 10, 980, 1, 1),
(23, 2, 21, 1, 'aaaaaaaa', 15, 20, 750, 15, 750, 1, 1),
(24, 4, 22, 1, 'ccccccccc', 10, 25, 250, 10, 250, 1, 1),
(25, 1, 23, 2, 'bbbbbbbbbbbbbbb', 150, 25, 5250, 10, 350, 1, 0),
(26, 1, 24, 2, 'bbbbbbbbbbbbbbb', 150, 10, 5250, 10, 350, 1, 1),
(27, 2, 25, 1, 'aaaaaaaa', 15, 35, 750, 15, 750, 1, 1),
(28, 2, 26, 1, 'aaaaaaaa', 15, 15, 750, 15, 750, 1, 1),
(29, 3, 27, 3, 'dddddddd', 10, 68, 980, 10, 980, 1, 1),
(30, 3, 28, 3, 'dddddddd', 10, 68, 980, 10, 980, 1, 0),
(31, 4, 29, 1, 'ccccccccc', 10, 15, 250, 10, 250, 1, 1),
(32, 4, 30, 1, 'ccccccccc', 10, 10, 250, 10, 250, 1, 0),
(33, 2, 23, 1, 'aaaaaaaa', 15, 25, 750, 15, 750, 1, 0),
(34, 4, 23, 1, 'ccccccccc', 10, 15, 250, 10, 250, 1, 0),
(35, 1, 28, 2, 'bbbbbbbbbbbbbbb', 150, 10, 5250, 10, 350, 1, 0),
(36, 2, 30, 1, 'aaaaaaaa', 15, 25, 750, 15, 750, 1, 0),
(37, 3, 30, 3, 'dddddddd', 10, 30, 980, 10, 980, 1, 0),
(38, 6, 31, 1, 'Zapatillas Nike', 199, 1, 199, 1.6, 1.6, 1, 0),
(39, 5, 31, 2, 'Iphone 6s', 1999, 2, 7996, 1.1, 4.4, 1, 0),
(40, 5, 32, 2, 'Iphone 6s', 1999, 2, 7996, 1.1, 4.4, 1, 0),
(41, 8, 32, 1, 'Jeans Levi''s', 20, 3, 100, 1.2, 3.6, 1, 0),
(42, 8, 33, 1, 'Jeans Levi''s', 20, 2, 100, 1.2, 6, 1, 0),
(43, 7, 33, 2, 'Macbook Pro Retina', 2500, 1, 2500, 1.2, 1.2, 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(100) NOT NULL,
  `ventaId` int(11) NOT NULL,
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

INSERT INTO `bills` (`bill_id`, `ventaId`, `establishment`, `number`, `provider`, `quantity`, `remaining_quantity`, `timestamp`, `totalprice`, `totalweight`, `trackingnumber`, `deleted`, `userId`, `bill_file_name`, `bill_file_path`) VALUES
(1, 1, 'Factura a', 'Factura a', 'Factura a', 85, 0, '2017-01-28 20:11:08', 6000, 1100, 'Factura a', 0, 1, 'QATEST_(1).pdf', '/dist/files/1485623049017/d00ebcc2183f11a20919cc8d5c8cf038c980b3aa97b9b04706b90e3ee7729ea2.pdf'),
(2, 1, 'Factura B', 'Factura B', 'Factura B', 123, 0, '2017-01-28 20:11:08', 1230, 1230, 'Factura B', 0, 1, 'QATEST_(1).pdf', '/dist/files/1485623049017/d00ebcc2183f11a20919cc8d5c8cf038c980b3aa97b9b04706b90e3ee7729ea2.pdf'),
(3, 2, 'Apple Store', '00102311', 'DHL', 5, 0, '2017-01-30 14:12:26', 10496, 5.6, 'ACXCV-123-ASDX', 0, 1, 'TEST.pdf', '/dist/files/1485784757727/d947591f48c419dc4b649a56404487e7389bb7d9033e778d0cf91db7619dd9b8.pdf'),
(4, 2, 'Dafiti', '00002301', 'DHL', 6, 0, '2017-01-30 14:12:26', 299, 7.6, '009911-QQA-1', 0, 1, 'TEST.pdf', '/dist/files/1485784757728/0e16f8e4c13cb8b83103b4d4ce79d134f2c68e7f4168b5eed2d3e631bf1aab58.pdf');

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
(1, 1, 2, 'bbbbbbbbbbbbbbb', 150, 35, 0, 5250, 350, 10, 10, 1, 0),
(2, 1, 1, 'aaaaaaaa', 15, 50, 0, 750, 750, 15, 15, 1, 0),
(3, 2, 3, 'dddddddd', 10, 98, 0, 980, 980, 10, 10, 1, 0),
(4, 2, 1, 'ccccccccc', 10, 25, 0, 250, 250, 10, 10, 1, 0),
(5, 3, 2, 'Iphone 6s', 1999, 4, 0, 7996, 4.4, 1.1, 1.1, 1, 0),
(6, 4, 1, 'Zapatillas Nike', 199, 1, 0, 199, 1.5, 1.5, 1.6, 1, 0),
(7, 3, 2, 'Macbook Pro Retina', 2500, 1, 0, 2500, 1.2, 1.2, 1.2, 1, 0),
(8, 4, 1, 'Jeans Levi''s', 20, 5, 0, 100, 8.5, 1.7, 1.2, 1, 0);

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
  `client_type` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `company_name`, `company_real_name`, `warehouse_name`, `tel`, `cel`, `email`, `password`, `sskey`, `codeType`, `idCode`, `deleted`, `address`, `localidad`, `postalcode`, `registerToken`, `registertimestamp`, `isAdmin`, `isPremium`, `client_type`) VALUES
(1, 'Nicolass', 'Sigal', NULL, NULL, NULL, '12345', 12345, 'nico', '410ec15153a6dff0bed851467309bcbd', NULL, 1, '00000001', 0, 'tabanera 33853', 'mendozaa', '55000', '0d75211910d3131a7d2472c4c41cead1', 1475968389, 0, 1, 0),
(2, 'Santiago', 'Lloret', NULL, NULL, NULL, '1234', 0, 'santi', '21232f297a57a5a743894a0e4a801fc3', '9fe307eb9eda686251d0592e5998aea2', 1, '12345678', 0, 'tabanera 3385', 'mendoza', '5500', '308192ed9a7cf69af0c004179844ace7', 1475968761, 1, 0, 0),
(3, 'Roberto', 'Gomez', NULL, NULL, NULL, '4998877', 153997755, 'dix.inferno@gmail.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 2, '7895761231', 0, 'cadetes chilenos 173', 'mendoza', '5500', 'c417aee12cc67a34d94aabdfd93377b4', 1477164242, 0, 0, 0),
(7, '', '', 'pepe', 'pepe s.a.', NULL, '1231231', 12312312, 'pepe@pepetransf.com.ar', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '12312312312', 0, 'asdds 123123', 'mendoza', '5500', '4574ae68157b6fd29a41000e75343e16', 1480195796, 0, 0, 1),
(8, 'part', 'part', '', '', NULL, '123123', 123123123, 'part@part.com', 'c30cc3ceb47f9c2a6217e6b731d27293', NULL, 2, '123123123123123', 0, 'part 1231', 'part', '5500', 'aa586af0a185a06981497e4a186aff9d', 1480196869, 0, 0, 0),
(9, '', '', 'empr', 'empr', NULL, '123123123', 123123123, 'empr@empr.com.ar', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '123', 0, 'empr 12312', 'empr', '5500', '9e697d04d234dfe09ebf4e796ed6ee5d', 1480197163, 0, 0, 1),
(10, '', '', NULL, NULL, 'warehouseName', '123123', 123123123, 'warehouse', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '271231231239', 0, 'direccion 123', 'localidad', '5500', '', 0, 0, 0, 2),
(11, '', '', '', '', 'warehouse24', '121234', 1231234, 'warehouse2@wh.com', '1fccb567a44880e8665b7cb9d0f97271', NULL, 1, '001001', 0, 'warehouse2 123', 'warehouse2', '5500', 'e4089965145a467a30a1ee10549a0697', 1480370689, 0, 0, 2),
(12, '', '', '', '', 'warehouse', '123123', 123123, 'warehouse3@wh.com', '063b4b5e985ac41e8c4de510be40e305', NULL, 1, '003002', 0, 'warehouse3 123', 'warehouse3', '5567', '5aea3132bbcae7ed9d05e8d9611b8701', 1480370757, 0, 0, 2),
(13, '', '', '', '', 'wh4', '123123', 123123, 'wh4@wh4.com', '25bfc0fa206722704da7bd56a78779d7', NULL, 1, '004004', 0, 'wh4 123', 'wh4', '5500', 'f9a37600bf0ffe63763a94ad45f62bf4', 1480370961, 0, 0, 2),
(14, 'asddas', 'asdasd', '', '', '', '23423', 234234, '2342@asdasd.com', '202cb962ac59075b964b07152d234b70', NULL, 1, '234234234', 0, 'asdasd', 'asdasd', 'asdasd', '15b343ac9f6e5e036431602b00fd1531', 1482677259, 0, 0, 0);

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
(1, 1, 7230, 7230, 208, 0, '1485623049007', 0, 0, 2330, 3),
(2, 1, 10795, 10795, 11, 0, '1485784757664', 0, 0, 13.2, 3);

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
  MODIFY `airwayId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT de la tabla `airway_bill_product`
--
ALTER TABLE `airway_bill_product`
  MODIFY `awb_productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
--
-- AUTO_INCREMENT de la tabla `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
