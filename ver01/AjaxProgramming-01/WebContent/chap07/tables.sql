create table COMMENT (
    ID        INT PRIMARY KEY,
    NAME      VARCHAR(20) NOT NULL,
    CONTENT   LONG VARCHAR NOT NULL
);

create table ID_REPOSITORY (
    NAME      VARCHAR(20) PRIMARY KEY,
    VALUE     INT
);

insert into ID_REPOSITORY values ('COMMENT', 0);