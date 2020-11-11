mod simple_broker;
use async_graphql::{Context, Enum, Object, Schema, Subscription, Result};
use futures::{Stream, StreamExt};
use simple_broker::SimpleBroker;
use std::time::Duration;
use sqlx::{SqlitePool, Row};
use sqlx::sqlite::SqliteRow;

pub type BooksSchema = Schema<QueryRoot, MutationRoot, SubscriptionRoot>;

#[derive(Clone)]
pub struct Shebei {
    pub zcbh: String,
    pub szbm: String,
    pub szxm: String,
    pub sblx: String,
    pub sbpp: String,
    pub sbxh: String,
    pub xlh: String,
    pub smcs: String,
    pub sbbz: String
}

#[Object]
impl Shebei {
    async fn zcbh(&self) -> &str {
        &self.zcbh
    }
    async fn szbm(&self) -> &str {
        &self.szbm
    }
    async fn szxm(&self) -> &str {
        &self.szxm
    }
    async fn sblx(&self) -> &str {
        &self.sblx
    }
    async fn sbpp(&self) -> &str {
        &self.sbpp
    }
    async fn sbxh(&self) -> &str {
        &self.sbxh
    }
    async fn xlh(&self) -> &str {
        &self.xlh
    }
    async fn smcs(&self) -> &str {
        &self.smcs
    }
    async fn sbbz(&self) -> &str {
        &self.sbbz
    }
}

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn books(&self, ctx: &Context<'_>) -> Result<Vec<Shebei>> {
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
                szbm: rec.szbm.unwrap(),
                szxm: rec.szxm.unwrap(),
                sblx: rec.sblx.unwrap(),
                sbpp: rec.sbpp.unwrap(),
                sbxh: rec.sbxh.unwrap(),
                xlh: rec.xlh.unwrap(),
                smcs: rec.smcs.unwrap(),
                sbbz: rec.sbbz.unwrap()
            });
        }
        Ok(books)
    }
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_book(&self, ctx: &Context<'_>, name: String) -> Result<String> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let mut tx = pool.begin().await?;

        let done = sqlx::query(
            "INSERT INTO shebei(zcbh)
                VALUES ($1) RETURNING zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz"
        )
        .bind(name)
        .map(|row: SqliteRow|{
            Shebei{
                zcbh: row.get(0),
                szbm: row.get(1),
                szxm: row.get(2),
                sblx: row.get(3),
                sbpp: row.get(4),
                sbxh: row.get(5),
                xlh: row.get(6),
                smcs: row.get(7),
                sbbz: row.get(8)
            }
        })
        .fetch_one(&mut tx)
        .await?;
        tx.commit().await?;

        // SimpleBroker::publish(BookChanged {
        //     mutation_type: MutationType::Created,
        //     id: id.clone(),
        // });
        Ok(done.zcbh)
    }

    async fn delete_book(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let mut tx = pool.begin().await?;
        let done = sqlx::query(
            "DELETE FROM shebei
                WHERE zcbh = $1"
        )
        .bind(id)
        .execute(&mut tx)
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
        tx.commit().await.unwrap();
        Ok(done > 0)
    }
}

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
enum MutationType {
    Created,
    Deleted,
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

    async fn zcid(&self) -> &str {
        &self.zcbh
    }

    async fn book(&self, ctx: &Context<'_>) -> Result<i32> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        // let id = self.zcbh.parse::<usize>()?;
        Ok(1)

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