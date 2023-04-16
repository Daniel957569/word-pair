mod generate;
use actix_cors::Cors;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};

#[get("/get_words")]
async fn get_words() -> impl Responder {
    println!("getting words...");

    let words = generate::Words::get_words("../words.txt");

    HttpResponse::Ok().json(words)
}

#[get("/generate_sounds")]
async fn generate_sounds() -> String {
    println!("generating...");

    let mut words = generate::Words::get_words("../words.txt");
    let result = generate::Words::generate_sounds(&mut words.dutch);
    println!("{:?}", result);

    return result;
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::default().allow_any_origin())
            .service(get_words)
            .service(generate_sounds)
    })
    .bind(("127.0.0.1", 3001))?
    .run()
    .await
}
