-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    "imageAlt" TEXT
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_JournalEntryToKeyword" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_JournalEntryToKeyword_A_fkey" FOREIGN KEY ("A") REFERENCES "JournalEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_JournalEntryToKeyword_B_fkey" FOREIGN KEY ("B") REFERENCES "Keyword" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_value_key" ON "Keyword"("value");

-- CreateIndex
CREATE UNIQUE INDEX "_JournalEntryToKeyword_AB_unique" ON "_JournalEntryToKeyword"("A", "B");

-- CreateIndex
CREATE INDEX "_JournalEntryToKeyword_B_index" ON "_JournalEntryToKeyword"("B");
