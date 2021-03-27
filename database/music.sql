/** CRIANDO TABELAS NA BASE DE DADOS */

create table client(
id_client SERIAL NOT NULL PRIMARY KEY,
fullname_client VARCHAR(200) NOT NULL,
email_client VARCHAR(100) NOT NULL,
user_client VARCHAR(20) NOT NULL,
password_client VARCHAR(255) NOT NULL,
updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW()),
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW())
);

create table band(
id_band SERIAL NOT NULL PRIMARY KEY,
name_band VARCHAR(250) NOT NULL,
birth_band DATE NOT NULL,
country_band VARCHAR(100) NOT NULL,
updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW()),
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW())
);

create table album(
id_album SERIAL NOT NULL PRIMARY KEY,
name_album VARCHAR(100) NOT NULL,
released_album DATE NOT NULL,
genre_album VARCHAR(20) NOT NULL, 
language_album VARCHAR(50) NOT NULL,
format_album VARCHAR(200) NOT NULL,
record_company_album VARCHAR(50) NOT NULL,
fk_id_band INT NOT NULL,
updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW()),
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW())
);

create table image(
id_image SERIAL NOT NULL PRIMARY KEY,
url_image VARCHAR(500) NOT NULL,
original_image VARCHAR(250) NOT NULL,
file_image VARCHAR(250) NOT NULL,
size_image INT NOT NULL,
fk_id_album INT NOT NULL,
expire_image TIMESTAMP WITHOUT TIME ZONE NOT NULL,
updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW()),
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW())
);

/** CHAVES ESTRANGEIRAS NAS TABELAS */

ALTER TABLE album ADD CONSTRAINT fk_id_band FOREIGN KEY (fk_id_band) REFERENCES band(id_band); 
ALTER TABLE image ADD CONSTRAINT fk_id_album FOREIGN KEY (fk_id_album) REFERENCES album(id_album); 

/** INSERCAO DAS BANDAS */

insert into band (name_band, birth_band, country_band)
values ('Andrea Bocelli', '1958-09-26', 'Italy');

insert into band (name_band, birth_band, country_band)
values ('Serj Tankian', '1967-08-21', 'Lebanon');

insert into band (name_band, birth_band, country_band)
values ('Mike Shinoda', '1977-02-11', 'United States');

insert into band (name_band, birth_band, country_band)
values ('Michel Teló', '1981-01-21', 'Brazil');

insert into band (name_band, birth_band, country_band)
values ('Guns N'' Roses', '1986-06-06', 'United States');

/** INSERCAO DOS ALBUNS*/

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Sì', '2018-10-26', 'Pop Classic', 'English', 'CD','Sugar Decca', 1);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Harakiri', '2012-07-10', 'Rock', 'English', 'CD','Armenian-American', 2);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Ramagehead', '2019-02-22', 'Rock', 'English', 'File, MP3, Single','Kscope', 2);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('The Rough Dog', '2018-12-14', 'Rock, Folk, World', 'English', 'File, MP3, Single','Picos & Ham Records', 2);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('The Rising Tied', '2005-11-21', 'Hip Hop, Rap', 'English', 'CD, download digital','Warner Bros, Machine Shop', 3);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Post Traumatic', '2018-06-15', 'Hip Hop, Rock', 'English', 'CD, download digital','Warner Bros, Machine Shop', 3);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Post Traumatic EP', '2018-01-25', 'Hip Hop', 'English', 'Download digital','Warner Bros, Machine Shop', 3);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Bem Sertanejo', '2014-12-08', 'Sertanejo', 'Portuguese', 'CD, DVD, Livro E-book','Warner Bros, Som Livre', 4);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Bem Sertanejo - O Show (Ao Vivo)', '2017-08-18', 'Sertanejo', 'Portuguese', 'CD, DVD, Digital','Warner Bros, Som Livre', 4);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Bem Sertanejo - (1ª Temporada) - EP', '2014-10-11', 'Sertanejo', 'Portuguese', 'CD, DVD, Digital','Warner Bros, Som Livre', 4);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Use Your Illusion I', '1991-09-17', 'Hard Rock, Metal', 'English', 'CD, DVD, Digital','Geffen', 5);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Use Your Illusion II', '1991-09-17', 'Hard Rock, Metal', 'English', 'CD, DVD, Digital','Geffen', 5);

insert into album (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band)
values ('Greatest Hits', '1981-11-02', 'Rock, Pop Rock', 'English', 'CD, DVD, Digital','Hollywood Records', 5);