module.exports = (sequelize, DataTypes) => {
    const ledger_head = sequelize.define('ledger_head', {
        account_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        account_no: {
            type: DataTypes.TEXT,
            allowNull:false,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull:false,
        },
        start_bal: {
            type: DataTypes.FLOAT,
            allowNull:false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        },
   })
    return ledger_head
}