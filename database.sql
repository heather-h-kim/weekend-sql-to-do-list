CREATE TABLE "tasks" (
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR(250) NOT NULL,
	"deadline" DATE,
	"is_completed" BOOLEAN NOT NULL
);


INSERT INTO "tasks" ("task", "deadline", "is_completed")
VALUES ('Buy cat food', '2-13-2022', FALSE), ('finish weekend challenge', '2-13-2022', FALSE), ('call mom', '2-11-2022', TRUE);