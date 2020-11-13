use async_graphql::{Context, Enum, Object, Schema, Subscription, Result};
use futures::{Stream, StreamExt};
use super::simple_broker::SimpleBroker;
use std::time::Duration;
use sqlx::SqlitePool;

pub type BooksSchema = Schema<QueryRoot, MutationRoot, SubscriptionRoot>;

#[derive(Clone)]
pub struct Shebei {
    pub zcbh: String,
    pub szbm: Option<String>,
    pub szxm: Option<String>,
    pub sblx: Option<String>,
    pub sbpp: Option<String>,
    pub sbxh: Option<String>,
    pub xlh: Option<String>,
    pub smcs: Option<String>,
    pub sbbz: Option<String>
}

#[Object]
impl Shebei {
    async fn zcbh(&self) -> &str {
        &self.zcbh
    }
    async fn szbm(&self) -> Option<&String> {
        self.szbm.as_ref()
    }
    async fn szxm(&self) -> Option<&String> {
        self.szxm.as_ref()
    }
    async fn sblx(&self) -> Option<&String> {
        self.sblx.as_ref()
    }
    async fn sbpp(&self) -> Option<&String> {
        self.sbpp.as_ref()
    }
    async fn sbxh(&self) -> Option<&String> {
        self.sbxh.as_ref()
    }
    async fn xlh(&self) -> Option<&String> {
        self.xlh.as_ref()
    }
    async fn smcs(&self) -> Option<&String> {
        self.smcs.as_ref()
    }
    async fn sbbz(&self) -> Option<&String> {
        self.sbbz.as_ref()
    }
}

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn shebeis(&self, ctx: &Context<'_>) -> Result<Vec<Shebei>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let recs = sqlx::query!(
            r#"
                SELECT zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz
                    FROM shebei
                ORDER BY zcbh DESC
            "#
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Shebei> = vec![];
        for rec in recs {
            books.push(Shebei{
                zcbh: rec.zcbh,
                szbm: rec.szbm,
                szxm: rec.szxm,
                sblx: rec.sblx,
                sbpp: rec.sbpp,
                sbxh: rec.sbxh,
                xlh: rec.xlh,
                smcs: rec.smcs,
                sbbz: rec.sbbz
            });
        }
        Ok(books)
    }
    async fn shebei(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "zcbh of shebei")] zcbh: String,
    ) -> Result<Shebei> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM shebei
                WHERE zcbh = (?1)
            "#,
            zcbh
        )
        .fetch_one(pool)
        .await?;
        let book = Shebei{
            zcbh: rec.zcbh,
            szbm: rec.szbm,
            szxm: rec.szxm,
            sblx: rec.sblx,
            sbpp: rec.sbpp,
            sbxh: rec.sbxh,
            xlh: rec.xlh,
            smcs: rec.smcs,
            sbbz: rec.sbbz
        };
        Ok(book)
    }

}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_shebei(&self, ctx: &Context<'_>, zcbh: String, szbm: Option<String>, szxm: Option<String>, sblx: Option<String>,
     sbpp: Option<String>, sbxh: Option<String>, xlh: Option<String>, smcs: Option<String>, sbbz: Option<String>) -> Result<bool> {
        let mut pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO shebei(zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz)
                VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)
            "#,
            zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz
        )
        .execute(&mut pool)
        .await?;
        // SimpleBroker::publish(BookChanged {
        //     mutation_type: MutationType::Created,
        //     id: id.clone(),
        // });
        Ok(done > 0)
    }

    async fn delete_shebei(&self, ctx: &Context<'_>, zcbh: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
     
        let done = sqlx::query!(
            r#"DELETE FROM shebei
                WHERE zcbh = $1"#,
            zcbh
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

    async fn change_shebei(&self, ctx: &Context<'_>, nzcbh: String, szbm: Option<String>, szxm: Option<String>, sblx: Option<String>,
    sbpp: Option<String>, sbxh: Option<String>, xlh: Option<String>, smcs: Option<String>, sbbz: Option<String>, ozcbh: String,) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE shebei
                SET zcbh = $1, szbm = $2, szxm = $3, sblx = $4, sbpp = $5, sbxh = $6, xlh = $7, smcs = $8, sbbz = $9
                WHERE zcbh = $10"#,
            nzcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz,ozcbh
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