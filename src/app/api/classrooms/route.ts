import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// 🔍 GET
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    let result;

    if (teacherId) {
      result = await sql`
        SELECT *
        FROM "Classroom"
        WHERE "teacherId" = ${teacherId}
        ORDER BY name ASC
      `;
    } else {
      result = await sql`
        SELECT *
        FROM "Classroom"
        ORDER BY name ASC
      `;
    }

    return NextResponse.json(result || []);
  } catch (error: any) {
    console.error("ERRO AO BUSCAR TURMAS:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// ➕ POST
export async function POST(req: Request) {
  try {
    const { name, teacherId, shift, capacity, year } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Nome da turma é obrigatório" },
        { status: 400 }
      );
    }

    const schoolId = "a1b2c3d4-e5f6-7890-1234-567890abcdef";
    const newId = uuidv4();

    const result = await sql`
      INSERT INTO "Classroom"
      (
        id,
        name,
        "schoolId",
        "teacherId",
        shift,
        capacity,
        year,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${newId},
        ${name},
        ${schoolId},
        ${teacherId || null},
        ${shift || null},
        ${capacity || null},
        ${year || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      classroom: result[0],
    });

  } catch (error: any) {
    console.error("ERRO AO CRIAR TURMA:", error);

    return NextResponse.json(
      { error: error.message || "Erro interno" },
      { status: 500 }
    );
  }
}

// ✏️ PUT (EDITAR)
export async function PUT(req: Request) {
  try {
    const { id, name, shift, capacity, year } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE "Classroom"
      SET
        name = ${name},
        shift = ${shift || null},
        capacity = ${capacity || null},
        year = ${year || null},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      classroom: result[0],
    });

  } catch (error: any) {
    console.error("ERRO AO ATUALIZAR TURMA:", error);

    return NextResponse.json(
      { error: error.message || "Erro interno" },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE (🔥 FALTAVA ISSO)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório" },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM "Classroom"
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("ERRO AO DELETAR TURMA:", error);

    return NextResponse.json(
      { error: error.message || "Erro interno" },
      { status: 500 }
    );
  }
}