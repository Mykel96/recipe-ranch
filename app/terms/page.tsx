"use client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useTranslation } from "@/lib/i18n/context";

export default function TermsPage() {
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
              {isGerman ? "Allgemeine Geschaeftsbedingungen (AGB)" : "Terms of Service"}
            </h1>
            <p className="font-[family-name:var(--font-body)] text-brown-400 text-sm">
              {isGerman ? "Zuletzt aktualisiert:" : "Last updated:"} {lastUpdated}
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="prose-legal space-y-10">
            <Block title={isGerman ? "1. Geltung der Bedingungen" : "1. Acceptance of Terms"}>
              <p>
                {isGerman
                  ? "Mit Zugriff auf oder Nutzung von Recepy Ranch (der \"Dienst\") akzeptierst du diese AGB. Wenn du diesen Bedingungen nicht zustimmst, darfst du den Dienst nicht nutzen. Wir koennen diese AGB jederzeit anpassen. Die weitere Nutzung nach einer Aenderung gilt als Zustimmung."
                  : "By accessing or using Recepy Ranch (the \"Service\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, you must not use the Service. We reserve the right to update these Terms at any time. Continued use of the Service after modifications constitutes acceptance of the revised Terms."}
              </p>
            </Block>

            <Block title={isGerman ? "2. Beschreibung des Dienstes" : "2. Description of Service"}>
              <p>
                {isGerman
                  ? "Recepy Ranch ist eine Community-Plattform zum Teilen, Entdecken und Speichern von Rezepten. Der Dienst wird \"wie besehen\" und \"wie verfuegbar\" bereitgestellt, ohne ausdrueckliche oder stillschweigende Gewaehrleistungen."
                  : "Recepy Ranch is a community-driven platform that allows users to share, discover, and save recipes. The Service is provided \"as is\" and \"as available\" without warranties of any kind, either express or implied."}
              </p>
            </Block>

            <Block title={isGerman ? "3. Nutzerkonten" : "3. User Accounts"}>
              <ul>
                <li>{isGerman ? "Bei der Kontoerstellung musst du korrekte und vollstaendige Angaben machen." : "You must provide accurate and complete information when creating an account."}</li>
                <li>{isGerman ? "Du bist verantwortlich fuer die Vertraulichkeit deiner Zugangsdaten und alle Aktivitaeten in deinem Konto." : "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."}</li>
                <li>{isGerman ? "Du musst mindestens 13 Jahre alt sein (oder das in deiner Region geltende Mindestalter)." : "You must be at least 13 years old (or the minimum age of digital consent in your jurisdiction) to use the Service."}</li>
                <li>{isGerman ? "Wir duerfen Konten, die gegen diese AGB verstossen, sperren oder beenden." : "We reserve the right to suspend or terminate accounts that violate these Terms."}</li>
              </ul>
            </Block>

            <Block title={isGerman ? "4. Nutzerinhalte" : "4. User Content"}>
              <Subblock title={isGerman ? "4.1 Eigentum" : "4.1 Ownership"}>
                <p>{isGerman ? "Du bleibst Eigentuemer aller von dir eingestellten Inhalte (\"Nutzerinhalte\"), inklusive Rezepte, Kommentare und Bilder. Mit dem Einstellen raeumst du Recepy Ranch eine nicht-exklusive, weltweite, gebuehrenfreie, unterlizenzierbare Lizenz ein, diese Inhalte zum Betrieb und zur Bereitstellung des Dienstes zu verwenden, anzuzeigen, zu vervielfaeltigen und zu verbreiten." : "You retain ownership of all content you submit to the Service (\"User Content\"), including recipes, comments, and images. By submitting User Content, you grant Recepy Ranch a non-exclusive, worldwide, royalty-free, sublicensable license to use, display, reproduce, and distribute your User Content solely in connection with operating and providing the Service."}</p>
              </Subblock>
              <Subblock title={isGerman ? "4.2 Verantwortung" : "4.2 Responsibility"}>
                <p>{isGerman ? "Du bist allein fuer deine Nutzerinhalte verantwortlich und sicherst zu, dass:" : "You are solely responsible for the User Content you submit. You represent and warrant that:"}</p>
                <ul>
                  <li>{isGerman ? "du die noetigen Rechte an den Inhalten hast" : "You own or have the necessary rights to submit the content"}</li>
                  <li>{isGerman ? "deine Inhalte keine Rechte Dritter verletzen" : "Your content does not infringe on any third party's intellectual property, privacy, or other rights"}</li>
                  <li>{isGerman ? "deine Inhalte keine rechtswidrigen, schaedlichen, beleidigenden oder unzulaessigen Inhalte enthalten" : "Your content does not contain unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable material"}</li>
                </ul>
              </Subblock>
              <Subblock title={isGerman ? "4.3 Entfernung von Inhalten" : "4.3 Removal"}>
                <p>{isGerman ? "Wir duerfen Nutzerinhalte, die gegen diese AGB verstossen oder anderweitig unzulaessig sind, nach eigenem Ermessen pruefen, bearbeiten oder entfernen." : "We reserve the right (but not the obligation) to review, edit, or remove any User Content that violates these Terms or is otherwise objectionable, at our sole discretion and without notice."}</p>
              </Subblock>
            </Block>

            <Block title={isGerman ? "5. Unzulaessige Nutzung" : "5. Prohibited Conduct"}>
              <p>{isGerman ? "Du verpflichtest dich, Folgendes zu unterlassen:" : "You agree not to:"}</p>
              <ul>
                <li>{isGerman ? "Nutzung fuer rechtswidrige Zwecke oder unter Verstoss gegen geltendes Recht" : "Use the Service for any unlawful purpose or in violation of any applicable laws or regulations"}</li>
                <li>{isGerman ? "Identitaetstaeuschung oder falsche Angaben zur Zugehoerigkeit" : "Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity"}</li>
                <li>{isGerman ? "Hochladen oder Verbreiten von Viren, Malware oder anderem schaedlichen Code" : "Upload or transmit viruses, malware, or other harmful code"}</li>
                <li>{isGerman ? "Unbefugter Zugriff auf den Dienst, Konten oder Systeme" : "Attempt to gain unauthorized access to any part of the Service, other users' accounts, or any systems or networks connected to the Service"}</li>
                <li>{isGerman ? "Scraping, Crawling oder automatisierter Zugriff ohne schriftliche Erlaubnis" : "Scrape, crawl, or use automated means to access the Service without our written permission"}</li>
                <li>{isGerman ? "Belaestigung, Missbrauch oder Schaedigung anderer Nutzer" : "Harass, abuse, or harm another user"}</li>
                <li>{isGerman ? "Versand von Spam oder unerwuenschten Nachrichten" : "Use the Service to send spam or unsolicited communications"}</li>
                <li>{isGerman ? "Stoerung der Integritaet oder Verfuegbarkeit des Dienstes" : "Interfere with or disrupt the integrity or performance of the Service"}</li>
              </ul>
            </Block>

            <Block title={isGerman ? "6. Geistiges Eigentum" : "6. Intellectual Property"}>
              <p>{isGerman ? "Der Dienst sowie seine urspruenglichen Inhalte (ausgenommen Nutzerinhalte), Funktionen und Merkmale sind Eigentum von Recepy Ranch bzw. seiner Lizenzgeber. Der Dienst ist durch Urheber-, Marken- und weitere Schutzrechte geschuetzt. Unsere Marken duerfen ohne vorherige schriftliche Zustimmung nicht verwendet werden." : "The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Recepy Ranch and its licensors. The Service is protected by copyright, trademark, and other applicable laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent."}</p>
            </Block>

            <Block title={isGerman ? "7. Gewaehrleistungsausschluss" : "7. Disclaimer of Warranties"}>
              <p>
                {isGerman ? "DER DIENST WIRD \"WIE BESEHEN\" UND \"WIE VERFUEGBAR\" BEREITGESTELLT. ES BESTEHEN KEINE AUSDRUECKLICHEN ODER STILLSCHWEIGENDEN GEWAEHRLEISTUNGEN, EINSCHLIESSLICH MARKTGAENGIGKEIT, EIGNUNG FUER EINEN BESTIMMTEN ZWECK ODER NICHTVERLETZUNG." : "THE SERVICE IS PROVIDED ON AN \"AS IS\" AND \"AS AVAILABLE\" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT."}
              </p>
              <p>
                {isGerman ? "WIR GARANTIEREN NICHT, DASS DER DIENST UNUNTERBROCHEN, SICHER ODER FEHLERFREI FUNKTIONIERT ODER DASS FEHLER BEHOBEN WERDEN." : "WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS."}
              </p>
              <p>
                {isGerman ? "REZEPTE UND INHALTE DIENEN NUR INFORMATIONELLEN ZWECKEN. WIR UEBERNEHMEN KEINE GEWAEHR FUER RICHTIGKEIT, SICHERHEIT ODER ERNAEHRUNGSWERT. DIE NUTZUNG ERFOLGT AUF EIGENES RISIKO. BEACHTE IMMER ALLERGIEN, ERNAEHRUNGSBESONDERHEITEN UND LEBENSMITTELSICHERHEIT." : "RECIPES AND OTHER CONTENT ON THE SERVICE ARE PROVIDED FOR INFORMATIONAL PURPOSES ONLY. WE MAKE NO REPRESENTATIONS OR WARRANTIES REGARDING THE ACCURACY, SAFETY, OR NUTRITIONAL VALUE OF ANY RECIPE OR CONTENT. YOU USE ANY RECIPE OR CONTENT AT YOUR OWN RISK. ALWAYS EXERCISE CAUTION AND COMMON SENSE WHEN PREPARING FOOD, ESPECIALLY REGARDING ALLERGIES, DIETARY RESTRICTIONS, AND FOOD SAFETY."}
              </p>
            </Block>

            <Block title={isGerman ? "8. Haftungsbeschraenkung" : "8. Limitation of Liability"}>
              <p>
                {isGerman ? "SOWEIT GESETZLICH ZULAESSIG, HAFTEN RECEPY RANCH UND SEINE ORGANE NICHT FUER MITTELBARE, ZUFAELLIGE, BESONDERE ODER FOLGESCHAEDEN, EINSCHLIESSLICH ENTGANGENEN GEWINNS, DATENVERLUST ODER SONSTIGER IMMATERIELLER SCHAEDEN, DIE ENTSTEHEN AUS:" : "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL RECEPY RANCH, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:"}
              </p>
              <ul>
                <li>{isGerman ? "deinem Zugriff auf den Dienst oder der Unmoeglichkeit der Nutzung" : "YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICE"}</li>
                <li>{isGerman ? "Verhalten oder Inhalten Dritter" : "ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE"}</li>
                <li>{isGerman ? "Nutzerinhalten aus dem Dienst" : "ANY USER CONTENT OBTAINED FROM THE SERVICE"}</li>
                <li>{isGerman ? "unbefugtem Zugriff, Nutzung oder Veraenderung deiner Uebertragungen oder Inhalte" : "UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT"}</li>
                <li>{isGerman ? "allergischen Reaktionen, Krankheiten, Verletzungen oder Schaeden bei Zubereitung oder Verzehr von Rezepten" : "ANY ALLERGIC REACTION, ILLNESS, INJURY, OR DAMAGE ARISING FROM THE PREPARATION OR CONSUMPTION OF ANY RECIPE FOUND ON THE SERVICE"}</li>
              </ul>
              <p>
                {isGerman ? "UNSERE GESAMTHAFTUNG IST, SOWEIT ZULAESSIG, AUF DEN BETRAG BEGRENZT, DEN DU UNS IN DEN 12 MONATEN VOR DEM SCHADENSEREIGNIS TATSAECHLICH BEZAHLT HAST." : "IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT YOU PAID US, IF ANY, IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE LIABILITY."}
              </p>
            </Block>

            <Block title={isGerman ? "9. Freistellung" : "9. Indemnification"}>
              <p>
                {isGerman ? "Du stellst Recepy Ranch sowie deren Mitarbeitende und Vertretungen von Anspruechen, Schaeden und Kosten (einschliesslich angemessener Anwaltskosten) frei, die aus deiner Nutzung des Dienstes, deinen Inhalten, einem Verstoss gegen diese AGB oder gegen Rechte Dritter entstehen." : "You agree to defend, indemnify, and hold harmless Recepy Ranch and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with: (a) your access to or use of the Service; (b) your User Content; (c) your violation of these Terms; or (d) your violation of any third-party rights."}
              </p>
            </Block>

            <Block title={isGerman ? "10. Dienste von Drittanbietern" : "10. Third-Party Services"}>
              <p>{isGerman ? "Der Dienst kann Links oder Integrationen zu externen Websites und Diensten enthalten. Wir haben darauf keinen Einfluss und uebernehmen keine Verantwortung fuer deren Inhalte oder Datenschutzpraktiken." : "The Service may contain links to or integrations with third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by the use of any such third-party content or services."}</p>
            </Block>

            <Block title={isGerman ? "11. Beendigung" : "11. Termination"}>
              <p>{isGerman ? "Wir koennen dein Konto und den Zugriff auf den Dienst aus wichtigem Grund, insbesondere bei Verstoessen gegen diese AGB, sofort sperren oder beenden. Mit Beendigung erlischt dein Nutzungsrecht. Regelungen, die ihrer Natur nach weitergelten sollen (z. B. Haftung, Freistellung), bleiben bestehen." : "We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability."}</p>
            </Block>

            <Block title={isGerman ? "12. Anwendbares Recht und Gerichtsstand" : "12. Governing Law"}>
              <p>{isGerman ? "Diese AGB unterstehen schweizerischem Recht unter Ausschluss des Kollisionsrechts. Ausschliesslicher Gerichtsstand fuer Streitigkeiten ist, soweit gesetzlich zulaessig, in der Schweiz." : "These Terms shall be governed by and construed in accordance with the laws of Switzerland, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Switzerland."}</p>
            </Block>

            <Block title={isGerman ? "13. Teilnichtigkeit" : "13. Severability"}>
              <p>{isGerman ? "Sollte eine Bestimmung dieser AGB unwirksam oder nicht durchsetzbar sein, bleiben die uebrigen Bestimmungen davon unberuehrt. Die unwirksame Bestimmung wird durch eine wirksame ersetzt, die dem wirtschaftlichen Zweck moeglichst nahekommt." : "If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect. The invalid or unenforceable provision will be modified to the minimum extent necessary to make it valid and enforceable."}</p>
            </Block>

            <Block title={isGerman ? "14. Gesamte Vereinbarung" : "14. Entire Agreement"}>
              <p>{isGerman ? "Diese AGB bilden zusammen mit der Datenschutzerklaerung die gesamte Vereinbarung zwischen dir und Recepy Ranch in Bezug auf die Nutzung des Dienstes und ersetzen fruehere Absprachen." : "These Terms, together with the Privacy Policy, constitute the entire agreement between you and Recepy Ranch regarding the use of the Service and supersede all prior agreements and understandings."}</p>
            </Block>

            <Block title={isGerman ? "15. Kontakt" : "15. Contact Us"}>
              <p>{isGerman ? "Bei Fragen zu diesen AGB kontaktiere uns unter:" : "If you have any questions about these Terms, please contact us at:"}</p>
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
