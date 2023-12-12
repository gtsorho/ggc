module.exports = (sequelize, DataTypes) => {
    const ledger = sequelize.define('ledger', {
        category: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull:false,
        },
        receivable_src: {
            type: DataTypes.TEXT,
            allowNull:true,
        },
        payable_dest: {
            type: DataTypes.TEXT,
            allowNull:true,
        },
        account_no: {
            type: DataTypes.TEXT,
            allowNull:false,
        },
        credit: {
            type: DataTypes.FLOAT,
            allowNull:true,
        },
        debit: {
            type: DataTypes.FLOAT,
            allowNull:true,
        },
        balance: {
            type: DataTypes.FLOAT,
            allowNull:false,
        }
    })
    return ledger
}