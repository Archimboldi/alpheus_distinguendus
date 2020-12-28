use async_graphql::*;
pub mod shebei;
pub mod xiangmu;
pub mod kehu;
pub mod yuangong;
pub mod haocai;
pub mod rizhi;
pub mod user;
pub mod file;


#[derive(MergedObject)]
pub struct QueryRoot(pub xiangmu::XmQuery, pub shebei::SbQuery, pub kehu::KhQuery,
    pub yuangong::YgQuery, pub haocai::HcQuery, pub rizhi::RzQuery, pub user::UQuery, pub file::FileQuery);

#[derive(MergedObject)]
pub struct Mutation(pub xiangmu::XmMutation, pub shebei::SbMutation, pub kehu::KhMutation,
    pub yuangong::YgMutation, pub haocai::HcMutation, pub user::UMutation, pub file::FileMutation);

// #[derive(MergedSubscription)]
// pub struct Subscription(xiangmu::XmSubscription, shebei::SbSubscription);

pub type BooksSchema = Schema<QueryRoot, Mutation,EmptySubscription>;
