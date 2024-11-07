module.exports = (sequelize, DataTypes) => {
    const record = sequelize.define('record', {
        attendance: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        vips: {
            type: DataTypes.INTEGER,
            allowNull:true,
        },
        income: {
            type: DataTypes.FLOAT,
            allowNull:true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull:true,
        },
    })
    return record
}