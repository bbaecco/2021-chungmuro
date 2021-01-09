module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    no: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    diary_cnt: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    userid: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    pwd: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    sex: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    interest: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },{
    timestamps: false,
  });
}