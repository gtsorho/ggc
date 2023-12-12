module.exports = (sequelize, DataTypes) => {
    const debt = sequelize.define('debt', {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        creditor: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        paid:{
            type: DataTypes.FLOAT,
            allowNull: true
        },
        balance:{
            type: DataTypes.FLOAT,
            allowNull: true
        },
        due: {
            type: DataTypes.DATE,
            allowNull:false,
        },
        merged:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        }      
    })
    return debt
}