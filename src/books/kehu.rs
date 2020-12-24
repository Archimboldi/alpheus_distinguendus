use async_graphql::{Context, Object, Result};
use sqlx::SqlitePool;

#[derive(Clone)]
pub struct Kehu {
    pub id: i32,
    pub khbh: Option<String>,
    pub khxm: String,
    pub ssxm: Option<String>,
    pub khxb: Option<String>,
    pub khgx: Option<String>,
    pub khbz: Option<String>,
    pub khlx: Option<String>,
}

#[Object]
impl Kehu {
    async fn id (&self) -> &i32 {
        &self.id
    }
    async fn khbh(&self) -> Option<&String> {
        self.khbh.as_ref()
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
    async fn kehus(&self, ctx: &Context<'_>, khxm: String) -> Result<Vec<Kehu>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let cc = format!("%{}%", khxm);
        let recs = sqlx::query!(
            r#"
                SELECT id,khbh,khxm,ssxm,khxb,khgx,khbz,khlx
                    FROM kehu WHERE khxm LIKE $1
                ORDER BY id DESC
            "#,
            cc
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Kehu> = vec![];
        for rec in recs {
            books.push(Kehu{
                id: rec.id,
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
        id: i32
    ) -> Result<Vec<Kehu>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let kehus = sqlx::query!(
            r#"
                SELECT * FROM kehu
                WHERE ssxm = (?1)
            "#,
            id
        )
        .fetch_all(pool)
        .await?;
        let mut ks: Vec<Kehu> = vec![];
        for rec in kehus {
            ks.push(Kehu{
                id: rec.id,
                khbh: rec.khbh,
                khxm: rec.khxm,
                ssxm: rec.ssxm,
                khxb: rec.khxb,
                khgx: rec.khgx,
                khbz: rec.khbz,
                khlx: rec.khlx
            });
        };
        Ok(ks)
    }

}

pub struct KhMutation;

#[Object]
impl KhMutation {
    async fn create_kehu(&self, ctx: &Context<'_>, khbh: Option<String>, khxm: String, ssxm: Option<String>, khxb: Option<String>,
     khgx: Option<String>, khbz: Option<String>, khlx: Option<String>) -> Result<Kehu> {
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
        if done == 1 {
            let rec = sqlx::query!(
                r#"
                    SELECT * FROM kehu ORDER BY id DESC
                "#
            )
            .fetch_one(pool)
            .await?;
            let nkh = Kehu{
                id: rec.id,
                khbh: rec.khbh,
                khxm: rec.khxm,
                ssxm: rec.ssxm,
                khxb: rec.khxb,
                khgx: rec.khgx,
                khbz: rec.khbz,
                khlx: rec.khlx
            };
            Ok(nkh)
        }else{
            let okh = Kehu{
                id: -1,
                khbh: khbh,
                khxm: khxm,
                ssxm: ssxm,
                khxb: khxb,
                khgx: khgx,
                khbz: khbz,
                khlx: khlx
            };
            Ok(okh)
        }
    }

    // async fn delete_kehu(&self, ctx: &Context<'_>, id: i32) -> Result<bool> {
    //     let pool = ctx.data_unchecked::<SqlitePool>();
     
    //     let done = sqlx::query!(
    //         r#"DELETE FROM kehu
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

    async fn update_kehu(&self, ctx: &Context<'_>, id: i32, khbh: Option<String>, khxm: String, ssxm: Option<String>, khxb: Option<String>,
    khgx: Option<String>, khbz: Option<String>, khlx: Option<String>) -> Result<Kehu> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE kehu
                SET khbh = $1, khxm = $2, ssxm = $3, khxb = $4, khgx = $5, khbz = $6, khlx = $7
                WHERE id = $8"#,
            khbh,khxm,ssxm,khxb,khgx,khbz,khlx,id
        )
        .execute(pool)
        .await?;
        if done == 1 {
            let nkh = Kehu{
                id: id,
                khbh: khbh,
                khxm: khxm,
                ssxm: ssxm,
                khxb: khxb,
                khgx: khgx,
                khbz: khbz,
                khlx: khlx
            };
            Ok(nkh)
        }else{
            let rec = sqlx::query!(
                r#"
                    SELECT * FROM kehu
                        WHERE id = $1
                "#,
                id
            )
            .fetch_one(pool)
            .await?;
            let okh = Kehu{
                id: rec.id,
                khbh: rec.khbh,
                khxm: rec.khxm,
                ssxm: rec.ssxm,
                khxb: rec.khxb,
                khgx: rec.khgx,
                khbz: rec.khbz,
                khlx: rec.khlx
            };
            Ok(okh)
        }
    }
}
