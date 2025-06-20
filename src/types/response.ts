export interface WBResponseData {
    kgvpBooking: number;
    kgvpMarketplace: number;
    kgvpPickup: number;
    kgvpSupplier: number;
    kgvpSupplierExpress: number;
    paidStorageKgvp: number;
    parentID: number;
    parentName: string;
    subjectID: number;
    subjectName: string;
}

export interface WBResponse {
    report: WBResponseData[];
}

export interface SpreadSheetData {
    spreadsheet_id: string;
}
