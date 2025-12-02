-- CreateTable
CREATE TABLE "public"."study_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "list_id" INTEGER NOT NULL,
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6),

    CONSTRAINT "study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session_answers" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "flashcard_id" INTEGER NOT NULL,
    "need_revise" BOOLEAN NOT NULL,
    "answer_time" TIMESTAMPTZ(6),

    CONSTRAINT "session_answers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."study_sessions" ADD CONSTRAINT "study_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."study_sessions" ADD CONSTRAINT "study_sessions_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "public"."flashcard_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session_answers" ADD CONSTRAINT "session_answers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."study_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session_answers" ADD CONSTRAINT "session_answers_flashcard_id_fkey" FOREIGN KEY ("flashcard_id") REFERENCES "public"."flashcards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
