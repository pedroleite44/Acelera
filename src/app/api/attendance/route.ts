import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      classId,
      studentId,
      present,
      observations,
      date,
      sleep_status,
      meal_status,
      bath,
      behavior,
      evacuation,
      diaper_pee,
      diaper_poop,
      water_amount,
      activity_name,
    } = body;

    if (!classId || !studentId) {
      return NextResponse.json(
        { error: "classId e studentId são obrigatórios" },
        { status: 400 }
      );
    }

    const logDate = date || new Date().toISOString();

    const existing = await sql`
      SELECT id
      FROM "DailyLog"
      WHERE "studentId" = ${studentId}
        AND "classId" = ${classId}
        AND DATE(date) = DATE(${logDate})
    `;

    if (existing.length > 0) {
      const updated = await sql`
        UPDATE "DailyLog"
        SET
          present = ${present ?? true},
          sleep_status = ${sleep_status || null},
          meal_status = ${meal_status || null},
          bath = ${bath ?? false},
          behavior = ${behavior || null},
          evacuation = ${evacuation || null},
          diaper_pee = ${diaper_pee ?? false},
          diaper_poop = ${diaper_poop ?? false},
          water_amount = ${water_amount || null},
          activity_name = ${activity_name || null},
          observations = ${observations || null},
          "updatedAt" = NOW()
        WHERE "studentId" = ${studentId}
          AND "classId" = ${classId}
          AND DATE(date) = DATE(${logDate})
        RETURNING *
      `;

      return NextResponse.json({
        success: true,
        dailyLog: updated[0],
      });
    }

    const newId = uuidv4();

    const created = await sql`
      INSERT INTO "DailyLog" (
        id,
        "classId",
        "studentId",
        date,
        present,
        sleep_status,
        meal_status,
        bath,
        behavior,
        evacuation,
        diaper_pee,
        diaper_poop,
        water_amount,
        activity_name,
        observations,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${newId},
        ${classId},
        ${studentId},
        ${logDate},
        ${present ?? true},
        ${sleep_status || null},
        ${meal_status || null},
        ${bath ?? false},
        ${behavior || null},
        ${evacuation || null},
        ${diaper_pee ?? false},
        ${diaper_poop ?? false},
        ${water_amount || null},
        ${activity_name || null},
        ${observations || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      dailyLog: created[0],
    });
  } catch (error: any) {
    console.error("ERRO AO REGISTRAR DIÁRIO:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const date = searchParams.get("date") || new Date().toISOString();

    if (!classId) {
      return NextResponse.json(
        { error: "classId é obrigatório" },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT
        d.id,
        d."studentId",
        s.name,
        d.present,
        d.sleep_status,
        d.meal_status,
        d.bath,
        d.behavior,
        d.evacuation,
        d.diaper_pee,
        d.diaper_poop,
        d.water_amount,
        d.activity_name,
        d.observations
      FROM "DailyLog" d
      JOIN "Student" s ON d."studentId" = s.id
      WHERE d."classId" = ${classId}
        AND DATE(d.date) = DATE(${date})
      ORDER BY s.name ASC
    `;

    return NextResponse.json(result || []);
  } catch (error: any) {
    console.error("ERRO AO BUSCAR DIÁRIO:", error);
    return NextResponse.json([], { status: 200 });
  }
}