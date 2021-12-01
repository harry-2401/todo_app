CREATE TABLE users (
  ID SERIAL NOT NULL,
  username CHAR(20) NOT NULL,
  password CHAR(200) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(username),
  CONSTRAINT pk_user PRIMARY KEY(ID)
);
ALTER TABLE "users" ADD email varchar(30);

CREATE TABLE posts (
  ID SERIAL NOT NULL,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(150),
  url CHAR(200),
  status CHAR(9) CHECK (status = 'TO LEARN' OR status = 'LEARNING' OR status = 'LEARNED') DEFAULT 'TO LEARN',
  "user" INTEGER NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_posts PRIMARY KEY (ID),
  CONSTRAINT fk_posts_user FOREIGN KEY("user") REFERENCES users(ID)
)