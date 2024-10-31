-- CreateTable
CREATE TABLE "event_notifications_users" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "event_notifications_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_notifications_users_eventId_key" ON "event_notifications_users"("eventId");
