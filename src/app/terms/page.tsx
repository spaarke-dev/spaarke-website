import type { Metadata } from "next";
import { PageHeader, Shell, Slab } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Spaarke terms of service — the agreement that governs your use of the Spaarke platform.",
};

export default function Terms() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Legal"
          title="Terms of Service"
          lede="The terms that govern your use of Spaarke."
        />

        <div className="text-fg-mid mt-12 max-w-2xl space-y-6 text-base leading-relaxed">
          <p className="text-fg-low text-sm">Last updated: 2026-05-07</p>

          <p>
            These Terms of Service (the &ldquo;Terms&rdquo;) are a binding
            agreement between you and Spaarke, Inc. (&ldquo;Spaarke,&rdquo;
            &ldquo;we,&rdquo; or &ldquo;us&rdquo;) governing your access to and
            use of the Spaarke platform, including any related websites,
            applications, APIs, documentation, and support services
            (collectively, the &ldquo;Service&rdquo;). By creating an account,
            signing an order form, or otherwise using the Service, you agree to
            these Terms. If you are accepting on behalf of an organization, you
            represent that you have authority to bind that organization, and
            &ldquo;you&rdquo; refers to that organization.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            1. The Service
          </h2>
          <p>
            Spaarke is a Legal Operations Intelligence platform delivered as a
            Microsoft ISV solution. It runs on Microsoft 365 infrastructure and
            is designed to help legal teams organize matters, documents, and
            communications, and to apply AI-assisted analysis to that content.
            Specific features available to you depend on your subscription
            plan, your Microsoft 365 entitlements, and any order form or
            statement of work you have entered into with us.
          </p>
          <p>
            We may add, change, or remove features over time. We will not
            materially reduce the core functionality of a paid subscription
            during its current term without notice.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            2. Accounts and eligibility
          </h2>
          <p>
            You must be at least 18 years old and able to enter into a binding
            contract to use the Service. The Service is intended for business
            use by legal departments, law firms, and related professional
            organizations. You are responsible for maintaining the
            confidentiality of your account credentials and for all activity
            that occurs under your account. Notify us promptly at{" "}
            <a
              href="mailto:legal@spaarke.com"
              className="text-cta-blue underline"
            >
              legal@spaarke.com
            </a>{" "}
            if you suspect unauthorized access.
          </p>
          <p>
            You are responsible for the conduct of your authorized users
            (employees, contractors, or other personnel you grant access to)
            and for ensuring they comply with these Terms.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            3. Subscriptions and fees
          </h2>
          <p>
            Paid plans are billed per the order form, statement of work, or
            online checkout you accept. Unless stated otherwise, fees are
            quoted in U.S. dollars, invoiced in advance, and due within thirty
            (30) days of the invoice date. Fees are non-refundable except as
            expressly provided in these Terms. You are responsible for any
            applicable taxes other than taxes on our net income.
          </p>
          <p>
            Subscriptions automatically renew for successive terms equal to
            the prior term unless either party gives written notice of
            non-renewal at least thirty (30) days before the renewal date. We
            may adjust pricing at renewal with at least thirty (30) days&rsquo;
            notice.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            4. Customer data and ownership
          </h2>
          <p>
            &ldquo;Customer Data&rdquo; means content, documents, records, and
            other information that you or your users submit to, or that the
            Service processes on your behalf within, your Microsoft 365 tenant
            in connection with the Service. As between you and Spaarke,{" "}
            <strong className="text-fg font-medium">
              you retain all rights, title, and interest in Customer Data
            </strong>
            . We claim no ownership of Customer Data.
          </p>
          <p>
            You grant Spaarke a limited, non-exclusive license to access,
            process, transmit, and display Customer Data solely to provide and
            support the Service for you, to maintain security and integrity,
            and to comply with law. We do not sell Customer Data, do not use
            Customer Data to advertise to you or anyone else, and do not use
            Customer Data to train foundation AI models. See the{" "}
            <a href="/privacy" className="text-cta-blue underline">
              Privacy Policy
            </a>{" "}
            for additional detail on how we handle data.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            5. License to use the Service
          </h2>
          <p>
            Subject to these Terms and your payment of applicable fees, we
            grant you a non-exclusive, non-transferable, non-sublicensable
            right to access and use the Service during your subscription term
            for your internal business purposes. We retain all rights in the
            Service, including the underlying software, models, prompts,
            templates, documentation, and trademarks. Nothing in these Terms
            transfers any of those rights to you except as expressly stated.
          </p>
          <p>
            If you provide feedback, suggestions, or feature requests, you
            grant us a perpetual, royalty-free license to use that feedback to
            improve the Service. Feedback never includes Customer Data.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            6. Acceptable use
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              use the Service in violation of applicable law, including export
              controls, sanctions, privacy laws, or rules of professional
              conduct;
            </li>
            <li>
              upload Customer Data you do not have the right to upload, or that
              infringes third-party rights;
            </li>
            <li>
              attempt to reverse engineer, decompile, or extract the
              source code, models, or weights underlying the Service, except
              to the extent applicable law expressly permits;
            </li>
            <li>
              use the Service to build a competing product, to benchmark for
              public comparison without our written consent, or to scrape its
              outputs at scale;
            </li>
            <li>
              interfere with the Service&rsquo;s security, integrity, or
              availability, or attempt to access data belonging to other
              customers;
            </li>
            <li>
              use the Service to generate unlawful, defamatory, or
              intentionally misleading content, or to make automated decisions
              about individuals that produce legal or similarly significant
              effects without appropriate human review.
            </li>
          </ul>
          <p>
            We may suspend access to the Service if continued use poses a
            material risk to other customers, to the Service, or to us, or if
            we reasonably believe use violates these Terms. We will give notice
            and an opportunity to cure where reasonably practicable.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            7. AI features
          </h2>
          <p>
            The Service includes AI-assisted features, including features
            built on Spaarke Foundry IQ and Microsoft Copilot Studio
            integrations. These features may summarize documents, classify
            matters, suggest related content, and answer questions grounded
            in your Customer Data. Outputs are generated by statistical
            models and may be inaccurate, incomplete, or out of date. AI
            outputs are not legal advice, and you are responsible for
            reviewing them before relying on them or acting on them.
          </p>
          <p>
            Customer Data is not used to train Spaarke&rsquo;s or any third
            party&rsquo;s foundation models. Prompts and grounding content
            sent to underlying model providers are processed under
            enterprise-grade agreements (including the Azure OpenAI Service
            data handling commitments and Microsoft Copilot enterprise data
            protection terms) that prohibit training on customer inputs. Where
            your plan supports it, you may select among approved enterprise
            models and configure region or tenant-bound processing.
          </p>
          <p>
            Where required by the EU AI Act, comparable U.S. federal or state
            AI regulation, or applicable rules of professional conduct, you
            are responsible for disclosing AI use to your clients, providing
            human oversight, and maintaining records of AI-assisted decisions.
            We provide tooling to support these obligations but do not
            discharge them on your behalf.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            8. Microsoft 365 and third-party dependencies
          </h2>
          <p>
            Spaarke is an application-layer ISV solution. The Service stores
            Customer Data inside{" "}
            <strong className="text-fg font-medium">
              your own Microsoft 365 tenant
            </strong>
            , primarily in Microsoft Dataverse and SharePoint Embedded, and
            relies on Microsoft Entra ID for identity and Microsoft Azure for
            compute and AI services. Your use of those Microsoft services is
            governed by your own agreements with Microsoft, including the
            Microsoft Product Terms, the Microsoft Online Services Terms, and
            the Data Protection Addendum. Those agreements, not these Terms,
            govern Microsoft&rsquo;s handling of your tenant and the data
            within it.
          </p>
          <p>
            You are responsible for maintaining valid Microsoft licenses
            sufficient to use the Service. We are not responsible for outages,
            data loss, security incidents, or feature changes that originate
            in Microsoft services or other third-party platforms outside our
            control. Where a Microsoft incident affects your use of the
            Service, we will provide reasonable assistance and information.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            9. Confidentiality
          </h2>
          <p>
            Each party may receive non-public information of the other that is
            marked confidential or that should reasonably be understood to be
            confidential (&ldquo;Confidential Information&rdquo;). The
            receiving party will use Confidential Information only to perform
            under these Terms and will protect it with at least the same care
            it uses for its own confidential information, and no less than a
            reasonable standard of care. Customer Data is your Confidential
            Information. These obligations do not apply to information that is
            public through no fault of the receiving party, was already known
            without restriction, is independently developed, or is rightfully
            received from a third party without confidentiality obligations.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            10. Security and privacy
          </h2>
          <p>
            We maintain administrative, technical, and physical safeguards
            designed to protect the Service and Customer Data, including
            encryption in transit and at rest, least-privilege access
            controls, audit logging, and a documented incident response
            program. Because Customer Data resides in your tenant, much of
            the security posture is shared with you and Microsoft. Our
            handling of personal data, including with respect to GDPR and
            CCPA, is described in the{" "}
            <a href="/privacy" className="text-cta-blue underline">
              Privacy Policy
            </a>
            . Customers subject to GDPR or similar regimes may request our
            standard Data Processing Addendum at{" "}
            <a
              href="mailto:legal@spaarke.com"
              className="text-cta-blue underline"
            >
              legal@spaarke.com
            </a>
            .
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            11. Warranties and disclaimers
          </h2>
          <p>
            Each party represents that it has the authority to enter into
            these Terms. We will provide the Service in a professional manner
            consistent with generally accepted industry standards. Your
            exclusive remedy for a breach of that commitment is for us to
            re-perform the affected services or, if we cannot do so within a
            reasonable time, to refund unused fees for the affected period.
          </p>
          <p>
            Except as expressly stated in these Terms, the Service is provided
            &ldquo;as is.&rdquo; We disclaim all other warranties, whether
            express, implied, or statutory, including warranties of
            merchantability, fitness for a particular purpose,
            non-infringement, and any warranty arising from course of dealing
            or usage of trade. We do not warrant that the Service will be
            uninterrupted, error-free, or that AI outputs will be accurate or
            complete. The Service is not a substitute for the independent
            professional judgment of a qualified lawyer, and using it does not
            create an attorney-client relationship with Spaarke.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            12. Limitation of liability
          </h2>
          <p>
            To the maximum extent permitted by law, neither party will be
            liable for indirect, incidental, special, consequential, or
            punitive damages, or for lost profits, lost revenue, or lost data,
            even if advised of the possibility. Each party&rsquo;s total
            cumulative liability arising out of or relating to these Terms
            will not exceed the fees you paid to us for the Service in the
            twelve (12) months preceding the event giving rise to the claim.
            These limits do not apply to your payment obligations, to a
            party&rsquo;s indemnification obligations, or to liability that
            cannot be limited under applicable law.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            13. Indemnification
          </h2>
          <p>
            We will defend you against third-party claims that the Service, as
            provided by us and used in accordance with these Terms, infringes
            a U.S. patent, copyright, or trademark, and will pay damages
            finally awarded or amounts agreed in settlement. If the Service
            becomes, or in our view is likely to become, the subject of an
            infringement claim, we may modify the Service, procure rights for
            you to continue using it, or terminate the affected subscription
            and refund prepaid unused fees. We have no obligation for claims
            arising from Customer Data, from combinations of the Service with
            items we did not provide, or from use after we asked you to stop.
          </p>
          <p>
            You will defend us against third-party claims arising from
            Customer Data, from your or your users&rsquo; use of the Service
            in violation of these Terms or applicable law, and from your
            advice or services to your own clients.
          </p>
          <p>
            The indemnifying party&rsquo;s obligations are conditioned on
            prompt notice, sole control of defense and settlement (subject to
            the indemnified party&rsquo;s reasonable approval where its
            interests are affected), and reasonable cooperation.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            14. Term and termination
          </h2>
          <p>
            These Terms apply for the duration of your subscription and any
            renewal terms. Either party may terminate for material breach if
            the breach is not cured within thirty (30) days of written notice.
            Either party may terminate immediately on written notice if the
            other becomes insolvent or subject to bankruptcy proceedings. We
            may suspend or terminate access for non-payment after notice and a
            reasonable opportunity to cure.
          </p>
          <p>
            On termination, your right to use the Service ends. Because
            Customer Data lives in your Microsoft 365 tenant, it remains under
            your control. We will, at your written request made within thirty
            (30) days of termination, deactivate the Service&rsquo;s access to
            your tenant and remove Spaarke-managed configuration. Sections
            that by their nature should survive (including ownership,
            confidentiality, disclaimers, limitation of liability,
            indemnification, and governing law) will survive termination.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            15. Modifications
          </h2>
          <p>
            We may update these Terms from time to time. If we make a material
            change, we will give reasonable notice — for example, by email to
            your account contact or by a notice in the Service — before the
            change takes effect. Your continued use of the Service after the
            effective date constitutes acceptance of the updated Terms. If you
            do not agree, you may terminate your subscription as of the
            effective date and receive a pro-rata refund of prepaid unused
            fees for the affected period.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            16. Governing law and disputes
          </h2>
          <p>
            These Terms are governed by the laws of the State of Delaware,
            without regard to conflict-of-laws principles. The parties consent
            to the exclusive jurisdiction of the state and federal courts
            located in Delaware for any dispute that is not subject to
            arbitration or that requires injunctive relief. Either party may
            seek equitable relief in any court of competent jurisdiction to
            protect its intellectual property or Confidential Information.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            17. General
          </h2>
          <p>
            These Terms, together with any order form, statement of work, and
            referenced policies, are the entire agreement between you and us
            regarding the Service and supersede prior or contemporaneous
            agreements on the same subject. If any provision is held
            unenforceable, the remaining provisions remain in effect. Neither
            party&rsquo;s failure to enforce a right is a waiver of that
            right. You may not assign these Terms without our consent, except
            to an affiliate or in connection with a merger, acquisition, or
            sale of substantially all assets, provided the assignee is not a
            competitor of Spaarke. Notices to us must be sent to{" "}
            <a
              href="mailto:legal@spaarke.com"
              className="text-cta-blue underline"
            >
              legal@spaarke.com
            </a>
            . Neither party is liable for delays or failures caused by events
            beyond reasonable control.
          </p>

          <h2 className="text-fg font-display text-2xl font-medium tracking-tight">
            18. Contact
          </h2>
          <p>
            Questions about these Terms? Email{" "}
            <a
              href="mailto:legal@spaarke.com"
              className="text-cta-blue underline"
            >
              legal@spaarke.com
            </a>{" "}
            or use our{" "}
            <a href="/contact" className="text-cta-blue underline">
              contact form
            </a>
            .
          </p>
        </div>
      </Shell>
    </Slab>
  );
}
