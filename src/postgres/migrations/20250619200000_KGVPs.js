/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("kgvps", function (t) {
        t.integer("subject").primary();
        t.foreign("subject").references("id").inTable("subjects");
        t.float("kgvpBooking");
        t.float("kgvpMarketplace");
        t.float("kgvpPickup");
        t.float("kgvpSupplier");
        t.float("kgvpSupplierExpress");
        t.float("paidStorageKgvp");
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("kgvps");
}
