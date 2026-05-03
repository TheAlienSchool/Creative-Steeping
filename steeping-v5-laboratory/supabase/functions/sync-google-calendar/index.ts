import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const GOOGLE_CLIENT_EMAIL = Deno.env.get('GOOGLE_CLIENT_EMAIL')
    const GOOGLE_PRIVATE_KEY = Deno.env.get('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n')
    const CALENDAR_ID = Deno.env.get('CALENDAR_ID')

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !CALENDAR_ID) {
      throw new Error("Missing Environmental Variables. Please ensure GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and CALENDAR_ID are set.")
    }

    // Parse requested time range
    const url = new URL(req.url)
    const timeMin = url.searchParams.get('timeMin') || new Date().toISOString()
    const timeMaxDate = new Date()
    timeMaxDate.setMonth(timeMaxDate.getMonth() + 3)
    const timeMax = url.searchParams.get('timeMax') || timeMaxDate.toISOString()

    // Create JWT
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + 3600 // 1 hour expiration

    const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    const payload = btoa(JSON.stringify({
      iss: GOOGLE_CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: exp,
      iat: iat
    })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

    const unsignedToken = `${header}.${payload}`

    // Parse PEM string to text (Deno crypto format)
    const pemHeader = "-----BEGIN PRIVATE KEY-----"
    const pemFooter = "-----END PRIVATE KEY-----"
    const pemContents = GOOGLE_PRIVATE_KEY.substring(
      GOOGLE_PRIVATE_KEY.indexOf(pemHeader) + pemHeader.length,
      GOOGLE_PRIVATE_KEY.indexOf(pemFooter)
    ).replace(/\s/g, '')

    const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))

    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" },
      },
      true,
      ["sign"]
    )

    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      new TextEncoder().encode(unsignedToken)
    )

    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    const signedJwt = `${unsignedToken}.${encodedSignature}`

    // Exchange JWT for Access Token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${signedJwt}`
    })

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok) throw new Error(`Google API Auth Error: ${tokenData.error_description || tokenData.error}`)

    const accessToken = tokenData.access_token

    // Fetch Calendar Events
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`

    const response = await fetch(calendarUrl, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    })

    const calendarData = await response.json()
    if (!response.ok) throw new Error(`Fetch Error: ${calendarData.error.message}`)

    // Map to simple structure for Observatory
    const events = calendarData.items?.map((event: any) => ({
      id: event.id,
      summary: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
    })) || []

    return new Response(
      JSON.stringify(events),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
