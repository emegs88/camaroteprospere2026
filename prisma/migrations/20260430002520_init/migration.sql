-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Show" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "artista" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "horario" TEXT NOT NULL,
    "imagem" TEXT,
    "banner" TEXT,
    "descricao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ingresso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'LIVRE',
    "showId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ingresso_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Convidado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "foto" TEXT,
    "tipo" TEXT NOT NULL,
    "redeSocial" TEXT,
    "handle" TEXT,
    "seguidores" INTEGER,
    "nicho" TEXT,
    "statusPost" TEXT DEFAULT 'NAO_POSTOU',
    "linkPost" TEXT,
    "avaliacaoPost" INTEGER,
    "empresa" TEXT,
    "produtoInteresse" TEXT,
    "statusCliente" TEXT,
    "consultor" TEXT,
    "observacoes" TEXT,
    "tokenConvite" TEXT NOT NULL,
    "conviteEnviado" BOOLEAN NOT NULL DEFAULT false,
    "conviteEnviadoEm" DATETIME,
    "ingressoId" TEXT,
    "showId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Convidado_ingressoId_fkey" FOREIGN KEY ("ingressoId") REFERENCES "Ingresso" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Convidado_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Interacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "convidadoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'NOTA',
    "descricao" TEXT NOT NULL,
    "autor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Interacao_convidadoId_fkey" FOREIGN KEY ("convidadoId") REFERENCES "Convidado" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogAcao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "acao" TEXT NOT NULL,
    "detalhes" TEXT,
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LogAcao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ingresso_numero_key" ON "Ingresso"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Convidado_tokenConvite_key" ON "Convidado"("tokenConvite");

-- CreateIndex
CREATE UNIQUE INDEX "Convidado_ingressoId_key" ON "Convidado"("ingressoId");
