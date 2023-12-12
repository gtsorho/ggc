module.exports = (sequelize, DataTypes) => {
    const expense = sequelize.define('expense', {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull:false,
        },
        merged:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        }             
    })
    return expense
}