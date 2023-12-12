module.exports = (sequelize, DataTypes) => {
    const income = sequelize.define('income', {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull:false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        merged:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        }  
    })
    return income
}