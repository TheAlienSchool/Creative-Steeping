import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { google } from "npm:googleapis";

serve(async (req) => {
  try {
    // 1. Receive the new application from the Supabase Webhook
    const payload = await req.json();
    const record = payload.record;

    if (!record) {
      return new Response(JSON.stringify({ error: "No record found in payload" }), { status: 400 });
    }

    // 2. Load the Google Service Account "Magic Wand" from Supabase Secrets
    const rawCredentials = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON') || '{}';
    const googleCredentials = JSON.parse(rawCredentials);
    
    // 3. Authenticate with Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: googleCredentials.client_email,
        private_key: googleCredentials.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = Deno.env.get('MASTER_SHEET_ID');

    // 4. Format the Application into the Spreadsheet Art
    const rowData = [
      [
        new Date(record.created_at).toLocaleDateString(), // Timestamp
        record.email,                                     // Navigator Email
        record.inquiry_response,                          // "Who do you think you are?"
        record.target_cohort || "TBD",                    // Requested Cohort
        "AWAITING REVIEW"                                 // Status
      ]
    ];

    // 5. Append to the Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:E', // Appends to the next empty row on the first sheet
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rowData },
    });

    return new Response(JSON.stringify({ success: true, message: "Added to Spreadsheet" }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Spreadsheet Sync Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
