import { migrate, seed } from "#postgres/knex.js";
import { requestTariffs } from "#postgres/data-inserts.js";

await migrate.latest();
await seed.run();

console.log("All migrations and seeds have been run");

setInterval(() => requestTariffs(), 3600000);
