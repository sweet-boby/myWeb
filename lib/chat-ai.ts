import { prisma } from './prisma';
// import { generateId } from 'ai'
import { nanoid } from 'nanoid';
// ===== ChatWithAI 相关操作 =====

// 创建新的聊天ss
export async function createChat(userId: number, title: string) {
  const chatId = nanoid()
  return prisma.chatWithAI.create({
    data: {
      userId,
      chatId: chatId,
      title,
    },
  });
}

// 获取用户的所有聊天
export async function getUserChats(userId: number) {
  return prisma.chatWithAI.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// 获取单个聊天及其消息
export async function getChatWithMessages(chatId: string) {
  return prisma.chatWithAI.findUnique({
    where: {
      chatId: chatId,
    },
    include: {
      ChatWithAIMessage: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
}

// 更新聊天标题
export async function updateChatTitle(chatId: string, title: string) {
  return prisma.chatWithAI.update({
    where: {
      chatId: chatId,
    },
    data: {
      title,
    },
  });
}

// 删除聊天（同时会删除关联的消息）
export async function deleteChat(chatId: string) {
  // 先删除关联的消息
  await prisma.chatWithAIMessage.deleteMany({
    where: {
      chatId,
    },
  });

  // 再删除聊天
  return prisma.chatWithAI.delete({
    where: {
      chatId: chatId,
    },
  });
}

// ===== ChatWithAIMessage 相关操作 =====

// 创建新消息
export async function createMessage(chatId: string, role: string, content: string) {
  return prisma.chatWithAIMessage.create({
    data: {
      chatId,
      role,
      content,
    },
  });
}

// 获取聊天的所有消息
export async function getChatMessages(chatId: string) {
  return prisma.chatWithAIMessage.findMany({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

// 更新消息内容
export async function updateMessage(messageId: number, content: string) {
  return prisma.chatWithAIMessage.update({
    where: {
      id: messageId,
    },
    data: {
      content,
    },
  });
}

// 删除单条消息
export async function deleteMessage(messageId: number) {
  return prisma.chatWithAIMessage.delete({
    where: {
      id: messageId,
    },
  });
}

// 删除聊天的所有消息
export async function deleteAllChatMessages(chatId: string) {
  return prisma.chatWithAIMessage.deleteMany({
    where: {
      chatId,
    },
  });
}

// 批量创建消息（用于导入对话）
export async function createManyMessages(messages: { chatId: string; role: string; content: string }[]) {
  return prisma.chatWithAIMessage.createMany({
    data: messages,
  });
}