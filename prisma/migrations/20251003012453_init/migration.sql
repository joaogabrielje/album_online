-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "photographerId" TEXT NOT NULL,
    CONSTRAINT "clients_photographerId_fkey" FOREIGN KEY ("photographerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "albums" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "previewCount" INTEGER NOT NULL DEFAULT 5,
    "price" DECIMAL NOT NULL DEFAULT 299.99,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    "photographerId" TEXT NOT NULL,
    CONSTRAINT "albums_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "albums_photographerId_fkey" FOREIGN KEY ("photographerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "cloudinaryId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "format" TEXT NOT NULL,
    "isPreview" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "albumId" TEXT NOT NULL,
    CONSTRAINT "photos_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "albums_code_key" ON "albums"("code");

-- CreateIndex
CREATE UNIQUE INDEX "photos_cloudinaryId_key" ON "photos"("cloudinaryId");
