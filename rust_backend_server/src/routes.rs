use std::{collections::HashMap, sync::{Arc, Mutex}};
use actix_web::{error::ErrorNotFound, Error, web, HttpResponse, Responder};
use serde::Deserialize;
use crate::models::{User, CreatUserResponse};

pub type UserDb = Arc<Mutex<HashMap<u32, User>>>;

#[derive(Deserialize)]
struct SearchUserQuery {
    name: String,
}

#[actix_web::get("/users")]
pub async fn search_by_user_name(
    query: web::Query<SearchUserQuery>,
    db: web::Data<UserDb>,
) -> Result<impl Responder, Error> {
    let db = db.lock().unwrap();
    let user_name = query.into_inner().name;
    let user_data = db.values().find(|user| user.name == user_name);

    match user_data {
        Some(user_data) => Ok(HttpResponse::Ok().json(user_data)),
        None => Err(ErrorNotFound("Not entries")),
    }
}


#[actix_web::get("/users/{user_id}/{friend}")]
pub async fn get_user_friend(
    path: web::Path<(u32, String)>
) -> impl Responder {
    let (user_id, friend) = path.into_inner();
    HttpResponse::Ok().body(format!("User: {}, Friend: {}", user_id, friend))
}

#[actix_web::get("/users/{id}")]
pub async fn get_user(
    user_id: web::Path<u32>,
    db: web::Data<UserDb>
) -> Result<impl Responder, Error> {
    let user_id = user_id.into_inner();
    let db = db.lock().unwrap();

    match db.get(&user_id) {
        Some(user_data) => Ok(HttpResponse::Ok().json(user_data)),
        None => Err(ErrorNotFound("User not found")),
    }
}

fn insert_user(
    db: &mut HashMap<u32, User>,
    user_data: User,
) -> u32 {
    let new_id = db.keys().max().unwrap_or(&0) + 1;
    db.insert(new_id, user_data);
    
    new_id
}

#[actix_web::post("/users")]
pub async fn create_user(
    user_data: web::Json<User>,
    db: web::Data<UserDb>
) -> impl Responder {
    let mut db = db.lock().unwrap();
    let name = user_data.name.clone();
    let new_id = insert_user(
        &mut db,
        user_data.into_inner()
    );

    HttpResponse::Created().json(CreatUserResponse {
        id: new_id,
        name,
    })
}

#[actix_web::post("users_form")]
pub async fn create_user_form(
    user_data: web::Form<User>,
    db:  web::Data<UserDb>
) -> impl Responder {
    let mut db = db.lock().unwrap();
    let name = user_data.name.clone();
    let new_id = insert_user(
        &mut db,
        user_data.into_inner()
    );

    HttpResponse::Created().json(CreatUserResponse {
        id: new_id,
        name,
    })
}