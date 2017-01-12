-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-01-2017 a las 03:02:12
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
-- Estructura de tabla para la tabla `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(100) NOT NULL,
  `ventaId` int(11) NOT NULL,
  `establishment` varchar(150) NOT NULL,
  `number` varchar(150) NOT NULL,
  `provider` varchar(150) NOT NULL,
  `quantity` int(10) NOT NULL,
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

INSERT INTO `bills` (`bill_id`, `ventaId`, `establishment`, `number`, `provider`, `quantity`, `timestamp`, `totalprice`, `totalweight`, `trackingnumber`, `deleted`, `userId`, `bill_file_name`, `bill_file_path`) VALUES
(1, 1, 'Apple Store', '00001', 'DHL', 3, '0000-00-00 00:00:00', 4500, 3, '00001', 0, 1, 'QATEST.pdf', '/dist/files/1484186481372/24ffe3042ca59b51afde7af28336f0e3125aff92002298f738eac6bf2fe7b2f6.pdf'),
(2, 1, 'Levi''s', '00002', 'DHL', 3, '0000-00-00 00:00:00', 1500, 3, '00002', 0, 1, 'QATEST.pdf', '/dist/files/1484186481372/24ffe3042ca59b51afde7af28336f0e3125aff92002298f738eac6bf2fe7b2f6.pdf');

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
  `totalprice` float NOT NULL,
  `totalweight` float NOT NULL,
  `weight` float NOT NULL,
  `userId` int(11) NOT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(1, 'Nicolass', 'Sigal', NULL, NULL, NULL, '12345', 12345, 'nico', '410ec15153a6dff0bed851467309bcbd', '7c0ae00819caf5c3e5abde2c25b4843d', 1, '00000001', 0, 'tabanera 33853', 'mendozaa', '55000', '0d75211910d3131a7d2472c4c41cead1', 1475968389, 0, 1, 0),
(2, 'Santiago', 'Lloret', NULL, NULL, NULL, '1234', 0, 'santi', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '12345678', 0, 'tabanera 3385', 'mendoza', '5500', '308192ed9a7cf69af0c004179844ace7', 1475968761, 1, 0, 0),
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
  `peso_total` float DEFAULT NULL,
  `total` double NOT NULL,
  `total_quantity` int(10) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `paymentGatewayUrl` varchar(150) NOT NULL,
  `state` int(11) NOT NULL DEFAULT '0',
  `token` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `uid`, `parcial_price`, `peso_total`, `total`, `total_quantity`, `timestamp`, `deleted`, `paymentGatewayUrl`, `state`, `token`) VALUES
(1, 1, 6000, 6, 6000, 6, '2017-01-12 02:01:21', 0, '', 0, NULL);

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;