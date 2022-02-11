CREATE TABLE "tasks" (
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR(250) NOT NULL,
	"deadline" DATE
);


INSERT INTO "tasks" ("task", "deadline")
VALUES ('Buy cat food', '2-13-2022'), ('finish weekend challenge', '2-13-2022'), ('call mom', '2-11-2022');