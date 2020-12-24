use async_graphql::{Context, Object, Result};
use sqlx::SqlitePool;

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
    async fn rizhis(&self, ctx: &Context<'_>) -> Result<Vec<Rizhi>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let recs = sqlx::query!(
            r#"
                SELECT id,cz,time,ip,mac
                    FROM rizhi
                ORDER BY id DESC
            "#
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
    async fn rizhi(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "rzid of rizhi")] id: String,
    ) -> Result<Rizhi> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM rizhi
                WHERE id = (?1)
            "#,
            id
        )
        .fetch_one(pool)
        .await?;
        let book = Rizhi{
            id: rec.id,
            cz: rec.cz,
            time: rec.time,
            ip: rec.ip,
            mac: rec.mac
        };
        Ok(book)
    }

}

pub struct RzMutation;

#[Object]
impl RzMutation {
    async fn create_rizhi(&self, ctx: &Context<'_>, cz: Option<String>, time: Option<String>, ip: Option<String>,
     mac: Option<String>) -> Result<bool> {
        let mut pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO rizhi(cz,time,ip,mac)
                VALUES (?1,?2,?3,?4)
            "#,
            cz,time,ip,mac
        )
        .execute(&mut pool)
        .await?;
        // SimpleBroker::publish(BookChanged {
        //     mutation_type: MutationType::Created,
        //     id: id.clone(),
        // });
        Ok(done > 0)
    }

    // async fn delete_rizhi(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
    //     let pool = ctx.data_unchecked::<SqlitePool>();
     
    //     let done = sqlx::query!(
    //         r#"DELETE FROM rizhi
    //             WHERE id = $1"#,
    //         id
    //     )
    //     .execute(pool)
    //     .await?;
    //     // if books.contains(id) {
    //     //     books.remove(id);
    //     //     SimpleBroker::publish(BookChanged {
    //     //         mutation_type: MutationType::Deleted,
    //     //         id: id.into(),
    //     //     });
    //     //     Ok(true)
    //     // } else {
    //     //     Ok(false)
    //     // }
    //     Ok(done > 0)
    // }

    
}
