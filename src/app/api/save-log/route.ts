import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, food, sleep, hygiene, observations } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: "ID do aluno é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar nome do aluno
    const studentResult = await sql`
      SELECT name
      FROM "Student"
      WHERE id = ${studentId}
    `;

    if (studentResult.length === 0) {
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    const studentName = studentResult[0].name;

    // Criar log
    const newId = uuidv4();

    const result = await sql`
      INSERT INTO "DailyLog" (
        id,
        "studentId",
        "studentName",
        food,
        sleep,
        hygiene,
        observations,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${newId},
        ${studentId},
        ${studentName},
        ${food},
        ${sleep},
        ${hygiene},
        ${observations},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    console.log("LOG SALVO COM SUCESSO:", result[0]);

    return NextResponse.json({
      success: true,
      log: result[0],
    });

  } catch (error: any) {
    console.error("ERRO AO SALVAR LOG NO BANCO:", error);

    return NextResponse.json(
      { error: "Erro interno no servidor: " + error.message },
      { status: 500 }
    );
  }
}