CREATE TABLE app_user(
	id SERIAL PRIMARY KEY NOT NULL,
	email varchar(100) NOT NULL,
	password varchar(50) NOT NULL
);

CREATE TABLE user_transaction(
	id SERIAL PRIMARY KEY NOT NULL,
	title varchar(50) NULL,
	amount INT NOT NULL,
	currency varchar(3) NOT NULL,
	user_id int references app_user(id)
);


INSERT INTO user_transaction VALUES (default, 'Kawa',-20, 'PLN',1);
INSERT INTO user_transaction VALUES (default, 'Kubek',-20, 'PLN',1);
SELECT * FROM user_transaction;