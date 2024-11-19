use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct User {
    pub name: String,
}

#[derive(Serialize)]
pub struct CreatUserResponse {
    pub id: u32,
    pub name: String,
}