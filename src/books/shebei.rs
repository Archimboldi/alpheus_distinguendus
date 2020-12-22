use async_graphql::*;
use sqlx::SqlitePool;

#[derive(Clone)]
pub struct Shebei {
    pub id: i32,
    pub zcbh: Option<String>,
    pub szbm: Option<String>,
    pub szxm: Option<String>,
    pub sblx: Option<String>,
    pub sbpp: Option<String>,
    pub sbxh: Option<String>,
    pub smcs: Option<String>,
    pub sbbz: Option<String>,
    pub xlh: Option<String>
}

#[Object]
impl Shebei {
    async fn id(&self) -> &i32 {
        &self.id
    }
    async fn zcbh(&self) -> Option<&String> {
        self.zcbh.as_ref()
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


pub struct SbQuery;

#[Object]
impl SbQuery {
    async fn shebeis(&self, ctx: &Context<'_>) -> Result<Vec<Shebei>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let recs = sqlx::query!(
            r#"
                SELECT id,zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz
                    FROM shebei
                ORDER BY id DESC
            "#
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Shebei> = vec![];
        for rec in recs {
            books.push(Shebei{
                id: rec.id,
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
        #[graphql(desc = "id of shebei")]
        id: String,
    ) -> Result<Shebei> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM shebei
                WHERE id = (?1)
            "#,
            id
        )
        .fetch_one(pool)
        .await?;
        let book = Shebei{
            id: rec.id,
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

pub struct SbMutation;

#[Object]
impl SbMutation {
    async fn create_shebei(&self, ctx: &Context<'_>, zcbh: Option<String>, szbm: Option<String>, szxm: Option<String>,sblx: Option<String>,
     sbpp: Option<String>, sbxh: Option<String>, xlh: Option<String>, smcs: Option<String>, sbbz: Option<String>) -> Result<Shebei> {
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
        if done == 1 {
            let rec = sqlx::query!(
                r#"
                    SELECT * FROM shebei ORDER BY id DESC
                "#
            )
            .fetch_one(pool)
            .await?;
            let nsb = Shebei {
                id: rec.id,
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
            Ok(nsb)
        }else{
            let osb = Shebei {
                id: -1,
                zcbh: zcbh,
                szbm: szbm,
                szxm: szxm,
                sblx: sblx,
                sbpp: sbpp,
                sbxh: sbxh,
                xlh: xlh,
                smcs: smcs,
                sbbz: sbbz
            };
            Ok(osb)
        }
        
    }

    async fn delete_shebei(&self, ctx: &Context<'_>, id: i32) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
     
        let done = sqlx::query!(
            r#"DELETE FROM shebei
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

    async fn update_todo(&self, ctx: &Context<'_>, id: i32, zcbh: Option<String>, szbm: Option<String>, szxm: Option<String>,sblx: Option<String>,
    sbpp: Option<String>, sbxh: Option<String>, xlh: Option<String>, smcs: Option<String>, sbbz: Option<String>) -> Result<Shebei> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE shebei
                SET zcbh = $1, szbm = $2, szxm = $3, sblx = $4, sbpp = $5, sbxh = $6, xlh = $7, smcs = $8, sbbz = $9
                WHERE id = $10"#,
            zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz,id
        )
        .execute(pool)
        .await?;
        if done > 0 {
            let nsb = Shebei {
                id: id,
                zcbh: zcbh,
                szbm: szbm,
                szxm: szxm,
                sblx: sblx,
                sbpp: sbpp,
                sbxh: sbxh,
                xlh: xlh,
                smcs: smcs,
                sbbz: sbbz
            };
            Ok(nsb)
        }else{
            let rec = sqlx::query!(
                r#"SELECT * FROM shebei
                    WHERE id = $1
                "#,
                id
            )
            .fetch_one(pool)
            .await?;
            let book = Shebei{
                id: rec.id,
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
}

