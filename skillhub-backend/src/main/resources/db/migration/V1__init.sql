-- Users
CREATE TABLE IF NOT EXISTS users (
    id         BIGSERIAL PRIMARY KEY,
    username   VARCHAR(50)  UNIQUE NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    credits    INTEGER      NOT NULL DEFAULT 100,
    api_key    VARCHAR(64)  UNIQUE,
    role       VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon        VARCHAR(50)
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
    id               BIGSERIAL PRIMARY KEY,
    slug             VARCHAR(150) UNIQUE NOT NULL,
    name             VARCHAR(200) NOT NULL,
    description      TEXT,
    content          TEXT         NOT NULL,
    author_id        BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    category_id      BIGINT       REFERENCES categories(id) ON DELETE SET NULL,
    version          VARCHAR(20)  NOT NULL DEFAULT '1.0.0',
    install_count    INTEGER      NOT NULL DEFAULT 0,
    is_published     BOOLEAN      NOT NULL DEFAULT FALSE,
    compatible_agents TEXT[]      NOT NULL DEFAULT '{}',
    ai_score         NUMERIC(3,2),
    thumbnail_url    TEXT,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Skill ↔ Tag (M:N)
CREATE TABLE IF NOT EXISTS skill_tags (
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    tag_id   BIGINT NOT NULL REFERENCES tags(id)   ON DELETE CASCADE,
    PRIMARY KEY (skill_id, tag_id)
);

-- Collections
CREATE TABLE IF NOT EXISTS collections (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    slug        VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    is_featured BOOLEAN      NOT NULL DEFAULT FALSE,
    author_id   BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Collection ↔ Skill (M:N)
CREATE TABLE IF NOT EXISTS collection_skills (
    collection_id BIGINT  NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    skill_id      BIGINT  NOT NULL REFERENCES skills(id)      ON DELETE CASCADE,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, skill_id)
);

-- User Favorites
CREATE TABLE IF NOT EXISTS user_favorites (
    user_id    BIGINT      NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    skill_id   BIGINT      NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, skill_id)
);

-- Playground Sessions
CREATE TABLE IF NOT EXISTS playground_sessions (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      REFERENCES users(id)  ON DELETE SET NULL,
    skill_id   BIGINT      REFERENCES skills(id) ON DELETE SET NULL,
    messages   JSONB       NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_skills_category   ON skills(category_id);
CREATE INDEX idx_skills_author     ON skills(author_id);
CREATE INDEX idx_skills_published  ON skills(is_published);
CREATE INDEX idx_skills_install    ON skills(install_count DESC);
CREATE INDEX idx_skills_created    ON skills(created_at DESC);
CREATE INDEX idx_skill_tags_tag    ON skill_tags(tag_id);
CREATE INDEX idx_user_fav_user     ON user_favorites(user_id);

-- Seed Categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Development', 'development', 'Code generation, debugging, refactoring', 'code'),
  ('Frontend',    'frontend',    'UI/UX, CSS, React, Angular, Vue',          'layout'),
  ('Backend',     'backend',     'API design, databases, microservices',     'server'),
  ('DevOps',      'devops',      'CI/CD, Docker, Kubernetes, cloud',         'cloud'),
  ('Testing',     'testing',     'Unit tests, E2E, TDD, BDD',                'check-circle'),
  ('AI/ML',       'ai-ml',       'Prompt engineering, model training',       'cpu'),
  ('Security',    'security',    'Auth, vulnerability scanning, compliance', 'shield'),
  ('Writing',     'writing',     'Docs, commit messages, changelogs',        'pen-tool')
ON CONFLICT DO NOTHING;

-- Seed Tags
INSERT INTO tags (name, slug) VALUES
  ('TypeScript', 'typescript'), ('Python', 'python'), ('Java', 'java'),
  ('React', 'react'), ('Angular', 'angular'), ('Vue', 'vue'),
  ('Spring Boot', 'spring-boot'), ('Node.js', 'nodejs'), ('Docker', 'docker'),
  ('TDD', 'tdd'), ('REST API', 'rest-api'), ('GraphQL', 'graphql'),
  ('Claude', 'claude'), ('Cursor', 'cursor'), ('Copilot', 'copilot')
ON CONFLICT DO NOTHING;
