-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-10-2016 a las 20:52:08
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
  `deleted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`product_id`, `venta_id`, `productType`, `quantity`, `partial_price`, `price`, `partial_weight`, `weight`, `establishment`, `postal`, `tracking_number`, `bill_number`, `deleted`) VALUES
(1, 1, 'asd', 1, 1, 1, 1, 1, 'asd', 'asd', 'asd', 'asd', 0),
(2, 2, 'Zapatilla', 2, 200, 400, 5, 10, 'Nike', 'DHL', 'as9asma9ask', 'gght3330', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(65) NOT NULL,
  `lastname` varchar(65) NOT NULL,
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
  `isAdmin` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `tel`, `cel`, `email`, `password`, `sskey`, `codeType`, `idCode`, `deleted`, `address`, `localidad`, `postalcode`, `registerToken`, `registertimestamp`, `isAdmin`) VALUES
(1, 'Nicolas', 'Sigal', '1234', 0, 'nicolas.sigal@gmail.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 2, '12345678', 0, 'tabanera 3385', 'mendoza', '5500', '0d75211910d3131a7d2472c4c41cead1', 1475968389, 0),
(2, 'Santiago', 'Lloret', '1234', 0, 'santi', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '12345678', 0, 'tabanera 3385', 'mendoza', '5500', '308192ed9a7cf69af0c004179844ace7', 1475968761, 1),
(3, 'Roberto', 'Gomez', '4998877', 153997755, 'dix.inferno@gmail.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 2, '7895761231', 0, 'cadetes chilenos 173', 'mendoz', '5500', 'c417aee12cc67a34d94aabdfd93377b4', 1477164242, 0);

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
(1, 1, 0, 1, 1, 0, 1, 1, 0, '2016-10-22 19:05:17', 0, 'https://forms.todopago.com.ar/formulario/commands?command=formulario&m=2794237fd0b17fcf9a9a970a0524c1d8', 1, '533bd36086cf9d3d4b5bf15b6a9e6645'),
(2, 3, 0, 400, 10, 0, 400, 2, 0, '2016-10-22 19:30:17', 0, 'https://forms.todopago.com.ar/formulario/commands?command=formulario&m=8cde20b0cd3a6d98e5c750662a6e551b', 0, '58e68a0920dc3d29d2855a7d0954f041');

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
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
