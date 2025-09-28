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
  topic_id     INT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  author_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  content      TEXT NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','published','archived')),
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);