module.exports = (sequelize, DataTypes) => {
    const member = sequelize.define('member', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        phone_two: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        location: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        profession: {
            type: DataTypes.STRING,
            allowNull:true,
        }
    })
    return member
}