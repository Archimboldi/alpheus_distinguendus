use actix_web::{guard, web, App, HttpRequest, HttpResponse, HttpServer, Error, http};
use actix_web_actors::ws;
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::{Schema, EmptySubscription};
use actix_files as fs;
use actix_cors::Cors;
use async_graphql_actix_web::{Request, Response, WSSubscription};
mod books;
use books::{shebei, xiangmu, kehu, yuangong, haocai, rizhi, user};
use sqlx::SqlitePool;
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
    let db_pool = SqlitePool::new(&database_url).await?;
    let queryroot = QueryRoot(xiangmu::XmQuery, shebei::SbQuery, kehu::KhQuery, yuangong::YgQuery, haocai::HcQuery, rizhi::RzQuery, user::UQuery);
    let mutationroot = Mutation(xiangmu::XmMutation, shebei::SbMutation, kehu::KhMutation, yuangong::YgMutation, haocai::HcMutation, rizhi::RzMutation, user::UMutation);
    let schema = Schema::build(queryroot, mutationroot, EmptySubscription)
        .data(db_pool)
        .finish();
    println!("Playground: http://localhost:8000/graphql");

    let serv = HttpServer::new(move || {
        App::new()
            .data(schema.clone())
            .wrap(
            Cors::default()
                .allowed_origin("http://localhost:3000")
                .allowed_origin("http://localhost:8000")
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
            .service(fs::Files::new("/","./app/build", ).index_file("index.html"))
    })
    .bind("127.0.0.1:8000")?;
    serv.run().await?;
    Ok(())
}