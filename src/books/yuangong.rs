use async_graphql::{Context, Object, Result};
use sqlx::SqlitePool;

#[derive(Clone)]
pub struct Yuangong {
    pub id: i32,
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
    async fn id(&self) -> &i32 {
        &self.id
    }
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
                SELECT id,ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,sfzh
                    FROM yuangong
                ORDER BY id DESC
            "#
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Yuangong> = vec![];
        for rec in recs {
            books.push(Yuangong{
                id: rec.id,
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
        #[graphql(desc = "sfzh of yuangong")] id: i32,
    ) -> Result<Yuangong> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM yuangong
                WHERE id = (?1)
            "#,
            id
        )
        .fetch_one(pool)
        .await?;
        let book = Yuangong{
            id: rec.id,
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
     rzsj: Option<String>, rgzl: Option<String>, ygzl: Option<String>, ljgzl: Option<String>, ygbz: Option<String>, sfzh: String) -> Result<Yuangong> {
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
        if done == 1 {
            let rec = sqlx::query!(
                r#"
                    SELECT * FROM yuangong ORDER BY id DESC
                "#
            )
            .fetch_one(pool)
            .await?;
            let nyg = Yuangong{
                id: rec.id,
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
            Ok(nyg)
        }else{
            let oyg = Yuangong{
                id: -1,
                ygxm: ygxm,
                ssbm: ssbm,
                szxm: szxm,
                ygjn: ygjn,
                rzsj: rzsj,
                rgzl: rgzl,
                ygzl: ygzl,
                ljgzl: ljgzl,
                ygbz: ygbz,
                sfzh: sfzh
            };
            Ok(oyg)
        }
    }

    async fn delete_yuangong(&self, ctx: &Context<'_>, id: i32) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
     
        let done = sqlx::query!(
            r#"DELETE FROM yuangong
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

    async fn update_yuangong(&self, ctx: &Context<'_>, id: i32, sfzh: String, ygxm: String, ssbm: Option<String>, szxm: Option<String>,
    ygjn: Option<String>, rzsj: Option<String>, rgzl: Option<String>, ygzl: Option<String>, ljgzl: Option<String>, ygbz: Option<String>) -> Result<Yuangong> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE yuangong
                SET sfzh = $1, ygxm = $2, ssbm = $3, szxm = $4, ygjn = $5, rzsj = $6, rgzl = $7, ygzl = $8, ljgzl = $9, ygbz = $10
                WHERE id = $11"#,
            sfzh,ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,id
        )
        .execute(pool)
        .await?;
        if done == 1 {
            let nyg = Yuangong{
                id: id,
                ygxm: ygxm,
                ssbm: ssbm,
                szxm: szxm,
                ygjn: ygjn,
                rzsj: rzsj,
                rgzl: rgzl,
                ygzl: ygzl,
                ljgzl: ljgzl,
                ygbz: ygbz,
                sfzh: sfzh
            };
            Ok(nyg)
        }else{
            let rec = sqlx::query!(
                r#"
                    SELECT * FROM yuangong
                        WHERE id = $1
                "#,
                id
            )
            .fetch_one(pool)
            .await?;
            let oyg = Yuangong{
                id: rec.id,
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
            Ok(oyg)
        }
    }
}