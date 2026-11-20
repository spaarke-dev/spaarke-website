import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Shell, Slab } from "@/components/primitives";
import {
  HELP_REPLY,
  KEYWORD,
  SAMPLE_LINK,
  callToAction,
  consentStatement,
  meetReply,
} from "@/lib/sms/messages";

// Program terms for "Text MEET to <number>". Twilio's toll-free verification
// uses this page as the Terms of Service URL and as the proof of where people
// see the keyword, and /sms is printed on cards and signs, so the path must
// never 404. The number is read from SMS_PUBLIC_NUMBER at request time rather
// than committed, because the repository is public.
// Spec: projects/text-to-meet/spec.md (FR-18).
export const dynamic = "force-dynamic";

const TITLE = "Text MEET to Book a Meeting";
const DESCRIPTION =
  "Text MEET to Spaarke's booking number to get a link to book a meeting with the Spaarke team. Program terms, message frequency, and how to opt out.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/sms" },
  openGraph: {
    title: `${TITLE} | Spaarke`,
    description: DESCRIPTION,
    url: "/sms",
  },
};

type BookingNumber = { display: string; e164: string };

/** Reads SMS_PUBLIC_NUMBER as a US or Canadian number, or null when unset or malformed. */
function getBookingNumber(): BookingNumber | null {
  const raw = process.env.SMS_PUBLIC_NUMBER?.trim();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (!/^[2-9]\d{9}$/.test(ten)) {
    console.warn("[sms] SMS_PUBLIC_NUMBER is not a 10 digit US number; the page shows no number.");
    return null;
  }
  return {
    display: `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`,
    e164: `+1${ten}`,
  };
}

const h2 = "text-fg font-display text-2xl font-medium tracking-tight";
const link = "text-cta-blue underline";

export default function Sms() {
  const number = getBookingNumber();
  const numberText = number ? number.display : "our booking number";

  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Text messages"
          title="Text MEET to book a meeting"
          lede="Send one word from your phone and we will reply with a link to choose a time with the Spaarke team."
        />

        <div className="text-fg-mid mt-12 max-w-2xl space-y-6 text-base leading-relaxed">
          <div className="border-line rounded-xl border p-6">
            <p className="text-fg font-display text-xl font-medium">
              Text <span className="font-semibold">{KEYWORD}</span> to{" "}
              {number ? <span className="whitespace-nowrap">{number.display}</span> : numberText}
            </p>
            <p className="mt-3">{callToAction(numberText)}</p>
            <p className="text-fg mt-3 text-sm leading-relaxed">
              <strong className="font-medium">Consent to receive texts. </strong>
              {consentStatement(numberText)}
            </p>
            <p className="mt-3 text-sm">
              <Link href="#terms" className={link}>
                Terms of Service
              </Link>
              <span aria-hidden="true"> · </span>
              <Link href="/privacy#text-messages" className={link}>
                Privacy Policy
              </Link>
              {number && (
                <>
                  <span aria-hidden="true"> · </span>
                  <a href={`sms:${number.e164}?&body=MEET`} className={link}>
                    On a phone? Start the text
                  </a>
                </>
              )}
            </p>
          </div>

          <h2 id="how-it-works" className={`${h2} scroll-mt-32 pt-6`}>
            How it works
          </h2>
          <ol className="list-decimal space-y-3 pl-6">
            <li>
              You see the call to action above on a Spaarke postcard, an event
              sign or slide, an email signature, or this page. The consent
              statement appears with it every time.
            </li>
            <li>
              You text {KEYWORD} to {numberText}. Sending that text is how you
              agree to receive a reply. We never text a number that has not
              texted us first.
            </li>
            <li>
              We reply once with a link to book a meeting. That reply also
              confirms the program, how often we text, and how to get help or
              opt out:
              <blockquote className="border-line text-fg mt-2 rounded-lg border px-4 py-3 text-sm break-words">
                {meetReply(SAMPLE_LINK)}
              </blockquote>
            </li>
            <li>
              Reply HELP at any time and we send:
              <blockquote className="border-line text-fg mt-2 rounded-lg border px-4 py-3 text-sm break-words">
                {HELP_REPLY}
              </blockquote>
            </li>
            <li>
              Reply STOP at any time and you receive one message confirming that
              you have opted out, and nothing after that. Reply START to opt
              back in.
            </li>
          </ol>
          <p className="text-sm">
            <a href="/sms/opt-in.png" className={link}>
              Picture of the opt-in workflow
            </a>{" "}
            (the call to action, the consent statement, and the messages
            above).
          </p>

          <p>
            The link opens the same booking page as{" "}
            <Link href="/meet" className={link}>
              spaarke.com/meet
            </Link>
            . If you are already at a computer, you can book there directly.
          </p>

          <h2 id="terms" className={`${h2} scroll-mt-32 pt-6`}>
            SMS Terms of Service
          </h2>

          <p className="text-fg-low text-sm">Last updated: 2026-11-19</p>

          <p>
            <strong className="text-fg font-medium">Spaarke meeting links.</strong>{" "}
            Text MEET to {numberText} and Spaarke, Inc. will reply with one text
            message containing a link to book a meeting with the Spaarke team.
            You get one reply for each text you send. We do not send other
            messages, reminders, or marketing by text, and we do not text you
            unless you text us first.
          </p>
          <p>
            <strong className="text-fg font-medium">Message frequency:</strong>{" "}
            one reply per text you send. Message and data rates may apply,
            according to your mobile plan.
          </p>
          <p>
            <strong className="text-fg font-medium">To opt out,</strong> reply
            STOP. You will receive one message confirming that you have opted
            out, and no further replies after that. To opt back in, reply START,
            then text MEET for a new link.
          </p>
          <p>
            <strong className="text-fg font-medium">For help,</strong> reply
            HELP, or email{" "}
            <a href="mailto:contactus@spaarke.com" className={link}>
              contactus@spaarke.com
            </a>
            .
          </p>
          <p>
            Carriers are not liable for delayed or undelivered messages. The
            link in our reply opens a page on spaarke.com; booking a meeting
            there is optional and subject to the same terms as booking at
            spaarke.com/meet.
          </p>
          <p>
            Our{" "}
            <Link href="/privacy#text-messages" className={link}>
              Privacy Policy
            </Link>{" "}
            explains what we keep when you text us. In short, we do not store
            your phone number in readable form, we do not keep the text of your
            messages, and we do not share your opt-in or consent to receive
            texts with any third party.
          </p>
        </div>
      </Shell>
    </Slab>
  );
}
