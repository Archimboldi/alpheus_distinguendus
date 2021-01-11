use async_graphql::*;
use sqlx::postgres::PgPool;
use sqlx::Done;

#[derive(Clone)]
pub struct Shebei {
    pub id: i32,
    pub zcbh: Option<String>,
    pub szbm: Option<String>,
    pub szxm: Option<i32>,
    pub sblx: Option<String>,
    pub sbpp: Option<String>,
    pub sbxh: Option<String>,
    pub smcs: Option<String>,
    pub sbbz: Option<String>,
    pub xlh: Option<String>
}
#[derive(Clone)]
pub struct Shebei_ {
    pub id: i32,
    pub zcbh: Option<String>,
    pub szbm: Option<String>,
    pub szxm: Option<i32>,
    pub xmmc: Option<String>,
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
    async fn szxm(&self) -> Option<&i32> {
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
#[Object]
impl Shebei_ {
    async fn id(&self) -> &i32 {
        &self.id
    }
    async fn zcbh(&self) -> Option<&String> {
        self.zcbh.as_ref()
    }
    async fn szbm(&self) -> Option<&String> {
        self.szbm.as_ref()
    }
    async fn szxm(&self) -> Option<&i32> {
        self.szxm.as_ref()
    }
    async fn xmmc(&self) -> Option<&String> {
        self.xmmc.as_ref()
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
    async fn shebeis(&self, ctx: &Context<'_>,sbxh:String, sblx:String) -> Result<Vec<Shebei_>> {
        let pool = ctx.data_unchecked::<PgPool>();
        let cc = format!("%{}%", sbxh);
        
        if sblx=="-1" {
            let recs = sqlx::query!(
                r#"
                SELECT shebei.id,zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz,xiangmu.xmmc
                FROM shebei left join xiangmu on xiangmu.id=shebei.szxm WHERE xiangmu.xmmc like $1
                 or szbm like $1 or sblx like $1 or sbpp like $1 or sbxh like $1 or xlh like $1 or sbbz like $1;
                "#,
                cc
            )
            .fetch_all(pool)
            .await?;
            let mut books: Vec<Shebei_> = vec![];
            for rec in recs {
                books.push(Shebei_{
                    id: rec.id,
                    zcbh: rec.zcbh,
                    szbm: rec.szbm,
                    szxm: rec.szxm,
                    xmmc: if rec.szxm.unwrap()==0{Some("库房".to_string())}else{rec.xmmc},
                    sblx: rec.sblx,
                    sbpp: rec.sbpp,
                    sbxh: rec.sbxh,
                    xlh: rec.xlh,
                    smcs: rec.smcs,
                    sbbz: rec.sbbz
                });
            }
            Ok(books)
        }else if sblx=="0"{
            let recs = sqlx::query!(
                r#"
                SELECT shebei.id,zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz,xiangmu.xmmc
                FROM shebei left join xiangmu on xiangmu.id=shebei.szxm 
                WHERE szxm = $1 AND (xiangmu.xmmc like $2 or szbm like $2
                    or sblx like $2 or sbpp like $2 or sbxh like $2 or xlh like $2 or sbbz like $2);
                "#,
                0,cc
            )
            .fetch_all(pool)
            .await?;
            let mut books: Vec<Shebei_> = vec![];
            for rec in recs {
                books.push(Shebei_{
                    id: rec.id,
                    zcbh: rec.zcbh,
                    szbm: rec.szbm,
                    szxm: rec.szxm,
                    xmmc: if rec.szxm.unwrap()==0{Some("库房".to_string())}else{rec.xmmc},
                    sblx: rec.sblx,
                    sbpp: rec.sbpp,
                    sbxh: rec.sbxh,
                    xlh: rec.xlh,
                    smcs: rec.smcs,
                    sbbz: rec.sbbz
                });
            }
            Ok(books)
        }else{
            let recs = sqlx::query!(
                r#"
                SELECT shebei.id,zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz,xiangmu.xmmc
                FROM shebei left join xiangmu on xiangmu.id=shebei.szxm 
                WHERE sblx = $1 AND (xiangmu.xmmc like $2
                or szbm like $2 or sbpp like $2 or sbxh like $2 or xlh like $2 or sbbz like $2);
                "#,
                sblx,cc
            )
            .fetch_all(pool)
            .await?;
            let mut books: Vec<Shebei_> = vec![];
            for rec in recs {
                books.push(Shebei_{
                    id: rec.id,
                    zcbh: rec.zcbh,
                    szbm: rec.szbm,
                    szxm: rec.szxm,
                    xmmc: if rec.szxm.unwrap()==0{Some("库房".to_string())}else{rec.xmmc},
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
    }
    async fn shebei(
        &self,
        ctx: &Context<'_>,
        id: i32,
    ) -> Result<Vec<Shebei>> {
        let pool = ctx.data_unchecked::<PgPool>();
        let shebeis = sqlx::query!(
            r#"
                SELECT * FROM shebei
                WHERE szxm = $1
            "#,
            id
        )
        .fetch_all(pool)
        .await?;
        let mut ss: Vec<Shebei> = vec![];
        for rec in shebeis {
            ss.push(Shebei{
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
        };
        Ok(ss)
    }
    async fn sblxs(&self,
        ctx: &Context<'_>) -> Result<Vec<Shebei>> {
            let pool = ctx.data_unchecked::<PgPool>();
            let recs = sqlx::query!(r#"
                SELECT distinct sblx FROM shebei
            "#)
            .fetch_all(pool)
            .await?;
         
            let mut ss: Vec<Shebei> = vec![];
            for rec in recs {
                ss.push(Shebei{
                    id: -1,
                    zcbh: Some("".to_string()),
                    szbm: Some("".to_string()),
                    szxm: Some(-1),
                    sblx: rec.sblx,
                    sbpp: Some("".to_string()),
                    sbxh: Some("".to_string()),
                    xlh: Some("".to_string()),
                    smcs: Some("".to_string()),
                    sbbz: Some("".to_string())
                });
            };
            Ok(ss)
        }
}

pub struct SbMutation;

#[Object]
impl SbMutation {
    async fn create_shebei(&self, ctx: &Context<'_>, zcbh: Option<String>, szbm: Option<String>, szxm: Option<i32>, xmmc:Option<String>,sblx: Option<String>,
     sbpp: Option<String>, sbxh: Option<String>, xlh: Option<String>, smcs: Option<String>, sbbz: Option<String>) -> Result<Shebei_> {
        let pool = ctx.data_unchecked::<PgPool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO shebei (zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            "#,
            zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz
        )
        .execute(pool)
        .await?
        .rows_affected();
        if done == 1 {
            let rec = sqlx::query!(
                r#"
                    SELECT shebei.id,zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz,xiangmu.xmmc
                    FROM shebei left join xiangmu on xiangmu.id=shebei.szxm ORDER BY shebei.id DESC
                "#
            )
            .fetch_one(pool)
            .await?;
            let nsb = Shebei_ {
                id: rec.id,
                zcbh: rec.zcbh,
                szbm: rec.szbm,
                szxm: rec.szxm,
                xmmc: rec.xmmc,
                sblx: rec.sblx,
                sbpp: rec.sbpp,
                sbxh: rec.sbxh,
                xlh: rec.xlh,
                smcs: rec.smcs,
                sbbz: rec.sbbz
            };
            Ok(nsb)
        }else{
            let osb = Shebei_ {
                id: -1,
                zcbh: zcbh,
                szbm: szbm,
                szxm: szxm,
                xmmc: xmmc,
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

    // async fn delete_shebei(&self, ctx: &Context<'_>, id: i32) -> Result<Shebei> {
    //     let pool = ctx.data_unchecked::<PgPool>();
        
    //     let rec = sqlx::query!(
    //         r#"SELECT * FROM shebei
    //             WHERE id = $1
    //         "#,
    //         id
    //     )
    //     .fetch_one(pool)
    //     .await?;
    //     let book = Shebei{
    //         id: rec.id,
    //         zcbh: rec.zcbh,
    //         szbm: rec.szbm,
    //         szxm: rec.szxm,
    //         sblx: rec.sblx,
    //         sbpp: rec.sbpp,
    //         sbxh: rec.sbxh,
    //         xlh: rec.xlh,
    //         smcs: rec.smcs,
    //         sbbz: rec.sbbz
    //     };
    //     let _done = sqlx::query!(
    //         r#"DELETE FROM shebei
    //             WHERE id = $1"#,
    //             id
    //     )
    //     .execute(pool)
    //     .await?;

    //     Ok(book)
    // }

    async fn update_shebei(&self, ctx: &Context<'_>, id: i32, zcbh: Option<String>, szbm: Option<String>, szxm: Option<i32>,xmmc:Option<String>,sblx: Option<String>,
    sbpp: Option<String>, sbxh: Option<String>, xlh: Option<String>, smcs: Option<String>, sbbz: Option<String>) -> Result<Shebei_> {
        let pool = ctx.data_unchecked::<PgPool>();
        let done = sqlx::query!(
            r#"UPDATE shebei
                SET zcbh = $1, szbm = $2, szxm = $3, sblx = $4, sbpp = $5, sbxh = $6, xlh = $7, smcs = $8, sbbz = $9
                WHERE id = $10"#,
            zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz,id
        )
        .execute(pool)
        .await?
        .rows_affected();
        if done > 0 {
            let nsb = Shebei_ {
                id: id,
                zcbh: zcbh,
                szbm: szbm,
                szxm: szxm,
                xmmc: xmmc,
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
                r#"SELECT shebei.id,zcbh,szbm,szxm,sblx,sbpp,sbxh,xlh,smcs,sbbz,xiangmu.xmmc FROM shebei
                    left join xiangmu on xiangmu.id=shebei.szxm WHERE shebei.id = $1
                "#,
                id
            )
            .fetch_one(pool)
            .await?;
            let book = Shebei_{
                id: rec.id,
                zcbh: rec.zcbh,
                szbm: rec.szbm,
                szxm: rec.szxm,
                xmmc: rec.xmmc,
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

