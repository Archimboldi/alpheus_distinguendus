use async_graphql::{Context, Enum, Object, Subscription, Result};
use futures::{Stream, StreamExt};
use super::simple_broker::SimpleBroker;
use std::time::Duration;
use sqlx::SqlitePool;

#[derive(Clone)]
pub struct Haocai {
    pub hcmc: String,
    pub gg: Option<String>,
    pub sl: Option<String>,
    pub dw: Option<String>,
    pub lj: Option<String>,
    pub hcbz: Option<String>,
    pub hcdj: Option<String>,
}

#[Object]
impl Haocai {
    async fn hcmc(&self) -> &str {
        &self.hcmc
    }
    async fn gg(&self) -> Option<&String> {
        self.gg.as_ref()
    }
    async fn sl(&self) -> Option<&String> {
        self.sl.as_ref()
    }
    async fn dw(&self) -> Option<&String> {
        self.dw.as_ref()
    }
    async fn lj(&self) -> Option<&String> {
        self.lj.as_ref()
    }
    async fn hcbz(&self) -> Option<&String> {
        self.hcbz.as_ref()
    }
    async fn hcdj(&self) -> Option<&String> {
        self.hcdj.as_ref()
    }

}

pub struct HcQuery;

#[Object]
impl HcQuery {
    async fn haocais(&self, ctx: &Context<'_>) -> Result<Vec<Haocai>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let recs = sqlx::query!(
            r#"
                SELECT hcmc,gg,sl,dw,lj,hcbz,hcdj
                    FROM haocai
                ORDER BY hcmc DESC
            "#
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Haocai> = vec![];
        for rec in recs {
            books.push(Haocai{
                hcmc: rec.hcmc,
                gg: rec.gg,
                sl: rec.sl,
                dw: rec.dw,
                lj: rec.lj,
                hcbz: rec.hcbz,
                hcdj: rec.hcdj
            });
        }
        Ok(books)
    }
    async fn haocai(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "hcmc of haocai")] hcmc: String,
    ) -> Result<Haocai> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM haocai
                WHERE hcmc = (?1)
            "#,
            hcmc
        )
        .fetch_one(pool)
        .await?;
        let book = Haocai{
            hcmc: rec.hcmc,
            gg: rec.gg,
            sl: rec.sl,
            dw: rec.dw,
            lj: rec.lj,
            hcbz: rec.hcbz,
            hcdj: rec.hcdj
        };
        Ok(book)
    }

}

pub struct HcMutation;

#[Object]
impl HcMutation {
    async fn create_haocai(&self, ctx: &Context<'_>, hcmc: String, gg: Option<String>, sl: Option<String>, dw: Option<String>,
     lj: Option<String>, hcbz: Option<String>, hcdj: Option<String>) -> Result<bool> {
        let mut pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO haocai(hcmc,gg,sl,dw,lj,hcbz,hcdj)
                VALUES (?1,?2,?3,?4,?5,?6,?7)
            "#,
            hcmc,gg,sl,dw,lj,hcbz,hcdj
        )
        .execute(&mut pool)
        .await?;
        // SimpleBroker::publish(BookChanged {
        //     mutation_type: MutationType::Created,
        //     id: id.clone(),
        // });
        Ok(done > 0)
    }

    async fn delete_haocai(&self, ctx: &Context<'_>, hcmc: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
     
        let done = sqlx::query!(
            r#"DELETE FROM haocai
                WHERE hcmc = $1"#,
            hcmc
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

    async fn change_haocai(&self, ctx: &Context<'_>, nhcmc: String, gg: Option<String>, sl: Option<String>, dw: Option<String>,
    lj: Option<String>, hcbz: Option<String>, hcdj: Option<String>, ohcmc: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE haocai
                SET hcmc = $1, gg = $2, sl = $3, dw = $4, lj = $5, hcbz = $6, hcdj = $7
                WHERE hcmc = $10"#,
            nhcmc,gg,sl,dw,lj,hcbz,hcdj,ohcmc
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
    hcmc: String,
}

#[Object]
impl BookChanged {
    async fn mutation_type(&self) -> MutationType {
        self.mutation_type
    }

    async fn hcmc(&self) -> &str {
        &self.hcmc
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