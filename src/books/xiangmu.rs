use async_graphql::{Context, Enum, Object, Subscription, Result};
use futures::{Stream, StreamExt};
use super::simple_broker::SimpleBroker;
use std::time::Duration;
use sqlx::SqlitePool;


#[derive(Clone)]
pub struct Xiangmu {
    pub xmbh: String,
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
    async fn xmbh(&self) -> &str {
        &self.xmbh
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
    async fn xiangmus(&self, ctx: &Context<'_>) -> Result<Vec<Xiangmu>> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let recs = sqlx::query!(
            r#"
                SELECT xmbh,xmmc,xmfzr,xmlx,gclzl,gcllr,gclsm,gclcl,xmdd,xmbz,xmhth
                    FROM xiangmu
                ORDER BY xmbh DESC
            "#
        )
        .fetch_all(pool)
        .await?;
        let mut books: Vec<Xiangmu> = vec![];
        for rec in recs {
            books.push(Xiangmu{
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
    async fn xiangmu(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "xmbh of xiangmu")] xmbh: String,
    ) -> Result<Xiangmu> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let rec = sqlx::query!(
            r#"
                SELECT * FROM xiangmu
                WHERE xmbh = (?1)
            "#,
            xmbh
        )
        .fetch_one(pool)
        .await?;
        let book = Xiangmu{
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
        Ok(book)
    }

}

pub struct XmMutation;

#[Object]
impl XmMutation {
    async fn create_xiangmu(&self, ctx: &Context<'_>, xmbh: String, xmmc: Option<String>, xmfzr: Option<String>, xmlx: Option<String>,
     gclzl: Option<String>, gcllr: Option<String>, gclsm: Option<String>, gclcl: Option<String>, xmdd: Option<String>, xmbz: Option<String>, xmhth: Option<String>) -> Result<bool> {
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
        // SimpleBroker::publish(BookChanged {
        //     mutation_type: MutationType::Created,
        //     id: id.clone(),
        // });
        Ok(done > 0)
    }

    async fn delete_xiangmu(&self, ctx: &Context<'_>, xmbh: String) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
     
        let done = sqlx::query!(
            r#"DELETE FROM xiangmu
                WHERE xmbh = $1"#,
            xmbh
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

    async fn change_xiangmu(&self, ctx: &Context<'_>, nxmbh: String, xmmc: Option<String>, xmfzr: Option<String>, xmlx: Option<String>,
    gclzl: Option<String>, gcllr: Option<String>, gclsm: Option<String>, gclcl: Option<String>, xmdd: Option<String>, xmbz: Option<String>, xmhth: Option<String>, oxmbh: String,) -> Result<bool> {
        let pool = ctx.data_unchecked::<SqlitePool>();
        let done = sqlx::query!(
            r#"UPDATE xiangmu
                SET xmbh= $1,xmmc= $2,xmfzr= $3,xmlx= $4,gclzl= $5,gcllr= $6,gclsm= $7,gclcl= $8,xmdd= $9,xmbz= $10,xmhth= $11
                WHERE xmbh = $12"#,
            nxmbh,xmmc,xmfzr,xmlx,gclzl,gcllr,gclsm,gclcl,xmdd,xmbz,xmhth,oxmbh
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
    xmbh: String,
}

#[Object]
impl BookChanged {
    async fn mutation_type(&self) -> MutationType {
        self.mutation_type
    }

    async fn xmbh(&self) -> &str {
        &self.xmbh
    }

}

pub struct XmSubscription;

#[Subscription]
impl XmSubscription {
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