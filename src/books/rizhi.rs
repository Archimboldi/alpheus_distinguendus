use async_graphql::{Context, Enum, Object, Subscription, Result};
use futures::{Stream, StreamExt};
use super::simple_broker::SimpleBroker;
use std::time::Duration;
use sqlx::SqlitePool;

#[derive(Clone)]
pub struct Rizhi {
    pub rzid: String,
    pub cz: Option<String>,
    pub time: Option<String>,
    pub ip: Option<String>,
    pub mac: Option<String>,
}

#[Object]
impl Rizhi {
    async fn rzid(&self) -> &str {
        &self.rzid
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
                SELECT rzid,cz,time,ip,mac
                    FROM rizhi
                ORDER BY rzid DESC
            "#
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Rizhi> = vec![];
        for rec in recs {
            books.push(Rizhi{
                rzid: rec.rzid,
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
        #[graphql(desc = "rzid of rizhi")] rzid: String,
    ) -> Result<Rizhi> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM rizhi
                WHERE rzid = (?1)
            "#,
            rzid
        )
        .fetch_one(pool)
        .await?;
        let book = Rizhi{
            rzid: rec.rzid,
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
    async fn create_rizhi(&self, ctx: &Context<'_>, rzid: String, cz: Option<String>, time: Option<String>, ip: Option<String>,
     mac: Option<String>) -> Result<bool> {
        let mut pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO rizhi(rzid,cz,time,ip,mac)
                VALUES (?1,?2,?3,?4,?5)
            "#,
            rzid,cz,time,ip,mac
        )
        .execute(&mut pool)
        .await?;
        // SimpleBroker::publish(BookChanged {
        //     mutation_type: MutationType::Created,
        //     id: id.clone(),
        // });
        Ok(done > 0)
    }

    async fn delete_rizhi(&self, ctx: &Context<'_>, rzid: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
     
        let done = sqlx::query!(
            r#"DELETE FROM rizhi
                WHERE rzid = $1"#,
            rzid
        )
        .execute(pool)
        .await?;
        // if books.contains(id) {
        //     books.remove(id);
        //     SimpleBroker::publish(BookChanged {
        //         mutation_type: MutationType::Deleted,
        //         id: id.into(),
        //     });
        //     Ok(true)
        // } else {
        //     Ok(false)
        // }
        Ok(done > 0)
    }

    
}

//订阅
#[derive(Enum, Eq, PartialEq, Copy, Clone)]
enum MutationType {
    Created,
    Deleted,
    Changed
}

#[derive(Clone)]
struct BookChanged {
    mutation_type: MutationType,
    zcbh: String,
}

#[Object]
impl BookChanged {
    async fn mutation_type(&self) -> MutationType {
        self.mutation_type
    }

    async fn zcbh(&self) -> &str {
        &self.zcbh
    }

}

pub struct SubscriptionRoot;

#[Subscription]
impl SubscriptionRoot {
    async fn interval(&self, #[graphql(default = 1)] n: i32) -> impl Stream<Item = i32> {
        let mut value = 0;
        tokio::time::interval(Duration::from_secs(1)).map(move |_| {
            value += n;
            value
        })
    }

    async fn books(&self, mutation_type: Option<MutationType>) -> impl Stream<Item = BookChanged> {
        SimpleBroker::<BookChanged>::subscribe().filter(move |event| {
            let res = if let Some(mutation_type) = mutation_type {
                event.mutation_type == mutation_type
            } else {
                true
            };
            async move { res }
        })
    }
}