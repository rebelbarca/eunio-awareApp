CREATE TABLE users
(
	id INT NOT NULL AUTO_INCREMENT,
	user varchar(255) NOT NULL,
    businessType varchar(255) NOT NULL,
	lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE foottraffics
(
	id INT NOT NULL AUTO_INCREMENT,
	road_name varchar(255) NOT NULL,
    count INT(11) NOT NULL,
	wgs84_latitude DOUBLE PRECISION NOT NULL,
    wgs84_longitude DOUBLE PRECISION NOT NULL,
    createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE vehicletraffics
(
	id INT NOT NULL AUTO_INCREMENT,
    suburb varchar(255) NOT NULL,
	road_name varchar(255) NOT NULL,
    period varchar(255) NOT NULL,
    traffic_count INT(11) NOT NULL,
	wgs84_latitude DOUBLE PRECISION NOT NULL,
    wgs84_longitude DOUBLE PRECISION NOT NULL,
    createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	PRIMARY KEY (id)
);
