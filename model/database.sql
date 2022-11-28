-- START...phpmyadminDB

CREATE TABLE `users` ( 
`user_id` INT(10) NOT NULL AUTO_INCREMENT , 
`fname` VARCHAR(200) NOT NULL ,
 `lname` VARCHAR(200) NOT NULL ,
  `gender` VARCHAR(200) NOT NULL ,
   `phoneno` VARCHAR(200) NOT NULL ,
    `email` VARCHAR(200) NOT NULL , 
    `avatar` VARCHAR(200) NULL , 
    `cloudinary_user_id` VARCHAR(200) NULL ,
     `walletballance` VARCHAR(200) NULL , 
     `user_bankname` VARCHAR(200) NULL , 
     `user_acctno` VARCHAR(200) NULL , 
     `user_acctname` VARCHAR(200) NULL DEFAULT NULL , 
     `savings` VARCHAR(200) NULL DEFAULT NULL ,
      `otp` VARCHAR(200) NULL DEFAULT NULL , 
      `totalbalance` VARCHAR(200) NULL DEFAULT NULL , 
      `investment` VARCHAR(200) NULL DEFAULT NULL , 
      `transaction_history` VARCHAR(200) NULL DEFAULT NULL ,
       `notification_from_suba` VARCHAR(200) NULL DEFAULT NULL , 
       `pswdotp` VARCHAR(200) NULL DEFAULT NULL ,
        `pswd` VARCHAR(200) NULL DEFAULT NULL ,
        `compswd` VARCHAR(200) NULL DEFAULT NULL , 
        `bvn_no` VARCHAR(200) NULL DEFAULT NULL , 
        `dob` VARCHAR(200) NULL DEFAULT NULL , 
        `user_doc_id` VARCHAR(200) NULL DEFAULT NULL , 
        `cardno` VARCHAR(200) NULL DEFAULT NULL ,
         `cardvalidThru` VARCHAR(200) NULL DEFAULT NULL , 
         `cardcvv` VARCHAR(200) NULL DEFAULT NULL , 
         `resident_address` VARCHAR(200) NULL DEFAULT NULL , 
         `state_id` VARCHAR(200) NULL DEFAULT NULL , 
         `nin_no` VARCHAR(200) NULL DEFAULT NULL , 
         `nin_doc_url` VARCHAR(200) NULL DEFAULT NULL , 
         `inter_id_no` VARCHAR(200) NULL DEFAULT NULL , 
         `inter_doc1_url` VARCHAR(200) NULL DEFAULT NULL , 
         `inter_doc2_url` VARCHAR(200) NULL DEFAULT NULL , 
         `driver_id_no` VARCHAR(200) NULL DEFAULT NULL , 
         `driver_doc1_url` VARCHAR(200) NULL DEFAULT NULL , 
         `driver_doc2_url` VARCHAR(200) NULL DEFAULT NULL , 
         `voter_id_no` VARCHAR(200) NULL DEFAULT NULL , 
         `voter_doc1_url` VARCHAR(200) NULL DEFAULT NULL , 
         `voter_doc2_url`VARCHAR(200) NULL DEFAULT NULL ,
          PRIMARY KEY (`user_id`)) ENGINE = InnoDB;






INSERT INTO `users` (`user_id`, `fname`, `lname`, `gender`, `phoneno`, `email`,  `otp`) VALUES (?,?,?,?,?,?,?)












-- End...phpmyadminDB





--  user_login_id: user[0].user_id,
--                 fname: user[0].fname,
--                 lname: user[0].lname,
--                 username: user[0].fname,
--                 gender: user[0].gender,
--                 email: user[0].email,
--                 phoneno: user[0].phoneno,
--                 avatar: user[0].avatar,
--                 walletballance: user[0].walletballance,
--                 user_bankname: user[0].user_bankname,
--                 user_acctno: user[0].user_acctno,
--                 user_acctname: user[0].user_acctname,
--                 savings: user[0].savings,
--                 totalbalance:  user[0].totalbalance,
--                 investment:  user[0].investment,
--                 transaction_history: user[0].transaction_history,
--                 notification_from_suba: user[0].notification_from_suba,
--                 bvn_no :user[0].bvn_no,
--                 dob :user[0].dob,
--                 cardno :user[0].cardno,
--                 cardvalidThru :user[0].cardvalidThru,
--                 cardcvv :user[0].cardcvv






-- DB_HOST=localhost
-- DATABASE_USER=postgres
-- DB_PASSWORD=78@90
-- DATABASE_LOCAL=suba_user_details
-- DB_PORT=5432


-- connect to postgres heroku data :  heroku pg:psql --app subatestappapi

CREATE TABLE users_admin_blog(

     admin_id BIGSERIAL NOT NULL PRIMARY KEY,
     fname VARCHAR(200) NOT NULL,
     lname VARCHAR(200) NOT NULL,
     gender VARCHAR(7) NOT NULL,
     phoneno VARCHAR(15) NOT NULL,
     email VARCHAR(255) NOT NULL,
     paswd VARCHAR(255) NOT NULL,
     comments VARCHAR(255) 
     

);


CREATE TABLE users_comment_blog(

     comment_id BIGSERIAL NOT NULL PRIMARY KEY,
     username VARCHAR(200) NOT NULL,
     usercomments VARCHAR(1000) NOT NULL,
     useremail VARCHAR(250) NOT NULL,
     created timestamp with time zone


);




CREATE DATABASE analkel_user_details;

CREATE TABLE analkel_users (
     user_id SERIAL PRIMARY KEY NOT NULL,
     email VARCHAR(255) NOT NULL,
     phoneno VARCHAR(15),
     fname VARCHAR(200),
     lname VARCHAR(200),
     username VARCHAR(200),
     avatar VARCHAR(255),
     cloudinary_user_id VARCHAR(255),
     user_analkel_acctno VARCHAR(255),
     walletballance VARCHAR(255),
     user_bankname VARCHAR(255),
     user_acctno VARCHAR(255),
     user_acctname VARCHAR(255),
     otp VARCHAR(255),
     investment VARCHAR(255),
     transaction_history VARCHAR(255),
     pswdotp VARCHAR(255),
     pswd VARCHAR(255),
     bvn_no VARCHAR(15) UNIQUE,
     cardno  VARCHAR(255),
     cardvalidThru VARCHAR(255),
     cardcvv VARCHAR(255),
     otp_timestamp VARCHAR(255)); 




GRANT ALL PRIVILEGES ON TABLE users_user_id_seq TO subaxpqz_subaDB;



CREATE TABLE transaction_user(

   user_transac_id BIGSERIAL NOT NULL PRIMARY KEY,
   discription  VARCHAR(200) NOT NULL,
   amount VARCHAR(200) NOT NULL,
   date_of_transaction VARCHAR(7) NOT NULL,
   status_0f_transaction VARCHAR(15) NOT NULL ,
      

)






CREATE TABLE user_doc_name_needed(
     user_doc_name_id SERIAL NOT NULL PRIMARY KEY,
      
     doc_name VARCHAR(200) NOT NULL); 




 CREATE TABLE states(
     user_state_id SERIAL NOT NULL PRIMARY KEY,
     state_name VARCHAR(200) NOT NULL); 



INSERT INTO user_doc_name_needed(doc_name) 
VALUES('Voters card');
     ('International Passport'),
     ("Driver's license"),
     ("Voter's card");


     -- "start": "nodemon app.js"





 INSERT INTO states (state_name) VALUES
('ABIA'),
('ADAMAWA'),
('AKWA IBOM'),
('ANAMBRA'),
('BAUCHI'),
('BAYELSA'),
('BENUE'),
('BORNO'),
('CROSS RIVER'),
('DELTA'),
('EBONYI'),
('EDO'),
('EKITI'),
('ENUGU'),
('FCT'),
('GOMBE'),
('IMO'),
('JIGAWA'),
('KADUNA'),
('KANO'),
('KATSINA'),
('KEBBI'),
('KOGI'),
('KWARA'),
('LAGOS');    

select * from user_doc_name_needed;


drop table users;
drop table user_doc_name_needed;
drop table  states;
