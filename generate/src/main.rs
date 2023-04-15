mod generate;
use actix_cors::Cors;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};

#[get("/get_words")]
async fn get_words() -> impl Responder {
    let words = generate::Words::get_words("../words.txt");
    println!("getting words... here: {:?}", words);

    HttpResponse::Ok().json(words)
}

#[get("/generate_sounds")]
async fn generate_sounds() -> String {
    let words = generate::Words::get_words("../words.tx");
    let result = generate::Words::generate_sounds(&words.dutch);
    println!("generating...");

    return result;
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::default())
            .service(get_words)
            .service(generate_sounds)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
