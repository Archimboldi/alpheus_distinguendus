use async_graphql::{Context, Enum, Object, Subscription, Result};
use futures::{Stream, StreamExt};
use super::simple_broker::SimpleBroker;
use std::time::Duration;
use sqlx::SqlitePool;

#[derive(Clone)]
pub struct User {
    pub uid: i32,
    pub usrn: Option<String>,
    pub upsd: Option<String>,
    pub power: Option<String>,
}

#[Object]
impl User {
    async fn uid(&self) -> &i32 {
        &self.uid
    }
    async fn usrn(&self) -> Option<&String> {
        self.usrn.as_ref()
    }
    async fn upsd(&self) -> Option<&String> {
        self.upsd.as_ref()
    }
    async fn power(&self) -> Option<&String> {
        self.power.as_ref()
    }
}

pub struct UQuery;

#[Object]
impl UQuery {
    async fn users(&self, ctx: &Context<'_>) -> Result<Vec<User>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let recs = sqlx::query!(
            r#"
                SELECT uid,usrn,upsd,power
                    FROM user
                ORDER BY uid DESC
            "#
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<User> = vec![];
        for rec in recs {
            books.push(User{
                uid: rec.uid,
                usrn: rec.usrn,
                upsd: rec.upsd,
                power: rec.power
            });
        }
        Ok(books)
    }
    async fn user(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "uid of user")] uid: String,
    ) -> Result<User> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM user
                WHERE uid = (?1)
            "#,
            uid
        )
        .fetch_one(pool)
        .await?;
        let book = User{
            uid: rec.uid,
            usrn: rec.usrn,
            upsd: rec.upsd,
            power: rec.power
        };
        Ok(book)
    }

}

pub struct UMutation;

#[Object]
impl UMutation {
    async fn create_user(&self, ctx: &Context<'_>, uid: String, usrn: Option<String>, upsd: Option<String>, power: Option<String>)
     -> Result<bool> {
        let mut pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO user(uid,usrn,upsd,power)
                VALUES (?1,?2,?3,?4)
            "#,
            uid,usrn,upsd,power
        )
        .execute(&mut pool)
        .await?;
        // SimpleBroker::publish(BookChanged {
        //     mutation_type: MutationType::Created,
        //     id: id.clone(),
        // });
        Ok(done > 0)
    }

    async fn delete_user(&self, ctx: &Context<'_>, uid: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
     
        let done = sqlx::query!(
            r#"DELETE FROM user
                WHERE uid = $1"#,
            uid
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

    async fn change_user(&self, ctx: &Context<'_>, nuid: i32, usrn: Option<String>, upsd: Option<String>, power: Option<String>, ouid: i32)
     -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE user
                SET uid = $1, usrn = $2, upsd = $3, power = $4
                WHERE uid = $5"#,
            nuid,usrn,upsd,power,ouid
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