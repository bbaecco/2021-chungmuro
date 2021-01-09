module.exports = (sequelize, DataTypes) => {
  return sequelize.define('diary_front', {
    no: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    opposite_id: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    cover_filePath: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
  },{
    timestamps: false,
  });
}