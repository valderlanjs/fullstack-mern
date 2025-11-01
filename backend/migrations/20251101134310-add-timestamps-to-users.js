export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Users", "createdAt", {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  });

  await queryInterface.addColumn("Users", "updatedAt", {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Users", "createdAt");
  await queryInterface.removeColumn("Users", "updatedAt");
}
