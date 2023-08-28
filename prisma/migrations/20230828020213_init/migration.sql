-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acronym" (
    "id" SERIAL NOT NULL,
    "acronym" TEXT NOT NULL,
    "word" TEXT NOT NULL,

    CONSTRAINT "Acronym_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Acronym_acronym_key" ON "Acronym"("acronym");
