import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json(
        { error: 'parentId é obrigatório' },
        { status: 400 }
      );
    }

    // 🔎 Buscar filhos do responsável
    const childrenResult = await pool.query(
      `SELECT s.id, s.name, s.rg, s.cpf,
              s."classId",
              c.name as "className"
       FROM "Student" s
       JOIN "Classroom" c ON s."classId" = c.id
       WHERE s."parentId" = $1
       ORDER BY s.name ASC`,
      [parentId]
    );

    const children = childrenResult.rows;

    // 🔎 Para cada filho buscar diário dos últimos 30 dias
    const childrenWithDiary = await Promise.all(
      children.map(async (child) => {
        const diaryResult = await pool.query(
          `SELECT d.id,
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
           WHERE d."studentId" = $1
           AND d.date >= CURRENT_DATE - INTERVAL '30 days'
           ORDER BY d.date DESC`,
          [child.id]
        );

        return {
          ...child,
          diary: diaryResult.rows || []
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