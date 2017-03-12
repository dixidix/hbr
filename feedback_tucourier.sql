CREATE TABLE IF NOT EXISTS `airway_bill` (
  `airwayId` int(11) NOT NULL AUTO_INCREMENT,
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
  `transfer_cuit` varchar(150) DEFAULT NULL,
  `transfer_cbu` varchar(150) DEFAULT NULL,
  `paymentDesc` text,
  PRIMARY KEY (`airwayId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `airway_bill_product` (
  `awb_productId` int(11) NOT NULL AUTO_INCREMENT,
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
  `deleted` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`awb_productId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `bills` (
  `bill_id` int(100) NOT NULL AUTO_INCREMENT,
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
  `bill_file_path` varchar(150) NOT NULL,
  `bill_state` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`bill_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(150) NOT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
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
  `deleted` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `showTutorial` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `ventas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `parcial_price` float NOT NULL,
  `total` double NOT NULL,
  `total_quantity` int(10) NOT NULL,
  `total_remaining_quantity` int(11) NOT NULL,
  `timestamp` varchar(150) NOT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `venta_state` int(11) NOT NULL DEFAULT '0',
  `totalweight` double DEFAULT NULL,
  `guide_amount` int(11) DEFAULT '0',
  `status` varchar(150) NOT NULL DEFAULT 'En Curso',
  `reason` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;





INSERT INTO `bills` (`bill_id`,`ventaId`,`whId`,`establishment`,`number`,`provider`,`quantity`,`remaining_quantity`,`timestamp`,`totalprice`,`totalweight`,`trackingnumber`,`deleted`,`userId`,`bill_file_name`,`bill_file_path`,`bill_state`) VALUES (1,1,2,'Tst','Tst','Tst',7,7,'0000-00-00 00:00:00',26,26,'Tst',0,3,'QATEST.pdf','/dist/files/1489330077246/414fd1561cc0d4d76b140e0336fdc4b2cae75091dbd3a49b28e88357557e4f9c.pdf',0);
INSERT INTO `bills` (`bill_id`,`ventaId`,`whId`,`establishment`,`number`,`provider`,`quantity`,`remaining_quantity`,`timestamp`,`totalprice`,`totalweight`,`trackingnumber`,`deleted`,`userId`,`bill_file_name`,`bill_file_path`,`bill_state`) VALUES (2,1,2,'Tst2','Tst2','Tst2',6,6,'0000-00-00 00:00:00',20,20,'Tst2',0,3,'QATEST.pdf','/dist/files/1489330077299/5da9969acdb08b53486c02e25db8caad2c7815aa1ab447c6a36b119a7532e835.pdf',0);

INSERT INTO `categories` (`category_id`,`category_name`,`deleted`) VALUES (1,'testCat',0);
INSERT INTO `categories` (`category_id`,`category_name`,`deleted`) VALUES (2,'testCat2',0);

INSERT INTO `products` (`product_id`,`bill_id`,`category_id`,`name`,`price`,`quantity`,`remaining_quantity`,`totalprice`,`totalweight`,`weight`,`real_weight`,`userId`,`deleted`) VALUES (1,1,1,'Tst',3,2,2,6,6,3,3,3,0);
INSERT INTO `products` (`product_id`,`bill_id`,`category_id`,`name`,`price`,`quantity`,`remaining_quantity`,`totalprice`,`totalweight`,`weight`,`real_weight`,`userId`,`deleted`) VALUES (2,1,1,'Tst',4,5,5,20,20,4,4,3,0);
INSERT INTO `products` (`product_id`,`bill_id`,`category_id`,`name`,`price`,`quantity`,`remaining_quantity`,`totalprice`,`totalweight`,`weight`,`real_weight`,`userId`,`deleted`) VALUES (3,2,1,'Tst2',4,4,4,16,16,4,4,3,0);
INSERT INTO `products` (`product_id`,`bill_id`,`category_id`,`name`,`price`,`quantity`,`remaining_quantity`,`totalprice`,`totalweight`,`weight`,`real_weight`,`userId`,`deleted`) VALUES (4,2,1,'Tst2',2,2,2,4,4,2,2,3,0);

INSERT INTO `users` (`id`,`name`,`lastname`,`company_name`,`company_real_name`,`warehouse_name`,`tel`,`cel`,`email`,`password`,`sskey`,`codeType`,`idCode`,`deleted`,`address`,`localidad`,`postalcode`,`registerToken`,`registertimestamp`,`isAdmin`,`isPremium`,`client_type`,`showTutorial`) VALUES (1,'Santiago','LLoret','','','','+54911-123456789',54911,'santiago.lloret@tucourier.com.ar','21232f297a57a5a743894a0e4a801fc3','c354c50216838ebad1ad242c52342b6b',1,'27-8978912378912-7',0,'Av. Corrientes 123','Buenos Aires, Capital Federal','1101','d6f81559201988fde9039bf45bcae1b4',1487257235,1,0,0,0);
INSERT INTO `users` (`id`,`name`,`lastname`,`company_name`,`company_real_name`,`warehouse_name`,`tel`,`cel`,`email`,`password`,`sskey`,`codeType`,`idCode`,`deleted`,`address`,`localidad`,`postalcode`,`registerToken`,`registertimestamp`,`isAdmin`,`isPremium`,`client_type`,`showTutorial`) VALUES (2,'','','','','GL','2613412351',2147483647,'nicolas.sigal@globallogic.com','21232f297a57a5a743894a0e4a801fc3',NULL,1,'231231231231237',0,'Av. Mitre 870','Mendoza','5500','c5ea21426b2675e72f6f9d4323458928',1487257730,0,0,2,0);
INSERT INTO `users` (`id`,`name`,`lastname`,`company_name`,`company_real_name`,`warehouse_name`,`tel`,`cel`,`email`,`password`,`sskey`,`codeType`,`idCode`,`deleted`,`address`,`localidad`,`postalcode`,`registerToken`,`registertimestamp`,`isAdmin`,`isPremium`,`client_type`,`showTutorial`) VALUES (3,'Test','User','','','','123456789',123456789,'nicolas.sigal@gmail.com','098f6bcd4621d373cade4e832627b4f6',NULL,2,'27-12312312321-7',0,'Calle Falsa 123','Mendoza','55500','27bed4482a7803b9426925d6fdecace8',1487257855,0,0,0,1);

INSERT INTO `ventas` (`id`,`uid`,`parcial_price`,`total`,`total_quantity`,`total_remaining_quantity`,`timestamp`,`deleted`,`venta_state`,`totalweight`,`guide_amount`,`status`,`reason`) VALUES (1,3,46,46,13,13,'1489330077195',0,1,46,0,'Finalizado',NULL);