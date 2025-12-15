import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const dataBaseVersionValue = databaseVersionResult.rows[0].server_version;

  const dataBaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const dataBaseMaxConnectionsValue =
    dataBaseMaxConnectionsResult.rows[0].max_connections;

  const dataBaseOpenConnectionsResult = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';",
  );
  const databaseOpenConnectionsValue =
    dataBaseOpenConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dataBaseVersionValue,
        max_connections: parseInt(dataBaseMaxConnectionsValue),
        open_connections: databaseOpenConnectionsValue,
      },
    },
  });
}

export default status;
