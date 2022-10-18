-- CreateTable
CREATE TABLE "vouches" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "vouchesRecived" INTEGER NOT NULL DEFAULT 0,
    "vouchesGiven" INTEGER NOT NULL DEFAULT 0
);
