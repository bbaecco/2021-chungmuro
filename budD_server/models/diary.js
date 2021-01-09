module.exports = (sequelize, DataTypes) => {
  return sequelize.define('diary', {
    no: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    diary_type:{
      type: DataTypes.STRING(16),
      allowNull: false
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    content_filePath: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    write_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('now()'),
    },
  },{
    timestamps: false,
  });
}