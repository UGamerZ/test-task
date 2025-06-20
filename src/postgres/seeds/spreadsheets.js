/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([{ spreadsheet_id: "1KjiPuSMmaHtm-uPNLJPAMte0vurn_csQSM6J0iCqRpk" }])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
