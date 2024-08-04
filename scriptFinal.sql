/* Sources:
- Learned Cascade constraints from all.sql file.
- Youtube video for circular dependency code idea source: https://www.youtube.com/watch?v=WvBSwWofeB4
- Got TO_TIMESTAMP(...) from https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/TO_TIMESTAMP.html 
*/

drop table Recipe cascade constraints;
drop table User1 cascade constraints;
drop table user2 cascade constraints;
drop table NutritionalValue1 cascade constraints;

drop table Makes cascade constraints;
drop table ActivityLogReporting cascade constraints;
drop table AdminApp cascade constraints;
drop table RegularUser cascade constraints;
drop table UserDietaryRestriction cascade constraints;
drop table MealEating cascade constraints;
drop table UserMealLogging cascade constraints;
drop table Creating cascade constraints;

drop table NutritionalValue2 cascade constraints;
drop table Ingredient cascade constraints;
drop table RecipIngr cascade constraints;
drop table ProcessedFood cascade constraints;
drop table ProcMeal cascade constraints;

CREATE TABLE Recipe 
    (recipeID CHAR(8), 
    cookTime INTEGER not null, 
    recipeName VARCHAR(99) not null, 
    steps VARCHAR(999) not null, 
    recipeCalories DECIMAL(7,2) not null, 
    PRIMARY KEY (recipeID));


CREATE TABLE User2
    (userID CHAR(8),
    username VARCHAR(99) NOT NULL,
    age INTEGER,
    gender VARCHAR(50),
    height DECIMAL(3,2),
    weights DECIMAL(5,2),
    PRIMARY KEY (userID));

CREATE TABLE User1
    (height DECIMAL(3,2),
    weights DECIMAL(5,2),
    BMI DECIMAL(4,2),
    PRIMARY KEY (height, weights));

CREATE TABLE NutritionalValue1
    (protein DECIMAL(7,2),
    fat DECIMAL(7,2),
    sodium DECIMAL(7,2),
    carbs DECIMAL(7,2),
    nutrCalories DECIMAL(7,2) NOT NULL,
    PRIMARY KEY (protein, fat, sodium, carbs));

CREATE TABLE Makes 
	(userID CHAR(8), 
	recipeID CHAR(8), 
	PRIMARY KEY (userID, recipeID), 
	FOREIGN KEY (userID) references User2(userID) ON DELETE CASCADE,
	FOREIGN KEY (recipeID) references Recipe(recipeID) ON DELETE CASCADE);

CREATE TABLE ActivityLogReporting
    (timestamped TIMESTAMP,                 /* Changed to timestamp, might work better. -> Also, changed name to timestamped*/
    userID CHAR(8), 
    activityType VARCHAR(50), 
    PRIMARY KEY (timestamped),
    FOREIGN KEY (userID) references User2(userID) ON DELETE CASCADE);

CREATE TABLE UserMealLogging
    (userID CHAR(8), 
    mealID CHAR(8), 
    timestamped TIMESTAMP,                  /* Changed to timestamp, works better cause DATETIME GAVE ERROR. -> Also, changed name to timestamped */
    PRIMARY KEY (userID, mealID),
    FOREIGN KEY (timestamped) references ActivityLogReporting(timestamped) ON DELETE CASCADE);

CREATE TABLE AdminApp                           /* Changed the name since it seems Admin has special meaning */
    (userID CHAR(8), 
    adminLevel VARCHAR(50) NOT NULL, 
    PRIMARY KEY (userID),
    FOREIGN KEY (userID) references User2(userID) ON DELETE CASCADE);

CREATE TABLE RegularUser
    (userID CHAR(8), 
    subscriptionType VARCHAR(50) NOT NULL, 
    PRIMARY KEY (userID),
    FOREIGN KEY (userID) references User2(userID) ON DELETE CASCADE);


CREATE TABLE UserDietaryRestriction
    (dietaryName VARCHAR(50), 
    userID CHAR(8), 
    restrictionType VARCHAR(50),
    descriptions VARCHAR(999), 
    PRIMARY KEY (dietaryName, userID),
    FOREIGN KEY (userID) references User2(userID) ON DELETE CASCADE);


CREATE TABLE MealEating
    (mealID CHAR(8), 
    userID CHAR(8), 
    mealType VARCHAR(50) NOT NULL, 
    PRIMARY KEY (mealID, userID),
    FOREIGN KEY (userID) references User2(userID) ON DELETE CASCADE);


CREATE TABLE Creating
    (recipeID CHAR(8), 
    mealID CHAR(8), 
    userID CHAR(8),                                                        
    PRIMARY KEY (recipeID, mealID),
    FOREIGN KEY (recipeID) references Recipe ON DELETE CASCADE,
	FOREIGN KEY (mealID, userID) references MealEating(mealID, userID) ON DELETE CASCADE);            


/* ===== Unique approach due to foriegn key circular dependencies present it seems. ===== */

CREATE TABLE NutritionalValue2
    (nutrID CHAR(8),               
    ingName VARCHAR(99) UNIQUE,           
    procName VARCHAR(50) UNIQUE,
    brand VARCHAR(50),               /* =============== Removed Unique from this one, cause really it can be same brand i.e. Tim Hortons. ===================== */
    protein DECIMAL(7,2),
    fat DECIMAL(7,2),
    sodium DECIMAL(7,2),
    carbs DECIMAL(7,2),
    PRIMARY KEY (nutrID));

CREATE TABLE Ingredient
    (ingName VARCHAR(99),
    nutrID CHAR(8) NOT NULL UNIQUE,
    ingUnit VARCHAR(99) NOT NULL,
    category VARCHAR(99),
    PRIMARY KEY (ingName));


CREATE TABLE RecipIngr
    (recipeID CHAR(8), 
    ingName VARCHAR(99), 
    PRIMARY KEY (recipeID, ingName));


CREATE TABLE ProcessedFood
    (procName VARCHAR(50),
    brand VARCHAR(50),
    nutrID CHAR(8) NOT NULL UNIQUE,
    userDescript VARCHAR(999), 
    pfUnit VARCHAR(20) NOT NULL,
    PRIMARY KEY (procName, brand));


CREATE TABLE ProcMeal
    (brand VARCHAR(50), 
    procName VARCHAR(50), 
    mealID CHAR(8), 
    userID CHAR(8),                                 /* Had to add userID for the alter table key constraint part then. */
    PRIMARY KEY (brand, procName, mealID));


ALTER TABLE Ingredient ADD CONSTRAINT nutrionalvalue2_ingredient_fk 
FOREIGN KEY (nutrID) REFERENCES NutritionalValue2(nutrID) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE RecipIngr ADD CONSTRAINT recipe_recipeingr_fk 
FOREIGN KEY (recipeID) REFERENCES Recipe(recipeID) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE RecipIngr ADD CONSTRAINT ingredient_recipeingr_fk 
FOREIGN KEY (ingName) REFERENCES Ingredient(ingName) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ProcessedFood ADD CONSTRAINT nutrionalvalue2_prcoessedfood_fk 
FOREIGN KEY (nutrID) REFERENCES NutritionalValue2(nutrID) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ProcMeal ADD CONSTRAINT processedfood_procmeal_fk 
FOREIGN KEY (brand, procName) REFERENCES ProcessedFood(brand, procName) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ProcMeal ADD CONSTRAINT mealeating_procmeal_fk  
FOREIGN KEY (mealID, userID) REFERENCES MealEating(mealID, userID) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE NutritionalValue2 ADD CONSTRAINT ingredient_nutrionalvalue2_fk 
FOREIGN KEY (ingName) REFERENCES Ingredient(ingName) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE NutritionalValue2 ADD CONSTRAINT processedfood_nutrionalvalue2_fk 
FOREIGN KEY (procName, brand) REFERENCES ProcessedFood(procName, brand) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;


/* =========================== Insert Data =========================== */

/* ========================== Recipe ========================== */
INSERT INTO Recipe (recipeID, cookTime, recipeName, steps, recipeCalories)
VALUES ('R0000001', 10, 'Sunny Side Up Omelet', 'Step 1: Omelet \r\n End recipe', 100);

INSERT INTO recipe (recipeID, cookTime, recipeName, steps, recipeCalories)
VALUES ('R0000002', 40, 'Butter Chicken', 'Step 1: Butter chicken \r\n End recipe', 400);

INSERT INTO recipe (recipeID, cookTime, recipeName, steps, recipeCalories)
VALUES ('R0000003', 20, 'Mixed Caesar Salad', 'Step 1: MCS \r\n End recipe', 100);

INSERT INTO recipe (recipeID, cookTime, recipeName, steps, recipeCalories)
VALUES ('R0000004', 60, 'Chicken Stew', 'Step 1: Chicken stew \r\n End recipe', 300);

INSERT INTO recipe (recipeID, cookTime, recipeName, steps, recipeCalories)
VALUES ('R0000005', 25, 'Egg Fried Rice', 'Step 1: Egg fried rice \r\n End recipe', 300);


/* ========================== User 1 ========================== */

INSERT INTO User1 (height, weights, BMI)
VALUES (1.70, 68.0, 23.5);

INSERT INTO User1 (height, weights, BMI)
VALUES (1.80, 75.0, 23.1);

INSERT INTO User1 (height, weights, BMI)
VALUES (1.60, 55.0, 21.5);

INSERT INTO User1 (height, weights, BMI)
VALUES (1.75, 70.0, 22.9);

INSERT INTO User1 (height, weights, BMI)
VALUES (1.65, 62.0, 22.8);

INSERT INTO User1 (height, weights, BMI)
VALUES (1.65, 70.2, 25.8);

INSERT INTO User1 (height, weights, BMI)
VALUES (1.70, 80.1, 27.7);

INSERT INTO User1 (height, weights, BMI)
VALUES (1.49, 35.7, 16.1);

INSERT INTO User1 (height, weights, BMI)
VALUES (2.15, 92.0, 19.9);

INSERT INTO User1 (height, weights, BMI)
VALUES (1.52, 50.1, 21.7);


/* ========================== User 2 ========================== */
INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0000001', 'Grace', 35, 'female', 1.70, 68.0);

INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0000002', 'Henry', 40, 'male', 1.80, 75.0);

INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0000003', 'Isabel', 28, 'female', 1.60, 55.0);

INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0000004', 'Jack', 33, 'male', 1.75, 70.0);

INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0000005', 'Karen', 45, 'female', 1.65, 62.0);

INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0000010', 'Alice', 30, 'female', 1.65, 70.2);

INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0000020', 'Bob', 25, 'male', 1.70, 80.1);

INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0000030', 'Charlie', 19, null, null, null);

INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0000040', 'Dan', 51, 'non-binary', 1.49, 35.7);

INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0000050', 'Erikson', 42, 'male', 2.15, 92.0);

INSERT INTO User2 (userID, username, age, gender, height, weights)
VALUES ('U0109050', 'FeralLion', 60, 'female', 1.52, 50.1);




/* ========================== Nutrional Value 1 ========================== */
INSERT INTO NutritionalValue1 (protein, fat, sodium, carbs, nutrCalories)
VALUES (30.20, 3.60, 0.80, 0.00, 153.0);

INSERT INTO NutritionalValue1 (protein, fat, sodium, carbs, nutrCalories)
VALUES (2.70, 0.30, 0.01, 28.00, 130.0);

INSERT INTO NutritionalValue1 (protein, fat, sodium, carbs, nutrCalories)
VALUES (0.80, 0.20, 0.08, 8.20, 35.0);

INSERT INTO NutritionalValue1 (protein, fat, sodium, carbs, nutrCalories)
VALUES (0.30, 0.00, 6.70, 0.70, 4.0);

INSERT INTO NutritionalValue1 (protein, fat, sodium, carbs, nutrCalories)
VALUES (6.00, 5.00, 0.62, 0.60, 78.0);

INSERT INTO NutritionalValue1 (protein, fat, sodium, carbs, nutrCalories)
VALUES (4.00, 1.50, 0.55, 15.00, 90.0);

INSERT INTO NutritionalValue1 (protein, fat, sodium, carbs, nutrCalories)
VALUES (17.00, 36.00, 0.95, 55.00, 610.0);

INSERT INTO NutritionalValue1 (protein, fat, sodium, carbs, nutrCalories)
VALUES (3.00, 15.00, 0.07, 48.00, 360.0);

INSERT INTO NutritionalValue1 (protein, fat, sodium, carbs, nutrCalories)
VALUES (2.00, 11.00, 0.05, 33.00, 250.0);

INSERT INTO NutritionalValue1 (protein, fat, sodium, carbs, nutrCalories)
VALUES (20.00, 18.00, 1.05, 53.00, 450.0);	


/* ========================== Makes ========================== */
INSERT INTO Makes (userID, recipeID)
VALUES ('U0000010', 'R0000001');

INSERT INTO Makes (userID, recipeID)
VALUES ('U0000020', 'R0000005');

INSERT INTO Makes (userID, recipeID)
VALUES ('U0000030', 'R0000003');

INSERT INTO Makes (userID, recipeID)
VALUES ('U0000040', 'R0000004');

INSERT INTO Makes (userID, recipeID)
VALUES ('U0000050', 'R0000002');


/* ========================== ActivityLogReporting ========================== */                                                      
INSERT INTO activityLogReporting (timestamped, userID, activityType)
VALUES (to_timestamp('2024-07-21 08:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'U0000010', 'Ran 10km');

INSERT INTO activityLogReporting (timestamped, userID, activityType)
VALUES (to_timestamp('2024-07-24 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'U0000020', 'Cycling 5km');

INSERT INTO activityLogReporting (timestamped, userID, activityType)
VALUES (to_timestamp('2024-07-26 15:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'U0000030', 'Swimming 5km');

INSERT INTO activityLogReporting (timestamped, userID, activityType)
VALUES (to_timestamp('2024-07-29 16:45:00', 'YYYY-MM-DD HH24:MI:SS'), 'U0000040', 'Rock Climbing 50m');

INSERT INTO activityLogReporting (timestamped, userID, activityType)
VALUES (to_timestamp('2024-07-30 06:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'U0000050', 'Hiking 3km'); 

                /* -> Needed to add this log info for meal related stuff in order for UserMealLogging to function correctly. */
INSERT INTO activityLogReporting (timestamped, userID, activityType)
VALUES (to_timestamp('2024-07-21 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'U0000010', 'Ate Strawberry Probiotic Yogurt');

INSERT INTO activityLogReporting (timestamped, userID, activityType)
VALUES (to_timestamp('2024-07-23 20:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'U0000020', 'Ate Chicken Pot Pie');

INSERT INTO activityLogReporting (timestamped, userID, activityType)
VALUES (to_timestamp('2024-07-25 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'U0000030', 'Drank Small Iced Capp');

INSERT INTO activityLogReporting (timestamped, userID, activityType)
VALUES (to_timestamp('2024-07-26 11:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'U0000040', 'Ate Strawberry Probiotic Yogurt');

INSERT INTO activityLogReporting (timestamped, userID, activityType)
VALUES (to_timestamp('2024-07-30 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'U0000050', 'Ate Butter Chicken'); 



/* ========================== AdminApp ========================== */
INSERT INTO AdminApp (userID, adminLevel)
VALUES ('U0000001', 'Beta Tester');

INSERT INTO AdminApp (userID, adminLevel)
VALUES ('U0000002', 'Recipe Writer');

INSERT INTO AdminApp (userID, adminLevel)
VALUES ('U0000003', 'Community Moderator');

INSERT INTO AdminApp (userID, adminLevel)
VALUES ('U0000004', 'Security Administrator');

INSERT INTO AdminApp (userID, adminLevel)
VALUES ('U0000005', 'Database Manager');


/* ========================== RegularUser ========================== */
INSERT INTO RegularUser (userID, subscriptionType)
VALUES ('U0000010', 'Free');

INSERT INTO RegularUser (userID, subscriptionType)
VALUES ('U0000020', 'Premium');

INSERT INTO RegularUser (userID, subscriptionType)
VALUES ('U0000030', 'Free');

INSERT INTO RegularUser (userID, subscriptionType)
VALUES ('U0000040', 'Free');

INSERT INTO RegularUser (userID, subscriptionType)
VALUES ('U0000050', 'Premium');

INSERT INTO RegularUser (userID, subscriptionType)
VALUES ('U0109050', 'Premium');

/* ========================== User Dietary Restriction ========================== */
INSERT INTO UserDietaryRestriction (dietaryName, userID, restrictionType, descriptions)
VALUES ('SeafoodDairyAllergy', 'U0000010', 'Seafood, Dairy', 'Cannot eat seafood and cheese');

INSERT INTO UserDietaryRestriction (dietaryName, userID, restrictionType, descriptions)
VALUES ('LacGluIntolerance', 'U0000020', 'Lactose, Gluten', 'Lactose and gluten intolerance');

INSERT INTO UserDietaryRestriction (dietaryName, userID, restrictionType, descriptions)
VALUES ('VegetarianDiet', 'U0000030', 'Vegetarian', 'No meat, fish, or poultry');

INSERT INTO UserDietaryRestriction (dietaryName, userID, restrictionType, descriptions)
VALUES ('LactoOvoVegetarianDiet', 'U0000040', 'Lacto-Ovo Vegetarian', 'Includes dairy and eggs but no meat, fish, or poultry');

INSERT INTO UserDietaryRestriction (dietaryName, userID, restrictionType, descriptions)
VALUES ('KosherDiet', 'U0000050', 'Pork', 'Follows Jewish dietary laws regarding avoiding pork');

/* ========================== Meal Eating ========================== */
INSERT INTO MealEating (mealID, userID, mealType)
VALUES ('M0000001', 'U0000010', 'Breakfast');

INSERT INTO MealEating (mealID, userID, mealType)
VALUES ('M0000002', 'U0000020', 'Lunch');

INSERT INTO MealEating (mealID, userID, mealType)
VALUES ('M0000004', 'U0000030', 'Dinner');

INSERT INTO MealEating (mealID, userID, mealType)
VALUES ('M0000001', 'U0000040', 'Snack');

INSERT INTO MealEating (mealID, userID, mealType)
VALUES ('M0000005', 'U0000050', 'Breakfast'); 


/* ========================== Creating  ========================== */    

    /* ======================================== Should this be userID or mealID? Cause in create table primary is 
                                                        recipeId and mealID but we had userID and info here (until I changed only userID but not actual value */
INSERT INTO Creating (mealID, recipeID)         
VALUES ('U0000010', 'R0000001');

INSERT INTO Creating (mealID, recipeID)
VALUES ('U0000020', 'R0000005');

INSERT INTO Creating (mealID, recipeID)
VALUES ('U0000030', 'R0000003');

INSERT INTO Creating (mealID, recipeID)
VALUES ('U0000040', 'R0000004');

INSERT INTO Creating (mealID, recipeID)
VALUES ('U0000050', 'R0000002'); 


/* ========================== User Meal Logging ========================== */ 
INSERT INTO UserMealLogging (userID, mealID, timestamped)
VALUES ('U0000010', 'M0000001', to_timestamp('2024-07-21 08:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO UserMealLogging (userID, mealID, timestamped)
VALUES ('U0000020', 'M0000002', to_timestamp('2024-07-23 20:30:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO UserMealLogging (userID, mealID, timestamped)
VALUES ('U0000030', 'M0000004', to_timestamp('2024-07-25 16:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO UserMealLogging (userID, mealID, timestamped)
VALUES ('U0000040', 'M0000001', to_timestamp('2024-07-26 11:30:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO UserMealLogging (userID, mealID, timestamped)
VALUES ('U0000050', 'M0000005', to_timestamp('2024-07-30 20:00:00', 'YYYY-MM-DD HH24:MI:SS')); 


/* ========================== Ingredient ========================== */
INSERT INTO Ingredient (ingName, nutrID, ingUnit, category)
VALUES ('chicken', 'N0000001', '100 gram', 'poultry');

INSERT INTO Ingredient (ingName, nutrID, ingUnit, category)
VALUES ('rice', 'N0000002', '100 gram', 'grains');

INSERT INTO Ingredient (ingName, nutrID, ingUnit, category)
VALUES ('carrot', 'N0000003', '100 gram', 'root vegetable');

INSERT INTO Ingredient (ingName, nutrID, ingUnit, category)
VALUES ('lettuce', 'N0000004', '1 leaf', 'leaf vegetable');

INSERT INTO Ingredient (ingName, nutrID, ingUnit, category)
VALUES ('egg', 'N0000005', '1 egg', 'poultry');

/* ========================== RecipIngr ========================== */
INSERT INTO RecipIngr (recipeID, ingName)
VALUES ('R0000001', 'egg');

INSERT INTO RecipIngr (recipeID, ingName)
VALUES ('R0000002', 'rice');

INSERT INTO RecipIngr (recipeID, ingName)
VALUES ('R0000002', 'chicken');

INSERT INTO RecipIngr (recipeID, ingName)
VALUES ('R0000003', 'lettuce');

INSERT INTO RecipIngr (recipeID, ingName)
VALUES ('R0000003', 'carrot');

INSERT INTO RecipIngr (recipeID, ingName)
VALUES ('R0000004', 'chicken');

INSERT INTO RecipIngr (recipeID, ingName)
VALUES ('R0000004', 'carrot');

INSERT INTO RecipIngr (recipeID, ingName)
VALUES ('R0000005', 'rice');

INSERT INTO RecipIngr (recipeID, ingName)
VALUES ('R0000005', 'egg');


/* ========================== Nutrion Value 2 ========================== */
INSERT INTO NutritionalValue2 (nutrID, ingName, procName, brand, protein, fat, sodium, carbs)
VALUES ('N0000001', 'chicken', NULL, NULL, 30.20, 3.60, 0.80, 0.00);

INSERT INTO NutritionalValue2 (nutrID, ingName, procName, brand, protein, fat, sodium, carbs)
VALUES ('N0000002', 'rice', NULL, NULL, 2.70, 0.30, 0.01, 28.00);

INSERT INTO NutritionalValue2 (nutrID, ingName, procName, brand, protein, fat, sodium, carbs)
VALUES ('N0000003', 'carrot', NULL, NULL, 0.80, 0.20, 0.08, 8.20);

INSERT INTO NutritionalValue2 (nutrID, ingName, procName, brand, protein, fat, sodium, carbs)
VALUES ('N0000004', 'lettuce', NULL, NULL, 0.30, 0.00, 6.70, 0.70);

INSERT INTO NutritionalValue2 (nutrID, ingName, procName, brand, protein, fat, sodium, carbs)
VALUES ('N0000005', 'egg', NULL, NULL, 6.00, 5.00, 0.62, 0.60);

INSERT INTO NutritionalValue2 (nutrID, ingName, procName, brand, protein, fat, sodium, carbs)
VALUES ('N0000006', NULL, 'Strawberry Probiotic Yogurt', 'Activia', 4.00, 1.50, 0.55, 15.00);

INSERT INTO NutritionalValue2 (nutrID, ingName, procName, brand, protein, fat, sodium, carbs)
VALUES ('N0000007', NULL, 'Chicken Pot Pie', 'Marie Callender''s', 17.00, 36.00, 0.95, 55.00);

INSERT INTO NutritionalValue2 (nutrID, ingName, procName, brand, protein, fat, sodium, carbs)
VALUES ('N0000008', NULL, 'Medium Iced Capp', 'Tim Hortons', 3.00, 15.00, 0.07, 48.00);

INSERT INTO NutritionalValue2 (nutrID, ingName, procName, brand, protein, fat, sodium, carbs)
VALUES ('N0000009', NULL, 'Small Iced Capp', 'Tim Hortons', 2.00, 11.00, 0.05, 33.00);

INSERT INTO NutritionalValue2 (nutrID, ingName, procName, brand, protein, fat, sodium, carbs)
VALUES ('N0000010', NULL, 'Butter Chicken', 'President''s Choice', 20.00, 18.00, 1.05, 53.00);


/* ========================== Processed Food ========================== */
INSERT INTO ProcessedFood (procName, brand, nutrID, userDescript, pfUnit)
VALUES ('Strawberry Probiotic Yogurt', 'Activia', 'N0000006', 'Might be my favorite yogurt.', 'pack');

INSERT INTO ProcessedFood (procName, brand, nutrID, userDescript, pfUnit)
VALUES ('Chicken Pot Pie', 'Marie Callender''s', 'N0000007', 'I liked to eat it sometimes.', 'box');

INSERT INTO ProcessedFood (procName, brand, nutrID, userDescript, pfUnit)
VALUES ('Medium Iced Capp', 'Tim Hortons', 'N0000008', 'Enjoable in the morning before class.', 'cup');

INSERT INTO ProcessedFood (procName, brand, nutrID, userDescript, pfUnit)
VALUES ('Small Iced Capp', 'Tim Hortons', 'N0000009', 'Usually get when short on money.', 'cup');

INSERT INTO ProcessedFood (procName, brand, nutrID, userDescript, pfUnit)
VALUES ('Butter Chicken', 'President''s Choice', 'N0000010', 'Love eating it for dinner.', 'box');


/* ========================== Proc Meal ========================== */
INSERT INTO ProcMeal (brand, procName, mealID)
VALUES ('Activia', 'Strawberry Probiotic Yogurt', 'M0000001');

INSERT INTO ProcMeal (brand, procName, mealID)
VALUES ('Marie Callender''s', 'Chicken Pot Pie', 'M0000002');

INSERT INTO ProcMeal (brand, procName, mealID)
VALUES ('Tim Hortons', 'Medium Iced Capp', 'M0000003');

INSERT INTO ProcMeal (brand, procName, mealID)
VALUES ('Tim Hortons', 'Small Iced Capp', 'M0000004');

INSERT INTO ProcMeal (brand, procName, mealID)
VALUES ('President''s Choice', 'Butter Chicken', 'M0000005');