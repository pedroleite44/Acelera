import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    let result;

    if (role) {
      result = await sql`
        SELECT id, name, email, rg, cpf, role
        FROM "User"
        WHERE role = ${role}
        ORDER BY name ASC
      `;
    } else {
      result = await sql`
        SELECT id, name, email, rg, cpf, role
        FROM "User"
        ORDER BY name ASC
      `;
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("ERRO AO BUSCAR USUÁRIOS:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, rg, cpf, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const schoolId = "a1b2c3d4-e5f6-7890-1234-567890abcdef";
    const newId = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO "User" (
        id,
        name,
        email,
        "passwordHash",
        role,
        "schoolId",
        rg,
        cpf,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${newId},
        ${name},
        ${email},
        ${hashedPassword},
        ${role},
        ${schoolId},
        ${rg || null},
        ${cpf || null},
        NOW(),
        NOW()
      )
      RETURNING id, name, email, role
    `;

    return NextResponse.json({
      success: true,
      user: result[0],
    });

  } catch (error: any) {
    console.error("ERRO AO CRIAR USUÁRIO:", error);

    return NextResponse.json(
      { error: error.message || "Erro interno" },
      { status: 500 }
    );
  }
}