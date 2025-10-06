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