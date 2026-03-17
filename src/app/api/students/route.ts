import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";


// ✅ GET - listar alunos
export async function GET() {
  try {
    const result = await sql`
      SELECT id, name, "classId", "parentId", rg, cpf
      FROM "Student"
      ORDER BY name ASC
    `;

    return NextResponse.json(result || []);
  } catch (error: any) {
    console.error("ERRO AO BUSCAR ALUNOS:", error);
    return NextResponse.json([], { status: 200 });
  }
}


// ✅ POST - criar aluno
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, classId, rg, cpf, parentId } = body;

    if (!name || !classId) {
      return NextResponse.json(
        { error: "Nome e Turma são obrigatórios" },
        { status: 400 }
      );
    }

    const newId = uuidv4();

    const result = await sql`
      INSERT INTO "Student"
      (id, name, "classId", rg, cpf, "parentId", "createdAt", "updatedAt")
      VALUES (
        ${newId},
        ${name},
        ${classId},
        ${rg || null},
        ${cpf || null},
        ${parentId || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      student: result[0],
    });

  } catch (error: any) {
    console.error("ERRO AO SALVAR ALUNO:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// ✅ DELETE - excluir aluno
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório" },
        { status: 400 }
      );
    }

    // ⚠️ remove dependências primeiro (se existir)
    await sql`
      DELETE FROM "DailyLog"
      WHERE "studentId" = ${id}
    `;

    // remove aluno
    await sql`
      DELETE FROM "Student"
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("ERRO AO EXCLUIR ALUNO:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}