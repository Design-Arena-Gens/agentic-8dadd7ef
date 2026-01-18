/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lightbulb, Plus, Trash2 } from "lucide-react";
import { BLUEPRINTS, type TradeBlueprint } from "@/lib/blueprints";
import type {
  ExperienceAchievement,
  ExperienceEntry,
  ResumeData
} from "@/lib/resume";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createDefaultResume } from "@/lib/defaults";
import { nanoid } from "nanoid";
import { MONTHS, YEARS } from "@/lib/resume";
import ResumePreview from "@/components/resume-preview";

type ResumeField = keyof Omit<
  ResumeData,
  "experience" | "skills" | "certifications"
>;

const experienceMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 }
};

export default function ResumeBuilder() {
  const defaultResume = useMemo(() => createDefaultResume(), []);
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [activeBlueprintId, setActiveBlueprintId] = useState(
    defaultResume.experience[0]?.blueprintId ?? BLUEPRINTS[0].id
  );

  const activeBlueprint = useMemo(
    () =>
      BLUEPRINTS.find((blueprint) => blueprint.id === activeBlueprintId) ??
      BLUEPRINTS[0],
    [activeBlueprintId]
  );

  const updateField = (field: ResumeField, value: string) => {
    setResume((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateCertifications = (value: string) => {
    setResume((prev) => ({
      ...prev,
      certifications: value
    }));
  };

  const handleApplyBlueprint = (blueprint: TradeBlueprint) => {
    setResume((prev) => ({
      ...prev,
      targetTitle: blueprint.title,
      summary: blueprint.summaryTemplate.replace("{years}", "5"),
      skills: blueprint.coreSkills,
      experience: prev.experience.map((role) =>
        role.blueprintId === blueprint.id
          ? role
          : {
              ...role,
              blueprintId: blueprint.id
            }
      )
    }));
  };

  const addSkill = (skill: string) => {
    if (resume.skills.includes(skill)) return;
    setResume((prev) => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
  };

  const removeSkill = (skill: string) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item !== skill)
    }));
  };

  const addExperience = (blueprint?: TradeBlueprint) => {
    const refBlueprint = blueprint ?? activeBlueprint;
    const fallback = prevOrDefaultBlueprint(resume, refBlueprint.id);
    const entry: ExperienceEntry = {
      id: nanoid(),
      role: refBlueprint.title,
      company: "",
      startMonth: "Jan",
      startYear: "2022",
      endMonth: "Dec",
      endYear: "2023",
      isCurrent: false,
      blueprintId: fallback.id,
      achievements: refBlueprint.bulletLibrary[0]?.bullets.slice(0, 1).map(
        (text) =>
          ({
            id: nanoid(),
            text
          }) satisfies ExperienceAchievement
      ) ?? [
        {
          id: nanoid(),
          text: ""
        }
      ]
    };
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, entry]
    }));
  };

  const removeExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id)
    }));
  };

  const updateExperienceField = <K extends keyof ExperienceEntry>(
    id: string,
    field: K,
    value: ExperienceEntry[K]
  ) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    }));
  };

  const addAchievement = (experienceId: string, text = "") => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === experienceId
          ? {
              ...item,
              achievements: [
                ...item.achievements,
                {
                  id: nanoid(),
                  text
                }
              ]
            }
          : item
      )
    }));
  };

  const updateAchievement = (
    experienceId: string,
    achievementId: string,
    text: string
  ) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === experienceId
          ? {
              ...item,
              achievements: item.achievements.map((achievement) =>
                achievement.id === achievementId
                  ? { ...achievement, text }
                  : achievement
              )
            }
          : item
      )
    }));
  };

  const removeAchievement = (experienceId: string, achievementId: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === experienceId
          ? {
              ...item,
              achievements: item.achievements.filter(
                (achievement) => achievement.id !== achievementId
              )
            }
          : item
      )
    }));
  };

  const handleSuggestionClick = (
    experienceId: string,
    suggestion: string
  ) => {
    addAchievement(experienceId, suggestion);
  };

  return (
    <div className="min-h-screen pb-16 pt-10">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg transition hover:border-white/20">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wider text-indigo-200">
                TradeCraft Blueprint
              </p>
              <h1 className="text-3xl font-semibold text-white">
                Build a resume for the job you already do best
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => addExperience()}>
              <Plus size={16} />
              Add Experience
            </Button>
          </header>

          <section className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-lg shadow-brand/10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-indigo-200">
                  Trade Focus
                </p>
                <h2 className="text-lg font-semibold text-white">
                  Choose the blueprint closest to your work
                </h2>
              </div>
              <Button
                variant="subtle"
                size="sm"
                onClick={() => handleApplyBlueprint(activeBlueprint)}
              >
                Apply Blueprint
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {BLUEPRINTS.map((blueprint) => {
                const isActive = blueprint.id === activeBlueprintId;
                return (
                  <button
                    key={blueprint.id}
                    className={cn(
                      "rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm text-indigo-100 transition hover:border-brand hover:text-white",
                      isActive &&
                        "border-brand bg-brand/90 text-white shadow-lg shadow-brand/25"
                    )}
                    onClick={() => setActiveBlueprintId(blueprint.id)}
                  >
                    <p className="font-semibold">{blueprint.title}</p>
                    <p className="mt-2 text-xs text-indigo-200">
                      {blueprint.coreSkills.slice(0, 3).join(" • ")}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <FieldCard title="Contact" description="Let hiring teams reach you">
              <div className="grid gap-3">
                <InputField
                  label="Full name"
                  value={resume.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                />
                <InputField
                  label="Target job title"
                  value={resume.targetTitle}
                  onChange={(event) =>
                    updateField("targetTitle", event.target.value)
                  }
                />
                <InputField
                  label="Location"
                  value={resume.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <InputField
                    label="Phone"
                    value={resume.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                  />
                  <InputField
                    label="Email"
                    value={resume.email}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                </div>
              </div>
            </FieldCard>

            <FieldCard
              title="Summary"
              description="Translate your day-to-day wins into a tight intro"
            >
              <textarea
                className="h-40 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
                value={resume.summary}
                onChange={(event) => updateField("summary", event.target.value)}
              />
              <p className="mt-2 text-xs text-indigo-200">
                Use plain words. Let metrics and wins speak for themselves.
              </p>
            </FieldCard>

            <FieldCard
              title="Skills"
              description="Highlight the tools, certifications, and strengths you bring"
            >
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-brand/80"
                  >
                    {skill}
                    <button
                      className="text-white/70 transition hover:text-white"
                      onClick={() => removeSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <SkillAdder onAdd={(skill) => addSkill(skill)} />
              <div className="flex flex-wrap gap-2">
                {activeBlueprint.coreSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="rounded-full border border-brand/40 px-3 py-1 text-xs text-brand transition hover:bg-brand hover:text-white"
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-indigo-200">
                  Certifications
                </label>
                <textarea
                  className="h-20 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
                  value={resume.certifications}
                  onChange={(event) =>
                    updateCertifications(event.target.value)
                  }
                />
              </div>
            </FieldCard>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Experience</h2>
                <p className="text-xs uppercase tracking-widest text-indigo-200">
                  Pull out the wins that show how you make crews better
                </p>
              </div>
              <Button size="sm" onClick={() => addExperience()}>
                <Plus size={16} />
                New Role
              </Button>
            </div>
            <div className="space-y-5">
              <AnimatePresence>
                {resume.experience.map((experience) => (
                  <motion.div
                    key={experience.id}
                    {...experienceMotion}
                    layout
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-brand/10"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-col gap-2">
                        <InputField
                          label="Role"
                          value={experience.role}
                          onChange={(event) =>
                            updateExperienceField(
                              experience.id,
                              "role",
                              event.target.value
                            )
                          }
                        />
                        <InputField
                          label="Company"
                          value={experience.company}
                          onChange={(event) =>
                            updateExperienceField(
                              experience.id,
                              "company",
                              event.target.value
                            )
                          }
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(experience.id)}
                      >
                        <Trash2 size={16} />
                        Remove
                      </Button>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-[repeat(2,minmax(0,1fr))]">
                      <DatePickerRow
                        label="Start"
                        month={experience.startMonth}
                        year={experience.startYear}
                        onMonthChange={(value) =>
                          updateExperienceField(
                            experience.id,
                            "startMonth",
                            value
                          )
                        }
                        onYearChange={(value) =>
                          updateExperienceField(
                            experience.id,
                            "startYear",
                            value
                          )
                        }
                      />
                      <DatePickerRow
                        label="End"
                        month={experience.isCurrent ? "Present" : experience.endMonth}
                        year={experience.isCurrent ? "Present" : experience.endYear}
                        disabled={experience.isCurrent}
                        onMonthChange={(value) =>
                          updateExperienceField(
                            experience.id,
                            "endMonth",
                            value
                          )
                        }
                        onYearChange={(value) =>
                          updateExperienceField(
                            experience.id,
                            "endYear",
                            value
                          )
                        }
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <label className="text-xs uppercase tracking-widest text-indigo-200">
                        Current role
                      </label>
                      <button
                        className={cn(
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border border-white/15 bg-white/10 p-1 transition",
                          experience.isCurrent && "bg-brand"
                        )}
                        onClick={() =>
                          updateExperienceField(
                            experience.id,
                            "isCurrent",
                            !experience.isCurrent
                          )
                        }
                      >
                        <span
                          className={cn(
                            "block h-4 w-4 rounded-full bg-white transition-transform",
                            experience.isCurrent
                              ? "translate-x-5"
                              : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-indigo-100">
                          Impact bullets
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addAchievement(experience.id)}
                        >
                          <Plus size={16} />
                          Bullet
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {experience.achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                          >
                            <textarea
                              className="min-h-[75px] flex-1 resize-none bg-transparent text-sm text-white outline-none"
                              value={achievement.text}
                              onChange={(event) =>
                                updateAchievement(
                                  experience.id,
                                  achievement.id,
                                  event.target.value
                                )
                              }
                            />
                            <button
                              className="text-indigo-200 transition hover:text-white"
                              onClick={() =>
                                removeAchievement(
                                  experience.id,
                                  achievement.id
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <SuggestionsRail
                      blueprintId={experience.blueprintId ?? activeBlueprintId}
                      onSuggestionClick={(text) =>
                        handleSuggestionClick(experience.id, text)
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </section>

        <aside className="sticky top-10 h-fit space-y-6 rounded-3xl border border-white/10 bg-slate-50/95 p-8 shadow-2xl shadow-brand/20">
          <header>
            <p className="text-xs uppercase tracking-widest text-brand-dark">
              Live Preview
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              How your resume looks
            </h2>
          </header>
          <ResumePreview resume={resume} blueprint={activeBlueprint} />
          <div className="rounded-2xl border border-brand/10 bg-white p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-1 h-5 w-5 text-brand" />
              <div className="space-y-2 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">
                  Make it printable-ready
                </p>
                <p>
                  Use your browser &ldquo;Print&rdquo; option and save as PDF.
                  The preview to the left is formatted to fit 8.5×11 inch pages.
                </p>
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              onClick={() => window.print()}
              variant="solid"
              size="lg"
            >
              Download / Print
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function prevOrDefaultBlueprint(
  resume: ResumeData,
  fallbackId: string
): TradeBlueprint {
  const ids = resume.experience
    .map((experience) => experience.blueprintId)
    .filter(Boolean);
  const lastId = ids[ids.length - 1];
  return (
    BLUEPRINTS.find((blueprint) => blueprint.id === lastId) ??
    BLUEPRINTS.find((blueprint) => blueprint.id === fallbackId) ??
    BLUEPRINTS[0]
  );
}

function FieldCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-brand/10">
      <p className="text-xs uppercase tracking-widest text-indigo-200">
        {title}
      </p>
      <p className="text-sm text-indigo-100">{description}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-200">
      {label}
      <input
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
}

function DatePickerRow({
  label,
  month,
  year,
  onMonthChange,
  onYearChange,
  disabled
}: {
  label: string;
  month: string;
  year: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  disabled?: boolean;
}) {
  const isPresent = month === "Present" || year === "Present";
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-indigo-200">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <select
            disabled={disabled}
            value={isPresent ? "Present" : month}
            className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
            onChange={(event) => onMonthChange(event.target.value)}
          >
            {isPresent ? (
              <option value="Present">Present</option>
            ) : (
              MONTHS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-indigo-200" />
        </div>
        <div className="relative flex-1">
          <select
            disabled={disabled}
            value={isPresent ? "Present" : year}
            className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
            onChange={(event) => onYearChange(event.target.value)}
          >
            {isPresent ? (
              <option value="Present">Present</option>
            ) : (
              YEARS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-indigo-200" />
        </div>
      </div>
    </div>
  );
}

function SuggestionsRail({
  blueprintId,
  onSuggestionClick
}: {
  blueprintId: string;
  onSuggestionClick: (text: string) => void;
}) {
  const blueprint =
    BLUEPRINTS.find((item) => item.id === blueprintId) ?? BLUEPRINTS[0];

  return (
    <div className="mt-6 rounded-xl border border-dashed border-white/20 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-indigo-100">
        <Lightbulb size={16} />
        <p className="text-xs font-semibold uppercase tracking-[0.2em]">
          Suggested bullet wins
        </p>
      </div>
      <div className="mt-3 space-y-3">
        {blueprint.bulletLibrary.map((library) => (
          <div key={library.label}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-200">
              {library.label}
            </p>
            <div className="mt-1 space-y-2">
              {library.bullets.map((bullet) => (
                <button
                  key={bullet}
                  className="w-full rounded-lg border border-white/0 bg-white/10 p-3 text-left text-sm text-indigo-100 transition hover:border-brand hover:bg-brand/30 hover:text-white"
                  onClick={() => onSuggestionClick(bullet)}
                >
                  {bullet.replace("{year}", new Date().getFullYear().toString())}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillAdder({ onAdd }: { onAdd: (skill: string) => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entries = value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (!entries.length) return;
    entries.forEach((entry) => onAdd(entry));
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
        placeholder="Add skills (separate with commas or press enter)"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button type="submit" variant="outline" size="sm">
        Add
      </Button>
    </form>
  );
}
