const { Client } = require("pg");
const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");

const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_R6iHTMXVc0Qf@ep-dawn-paper-a48dv6ko-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Conectado ao banco Neon");

    const schoolId = "a1b2c3d4-e5f6-7890-1234-567890abcdef";

    const passwordHash = await bcrypt.hash("123456", 10);

    // Remove usuários antigos
    await client.query(
      `DELETE FROM "User" WHERE email IN ($1,$2)`,
      ["professor@teste.com", "admin@teste.com"]
    );

    await Promise.all([
      client.query(
        `INSERT INTO "User"
        (id, name, email, "passwordHash", role, "schoolId", "createdAt", "updatedAt")
        VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())`,
        [
          randomUUID(),
          "Professor Pedro",
          "professor@teste.com",
          passwordHash,
          "teacher",
          schoolId
        ]
      ),

      client.query(
        `INSERT INTO "User"
        (id, name, email, "passwordHash", role, "schoolId", "createdAt", "updatedAt")
        VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())`,
        [
          randomUUID(),
          "Admin Pedro",
          "admin@teste.com",
          passwordHash,
          "admin",
          schoolId
        ]
      )
    ]);

    console.log("🎉 Usuários criados no banco Neon!");

  } catch (error) {
    console.error("❌ ERRO:", error.message);
  } finally {
    await client.end();
  }
}

run();