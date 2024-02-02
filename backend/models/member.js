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
        },
        dob: {
            type: DataTypes.DATE,
            allowNull:true,
        },
        status: {
            type: DataTypes.ENUM('single', 'married', 'child'),
            allowNull:false,
            defaultValue:'single'
        },
        ministry: {
            type: DataTypes.STRING,
            allowNull:false,
            defaultValue:'youth'
        },
        department: {
            type: DataTypes.STRING,
            allowNull:false,
            defaultValue:'N/A'
        },
        cell: {
            type: DataTypes.STRING,
            allowNull:false,
            defaultValue:'N/A'
        },
    })
    return member
}