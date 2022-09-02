-- migrate:up
ALTER TABLE users MODIFY column kakao_id BIGINT(20) NOT NULL UNIQUE;

-- migrate:down

