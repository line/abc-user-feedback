import { test } from "@playwright/test";

import { createConnection } from "./database-utils";

async function clearDatabase() {
  const connection = await createConnection();
  try {
    await connection.execute(`DELETE FROM tenant WHERE site_name = ?`, [
      "TestTenant",
    ]);
    await connection.execute("ALTER TABLE tenant AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE projects AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE channels AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE fields AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE feedbacks AUTO_INCREMENT = 1");
    await connection.execute(`DELETE FROM users WHERE email = ?`, [
      "user@feedback.com",
    ]);
    await connection.execute("ALTER TABLE users AUTO_INCREMENT = 1");
    await connection.execute("DELETE FROM histories");
    await connection.execute("ALTER TABLE histories AUTO_INCREMENT = 1");
  } finally {
    await connection.end();
  }
}

test("clear database", async () => {
  try {
    await clearDatabase();
    console.log("Clear database succeeds.");
  } catch (e) {
    console.log("Clear database fails.", e);
  }
});
