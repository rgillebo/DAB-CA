module.exports = (sequelize, DataTypes) => {
  const Species = sequelize.define('Species', {
    name: DataTypes.STRING
  }, {
    timestamps: false
  });
  Species.associate = function(models) {
    Species.hasMany(models.Animal, {foreignKey: 'speciesId'});
  };
  return Species;
};
