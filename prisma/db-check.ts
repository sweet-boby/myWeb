import { PrismaClient } from '@prisma/client';

async function checkDatabase() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    const count = await prisma.massage.count();
    console.log(`消息表中有 ${count} 条记录`);

    // 添加测试数据
    const testMsg = await prisma.massage.create({
      data: {
        sender: "test_user",
        text: "这是一条测试消息",
        createdAt: new Date()
      }
    });
    console.log('已创建测试消息:', testMsg);
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();