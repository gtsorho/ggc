module.exports = (sequelize, DataTypes) => {
    const event = sequelize.define('event', {
        subject: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue:false 
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull:false,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull:false,
        },
        recurring: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue:false
        },
    })
    return event
}