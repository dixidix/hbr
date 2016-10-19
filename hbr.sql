-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-10-2016 a las 04:20:55
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
(1, 1, 'asdasd', 2, 200, 400, 1, 2, 'asdasdasd', 'asdas', 'dasdasd', '123123123', 0),
(2, 1, 'aaaaaaaa', 3, 500, 1500, 5, 15, 'asdasd', 'asd', 'asd', '123123123', 0),
(3, 2, 'Zapatillas', 2, 250, 500, 5, 10, 'Nike', 'DHL', '99988778', '123123123', 0),
(4, 2, 'Notebook', 1, 1500, 1500, 1.5, 1.5, 'Apple Store', 'DHL', '1112112', '123123123', 0),
(5, 3, 'Manzanas', 12, 5, 60, 0.5, 6, 'Verduleria', 'DHL', '1123123', '123123123', 0),
(6, 3, 'Zanahorias', 12, 12.5, 150, 2, 24, 'Verduleria', 'DHL', '11111', '123123123', 0);

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
(1, 'Nicolas', 'Sigal', '1234', 0, 'nicolas.sigal@gmail.com', '21232f297a57a5a743894a0e4a801fc3', 'b025ba7949e4d25d521d899f0809a3da', 2, '12345678', 0, 'tabanera 3385', 'mendoza', '5500', '0d75211910d3131a7d2472c4c41cead1', 1475968389, 1),
(2, 'Nicolas Emiliano', 'Sigal', '1234', 0, 'nicolas.e.sigal@gmail.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 1, '12345678', 0, 'tabanera 3385', 'mendoza', '5500', '308192ed9a7cf69af0c004179844ace7', 1475968761, 0);

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
(1, 1, 0, 1900, 17, 0, 1900, 5, 0, '2016-10-19 00:34:26', 0, 'https://forms.todopago.com.ar/formulario/commands?command=formulario&m=dac8ac59e8b6f787f8bf66a1dbd74ad2', 1, ''),
(2, 1, 0, 2000, 12, 0, 2000, 3, 0, '2016-10-19 00:43:15', 0, 'https://forms.todopago.com.ar/formulario/commands?command=formulario&m=dac8ac59e8b6f787f8bf66a1dbd74ad2', 1, 'ad106169bea86ab7e7ba91e6adf5723d'),
(3, 1, 0, 210, 30, 0, 210, 24, 0, '2016-10-19 00:34:30', 0, 'https://forms.todopago.com.ar/formulario/commands?command=formulario&m=dac8ac59e8b6f787f8bf66a1dbd74ad2', 0, '');

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
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
