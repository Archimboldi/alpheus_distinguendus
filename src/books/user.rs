use async_graphql::{Context, Object, Result};

use sqlx::SqlitePool;

#[derive(Clone)]
pub struct User {
    pub id: i32,
    pub usrn: Option<String>,
    pub upsd: Option<String>,
    pub power: Option<String>,
}

#[Object]
impl User {
    async fn id(&self) -> &i32 {
        &self.id
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
                SELECT id,usrn,upsd,power
                    FROM user
                ORDER BY id DESC
            "#
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<User> = vec![];
        for rec in recs {
            books.push(User{
                id: rec.id,
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
        #[graphql(desc = "uid of user")] id: String,
    ) -> Result<User> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM user
                WHERE id = (?1)
            "#,
            id
        )
        .fetch_one(pool)
        .await?;
        let book = User{
            id: rec.id,
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
    async fn create_user(&self, ctx: &Context<'_>, usrn: Option<String>, upsd: Option<String>, power: Option<String>)
     -> Result<bool> {
        let mut pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO user(usrn,upsd,power)
                VALUES (?1,?2,?3)
            "#,
            usrn,upsd,power
        )
        .execute(&mut pool)
        .await?;
        // SimpleBroker::publish(BookChanged {
        //     mutation_type: MutationType::Created,
        //     id: id.clone(),
        // });
        Ok(done > 0)
    }

    async fn delete_user(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
     
        let done = sqlx::query!(
            r#"DELETE FROM user
                WHERE id = $1"#,
            id
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

    async fn change_user(&self, ctx: &Context<'_>, id: i32, usrn: Option<String>, upsd: Option<String>, power: Option<String>)
     -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE user
                SET usrn = $1, upsd = $2, power = $3
                WHERE id = $4"#,
            usrn,upsd,power,id
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
