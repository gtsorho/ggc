module.exports = (sequelize, DataTypes) => {
    const tithe = sequelize.define('tithe', {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
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
    return tithe
}