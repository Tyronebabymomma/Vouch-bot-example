/*
  Warnings:

  - The primary key for the `vouches` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vouches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vouchesRecived" INTEGER NOT NULL DEFAULT 0,
    "vouchesGiven" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_vouches" ("id", "vouchesGiven", "vouchesRecived") SELECT "id", "vouchesGiven", "vouchesRecived" FROM "vouches";
DROP TABLE "vouches";
ALTER TABLE "new_vouches" RENAME TO "vouches";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
