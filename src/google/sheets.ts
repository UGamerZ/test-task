import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { SpreadSheetData } from "#types/response.js";

export async function batchUpdateValues(
    valuesSubjects: any[][],
    valuesParents: any[][],
    valuesKGVPs: number[][],
    spreadsheetIds: SpreadSheetData[],
    auth: OAuth2Client,
) {
    const service = google.sheets({ version: "v4", auth });
    const data = [
        {
            range: "subjects",
            values: [["ID", "ParentID", "Name"], ...valuesSubjects],
        },
        {
            range: "parents",
            values: [["ID", "Name"], ...valuesParents],
        },
        {
            range: "stocks_coefs",
            values: [["Subject", "kgvpBooking", "kgvpMarketplace", "kgvpPickup", "kgvpSupplier", "kgvpSupplierExpress", "paidStorageKgvp"], ...valuesKGVPs],
        },
    ];
    const resource = {
        data,
        valueInputOption: "USER_ENTERED",
    };
    try {
        spreadsheetIds.forEach((spreadsheet) =>
            // @ts-ignore
            service.spreadsheets.values.batchUpdate({
                spreadsheetId: spreadsheet.spreadsheet_id,
                resource,
            }),
        );
        console.log("cells successfully updated.");
    } catch (err) {
        throw err;
    }
}
