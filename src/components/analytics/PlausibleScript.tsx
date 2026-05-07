import Script from "next/script";

export function PlausibleScript() {
  return (
    <>
      <Script
        async
        src="https://plausible.io/js/pa-of04A4p4E27LEiVbf7ChI.js"
        strategy="afterInteractive"
      />
      <Script id="plausible-init" strategy="afterInteractive">
        {`
          window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
          plausible.init()
        `}
      </Script>
    </>
  );
}
