use std::{collections::HashMap, sync::{Arc, Mutex}};

use actix_web::{web, App, HttpServer};

mod models;
mod routes;

use models::User;
use routes::{get_user, create_user, search_by_user_name, create_user_form, UserDb};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = 8080;
    println!("Starting server on port {port}");

    let user_db: UserDb = Arc::new(Mutex::new(HashMap::<u32, User>::new()));

    HttpServer::new(move || {
        let app_data = web::Data::new(user_db.clone());
        App::new()
            .app_data(app_data)
            .service(get_user)
            .service(create_user)
            .service(search_by_user_name)
            .service(create_user_form)
    })
    .bind(("127.0.0.1", port))?
    .workers(2)
    .run()
    .await
}
