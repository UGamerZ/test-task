import { WBResponse, WBResponseData } from "#types/response.js";
import knex from "#postgres/knex.js";
import { dbToSheets } from "#google/db-to-sheets.js";
import axios from "axios";

function validateUniqueParents(data: WBResponseData[]) {
    const uniqueByIdFirst = [];
    const seenIds = new Set();
    for (const obj of data) {
        if (!seenIds.has(obj.parentID)) {
            seenIds.add(obj.parentID);
            uniqueByIdFirst.push(obj);
        }
    }
    return uniqueByIdFirst;
}

async function execQuery(tableName: string, data: any) {
    await knex(tableName).insert(data).onConflict("id").merge();
}

export async function updateDB(data: WBResponse) {
    console.log("running db update...");

    await execQuery(
        "parents",
        validateUniqueParents(data.report).map((item) => ({ id: item.parentID, parentName: item.parentName })),
    );
    await execQuery(
        "subjects",
        data.report.map((item) => ({ id: item.subjectID, parent: item.parentID, subjectName: item.subjectName })),
    );
    await knex("kgvps")
        .insert(
            data.report.map((item) => ({
                subject: item.subjectID,
                kgvpBooking: item.kgvpBooking,
                kgvpMarketplace: item.kgvpMarketplace,
                kgvpPickup: item.kgvpPickup,
                kgvpSupplier: item.kgvpSupplier,
                kgvpSupplierExpress: item.kgvpSupplierExpress,
                paidStorageKgvp: item.paidStorageKgvp,
            })),
        )
        .onConflict("subject")
        .merge();

    console.log("db updated successfully");

    await dbToSheets();
}

export function requestTariffs() {
    console.log("getting data from api...");

    axios
        .get("https://common-api.wildberries.ru/api/v1/tariffs/commission", { headers: { Authorization: process.env.API_KEY } })
        .then((res) => updateDB(res.data))
        .catch((msg) => console.log(msg));
}
