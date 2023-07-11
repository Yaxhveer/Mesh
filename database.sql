CREATE TABLE users(
    user_id serial PRIMARY KEY,
    email text unique not null,
    password text not null,
    created_on timestamp default current_timestamp
);

CREATE TABLE user_info(
    user_id int references users(user_id) on delete cascade,
    user_name text unique not null,
    display_name text not null,
    about text default "(@_@)",
    avatar text,
    PRIMARY KEY (user_id)
);
 
CREATE TABLE following(
    user_id int references users(user_id) on delete cascade,
    following_id int references users(user_id) on delete cascade,
    PRIMARY KEY (user_id, following_id)
);

CREATE TABLE posts(
    post_id serial PRIMARY KEY,
    user_id int references users(user_id) on delete cascade,
    about text,
    post text not null,
    created_on timestamp default current_timestamp
);

CREATE TABLE likes(
    post_id int references posts(post_id) on delete cascade,
    user_id int references users(user_id) on delete cascade,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE comments(
    comment_id serial,
    post_id int references posts(post_id) on delete cascade,
    user_id int references users(user_id) on delete cascade,
    comment text not null,
    PRIMARY KEY (comment_id)
);