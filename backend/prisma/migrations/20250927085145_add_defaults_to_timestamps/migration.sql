-- CreateEnum
CREATE TYPE "public"."enum_questions_question_type" AS ENUM ('multiple_choice', 'short_answer');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "avatar_url" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."authentication" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "provider_id" VARCHAR(255),
    "password_hash" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authentication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_verification_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "id" SERIAL NOT NULL,
    "s3_key" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'temporary',
    "user_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tests" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "time_limit" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."test_sections" (
    "id" SERIAL NOT NULL,
    "test_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_groups" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "title" TEXT,
    "media_url" TEXT,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "media_url" TEXT,
    "question_type" "public"."enum_questions_question_type" NOT NULL,
    "points" DECIMAL(5,2) DEFAULT 1,
    "sort_order" INTEGER NOT NULL,
    "correct_answer" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."answer_options" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN DEFAULT false,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_key" ON "public"."user_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "authentication_provider_provider_id" ON "public"."authentication"("provider", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "authentication_provider_user_id" ON "public"."authentication"("provider", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_user_id_key" ON "public"."email_verification_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_token_key" ON "public"."email_verification_tokens"("token");

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."authentication" ADD CONSTRAINT "authentication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."test_sections" ADD CONSTRAINT "test_sections_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_groups" ADD CONSTRAINT "question_groups_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."test_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."question_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answer_options" ADD CONSTRAINT "answer_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
