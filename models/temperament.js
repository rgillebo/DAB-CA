module.exports = (sequelize, DataTypes) => {
  const Temperament = sequelize.define('Temperament', {
    description: {
      type: DataTypes.STRING,
      unique: true
  }}, {
    timestamps: false
  });
  Temperament.associate = function(models) {
    Temperament.belongsToMany(models.Animal, { through: 'AnimalTemperaments' });
  };
  return Temperament;
};
