import { ImageResponse } from "next/og";
import {
  HELP_REPLY,
  KEYWORD,
  SAMPLE_LINK,
  callToAction,
  consentStatement,
  displayNumber,
  meetReply,
} from "@/lib/sms/messages";

// The opt-in workflow as one picture, for Twilio's toll-free verification
// (the "opt-in image URL"). It shows the call to action with its consent
// statement as people see it, then the conversation that follows. Rendered at
// request time so the number comes from SMS_PUBLIC_NUMBER and is never
// committed. Its text comes from src/lib/sms/messages.ts, like the /sms page.
export const dynamic = "force-dynamic";

const W = 1200;
const H = 900;

function bubble(text: string, from: "person" | "spaarke") {
  const mine = from === "person";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: mine ? "flex-end" : "flex-start",
        width: "100%",
        marginTop: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: 470,
          padding: "12px 16px",
          borderRadius: 18,
          fontSize: 19,
          lineHeight: 1.35,
          background: mine ? "#2f6fed" : "#e9e9ee",
          color: mine ? "#ffffff" : "#111111",
        }}
      >
        {text}
      </div>
    </div>
  );
}

export function GET() {
  const raw = process.env.SMS_PUBLIC_NUMBER?.trim() || null;
  const number = displayNumber(raw);

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          background: "#f6f7fb",
          padding: 48,
          fontFamily: "sans-serif",
          color: "#111111",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
          Spaarke meeting links: opt-in workflow
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#555555", marginTop: 6 }}>
          Keyword opt-in. The person texts first; Spaarke replies once per text. Terms: spaarke.com/sms. Privacy: spaarke.com/privacy.
        </div>

        <div style={{ display: "flex", flexDirection: "row", marginTop: 32, gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 540 }}>
            <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: "#555555" }}>
              1. Call to action, as shown on postcards, signs, email signatures, and spaarke.com/sms
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 14,
                padding: 28,
                borderRadius: 16,
                background: "#ffffff",
                border: "2px solid #d5d8e2",
              }}
            >
              <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
                {`Text ${KEYWORD} to ${number}`}
              </div>
              <div style={{ display: "flex", fontSize: 21, marginTop: 14, lineHeight: 1.35 }}>
                {callToAction(number)}
              </div>
              <div style={{ display: "flex", fontSize: 18, marginTop: 14, lineHeight: 1.4, color: "#333333" }}>
                {consentStatement(number)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", fontSize: 18, marginTop: 14, color: "#2f6fed" }}>
                <div style={{ display: "flex" }}>Terms of Service: spaarke.com/sms</div>
                <div style={{ display: "flex" }}>Privacy Policy: spaarke.com/privacy</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: 540 }}>
            <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: "#555555" }}>
              2. The conversation that follows
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 14,
                padding: 20,
                borderRadius: 24,
                background: "#ffffff",
                border: "2px solid #d5d8e2",
              }}
            >
              {bubble(KEYWORD, "person")}
              {bubble(meetReply(SAMPLE_LINK), "spaarke")}
              {bubble("HELP", "person")}
              {bubble(HELP_REPLY, "spaarke")}
              {bubble("STOP", "person")}
              {bubble("One opt-out confirmation, then no further messages.", "spaarke")}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
}
