use actix_web::{guard, web, App, HttpRequest, HttpResponse, HttpServer, Error, http};
use actix_web_actors::ws;
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::{Schema, EmptySubscription};
use actix_files as fs;
use actix_cors::Cors;
use async_graphql_actix_web::{Request, Response, WSSubscription};
mod books;
use books::{shebei, xiangmu, kehu, yuangong, haocai, rizhi, user, file};
use sqlx::postgres::PgPool;
use anyhow::Result;
use dotenv::dotenv;
use books::{BooksSchema, QueryRoot, Mutation};

async fn index(schema: web::Data<BooksSchema>, req: Request) -> Response {
    schema.execute(req.into_inner()).await.into()
}

async fn index_playground() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(
            GraphQLPlaygroundConfig::new("/graphql").subscription_endpoint("/"),
        )))
}

async fn index_ws(
    schema: web::Data<BooksSchema>,
    req: HttpRequest,
    payload: web::Payload,
) -> Result<HttpResponse, Error> {
    Ok(
        ws::start_with_protocols(
            WSSubscription::new(Schema::clone(&*schema)),
            &["graphql-ws"],
            &req,
            payload,
        )?
    )
}

#[actix_rt::main]
async fn main() -> Result<()> {
    dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL is not set.");
    let db_pool = PgPool::connect(&database_url).await?;
    let queryroot = QueryRoot(xiangmu::XmQuery, shebei::SbQuery, kehu::KhQuery, yuangong::YgQuery, haocai::HcQuery, rizhi::RzQuery, user::UQuery, file::FileQuery);
    let mutationroot = Mutation(xiangmu::XmMutation, shebei::SbMutation, kehu::KhMutation, yuangong::YgMutation, haocai::HcMutation, user::UMutation, file::FileMutation);
    let schema = Schema::build(queryroot, mutationroot, EmptySubscription)
        .data(db_pool)
        .finish();
    println!("Playground: http://192.168.10.140:8080/graphql");

    let serv = HttpServer::new(move || {
        App::new()
            .data(schema.clone())
            .wrap(
            Cors::default()
                .allow_any_origin()
                .send_wildcard()
                .allowed_header(http::header::CONTENT_TYPE)
                .allowed_methods(vec!["GET", "POST"])
                .max_age(3600)
            )
            .service(web::resource("/graphql").guard(guard::Post()).to(index))
            .service(
                web::resource("/graphql")
                    .guard(guard::Get())
                    .guard(guard::Header("upgrade", "websocket"))
                        .to(index_ws),
            )
            .service(web::resource("/graphql").guard(guard::Get()).to(index_playground))
            .service(fs::Files::new("/","./dist", ).index_file("index.html"))
    })
    .bind("0.0.0.0:8080")?;
    serv.run().await?;
    Ok(())
}