
sudo docker pull mysql/mysql-server:latest

sudo docker run -d -p 6603:3306 --network="host" --name mysql-container -e MYSQL_ROOT_PASSWORD=rockstake mysql:5.7

sudo docker run -d --network="host" --name mysql-container -e MYSQL_ROOT_PASSWORD=rockstake mysql:5.7

sudo docker run --name=mysql1 -d mysql/mysql-server

sudo docker run --name=mysql1 -d mysql:5.7

sudo docker start <98ff5169e7bc>
sudo docker exec -it mysql1 mysql -uroot -p
sudo docker exec -it mysql-container mysql -uroot -p

create database wallet;
create table nonce_eth (id int(50) not null auto_increment primary key,nonce int(50));
create table nonce_eth_testnet (id int(50) not null auto_increment primary key,nonce int(50));
create table nonce_atom (id int(50) not null auto_increment primary key,nonce int(50));
create table nonce_atom_testnet (id int(50) not null auto_increment primary key,nonce int(50));
create table nonce_btc (id int(50) not null auto_increment primary key,nonce int(50));
create table nonce_btc_testnet (id int(50) not null auto_increment primary key,nonce int(50));

INSERT INTO nonce_eth (nonce) VALUES(0);
INSERT INTO nonce_eth_testnet (nonce) VALUES(0);
INSERT INTO nonce_atom (nonce) VALUES(0);
INSERT INTO nonce_atom_testnet (nonce) VALUES(0);
INSERT INTO nonce_btc (nonce) VALUES(0);
INSERT INTO nonce_btc_testnet (nonce) VALUES(0);

SELECT * FROM nonce_eth;
SELECT * FROM nonce_eth_testnet;
SELECT * FROM nonce_atom;
SELECT * FROM nonce_atom_testnet;
SELECT * FROM nonce_btc;
SELECT * FROM nonce_btc_testnet;
