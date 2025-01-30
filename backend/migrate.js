import { sequelize } from "./config/mysql.js";
import { DataTypes } from "sequelize";

async function migrate() {
  try {
    await sequelize.getQueryInterface().addColumn("users", "isAdmin", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    console.log("Coluna 'isAdmin' adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar coluna:", error);
  } finally {
    await sequelize.close();
  }
}

migrate();
