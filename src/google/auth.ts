import { google } from "googleapis";
import * as http from "node:http";
import * as url from "node:url";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { OAuth2Client } from "google-auth-library";
import * as z from "zod";

const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

const content = await fs.readFile(CREDENTIALS_PATH);
const keys = JSON.parse(content.toString());
const key = keys.installed || keys.web;

const oauth2Client = new google.auth.OAuth2(key.client_id, key.client_secret, key.redirect_uris[0]);

const AuthClientScheme = z.instanceof(OAuth2Client);

async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content.toString());
        return AuthClientScheme.parse(google.auth.fromJSON(credentials));
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client: any) {
    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

export async function authenticate(): Promise<OAuth2Client> {
    const client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    return new Promise((resolve, reject) => {
        const authorizeUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: "https://www.googleapis.com/auth/spreadsheets",
        });
        const server = http
            .createServer(async (req, res) => {
                try {
                    if (req.url && req.url.indexOf("/oauth2callback") > -1) {
                        const qs = new url.URL(req.url, "http://localhost:3000").searchParams;
                        res.end("Authentication successful! Please return to the console.");
                        server.close();
                        const { tokens } = await oauth2Client.getToken(qs.get("code") ?? "");
                        oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
                        await saveCredentials(oauth2Client);
                        resolve(oauth2Client);
                    }
                } catch (e) {
                    reject(e);
                }
            })
            .listen(3000, () => {
                console.log("TO UPDATE GOOGLE SHEET, CONSIDER AUTHORIZING:", authorizeUrl);
            });
    });
}
