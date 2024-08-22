module.exports = (sequelize, DataTypes) => {
    const Adoption = sequelize.define('Adoption', {
      userId: DataTypes.INTEGER,
      animalId: DataTypes.INTEGER
    }, {});
    Adoption.associate = function(models) {
      Adoption.belongsTo(models.User, {foreignKey: 'userId'});
      Adoption.belongsTo(models.Animal, {foreignKey: 'animalId'});
    };
    return Adoption;
  };
  