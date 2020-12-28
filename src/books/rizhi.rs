use async_graphql::{Context, Object, Result};
use sqlx::postgres::PgPool;

#[derive(Clone)]
pub struct Rizhi {
    pub id: i32,
    pub cz: Option<String>,
    pub time: Option<String>,
    pub ip: Option<String>,
    pub mac: Option<String>,
}

#[Object]
impl Rizhi {
    async fn id(&self) -> &i32 {
        &self.id
    }
    async fn cz(&self) -> Option<&String> {
        self.cz.as_ref()
    }
    async fn time(&self) -> Option<&String> {
        self.time.as_ref()
    }
    async fn ip(&self) -> Option<&String> {
        self.ip.as_ref()
    }
    async fn mac(&self) -> Option<&String> {
        self.mac.as_ref()
    }
}

pub struct RzQuery;

#[Object]
impl RzQuery {
    async fn rizhis(&self, ctx: &Context<'_>, cz:String) -> Result<Vec<Rizhi>> {
        let pool = ctx.data_unchecked::<PgPool>();
        let cc = format!("%{}%", cz);
        let recs = sqlx::query!(
            r#"
                SELECT id,cz,time,ip,mac
                    FROM rizhi WHERE cz like $1
                ORDER BY id DESC
            "#,
            cc
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Rizhi> = vec![];
        for rec in recs {
            books.push(Rizhi{
                id: rec.id,
                cz: rec.cz,
                time: rec.time,
                ip: rec.ip,
                mac: rec.mac
            });
        }
        Ok(books)
    }

}

