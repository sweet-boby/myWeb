-- CreateTable
CREATE TABLE "ChatWithAI" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ChatWithAI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatWithAIMessage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "ChatWithAIMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postgres_log" (
    "log_time" TIMESTAMPTZ(3),
    "user_name" TEXT,
    "database_name" TEXT,
    "process_id" INTEGER,
    "connection_from" TEXT,
    "session_id" TEXT NOT NULL,
    "session_line_num" BIGINT NOT NULL,
    "command_tag" TEXT,
    "session_start_time" TIMESTAMPTZ(6),
    "virtual_transaction_id" TEXT,
    "transaction_id" BIGINT,
    "error_severity" TEXT,
    "sql_state_code" TEXT,
    "message" TEXT,
    "detail" TEXT,
    "hint" TEXT,
    "internal_query" TEXT,
    "internal_query_pos" INTEGER,
    "context" TEXT,
    "query" TEXT,
    "query_pos" INTEGER,
    "location" TEXT,
    "application_name" TEXT,
    "backend_type" TEXT,
    "leader_pid" INTEGER,
    "query_id" BIGINT
);

-- AddForeignKey
ALTER TABLE "ChatWithAI" ADD CONSTRAINT "ChatWithAI_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatWithAIMessage" ADD CONSTRAINT "ChatWithAIMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatWithAI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
