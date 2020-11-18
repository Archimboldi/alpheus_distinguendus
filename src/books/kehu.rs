use async_graphql::{Context, Enum, Object, Subscription, Result};
use futures::{Stream, StreamExt};
use super::simple_broker::SimpleBroker;
use std::time::Duration;
use sqlx::SqlitePool;

#[derive(Clone)]
pub struct Kehu {
    pub khbh: String,
    pub khxm: String,
    pub ssxm: Option<String>,
    pub khxb: Option<String>,
    pub khgx: Option<String>,
    pub khbz: Option<String>,
    pub khlx: Option<String>,
}

#[Object]
impl Kehu {
    async fn khbh(&self) -> &str {
        &self.khbh
    }
    async fn khxm(&self) -> &str {
        &self.khxm
    }
    async fn ssxm(&self) -> Option<&String> {
        self.ssxm.as_ref()
    }
    async fn khxb(&self) -> Option<&String> {
        self.khxb.as_ref()
    }
    async fn khgx(&self) -> Option<&String> {
        self.khgx.as_ref()
    }
    async fn khbz(&self) -> Option<&String> {
        self.khbz.as_ref()
    }
    async fn khlx(&self) -> Option<&String> {
        self.khlx.as_ref()
    }
}

pub struct KhQuery;

#[Object]
impl KhQuery {
    async fn kehus(&self, ctx: &Context<'_>) -> Result<Vec<Kehu>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let recs = sqlx::query!(
            r#"
                SELECT khbh,khxm,ssxm,khxb,khgx,khbz,khlx
                    FROM kehu
                ORDER BY khbh DESC
            "#
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Kehu> = vec![];
        for rec in recs {
            books.push(Kehu{
                khbh: rec.khbh,
                khxm: rec.khxm,
                ssxm: rec.ssxm,
                khxb: rec.khxb,
                khgx: rec.khgx,
                khbz: rec.khbz,
                khlx: rec.khlx
            });
        }
        Ok(books)
    }
    async fn kehu(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "khbh of kehu")] khbh: String,
    ) -> Result<Kehu> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM kehu
                WHERE khbh = (?1)
            "#,
            khbh
        )
        .fetch_one(pool)
        .await?;
        let book = Kehu{
            khbh: rec.khbh,
            khxm: rec.khxm,
            ssxm: rec.ssxm,
            khxb: rec.khxb,
            khgx: rec.khgx,
            khbz: rec.khbz,
            khlx: rec.khlx
        };
        Ok(book)
    }

}

pub struct KhMutation;

#[Object]
impl KhMutation {
    async fn create_kehu(&self, ctx: &Context<'_>, khbh: String, khxm: Option<String>, ssxm: Option<String>, khxb: Option<String>,
     khgx: Option<String>, khbz: Option<String>, khlx: Option<String>) -> Result<bool> {
        let mut pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO kehu(khbh,khxm,ssxm,khxb,khgx,khbz,khlx)
                VALUES (?1,?2,?3,?4,?5,?6,?7)
            "#,
            khbh,khxm,ssxm,khxb,khgx,khbz,khlx
        )
        .execute(&mut pool)
        .await?;
        // SimpleBroker::publish(BookChanged {
        //     mutation_type: MutationType::Created,
        //     id: id.clone(),
        // });
        Ok(done > 0)
    }

    async fn delete_kehu(&self, ctx: &Context<'_>, khbh: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
     
        let done = sqlx::query!(
            r#"DELETE FROM kehu
                WHERE khbh = $1"#,
            khbh
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

    async fn change_kehu(&self, ctx: &Context<'_>, nkhbh: String, khxm: Option<String>, ssxm: Option<String>, khxb: Option<String>,
    khgx: Option<String>, khbz: Option<String>, khlx: Option<String>, okhbh: String,) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE kehu
                SET khbh = $1, khxm = $2, ssxm = $3, khxb = $4, khgx = $5, khbz = $6, khlx = $7
                WHERE khbh = $8"#,
            nkhbh,khxm,ssxm,khxb,khgx,khbz,khlx,okhbh
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
    khbh: String,
}

#[Object]
impl BookChanged {
    async fn mutation_type(&self) -> MutationType {
        self.mutation_type
    }

    async fn khbh(&self) -> &str {
        &self.khbh
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