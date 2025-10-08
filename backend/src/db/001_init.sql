-- Core users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT NOW()
);

-- Authentication providers
CREATE TABLE authentication (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,         -- 'local', 'google', 'facebook'
    provider_id VARCHAR(255),              -- external ID for OAuth, NULL for local
    password_hash VARCHAR(255),            -- only for local
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (provider, user_id),            -- each user can have 1 record per provider
    UNIQUE (provider, provider_id)         -- ensures OAuth IDs are unique
);

-- Authorization (roles)
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user', 'admin'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email confirmations
CREATE TABLE email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Flashcards lists
CREATE TABLE flashcard_lists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_title UNIQUE (user_id, title)
);

-- Flashcards
CREATE TABLE flashcards (
    id SERIAL PRIMARY KEY,
    list_id INTEGER NOT NULL REFERENCES flashcard_lists(id) ON DELETE CASCADE,
    term TEXT,
    definition TEXT,
    example TEXT,
    image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
-- TOPICS table
CREATE TABLE topics (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL UNIQUE,
  slug        VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- POSTS table
CREATE TABLE posts (
  id           SERIAL PRIMARY KEY,
  author_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  content      TEXT NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','published','archived')),
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  cover_url    TEXT,                                         -- NEW
  topic_id     INT REFERENCES topics(id) ON DELETE SET NULL  -- NEW
);
-- Media (images, videos, audios)
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    s3_key TEXT NOT NULL,          -- uploads/1758700155421-vite.svg
    file_type TEXT NOT NULL,       -- image/png
    status VARCHAR(20) NOT NULL DEFAULT 'temporary', -- for deleting orphans
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT now()
);

-- Tests
CREATE TABLE tests (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INT, -- in minutes, NULL = no limit
    created_at TIMESTAMP DEFAULT now()
);

-- Test sections
CREATE TABLE test_sections (
    id SERIAL PRIMARY KEY,
    test_id INT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sort_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Question groups
CREATE TABLE question_groups (
    id SERIAL PRIMARY KEY,
    section_id INT NOT NULL REFERENCES test_sections(id) ON DELETE CASCADE,
    title TEXT,
    media_url TEXT, -- e.g. image or audio for the group
    sort_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES question_groups(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    media_url TEXT, -- optional media for individual question
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'short_answer')),
    points NUMERIC(5,2) DEFAULT 1, -- points per question
    sort_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),

    -- for short answer type
    correct_answer TEXT
);

-- Options of a multiple choice question
CREATE TABLE answer_options (
    id SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    sort_order INT NOT NULL
);


