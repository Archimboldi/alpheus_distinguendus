use async_graphql::{Context, Object, Result};

use sqlx::postgres::PgPool;

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
    async fn users(&self, ctx: &Context<'_>, usrn:String) -> Result<Vec<User>> {
        let pool = ctx.data_unchecked::<PgPool>();
        let cc = format!("%{}%", usrn);
        let recs = sqlx::query!(
            r#"
                SELECT id,usrn,upsd,power
                    FROM users WHERE usrn like $1 ORDER BY id DESC
            "#,
            cc
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
   
}

pub struct UMutation;

#[Object]
impl UMutation {
    async fn user(&self, ctx:&Context<'_>, usrn: String, upsd: String) -> Result<User> {
        let pool = ctx.data_unchecked::<PgPool>();
        let rec = sqlx::query!(
            r#"
                SELECT id,usrn,upsd,power
                    FROM users WHERE usrn = $1
            "#,
            usrn
        )
        .fetch_one(pool)
        .await?;
        if rec.upsd == Some(upsd.clone()) {
            let done = User {
                id: rec.id,
                usrn: rec.usrn,
                upsd: rec.upsd,
                power: rec.power
            };
            Ok(done)
        }else{
            let no = User {
                id: -1,
                usrn: Some(usrn),
                upsd: Some(upsd),
                power: Some("".to_string())
            };
            Ok(no)
        }
    }
    async fn create_user(&self, ctx: &Context<'_>, usrn: Option<String>, upsd: Option<String>, power: Option<String>)
     -> Result<User> {
        let mut pool = ctx.data_unchecked::<PgPool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO users(usrn,upsd,power)
                VALUES ($1,$2,$3)
            "#,
            usrn,upsd,power
        )
        .execute(&mut pool)
        .await?;
        if done == 1 {
            let rec = sqlx::query!(
                r#"
                    SELECT * FROM users ORDER BY id DESC
                "#
            )
            .fetch_one(pool)
            .await?;
            let nur = User {
                id: rec.id,
                usrn: rec.usrn,
                upsd: rec.upsd,
                power: rec.power
            };
            Ok(nur)
        }else{
            let our = User {
                id: -1,
                usrn: usrn,
                upsd: upsd,
                power: power
            };
            Ok(our)
        }
    }

    async fn update_user(&self, ctx: &Context<'_>, id: i32, usrn: Option<String>, upsd: Option<String>, power: Option<String>)
     -> Result<User> {
        let pool = ctx.data_unchecked::<PgPool>();
        let done = sqlx::query!(
            r#"UPDATE users
                SET usrn = $1, upsd = $2, power = $3
                WHERE id = $4"#,
            usrn,upsd,power,id
        )
        .execute(pool)
        .await?;
        if done == 1 {
            let nur = User {
                id: id,
                usrn: usrn,
                upsd: upsd,
                power: power
            };
            Ok(nur)
        }else{
            let rec = sqlx::query!(
                r#"SELECT * FROM users 
                    WHERE id = $1
                "#,
                id
            )
            .fetch_one(pool)
            .await?;
            let our = User {
                id: rec.id,
                usrn: rec.usrn,
                upsd: rec.upsd,
                power: rec.power
            };
            Ok(our)
        }
     
    }
}
