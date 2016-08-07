DROP TABLE IF EXISTS public.directed_by;
DROP TABLE IF EXISTS public.acts_in;
DROP TABLE IF EXISTS public.watched_by;
DROP TABLE IF EXISTS public.commented_by;
DROP TABLE IF EXISTS public.rated_by;
DROP TABLE IF EXISTS public.movie_category;
DROP TABLE IF EXISTS public.movie_award;
DROP TABLE IF EXISTS public.movie;
DROP TABLE IF EXISTS public.director;
DROP TABLE IF EXISTS public.user;
DROP TABLE IF EXISTS public.award;
DROP TABLE IF EXISTS public.category;

CREATE TABLE public.movie (
   id SERIAL PRIMARY KEY,
   name TEXT NOT NULL,
   year INT CHECK (year > 1900),
   country TEXT,
   bannerUrl TEXT,
   posterUrl TEXT,
   videoUrl TEXT,
   releaseDate DATE,
   updateDate DATE,
   plot TEXT
);

CREATE TABLE public.director (
   id SERIAL PRIMARY KEY,
   name TEXT NOT NULL
);

CREATE TABLE public.directed_by (
   movie_id INT REFERENCES movie(id),
   director_id INT REFERENCES director(id),
   PRIMARY KEY (movie_id, director_id)
);

CREATE TABLE public.acts_in (
   movie_id INT REFERENCES movie(id),
   actor_name TEXT NOT NULL,
   role TEXT,
   PRIMARY KEY(movie_id, actor_name)
);

CREATE TABLE public.user (
   id SERIAL PRIMARY KEY,
   username TEXT NOT NULL,
   password TEXT NOT NULL,
   full_name TEXT NOT NULL,
   email TEXT,
   user_type TEXT NOT NULL
);

CREATE TABLE public.watched_by (
   movie_id INT REFERENCES movie(id),
   user_id INT REFERENCES public.user(id),
   times INT DEFAULT 0 CHECK(times > -1),
   PRIMARY KEY (movie_id, user_id)
);

CREATE TABLE public.rated_by (
   movie_id INT REFERENCES movie(id),
   user_id INT REFERENCES public.user(id),
   rate REAL DEFAULT 1 CHECK(rate >= 1.0 AND rate <= 5.0),
   PRIMARY KEY (movie_id, user_id)
);

CREATE TABLE public.commented_by (
   id SERIAL PRIMARY KEY,
   movie_id INT REFERENCES movie(id),
   user_id INT REFERENCES public.user(id),
   message TEXT NULL,
   creation_date DATE,
   replied_to INT REFERENCES commented_by(id) NULL
);

CREATE TABLE public.category (
   id  SERIAL PRIMARY KEY,
   name TEXT NOT NULL
);

CREATE TABLE public.movie_category (
   movie_id INT REFERENCES movie(id),
   category_id INT REFERENCES category(id),
   PRIMARY KEY (movie_id, category_id)
);

CREATE TABLE public.award (
   id  SERIAL PRIMARY KEY,
   name TEXT NOT NULL
);

CREATE TABLE public.movie_award (
   movie_id INT REFERENCES movie(id),
   award_id INT REFERENCES award(id),
   category TEXT NOT NULL,
   PRIMARY KEY (movie_id, award_id)
);


INSERT INTO public.user (username, password, full_name, email, user_type) VALUES ('sergiowero', 'admin', 'Sergio Sanchez', 'sergioj.sanchezr@gmail.com', 'admin');
INSERT INTO public.user (username, password, full_name, email, user_type) VALUES ('esther509', 'admin', 'Laura Lopez', 'esther_509@hotmail.com', 'admin');