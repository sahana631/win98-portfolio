export function ResumeWindow() {
  const resume = `Sahana Swaminathan
sahana631@gmail.com | linkedin.com/in/sahana533 | github.com/sahana631
Seattle, WA | (408) 398-9186
─────────────────────────────────────────────────────────

SUMMARY
───────
Software Engineer with 3 years of experience building enterprise-scale
systems and customer-facing applications. Experienced in JavaScript,
TypeScript, and React on the frontend, and C# and Node.js on the backend.
Shipped production features used by enterprise customers globally, owned
operational quality through on-call incident response, and built
AI-assisted workflows to improve engineering productivity at scale.

EXPERIENCE
──────────
Software Engineer                              Jun 2023 – May 2026
Microsoft Corporation — Redmond, WA

  Dynamics 365 Omnichannel Voice          Oct 2024 – May 2026
  • Owned end-to-end delivery of Teams Phone extensibility features,
    deepening integration between Microsoft Teams and Dynamics 365
    Contact Center for enterprise customers globally
  • Delivered DTMF Broadcast feature (public preview) — enabling
    real-time tone broadcasting to all call participants
  • Maintained communication infrastructure at 99.999% reliability
  • Led Sev-2 incident investigations and customer escalations on-call,
    coordinating cross-team response to resolve service outages
  • Built AI-powered workflows using Claude and GitHub Copilot to
    automate bug triage and incident investigation

  SRO Support — DevOps & Developer Productivity  Jun 2023 – Oct 2024
  • Developed static analysis packages in C# adopted across 1,000+
    engineers, including a credential/secrets scanner
  • Built Grafana dashboards tracking PR metrics and developer velocity
  • Maintained CI/CD pipelines using PowerShell and KQL

Software Engineering Intern                    Jun 2022 – Aug 2022
Microsoft Corporation — Redmond, WA
  • Integrated Instagram messaging into Dynamics 365 Omnichannel CRM
    using .NET/C# and the Instagram Messaging API

Software Engineering Intern                    May 2021 – Aug 2021
State Farm Insurance — Bloomington, IL
  • Architected a full stack self-service tool (MERN stack) allowing
    engineers to view and manage GitLab groups and projects
  • Wrote automated test suites using JUnit and Enzyme

EDUCATION
─────────
B.S. Computer Science, Data Science              Graduated 2023
Purdue University
Presidential Scholarship Recipient & Honors College Graduate

SKILLS
──────
Languages:   JavaScript, TypeScript, C#, Python, SQL, PowerShell, Java
Frameworks:  React, Node.js, .NET, Grafana, Azure DevOps
Platforms:   Microsoft Azure, Dynamics 365, Microsoft Teams
`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <a
          href="/Sahana_Swaminathan_Resume.pdf"
          download="Sahana_Swaminathan_Resume.pdf"
          className="win98-btn"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          💾 Save As...
        </a>
      </div>
      <div
        className="mono"
        style={{
          background: 'white',
          border: '2px solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          padding: 12,
          whiteSpace: 'pre',
          overflowX: 'auto',
          lineHeight: 1.7,
          minHeight: 200,
          fontSize: 13,
          color: '#1a1a1a',
          fontWeight: 'bold',
        }}
      >
        {resume}
      </div>
    </div>
  );
}
