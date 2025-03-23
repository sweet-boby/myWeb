-- CreateTable
CREATE TABLE "Massage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "recevier" TEXT NOT NULL,

    CONSTRAINT "Massage_pkey" PRIMARY KEY ("id")
);
