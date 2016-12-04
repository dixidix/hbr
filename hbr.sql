-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-12-2016 a las 13:51:12
-- Versión del servidor: 10.1.16-MariaDB
-- Versión de PHP: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hbr`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `product_id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `productType` varchar(80) NOT NULL,
  `quantity` int(10) NOT NULL,
  `partial_price` float NOT NULL,
  `price` float NOT NULL,
  `partial_weight` float NOT NULL,
  `weight` float NOT NULL,
  `establishment` varchar(150) NOT NULL,
  `postal` varchar(150) NOT NULL,
  `tracking_number` varchar(150) NOT NULL,
  `bill_number` varchar(150) NOT NULL,
  `bill_name` varchar(200) NOT NULL,
  `bill_file` varchar(200) NOT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`product_id`, `venta_id`, `productType`, `quantity`, `partial_price`, `price`, `partial_weight`, `weight`, `establishment`, `postal`, `tracking_number`, `bill_number`, `bill_name`, `bill_file`, `deleted`) VALUES
(1, 1, 'zapatilla', 1, 2500, 2500, 5, 5, 'nike', 'DHL', '098098209183109', '00098abc', 'carpeta_brisas.pdf', '/dist/files/1477781129734/bd7a507a399a5d1b4b94a6316b357349267b0d8a69384de77682e3c876ba0ed8.pdf', 0);

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
  `client_type` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `company_name`, `company_real_name`, `warehouse_name`, `tel`, `cel`, `email`, `password`, `sskey`, `codeType`, `idCode`, `deleted`, `address`, `localidad`, `postalcode`, `registerToken`, `registertimestamp`, `isAdmin`, `client_type`) VALUES
(1, 'Nicolas', 'Sigal', NULL, NULL, NULL, '1234', 0, 'nicolas.sigal@gmail.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 2, '12345678', 0, 'tabanera 3385', 'mendoza', '5500', '0d75211910d3131a7d2472c4c41cead1', 1475968389, 0, 0),
(2, 'Santiago', 'Lloret', NULL, NULL, NULL, '1234', 0, 'santi', '21232f297a57a5a743894a0e4a801fc3', '15218b426c2a8dd3b78c229e450ca89c', 1, '12345678', 0, 'tabanera 3385', 'mendoza', '5500', '308192ed9a7cf69af0c004179844ace7', 1475968761, 1, 0),
(3, 'Roberto', 'Gomez', NULL, NULL, NULL, '4998877', 153997755, 'dix.inferno@gmail.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 2, '7895761231', 0, 'cadetes chilenos 173', 'mendoz', '5500', 'c417aee12cc67a34d94aabdfd93377b4', 1477164242, 0, 0),
(7, '', '', 'pepe', 'pepe s.a.', NULL, '1231231', 12312312, 'pepe@pepetransf.com.ar', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '12312312312', 0, 'asdds 123123', 'mendoza', '5500', '4574ae68157b6fd29a41000e75343e16', 1480195796, 0, 1),
(8, 'part', 'part', '', '', NULL, '123123', 123123123, 'part@part.com', 'c30cc3ceb47f9c2a6217e6b731d27293', NULL, 2, '123123123123123', 0, 'part 1231', 'part', '5500', 'aa586af0a185a06981497e4a186aff9d', 1480196869, 0, 0),
(9, '', '', 'empr', 'empr', NULL, '123123123', 123123123, 'empr@empr.com.ar', '1f3a4258f1161b7ef76e61f3a9396243', NULL, 1, '123123123123', 0, 'empr 12312', 'empr', '5500', '9e697d04d234dfe09ebf4e796ed6ee5d', 1480197163, 0, 1),
(10, '', '', NULL, NULL, 'warehouseName', '123123', 123123123, 'warehouse@mail.com', '271231231239', NULL, 1, '271231231239', 0, 'direccion 123', 'localidad', '5500', '', 0, 0, 2),
(11, '', '', '', '', 'warehouse24', '121234', 1231234, 'warehouse2@wh.com', '1fccb567a44880e8665b7cb9d0f97271', NULL, 1, '001001', 0, 'warehouse2 123', 'warehouse2', '5500', 'e4089965145a467a30a1ee10549a0697', 1480370689, 0, 2),
(12, '', '', '', '', 'warehouse', '123123', 123123, 'warehouse3@wh.com', '35e47c8a7e27d512b4cf3b052ffe1960', NULL, 1, '002002', 0, 'warehouse3 123', 'warehouse3', '5567', '5aea3132bbcae7ed9d05e8d9611b8701', 1480370757, 0, 2),
(13, '', '', '', '', 'wh4', '123123', 123123, 'wh4@wh4.com', '25bfc0fa206722704da7bd56a78779d7', NULL, 1, '004004', 1, 'wh4 123', 'wh4', '5500', 'f9a37600bf0ffe63763a94ad45f62bf4', 1480370961, 0, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `peso_excedente` float NOT NULL,
  `parcial_price` float NOT NULL,
  `peso_total` int(10) NOT NULL,
  `tasas` float NOT NULL,
  `total` double NOT NULL,
  `total_quantity` int(10) NOT NULL,
  `transporte` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `paymentGatewayUrl` varchar(150) NOT NULL,
  `state` int(11) NOT NULL DEFAULT '0',
  `token` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `uid`, `peso_excedente`, `parcial_price`, `peso_total`, `tasas`, `total`, `total_quantity`, `transporte`, `timestamp`, `deleted`, `paymentGatewayUrl`, `state`, `token`) VALUES
(1, 3, 0, 2500, 5, 0, 2500, 1, 0, '2016-10-29 22:45:29', 0, '', 0, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
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
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
