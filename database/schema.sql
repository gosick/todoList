CREATE DATABASE `todo`;
USE `todo`;
CREATE TABLE `todo`.`todo_list` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)) ENGINE = InnoDB;
