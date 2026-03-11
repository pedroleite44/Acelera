import { PrismaClient } from '@prisma/client';

// No Prisma 7, para scripts externos, esta é a forma mais segura:
const prisma = new PrismaClient({
  // @ts-ignore - ignoramos o erro de tipagem do VS Code para focar na execução
  datasource: {
    url: "postgresql://postgres:admin123@localhost:5432/acelera_pre_escola_db?schema=public"
  }
});

async function main() {
  console.log('🌱 Iniciando a semente do banco de dados...');
  // ... o restante do código (school, classroom, students) continua igual


  // 1. Criar a Escola
  const school = await prisma.school.upsert({
    where: { id: 'esc-001' },
    update: {},
    create: {
      id: 'esc-001',
      name: 'Escola Acelera Kids',
      subscriptionStatus: 'active',
    },
  });

  // 2. Criar a Turma
  const classroom = await prisma.classroom.upsert({
    where: { id: 'turma-maternal-a' },
    update: {},
    create: {
      id: 'turma-maternal-a',
      name: 'Maternal A',
      schoolId: school.id,
    },
  });

  // 3. Criar os Alunos
  const studentsData = [
    { id: '1', name: 'Ana Silva', classId: classroom.id },
    { id: '2', name: 'Bruno Costa', classId: classroom.id },
    { id: '3', name: 'Clara Oliveira', classId: classroom.id },
    { id: '4', name: 'Davi Santos', classId: classroom.id },
  ];

  for (const student of studentsData) {
    await prisma.student.upsert({
      where: { id: student.id },
      update: {},
      create: student,
    });
  }

  console.log('✅ Dados de teste criados com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
