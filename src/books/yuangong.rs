use async_graphql::{Context, Enum, Object, Subscription, Result};
use futures::{Stream, StreamExt};
use super::simple_broker::SimpleBroker;
use std::time::Duration;
use sqlx::SqlitePool;

#[derive(Clone)]
pub struct Yuangong {
    pub ygxm: String,
    pub ssbm: Option<String>,
    pub szxm: Option<String>,
    pub ygjn: Option<String>,
    pub rzsj: Option<String>,
    pub rgzl: Option<String>,
    pub ygzl: Option<String>,
    pub ljgzl: Option<String>,
    pub ygbz: Option<String>,
    pub sfzh: String
}

#[Object]
impl Yuangong {
    async fn ygxm(&self) -> &str {
        &self.ygxm
    }
    async fn ssbm(&self) -> Option<&String> {
        self.ssbm.as_ref()
    }
    async fn szxm(&self) -> Option<&String> {
        self.szxm.as_ref()
    }
    async fn ygjn(&self) -> Option<&String> {
        self.ygjn.as_ref()
    }
    async fn rzsj(&self) -> Option<&String> {
        self.rzsj.as_ref()
    }
    async fn rgzl(&self) -> Option<&String> {
        self.rgzl.as_ref()
    }
    async fn ygzl(&self) -> Option<&String> {
        self.ygzl.as_ref()
    }
    async fn ljgzl(&self) -> Option<&String> {
        self.ljgzl.as_ref()
    }
    async fn ygbz(&self) -> Option<&String> {
        self.ygbz.as_ref()
    }
    async fn sfzh(&self) -> &str {
        &self.sfzh
    }
}

pub struct YgQuery;

#[Object]
impl YgQuery {
    async fn yuangongs(&self, ctx: &Context<'_>) -> Result<Vec<Yuangong>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let recs = sqlx::query!(
            r#"
                SELECT ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,sfzh
                    FROM yuangong
                ORDER BY sfzh DESC
            "#
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Yuangong> = vec![];
        for rec in recs {
            books.push(Yuangong{
                ygxm: rec.ygxm,
                ssbm: rec.ssbm,
                szxm: rec.szxm,
                ygjn: rec.ygjn,
                rzsj: rec.rzsj,
                rgzl: rec.rgzl,
                ygzl: rec.ygzl,
                ljgzl: rec.ljgzl,
                ygbz: rec.ygbz,
                sfzh: rec.sfzh
            });
        }
        Ok(books)
    }
    async fn yuangong(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "sfzh of yuangong")] sfzh: String,
    ) -> Result<Yuangong> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM yuangong
                WHERE sfzh = (?1)
            "#,
            sfzh
        )
        .fetch_one(pool)
        .await?;
        let book = Yuangong{
            ygxm: rec.ygxm,
            ssbm: rec.ssbm,
            szxm: rec.szxm,
            ygjn: rec.ygjn,
            rzsj: rec.rzsj,
            rgzl: rec.rgzl,
            ygzl: rec.ygzl,
            ljgzl: rec.ljgzl,
            ygbz: rec.ygbz,
            sfzh: rec.sfzh
        };
        Ok(book)
    }

}

pub struct YgMutation;

#[Object]
impl YgMutation {
    async fn create_yuangong(&self, ctx: &Context<'_>, ygxm: String, ssbm: Option<String>, szxm: Option<String>, ygjn: Option<String>,
     rzsj: Option<String>, rgzl: Option<String>, ygzl: Option<String>, ljgzl: Option<String>, ygbz: Option<String>, sfzh: String) -> Result<bool> {
        let mut pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO yuangong(ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,sfzh)
                VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)
            "#,
            ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,sfzh
        )
        .execute(&mut pool)
        .await?;
        // SimpleBroker::publish(BookChanged {
        //     mutation_type: MutationType::Created,
        //     id: id.clone(),
        // });
        Ok(done > 0)
    }

    async fn delete_yuangong(&self, ctx: &Context<'_>, sfzh: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
     
        let done = sqlx::query!(
            r#"DELETE FROM yuangong
                WHERE sfzh = $1"#,
            sfzh
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

    async fn change_yuangong(&self, ctx: &Context<'_>, nsfzh: String, ygxm: Option<String>, ssbm: Option<String>, szxm: Option<String>,
    ygjn: Option<String>, rzsj: Option<String>, rgzl: Option<String>, ygzl: Option<String>, ljgzl: Option<String>, ygbz: Option<String>, osfzh: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE yuangong
                SET sfzh = $1, ygxm = $2, ssbm = $3, szxm = $4, ygjn = $5, rzsj = $6, rgzl = $7, ygzl = $8, ljgzl = $9, ygbz = $10
                WHERE sfzh = $11"#,
            nsfzh,ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,osfzh
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