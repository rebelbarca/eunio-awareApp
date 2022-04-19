module.exports = function (sequelize, DataTypes) {
    var FootTraffic = sequelize.define("FootTraffic", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
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
        count: {
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

    return FootTraffic;
};
