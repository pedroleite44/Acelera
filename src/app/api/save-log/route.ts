import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      studentId,
      present,
      meal_status,
      sleep_status,
      behavior,
      diaper_pee,
      diaper_poop,
      observations,
      date,
    } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: "ID do aluno é obrigatório" },
        { status: 400 }
      );
    }

    // 🔥 BUSCA NOME DO ALUNO
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

    // 🔥 EVITA DUPLICAR NO MESMO DIA
    const existing = await sql`
      SELECT id FROM "DailyLog"
      WHERE "studentId" = ${studentId}
      AND DATE("createdAt") = DATE(${date || new Date()})
    `;

    if (existing.length > 0) {
      // UPDATE
      const updated = await sql`
        UPDATE "DailyLog"
        SET
          present = ${present},
          meal_status = ${meal_status},
          sleep_status = ${sleep_status},
          behavior = ${behavior},
          diaper_pee = ${diaper_pee},
          diaper_poop = ${diaper_poop},
          observations = ${observations},
          "updatedAt" = NOW()
        WHERE id = ${existing[0].id}
        RETURNING *
      `;

      return NextResponse.json({ success: true, log: updated[0] });
    }

    // 🔥 CREATE
    const newId = uuidv4();

    const result = await sql`
      INSERT INTO "DailyLog" (
        id,
        "studentId",
        "studentName",
        present,
        meal_status,
        sleep_status,
        behavior,
        diaper_pee,
        diaper_poop,
        observations,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${newId},
        ${studentId},
        ${studentName},
        ${present},
        ${meal_status},
        ${sleep_status},
        ${behavior},
        ${diaper_pee},
        ${diaper_poop},
        ${observations},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    console.log("LOG SALVO:", result[0]);

    return NextResponse.json({ success: true, log: result[0] });

  } catch (error: any) {
    console.error("ERRO AO SALVAR LOG:", error);

    return NextResponse.json(
      { error: "Erro interno: " + error.message },
      { status: 500 }
    );
  }
}