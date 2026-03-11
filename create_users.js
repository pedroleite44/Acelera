const { Client } = require("pg");
const bcrypt = require("bcrypt");

const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_R6iHTMXVc0Qf@ep-dawn-paper-a48dv6ko-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    await client.connect();

    const passwordHash = await bcrypt.hash("123456", 10);

    await client.query(
      `INSERT INTO "User"
      (id, name, email, "passwordHash", role, "schoolId", "createdAt", "updatedAt")
      VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
      ON CONFLICT (email) DO NOTHING`,
      [
        require("crypto").randomUUID(),
        "Professor Pedro",
        "professor@teste.com",
        passwordHash,
        "teacher",
        "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      ]
    );

    await client.query(
      `INSERT INTO "User"
      (id, name, email, "passwordHash", role, "schoolId", "createdAt", "updatedAt")
      VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
      ON CONFLICT (email) DO NOTHING`,
      [
        require("crypto").randomUUID(),
        "Admin Pedro",
        "admin@teste.com",
        passwordHash,
        "admin",
        "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      ]
    );

    console.log("✅ Usuários criados no Neon");

  } catch (e) {
    console.log("❌ Erro:", e.message);
  } finally {
    await client.end();
  }
}

run();