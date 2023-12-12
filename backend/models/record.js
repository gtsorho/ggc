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
        offering: {
            type: DataTypes.FLOAT,
            allowNull:true,
        },
        tithe: {
            type: DataTypes.FLOAT,
            allowNull:true,
        },
        seed: {
            type: DataTypes.FLOAT,
            allowNull:true,
        },
        welfare: {
            type: DataTypes.FLOAT,
            allowNull:true,
        },
        thanksgiving: {
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