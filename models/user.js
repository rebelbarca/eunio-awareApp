module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        user: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0,140]
            }
        },
        businessType: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0,140]
            }
        },
        lat: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        lon: {
            type: DataTypes.DOUBLE,
            allowNull: true
        }
    });

    return User;
};
