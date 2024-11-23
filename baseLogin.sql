create database login;
use login;

CREATE TABLE usuarios (
    id_usuario VARCHAR(50) PRIMARY KEY,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL
);

select*from usuarios;

ALTER TABLE usuarios ADD COLUMN token VARCHAR(64);
ALTER TABLE usuarios ADD COLUMN verificado BOOLEAN DEFAULT FALSE;

truncate table usuarios;
