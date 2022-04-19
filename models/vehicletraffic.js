module.exports = function (sequelize, DataTypes) {
    var VehicleTraffic = sequelize.define("VehicleTraffic", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        suburb: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        road_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        period: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        traffic_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        wgs84_latitude: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        wgs84_longitude: {
            type: DataTypes.DOUBLE,
            allowNull: false
        }
    });

    return VehicleTraffic;
};
