import { NextResponse, type NextRequest } from "next/server";
import { flushTelemetry, trackEvent, trackException } from "@/lib/logger";
import { DOWNLOAD_FILENAME, readPdf, verifyDownloadToken } from "@/lib/investor-overview";

export const dynamic = "force-dynamic";

/**
 * Serves the investor overview to a holder of a signed link. An invalid or
 * expired link goes back to the form, which issues a fresh one.
 */
export async function GET(request: NextRequest) {
  const check = verifyDownloadToken(request.nextUrl.searchParams.get("t"));
  if (!check.ok) {
    trackEvent("investor_overview.link_rejected", { reason: check.reason });
    await flushTelemetry();
    const back = new URL("/tltf-2026", request.nextUrl.origin);
    back.searchParams.set("download", check.reason);
    back.hash = "investor-overview";
    return NextResponse.redirect(back, 302);
  }

  try {
    const pdf = await readPdf();
    trackEvent("investor_overview.downloaded", { requestId: check.requestId });
    await flushTelemetry();
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${DOWNLOAD_FILENAME}"`,
        "Content-Length": String(pdf.length),
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (err) {
    console.error("[investor-overview] file read failed:", err);
    trackException(err instanceof Error ? err : new Error(String(err)), { step: "investor_overview.file" });
    await flushTelemetry();
    return new NextResponse("The file is not available right now. Please try again later.", { status: 503 });
  }
}
