import knex from "#postgres/knex.js";
import { authenticate } from "#google/auth.js";
import { batchUpdateValues } from "#google/sheets.js";
import { SpreadSheetData } from "#types/response.js";

export async function dbToSheets() {
    console.log("filling google sheets from db...");

    const subjectsData = await knex("subjects").select("*");
    const parentsData = await knex("parents").select("*");
    const kgvpsData = await knex("kgvps").select("*").orderBy("kgvpBooking");
    const spreadSheets: SpreadSheetData[] = await knex("spreadsheets").select("*");

    const subjectsValues = subjectsData.map((obj) => Object.values(obj));
    const parentsValues = parentsData.map((obj) => Object.values(obj));
    const kgvpsValues: number[][] = kgvpsData.map((obj) => Object.values(obj));

    authenticate()
        .then((auth) => batchUpdateValues(subjectsValues, parentsValues, kgvpsValues, spreadSheets, auth))
        .then(() => console.log("cells successfully updated"));
}
