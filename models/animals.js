module.exports = (sequelize, DataTypes) => {
  const Animal = sequelize.define('Animal', {
    name: DataTypes.STRING,
    speciesId: DataTypes.INTEGER,
    birthday: DataTypes.DATEONLY,
    size: DataTypes.ENUM('small', 'medium', 'large'),
    adopted: DataTypes.BOOLEAN
  }, {
    timestamps: false
  });
  Animal.associate = function(models) {
    Animal.belongsTo(models.Species, {foreignKey: 'speciesId'});
    Animal.belongsToMany(models.Temperament, {through: 'AnimalTemperaments'});
  };
  return Animal;
};
