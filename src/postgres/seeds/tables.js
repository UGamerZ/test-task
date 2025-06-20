import { requestTariffs } from "#postgres/data-inserts.js";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    requestTariffs();
}
