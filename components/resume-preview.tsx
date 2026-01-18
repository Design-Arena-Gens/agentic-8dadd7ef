import type { TradeBlueprint } from "@/lib/blueprints";
import type { ResumeData } from "@/lib/resume";
import { cn } from "@/lib/utils";

export default function ResumePreview({
  resume,
  blueprint
}: {
  resume: ResumeData;
  blueprint: TradeBlueprint;
}) {
  return (
    <article className="relative rounded-3xl border border-slate-200 bg-white p-8 text-slate-800 shadow-xl shadow-slate-600/10">
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-brand via-brand-light to-brand-dark" />
      <header className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {resume.fullName || "Your Name"}
        </h1>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark/80">
          {resume.targetTitle || blueprint.title}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
          {resume.location && <span>{resume.location}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.email && <span>{resume.email}</span>}
        </div>
      </header>

      <section className="mt-4 space-y-6 text-sm leading-relaxed">
        <ResumeSection title="Summary">
          <p>{resume.summary || "Add a short punchy story about how you deliver results on the job."}</p>
        </ResumeSection>

        <ResumeSection title="Core Skills">
          <div className="flex flex-wrap gap-2">
            {(resume.skills.length ? resume.skills : blueprint.coreSkills).map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold text-brand-dark"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </ResumeSection>

        {!!resume.certifications.trim().length && (
          <ResumeSection title="Certifications & Training">
            <p>{resume.certifications}</p>
          </ResumeSection>
        )}

        <ResumeSection title="Experience">
          <div className="space-y-5">
            {resume.experience.map((experience) => (
              <div key={experience.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {experience.role || "Job Title"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {experience.company || "Company Name"}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {formatExperienceDuration(experience)}
                  </span>
                </div>
                <ul className="mt-2 space-y-2 pl-5 text-sm text-slate-600">
                  {experience.achievements.length ? (
                    experience.achievements.map((achievement) => (
                      <li key={achievement.id} className="list-disc">
                        {achievement.text || "Add a strong, metric-driven win."}
                      </li>
                    ))
                  ) : (
                    <li className="list-disc">
                      Add bullet points that show how you keep crews safe, on
                      time, and on budget.
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </ResumeSection>
      </section>
    </article>
  );
}

function ResumeSection({
  title,
  children,
  className
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-2", className)}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function formatExperienceDuration(experience: ResumeData["experience"][number]) {
  const start = formatDatePart(experience.startMonth, experience.startYear);
  const end = experience.isCurrent
    ? "Present"
    : formatDatePart(experience.endMonth, experience.endYear);

  if (!start && !end) return "";
  return [start, end].filter(Boolean).join(" – ");
}

function formatDatePart(month: string, year: string) {
  const safeMonth = month === "Present" ? "" : month;
  const safeYear = year === "Present" ? "" : year;
  return [safeMonth, safeYear].filter(Boolean).join(" ");
}
