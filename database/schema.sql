CREATE DATABASE `todo`;
USE `todo`;
CREATE TABLE `todo`.`todo_list` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `completed` tinyint(1) NOT NULL DEFAULT '0'
    PRIMARY KEY (`id`)) ENGINE = InnoDB DEFAULT CHARSET=utf8;