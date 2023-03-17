CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create database jwttutorial;
create table users(
    user_id uuid primary key default uuid_generate_v4(),
    user_name text not null,
    user_email text not null unique,
    user_password text not null
);
select * from users;
insert into users (user_name,user_email,user_password) values('durga','durga@gmail.com','durga'); 
--psql -U postgres
--\c jwttutorial
--\dt
