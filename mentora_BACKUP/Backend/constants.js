const DB_USER = process.env.DB_USER || "60823286_db_user2";
const DB_PASSWORD = process.env.DB_PASSWORD || "admin";
const DB_HOST = process.env.DB_HOST || "ac-hbkkpqh-shard-00-00.bpfzaub.mongodb.net:27017,ac-hbkkpqh-shard-00-01.bpfzaub.mongodb.net:27017,ac-hbkkpqh-shard-00-02.bpfzaub.mongodb.net:27017/?ssl=true&replicaSet=atlas-mgo7m3-shard-0&authSource=admin&appName=Cluster0";
const API_VERSION = process.env.API_VERSION || "v1";
const IP_SERVER = process.env.IP_SERVER || "localhost";

module.exports = {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    API_VERSION,
    IP_SERVER
}