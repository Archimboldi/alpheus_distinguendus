use async_graphql::{Context, Object, Result};
use sqlx::SqlitePool;


#[derive(Clone)]
pub struct Xiangmu {
    pub id: i32,
    pub xmbh: Option<String>,
    pub xmmc: Option<String>,
    pub xmfzr: Option<String>,
    pub xmlx: Option<String>,
    pub gclzl: Option<String>,
    pub gcllr: Option<String>,
    pub gclsm: Option<String>,
    pub gclcl: Option<String>,
    pub xmdd: Option<String>,
    pub xmbz: Option<String>,
    pub xmhth: Option<String>
}


#[Object]
impl Xiangmu {
    async fn id(&self) -> &i32 {
        &self.id
    }
    async fn xmbh(&self) -> Option<&String> {
        self.xmbh.as_ref()
    }
    async fn xmmc(&self) -> Option<&String> {
        self.xmmc.as_ref()
    }
    async fn xmfzr(&self) -> Option<&String> {
        self.xmfzr.as_ref()
    }
    async fn xmlx(&self) -> Option<&String> {
        self.xmlx.as_ref()
    }
    async fn gclzl(&self) -> Option<&String> {
        self.gclzl.as_ref()
    }
    async fn gcllr(&self) -> Option<&String> {
        self.gcllr.as_ref()
    }
    async fn gclsm(&self) -> Option<&String> {
        self.gclsm.as_ref()
    }
    async fn gclcl(&self) -> Option<&String> {
        self.gclcl.as_ref()
    }
    async fn xmdd(&self) -> Option<&String> {
        self.xmdd.as_ref()
    }
    async fn xmbz(&self) -> Option<&String> {
        self.xmbz.as_ref()
    }
    async fn xmhth(&self) -> Option<&String> {
        self.xmhth.as_ref()
    }
}


pub struct XmQuery;

#[Object]
impl XmQuery {
    async fn xiangmus(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "xmmc of xiangmu")] xmmc: String
    ) -> Result<Vec<Xiangmu>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let cc = format!("%{}%", xmmc);
        let recs = sqlx::query!(
            r#"
                SELECT * FROM xiangmu
                WHERE xmmc LIKE $1
            "#,
            cc
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Xiangmu> = vec![];
        for rec in recs {
            books.push(Xiangmu{
                id: rec.id,
                xmbh: rec.xmbh,
                xmmc: rec.xmmc,
                xmfzr: rec.xmfzr,
                xmlx: rec.xmlx,
                gclzl: rec.gclzl,
                gcllr: rec.gcllr,
                gclsm: rec.gclsm,
                gclcl: rec.gclcl,
                xmdd: rec.xmdd,
                xmbz: rec.xmbz,
                xmhth: rec.xmhth
            });
        }
        Ok(books)
    }
    
}

pub struct XmMutation;

#[Object]
impl XmMutation {
    async fn create_xiangmu(&self, ctx: &Context<'_>, xmbh: Option<String>, xmmc: Option<String>, xmfzr: Option<String>, xmlx: Option<String>,
     gclzl: Option<String>, gcllr: Option<String>, gclsm: Option<String>, gclcl: Option<String>,
      xmdd: Option<String>, xmbz: Option<String>, xmhth: Option<String>) -> Result<Xiangmu> {
        let mut pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"
            INSERT INTO xiangmu(xmbh,xmmc,xmfzr,xmlx,gclzl,gcllr,gclsm,gclcl,xmdd,xmbz,xmhth)
                VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)
            "#,
            xmbh,xmmc,xmfzr,xmlx,gclzl,gcllr,gclsm,gclcl,xmdd,xmbz,xmhth
        )
        .execute(&mut pool)
        .await?;
        if done == 1 {
            let rec = sqlx::query!(
                r#"
                    SELECT * FROM xiangmu ORDER BY id DESC
                "#
            )
            .fetch_one(pool)
            .await?;
            let nxm = Xiangmu{
                id: rec.id,
                xmbh: rec.xmbh,
                xmmc: rec.xmmc,
                xmfzr: rec.xmfzr,
                xmlx: rec.xmlx,
                gclzl: rec.gclzl,
                gcllr: rec.gcllr,
                gclsm: rec.gclsm,
                gclcl: rec.gclcl,
                xmdd: rec.xmdd,
                xmbz: rec.xmbz,
                xmhth: rec.xmhth
            };
            Ok(nxm)
        }else{
            let oxm = Xiangmu{
                id: -1,
                xmbh: xmbh,
                xmmc: xmmc,
                xmfzr: xmfzr,
                xmlx: xmlx,
                gclzl: gclzl,
                gcllr: gcllr,
                gclsm: gclsm,
                gclcl: gclcl,
                xmdd: xmdd,
                xmbz: xmbz,
                xmhth: xmhth
            };
            Ok(oxm)
        }
    }

    // async fn delete_xiangmu(&self, ctx: &Context<'_>, id: i32) -> Result<bool> {
    //     let pool = ctx.data_unchecked::<SqlitePool>();
     
    //     let done = sqlx::query!(
    //         r#"DELETE FROM xiangmu
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

    async fn update_xiangmu(&self, ctx: &Context<'_>, id: i32, xmbh: Option<String>, xmmc: Option<String>, xmfzr: Option<String>, xmlx: Option<String>,
    gclzl: Option<String>, gcllr: Option<String>, gclsm: Option<String>, gclcl: Option<String>, xmdd: Option<String>, xmbz: Option<String>, xmhth: Option<String>) -> Result<Xiangmu> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE xiangmu
                SET xmbh= $1,xmmc= $2,xmfzr= $3,xmlx= $4,gclzl= $5,gcllr= $6,gclsm= $7,gclcl= $8,xmdd= $9,xmbz= $10,xmhth= $11
                WHERE id = $12"#,
            xmbh,xmmc,xmfzr,xmlx,gclzl,gcllr,gclsm,gclcl,xmdd,xmbz,xmhth,id
        )
        .execute(pool)
        .await?;
        if done == 1 {
            let nxm = Xiangmu{
                id: id,
                xmbh: xmbh,
                xmmc: xmmc,
                xmfzr: xmfzr,
                xmlx: xmlx,
                gclzl: gclzl,
                gcllr: gcllr,
                gclsm: gclsm,
                gclcl: gclcl,
                xmdd: xmdd,
                xmbz: xmbz,
                xmhth: xmhth
            };
            Ok(nxm)
        }else{
            let rec = sqlx::query!(
                r#"
                    SELECT * FROM xiangmu
                        WHERE id = $1
                "#,
                id
            )
            .fetch_one(pool)
            .await?;
            let oxm = Xiangmu{
                id: rec.id,
                xmbh: rec.xmbh,
                xmmc: rec.xmmc,
                xmfzr: rec.xmfzr,
                xmlx: rec.xmlx,
                gclzl: rec.gclzl,
                gcllr: rec.gcllr,
                gclsm: rec.gclsm,
                gclcl: rec.gclcl,
                xmdd: rec.xmdd,
                xmbz: rec.xmbz,
                xmhth: rec.xmhth
            };
            Ok(oxm)
        }
    }
}
