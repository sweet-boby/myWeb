-- CreateTable
CREATE TABLE "SharedCanvas" (
    "id" SERIAL NOT NULL,
    "imageData" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedCanvas_pkey" PRIMARY KEY ("id")
);
