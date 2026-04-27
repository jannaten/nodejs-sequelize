import express from "express";
import db from "./models";
import usersRouter from "./routes/users";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usersRouter);

async function main(): Promise<void> {
  await db.sequelize.authenticate();
  console.log("Database connected.");

  await db.sequelize.sync({ alter: true });
  console.log("Models synced.");

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
