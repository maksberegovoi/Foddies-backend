/*
  Warnings:

  - A unique constraint covering the columns `[title,ownerId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recipe_title_ownerId_key" ON "Recipe"("title", "ownerId");
