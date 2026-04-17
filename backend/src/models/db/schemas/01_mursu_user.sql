DROP DATABASE IF EXISTS sushi_restaurant;
CREATE DATABASE sushi_restaurant;
USE sushi_restaurant;

DROP USER  IF EXISTS 'mursu_user'@'localhost';
CREATE USER 'mursu_user'@'localhost' IDENTIFIED BY 'mursu_password';
GRANT ALL PRIVILEGES ON sushi_restaurant.* TO 'mursu_user'@'localhost';
FLUSH PRIVILEGES;
