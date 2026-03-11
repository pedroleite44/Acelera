import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    let result;

    if (teacherId) {
      result = await sql`
        SELECT * FROM "Classroom"
        WHERE "teacherId" = ${teacherId}
        ORDER BY name ASC
      `;
    } else {
      result = await sql`
        SELECT * FROM "Classroom"
        ORDER BY name ASC
      `;
    }

    return NextResponse.json(result || []);
  } catch (error: any) {
    console.error("ERRO AO BUSCAR TURMAS:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, teacherId } = await req.json();
    const schoolId = "a1b2c3d4-e5f6-7890-1234-567890abcdef";
    const newId = uuidv4();

    const result = await sql`
      INSERT INTO "Classroom"
      (id, name, "schoolId", "teacherId", "createdAt", "updatedAt")
      VALUES (
        ${newId},
        ${name},
        ${schoolId},
        ${teacherId || null},
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
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}