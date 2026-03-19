import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password, rg, cpf, role } = body;

    if (!role) {
      return NextResponse.json(
        { error: "Role é obrigatório" },
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
        ${role}, -- 🔥 AQUI É A CORREÇÃO
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
      { error: error.message },
      { status: 500 }
    );
  }
}