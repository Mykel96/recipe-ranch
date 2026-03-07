"use client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useTranslation } from "@/lib/i18n/context";

export default function PrivacyPage() {
  const { language } = useTranslation();
  const isGerman = language === "de";
  const lastUpdated = isGerman ? "18. Februar 2026" : "February 18, 2026";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-parchment to-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-brown-800 mb-4">
              {isGerman ? "Datenschutz" : "Privacy Policy"}
            </h1>
            <p className="font-[family-name:var(--font-body)] text-brown-400 text-sm">
              {isGerman ? "Zuletzt aktualisiert:" : "Last updated:"} {lastUpdated}
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="prose-legal space-y-10">
            <Block title={isGerman ? "1. Einleitung" : "1. Introduction"}>
              <p>
                {isGerman
                  ? "Willkommen bei Recepy Ranch (\"wir\" oder \"uns\"). Der Schutz deiner personenbezogenen Daten ist uns wichtig. Diese Datenschutzerklaerung erklaert, welche Informationen wir erheben, wie wir sie verwenden, wann wir sie weitergeben und wie wir sie schuetzen, wenn du unsere Website und Dienste nutzt (zusammen der \"Dienst\"). Mit der Nutzung des Dienstes stimmst du dieser Verarbeitung zu."
                  : "Welcome to Recepy Ranch (\"we,\" \"us,\" or \"our\"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services (collectively, the \"Service\"). By using the Service, you agree to the collection and use of information in accordance with this policy."}
              </p>
            </Block>

            <Block title={isGerman ? "2. Welche Daten wir erheben" : "2. Information We Collect"}>
              <p>
                {isGerman ? "Wir koennen folgende Arten von Informationen erheben:" : "We may collect the following types of information:"}
              </p>
              <Subblock title={isGerman ? "2.1 Informationen, die du angibst" : "2.1 Information You Provide"}>
                <ul>
                  <li><strong>{isGerman ? "Kontodaten:" : "Account Information:"}</strong> {isGerman ? "Bei der Registrierung erheben wir deine E-Mail-Adresse, deinen Anzeigenamen und optionale Profildaten." : "When you register, we collect your email address, display name, and any profile information you choose to provide."}</li>
                  <li><strong>{isGerman ? "Nutzerinhalte:" : "User Content:"}</strong> {isGerman ? "Rezepte, Kommentare, Bewertungen und weitere Inhalte, die du einreichst." : "Recipes, comments, ratings, and any other content you submit to the Service."}</li>
                  <li><strong>{isGerman ? "Kommunikation:" : "Communications:"}</strong> {isGerman ? "Wenn du uns kontaktierst, koennen wir diese Kommunikation speichern." : "If you contact us, we may keep a record of that correspondence."}</li>
                </ul>
              </Subblock>
              <Subblock title={isGerman ? "2.2 Automatisch erhobene Informationen" : "2.2 Information Collected Automatically"}>
                <ul>
                  <li><strong>{isGerman ? "Log-Daten:" : "Log Data:"}</strong> {isGerman ? "Browsertyp, IP-Adresse, besuchte Seiten, Aufenthaltsdauer und technische Diagnosedaten." : "Your browser type, IP address, pages visited, time spent on pages, and other diagnostic data."}</li>
                  <li><strong>{isGerman ? "Cookies:" : "Cookies:"}</strong> {isGerman ? "Wir verwenden Cookies und aehnliche Technologien fuer Sitzung und Praeferenzen. Du kannst Cookies im Browser deaktivieren, dann funktionieren gewisse Funktionen eventuell eingeschraenkt." : "We use cookies and similar technologies to maintain your session and preferences. You can instruct your browser to refuse cookies, though some features may not function properly."}</li>
                </ul>
              </Subblock>
              <Subblock title={isGerman ? "2.3 Anmeldung ueber Drittanbieter" : "2.3 Third-Party Authentication"}>
                <p>{isGerman ? "Wenn du dich ueber einen Drittanbieter (z. B. Google, GitHub) anmeldest, erhalten wir nur die dort freigegebenen Basisdaten. Passwoerter deines Drittanbieter-Kontos erhalten oder speichern wir nicht." : "If you sign in using a third-party provider (e.g., Google, GitHub), we receive limited profile information from that provider as authorized by your privacy settings with them. We do not receive or store your third-party account passwords."}</p>
              </Subblock>
            </Block>

            <Block title={isGerman ? "3. Wie wir deine Daten verwenden" : "3. How We Use Your Information"}>
              <p>{isGerman ? "Wir verwenden die erhobenen Daten, um:" : "We use collected information to:"}</p>
              <ul>
                <li>{isGerman ? "den Dienst bereitzustellen und zu betreiben" : "Provide, operate, and maintain the Service"}</li>
                <li>{isGerman ? "dein Konto zu erstellen und zu verwalten" : "Create and manage your account"}</li>
                <li>{isGerman ? "deine Rezepte und Profildaten fuer andere Nutzer anzuzeigen" : "Display your recipes and profile to other users"}</li>
                <li>{isGerman ? "den Dienst zu verbessern und zu personalisieren" : "Improve, personalize, and expand the Service"}</li>
                <li>{isGerman ? "mit dir ueber Updates, Sicherheit oder Support zu kommunizieren" : "Communicate with you about updates, security alerts, or support"}</li>
                <li>{isGerman ? "Missbrauch und technische Probleme zu erkennen und zu verhindern" : "Detect, prevent, and address technical issues or abuse"}</li>
                <li>{isGerman ? "gesetzliche Pflichten zu erfuellen" : "Comply with legal obligations"}</li>
              </ul>
            </Block>

            <Block title={isGerman ? "4. Weitergabe von Daten" : "4. Sharing of Information"}>
              <p>{isGerman ? "Wir verkaufen, vermieten oder handeln deine personenbezogenen Daten nicht. Eine Weitergabe erfolgt nur in folgenden Faellen:" : "We do not sell, trade, or rent your personal information to third parties. We may share information in the following limited circumstances:"}</p>
              <ul>
                <li><strong>{isGerman ? "Oeffentliche Inhalte:" : "Public Content:"}</strong> {isGerman ? "Oeffentlich geteilte Rezepte, Kommentare und Profilangaben sind fuer alle Nutzer sichtbar." : "Recipes, comments, and profile information you make public are visible to all users."}</li>
                <li><strong>{isGerman ? "Dienstleister:" : "Service Providers:"}</strong> {isGerman ? "Wir nutzen externe Anbieter (z. B. Supabase, Vercel), die Daten in unserem Auftrag unter Vertraulichkeit verarbeiten." : "We use third-party services (e.g., Supabase for hosting and authentication, Vercel for deployment) that may process data on our behalf under strict confidentiality obligations."}</li>
                <li><strong>{isGerman ? "Rechtliche Gruende:" : "Legal Requirements:"}</strong> {isGerman ? "Wir koennen Daten offenlegen, wenn wir gesetzlich dazu verpflichtet sind." : "We may disclose information if required by law, regulation, legal process, or governmental request."}</li>
                <li><strong>{isGerman ? "Sicherheit:" : "Safety:"}</strong> {isGerman ? "Wir koennen Daten weitergeben, um Rechte, Eigentum oder Sicherheit von Recepy Ranch, Nutzern oder Dritten zu schuetzen." : "We may disclose information to protect the rights, property, or safety of Recepy Ranch, our users, or the public."}</li>
              </ul>
            </Block>

            <Block title={isGerman ? "5. Speicherdauer" : "5. Data Retention"}>
              <p>{isGerman ? "Wir speichern personenbezogene Daten nur so lange, wie es fuer den Betrieb des Dienstes und die in dieser Erklaerung genannten Zwecke notwendig ist. Wenn du dein Konto loeschst, werden deine Daten innert angemessener Frist geloescht oder anonymisiert, sofern keine gesetzliche Aufbewahrungspflicht besteht." : "We retain your personal information only for as long as necessary to provide the Service and fulfill the purposes described in this policy. When you delete your account, we will delete or anonymize your personal data within a reasonable timeframe, except where retention is required by law."}</p>
            </Block>

            <Block title={isGerman ? "6. Datensicherheit" : "6. Data Security"}>
              <p>{isGerman ? "Wir setzen angemessene technische und organisatorische Massnahmen ein, darunter Verschluesselung waehrend der Uebertragung (TLS/SSL) und im Ruhezustand. Eine absolute Sicherheit bei Internet-Uebertragungen kann jedoch nicht garantiert werden." : "We implement commercially reasonable security measures to protect your information, including encryption in transit (TLS/SSL) and at rest. However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security."}</p>
            </Block>

            <Block title={isGerman ? "7. Deine Rechte" : "7. Your Rights"}>
              <p>{isGerman ? "Je nach anwendbarem Recht hast du insbesondere folgende Rechte:" : "Depending on your jurisdiction, you may have the right to:"}</p>
              <ul>
                <li>{isGerman ? "Auskunft ueber gespeicherte Daten" : "Access the personal data we hold about you"}</li>
                <li>{isGerman ? "Berichtigung unrichtiger Daten" : "Request correction of inaccurate data"}</li>
                <li>{isGerman ? "Loeschung deiner Daten" : "Request deletion of your personal data"}</li>
                <li>{isGerman ? "Widerspruch oder Einschraenkung der Verarbeitung" : "Object to or restrict processing of your data"}</li>
                <li>{isGerman ? "Datenuebertragbarkeit" : "Request portability of your data"}</li>
                <li>{isGerman ? "Widerruf einer Einwilligung mit Wirkung fuer die Zukunft" : "Withdraw consent at any time (where processing is based on consent)"}</li>
              </ul>
              <p>{isGerman ? "Zur Ausuebung deiner Rechte kontaktiere uns ueber die untenstehenden Angaben." : "To exercise any of these rights, please contact us using the information below."}</p>
            </Block>

            <Block title={isGerman ? "8. Datenschutz bei Kindern" : "8. Children's Privacy"}>
              <p>{isGerman ? "Der Dienst richtet sich nicht an Kinder unter 13 Jahren (bzw. unter dem in deinem Land geltenden Mindestalter). Wir erheben nicht wissentlich Daten von Kindern. Falls du glaubst, dass wir solche Daten erfasst haben, kontaktiere uns bitte." : "The Service is not directed to children under the age of 13 (or the applicable age of consent in your jurisdiction). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us and we will take steps to delete such information."}</p>
            </Block>

            <Block title={isGerman ? "9. Links zu Drittanbietern" : "9. Third-Party Links"}>
              <p>{isGerman ? "Der Dienst kann Links zu externen Websites oder Diensten enthalten. Fuer deren Datenschutzpraktiken sind wir nicht verantwortlich. Bitte prüfe die jeweiligen Datenschutzerklaerungen." : "The Service may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review their privacy policies before providing any personal information."}</p>
            </Block>

            <Block title={isGerman ? "10. Aenderungen dieser Datenschutzerklaerung" : "10. Changes to This Policy"}>
              <p>{isGerman ? "Wir koennen diese Datenschutzerklaerung von Zeit zu Zeit anpassen. Aenderungen werden auf dieser Seite mit aktualisiertem Datum veröffentlicht. Die weitere Nutzung des Dienstes gilt als Zustimmung." : "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated \"Last updated\" date. Your continued use of the Service after changes constitutes acceptance of the revised policy."}</p>
            </Block>

            <Block title={isGerman ? "11. Kontakt" : "11. Contact Us"}>
              <p>{isGerman ? "Bei Fragen zum Datenschutz kontaktiere uns unter:" : "If you have any questions or concerns about this Privacy Policy, please contact us at:"}</p>
              <p className="font-semibold">michael.highstreeterx@gmail.com</p>
            </Block>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-brown-800 mb-3">
        {title}
      </h2>
      <div className="font-[family-name:var(--font-body)] text-sm text-brown-600 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-brown-600">
        {children}
      </div>
    </div>
  );
}

function Subblock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <h3 className="font-[family-name:var(--font-body)] text-sm font-bold text-brown-700 mb-1.5">
        {title}
      </h3>
      {children}
    </div>
  );
}
