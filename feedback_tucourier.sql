-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-01-2017 a las 22:01:20
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
(1, 5, 1, 3, 9.5, 9, 0, 3, NULL, 25, 25, 25, 75, 25, 237.5, '1487646000', '1485831600', NULL, 'null', '', 'null', 312.5, 'DHL', 'HHGFAA-AAASSAAA-1123123000', 2, '123-123-123-123-123', 'Santiago Lloret', 'Banco Rio', 'Av. Corrientes 123 Sucursal 3', 'El pago se realiza por transferencia por acuerdo mutuo'),
(2, 5, 2, 4, 10.2, 12, 0, 3, NULL, 25, 12, 12, 49, 12, 122.4, '1488250800', '1485831600', NULL, '<meta charset=\\"utf-8\\">\\r\\n<link href=\\"https://portal.todopago.com.ar/app/css/boton.css\\" rel=\\"stylesheet\\">\\r\\n<div class=\\"boton-todopago-css\\">\\r\\n  <a href=''https://forms.todopago.com.ar/formulario/commands?command=formulario&m=ced8b3ebbb042f6642b2254c9d6a596f#utm_source=134722&utm_medium=boton_de_pago&utm_campaign=web''>\\r\\n    <div class=\\"col-md-4 col-sm-4 col-xs-12 tipo-boton-class boton_solo\\" id=\\"htmlBoton\\" style=\\"display: block;\\">\\r\\n      <input type=\\"button\\" id=\\"vistaPreviaBoton\\" class=\\"btn aviso-boton-texto disabled\\" value=\\"Pagar\\" style=\\"border: 1px solid;\\">\\r\\n    </div>\\r\\n  </a>\\r\\n</div>', '', 'http://tucourier.com.ar/hbr-selfie/dashboard/shopping/checkout/success/00e6967b4bf3a1d4ba9c9f7f1ab3b85d', 171.4, 'FedEx', 'AGJQO-0989011', 1, '', '', '', '', ''),
(3, 5, 3, 4, 4.8, 16, 0, 3, NULL, 25, 25, 25, 75, 12, 57.6, '1488412800', '1485993600', NULL, 'null', '', 'null', 132.6, 'DHL', 'ASDQWE-ASDQWD-QQW', 3, '', '', '', '', '');

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
(1, 13, 1, 1, 'rrrrrrrr', 1, 1, 1, 1.5, 1.5, 1, 0),
(2, 15, 1, 3, 'ffff', 4, 2, 16, 4, 16, 1, 0),
(3, 15, 2, 3, 'ffff', 4, 2, 16, 4, 16, 1, 0),
(4, 14, 2, 3, 'fffff', 2, 2, 4, 1.1, 2.2, 1, 0),
(5, 16, 3, 1, 'ggggg', 4, 4, 16, 1.2, 4.8, 1, 0);

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
(1, 2, NULL, 'qweqwe', 'qweqwe', 'qweqwe', 23, 23, '0000-00-00 00:00:00', 45, 0, 'qweqwe', 0, 1, 'TEST.pdf', '/dist/files/1485874917785/ae371eebcdc5f86aeee8c4b1911821c652a0cbbb125f75b9584146f67aaf3f17.pdf'),
(2, 2, NULL, 'www', 'wwwwwww', 'wwwwww', 4, 4, '0000-00-00 00:00:00', 8, 8, 'wwww', 0, 1, 'TEST.pdf', '/dist/files/1485874922665/072f8d64d435b7430af0700a6fa40a9b2c445baeed3b3e0d87af133917e1ef7e.pdf'),
(3, 3, NULL, 'zzzzz', 'zzzzzzzzzzz', 'zzzzzzzzzzz', 24, 24, '0000-00-00 00:00:00', 288, 0, 'zzzzzzzzz', 0, 1, 'TEST.pdf', '/dist/files/1485875058193/fbd0deba7fb2f7cb6c36d746c79b13c9a03c4564b930adc1339cd48d03667ae3.pdf'),
(4, 3, NULL, 'xxxxx', 'xxxxxxx', 'xxxxx', 56, 56, '0000-00-00 00:00:00', 1552, 1156, 'xxxx', 0, 1, 'TEST.pdf', '/dist/files/1485875058248/72a547af785695bf5a9bca41c39e5808e02c3ed72be8433d1f347e62a5cc78d4.pdf'),
(5, 4, NULL, 'uuuuuuu', 'uuuuuuuuuuu', 'uuuuuuuuuuuuu', 144, 144, '0000-00-00 00:00:00', 5028, 0, 'uuuuuuu', 0, 1, 'TEST.pdf', '/dist/files/1485875324313/1e623cb538ea6a8318792421bc857a293c4221131da0520787d58b728c951cfb.pdf'),
(6, 4, NULL, 'iiiiiii', 'iiiiiiiii', 'iiiiiiiii', 105, 105, '0000-00-00 00:00:00', 1287, 1287, 'iiiiiii', 0, 1, 'TEST.pdf', '/dist/files/1485875324390/fef25964a48e09b30b5124bfda078f2d1adb50c7f417d6548aa4f195e58c052a.pdf'),
(7, 5, NULL, 'rrrrrrrr', 'rrrrrrrrrrrr', 'rrrrrrrrrrrrr', 3, 0, '2017-01-31 15:11:42', 5, 3.7, 'rrrrrrrrrrrr', 0, 1, 'TEST.pdf', '/dist/files/1485875424024/86c7019d1f2d305b2791b6b6b9191f0324b751c5d2a0187eac3a85111d19321e.pdf'),
(8, 5, NULL, 'ggggggg', 'ggggggggg', 'ggggggggggg', 8, 0, '2017-01-31 15:11:54', 32, 20.8, 'ggggg', 0, 1, 'TEST.pdf', '/dist/files/1485875424077/9dbc695c18e26edadf6aed041f556ad43dd79cbb1fd49db2a289dabacc65e4a1.pdf'),
(9, 7, 10, 'test', 'test', 'test', 6, 6, '0000-00-00 00:00:00', 18, 18, 'test', 0, 1, 'TEST.pdf', '/dist/files/1485896243794/5126df2d2a5639feedc37504defe7e36d93781e5d8740e640289c233c1b7225f.pdf'),
(10, 7, 10, 'test2', 'test2', 'test2', 4, 4, '0000-00-00 00:00:00', 8, 6, 'test2', 0, 1, 'TEST.pdf', '/dist/files/1485896243864/8adff9930857b70173aa118a28f48376ad13b909af84907e7e135a02be727787.pdf');

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
(1, 1, 1, 'qweqwe', 1, 1, 1, 1, 0, 0, 0, 1, 0),
(2, 1, 2, 'asdasd', 2, 22, 22, 44, 0, 0, 0, 1, 0),
(3, 2, 1, 'qqqq', 2, 2, 2, 4, 4, 2, 2, 1, 0),
(4, 2, 3, 'wwwwww', 2, 2, 2, 4, 4, 2, 2, 1, 0),
(5, 3, 1, '21', 12, 12, 12, 144, 0, 0, 0, 1, 0),
(6, 3, 2, 'wwww', 12, 12, 12, 144, 0, 0, 0, 1, 0),
(7, 4, 1, 'xxxx', 12, 12, 12, 144, 144, 12, 12, 1, 0),
(8, 4, 3, 'ttttttt', 32, 44, 44, 1408, 1012, 23, 23, 1, 0),
(9, 5, 1, 'uuuuuu', 67, 67, 67, 4489, 0, 0, 0, 1, 0),
(10, 5, 3, 'iiiiiiiiiiii', 7, 77, 77, 539, 0, 0, 0, 1, 0),
(11, 6, 3, 'iiiiii', 66, 6, 6, 396, 396, 66, 66, 1, 0),
(12, 6, 3, 'oooooo', 9, 99, 99, 891, 891, 9, 9, 1, 0),
(13, 7, 1, 'rrrrrrrr', 1, 1, 0, 1, 0, 0, 1.5, 1, 0),
(14, 7, 3, 'fffff', 2, 2, 0, 4, 0, 0, 1.1, 1, 0),
(15, 8, 3, 'ffff', 4, 4, 0, 16, 16, 4, 4, 1, 0),
(16, 8, 1, 'ggggg', 4, 4, 0, 16, 16, 4, 1.2, 1, 0),
(17, 0, 1, 'Test', 2, 2, 2, 4, 4, 2, 2, 1, 0),
(18, 0, 2, 'Test', 2, 3, 3, 6, 6, 2, 2, 1, 0),
(19, 0, 1, 'Test2', 2, 2, 2, 4, 4, 2, 2, 1, 0),
(20, 0, 3, 'Test2', 3, 3, 3, 9, 9, 3, 3, 1, 0),
(21, 9, 1, 'test', 3, 3, 3, 9, 9, 3, 3, 1, 0),
(22, 9, 2, 'test', 3, 3, 3, 9, 9, 3, 3, 1, 0),
(23, 10, 2, 'test2', 2, 2, 2, 4, 4, 2, 2, 1, 0),
(24, 10, 3, 'test2', 2, 2, 2, 4, 2, 1, 1, 1, 0);

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
(1, 'Nicolass', 'Sigal', NULL, NULL, NULL, '12345', 12345, 'nico', '410ec15153a6dff0bed851467309bcbd', '8c962bdb08d6d093ee5e165bc3f52d0d', 1, '00000001', 0, 'tabanera 33853', 'mendozaa', '55000', '0d75211910d3131a7d2472c4c41cead1', 1475968389, 0, 1, 0),
(2, 'Santiago', 'Lloret', NULL, NULL, NULL, '1234', 0, 'santi', '21232f297a57a5a743894a0e4a801fc3', '0813f96c441ab5ea250cf805ee71e4b3', 1, '12345678', 0, 'tabanera 3385', 'mendoza', '5500', '308192ed9a7cf69af0c004179844ace7', 1475968761, 1, 0, 0),
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
(1, 1, 296, 296, 28, 28, '1485874512568', 0, 0, 148, 0),
(2, 1, 53, 53, 27, 27, '1485874856302', 0, 0, 8, 0),
(3, 1, 1840, 1840, 80, 80, '1485875058141', 0, 0, 1156, 0),
(4, 1, 6315, 6315, 249, 249, '1485875324245', 0, 0, 1287, 0),
(5, 1, 37, 37, 11, 0, '1485875423958', 0, 0, 24.5, 3),
(6, 1, 23, 23, 10, 10, '1485896119410', 0, 0, 23, 0),
(7, 1, 26, 26, 10, 10, '1485896243728', 0, 0, 24, 0);

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
  MODIFY `airwayId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `airway_bill_product`
--
ALTER TABLE `airway_bill_product`
  MODIFY `awb_productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
