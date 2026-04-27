import db from './models';

async function main(): Promise<void> {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');

    await db.sequelize.sync({ alter: true });
    console.log('All models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
}

main();
