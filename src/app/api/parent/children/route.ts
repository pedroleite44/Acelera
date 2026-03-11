import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");

    if (!parentId) {
      return NextResponse.json(
        { error: "parentId é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar filhos do responsável
    const children = await sql`
      SELECT s.id,
             s.name,
             s.rg,
             s.cpf,
             s."classId",
             c.name as "className"
      FROM "Student" s
      JOIN "Classroom" c ON s."classId" = c.id
      WHERE s."parentId" = ${parentId}
      ORDER BY s.name ASC
    `;

    // Buscar diário dos últimos 30 dias para cada filho
    const childrenWithDiary = await Promise.all(
      children.map(async (child: any) => {
        const diary = await sql`
          SELECT d.id,
                 d.date,
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
          WHERE d."studentId" = ${child.id}
          AND d.date >= CURRENT_DATE - INTERVAL '30 days'
          ORDER BY d.date DESC
        `;

        return {
          ...child,
          diary: diary || []
        };
      })
    );

    return NextResponse.json(childrenWithDiary);

  } catch (error: any) {
    console.error("ERRO AO BUSCAR FILHOS:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}