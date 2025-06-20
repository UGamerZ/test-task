/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("subjects", function (t) {
        t.integer("id").primary();
        t.integer("parent");
        t.string("subjectName");
        t.foreign("parent").references("id").inTable("parents");
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("subjects");
}
