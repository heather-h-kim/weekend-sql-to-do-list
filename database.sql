CREATE TABLE "tasks" (
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR(250) NOT NULL,
	"deadline" DATE,
	"completed_date" DATE,
	"is_completed" BOOLEAN DEFAULT FALSE
);


INSERT INTO "tasks" ("task", "deadline", "completed_date","is_completed")
VALUES ('Buy cat food', '2-13-2022', CURRENT_DATE, FALSE), ('finish weekend challenge', '2-13-2022', CURRENT_DATE, FALSE), ('call mom', '2-11-2022', CURRENT_DATE, FALSE);