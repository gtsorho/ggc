module.exports = (sequelize, DataTypes) => {
    const setting = sequelize.define('setting', {
        tag: {
          type: DataTypes.STRING,
          allowNull:false,
        },
        datatype: {
          type: DataTypes.STRING,
          allowNull:false,
        },
        value: {
          type: DataTypes.STRING,
          allowNull:false,
        },
      });
    return setting
}