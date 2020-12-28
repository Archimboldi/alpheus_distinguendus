use async_graphql::{Context, Object, Result};
use sqlx::postgres::PgPool;

#[derive(Clone)]
pub struct Haocai {
    pub id: i32,
    pub hcmc: Option<String>,
    pub gg: Option<String>,
    pub sl: Option<String>,
    pub dw: Option<String>,
    pub lj: Option<String>,
    pub hcbz: Option<String>,
    pub hcdj: Option<String>,
}

#[Object]
impl Haocai {
    async fn id(&self) -> &i32 {
        &self.id
    }
    async fn hcmc(&self) -> Option<&String> {
        self.hcmc.as_ref()
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
    async fn haocais(&self, ctx: &Context<'_>, hcmc: String) -> Result<Vec<Haocai>> {
        let pool = ctx.data_unchecked::<PgPool>();
        let cc = format!("%{}%", hcmc);
        let recs = sqlx::query!(
            r#"
                SELECT id,hcmc,gg,sl,dw,lj,hcbz,hcdj
                    FROM haocai WHERE hcmc LIKE $1
                ORDER BY id DESC
            "#,
            cc
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Haocai> = vec![];
        for rec in recs {
            books.push(Haocai{
                id: rec.id,
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
    // async fn haocai(
    //     &self,
    //     ctx: &Context<'_>,
    //     #[graphql(desc = "id of haocai")] id: i32,
    // ) -> Result<Haocai> {
    //     let pool = ctx.data_unchecked::<PgPool>();
    //     let rec = sqlx::query!(
    //         r#"
    //             SELECT * FROM haocai
    //             WHERE id = (?1)
    //         "#,
    //         id
    //     )
    //     .fetch_one(pool)
    //     .await?;
    //     let book = Haocai{
    //         id: rec.id,
    //         hcmc: rec.hcmc,
    //         gg: rec.gg,
    //         sl: rec.sl,
    //         dw: rec.dw,
    //         lj: rec.lj,
    //         hcbz: rec.hcbz,
    //         hcdj: rec.hcdj
    //     };
    //     Ok(book)
    // }

}

pub struct HcMutation;

#[Object]
impl HcMutation {
    async fn create_haocai(&self, ctx: &Context<'_>, hcmc: Option<String>, gg: Option<String>, sl: Option<String>, dw: Option<String>,
     lj: Option<String>, hcbz: Option<String>, hcdj: Option<String>) -> Result<Haocai> {
        let mut pool = ctx.data_unchecked::<PgPool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO haocai(hcmc,gg,sl,dw,lj,hcbz,hcdj)
                VALUES ($1,$2,$3,$4,$5,$6,$7)
            "#,
            hcmc,gg,sl,dw,lj,hcbz,hcdj
        )
        .execute(&mut pool)
        .await?;
        if done == 1 {
            let rec = sqlx::query!(
                r#"
                    SELECT * FROM haocai ORDER BY id DESC
                "#
            )
            .fetch_one(pool)
            .await?;
            let nhc = Haocai{
                id: rec.id,
                hcmc: rec.hcmc,
                gg: rec.gg,
                sl: rec.sl,
                dw: rec.dw,
                lj: rec.lj,
                hcbz: rec.hcbz,
                hcdj: rec.hcdj
            };
            Ok(nhc)
        }else{
            let ohc = Haocai{
                id: -1,
                hcmc: hcmc,
                gg: gg,
                sl: sl,
                dw: dw,
                lj: lj,
                hcbz: hcbz,
                hcdj: hcdj
            };
            Ok(ohc)
        }
    }

    // async fn delete_haocai(&self, ctx: &Context<'_>, id: i32) -> Result<bool> {
    //     let pool = ctx.data_unchecked::<PgPool>();
     
    //     let done = sqlx::query!(
    //         r#"DELETE FROM haocai
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

    async fn update_haocai(&self, ctx: &Context<'_>, id:i32, hcmc: Option<String>, gg: Option<String>, sl: Option<String>, dw: Option<String>,
    lj: Option<String>, hcbz: Option<String>, hcdj: Option<String>) -> Result<Haocai> {
        let pool = ctx.data_unchecked::<PgPool>();
        let done = sqlx::query!(
            r#"UPDATE haocai
                SET hcmc = $1, gg = $2, sl = $3, dw = $4, lj = $5, hcbz = $6, hcdj = $7
                WHERE id = $8"#,
            hcmc,gg,sl,dw,lj,hcbz,hcdj,id
        )
        .execute(pool)
        .await?;
        if done == 1 {
            let nhc = Haocai{
                id: id,
                hcmc: hcmc,
                gg: gg,
                sl: sl,
                dw: dw,
                lj: lj,
                hcbz: hcbz,
                hcdj: hcdj
            };
            Ok(nhc)
        }else{
            let rec = sqlx::query!(
                r#"
                    SELECT * FROM haocai
                        WHERE id = $1
                "#,
                id
            )
            .fetch_one(pool)
            .await?;
            let ohc = Haocai{
                id: rec.id,
                hcmc: rec.hcmc,
                gg: rec.gg,
                sl: rec.sl,
                dw: rec.dw,
                lj: rec.lj,
                hcbz: rec.hcbz,
                hcdj: rec.hcdj
            };
            Ok(ohc)
        }
    }
}
