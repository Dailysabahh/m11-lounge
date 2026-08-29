import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/format";
import { requireAdmin } from "@/lib/admin-guard";
import {
  saveApplicationNotes,
  updateApplicationStatus,
} from "../../actions";
import type { ApplicationStatus } from "@prisma/client";

const statuses: ApplicationStatus[] = [
  "SUBMITTED",
  "REVIEWED",
  "SHORTLISTED",
  "REJECTED",
];

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const app = await prisma.application.findUnique({
    where: { id },
    include: { jobRole: { include: { questions: { orderBy: { number: "asc" } } } } },
  });
  if (!app) notFound();

  const generalRole = await prisma.jobRole.findFirst({
    where: { isGeneral: true },
    include: { questions: { orderBy: { number: "asc" } } },
  });
  const chosen = parseJson<Record<string, string>>(app.answersJson, {});

  function Block({
    title,
    questions,
  }: {
    title: string;
    questions: { id: string; number: number; prompt: string; optionsJson: string; correctKey: string }[];
  }) {
    return (
      <section className="mt-10">
        <h2 className="font-display text-xl text-gold-light">{title}</h2>
        <div className="mt-4 space-y-4">
          {questions.map((q) => {
            const options = parseJson<{ key: string; text: string }[]>(q.optionsJson, []);
            const pick = (chosen[q.id] || "").toUpperCase();
            const ok = pick === q.correctKey;
            const pickText = options.find((o) => o.key === pick)?.text;
            const rightText = options.find((o) => o.key === q.correctKey)?.text;
            return (
              <div key={q.id} className="gold-border p-4 text-sm">
                <p>
                  <span className="text-gold">{q.number}.</span> {q.prompt}
                </p>
                <p className={`mt-2 ${ok ? "text-emerald-400" : "text-red-400"}`}>
                  Applicant: {pick || "—"} {pickText ? `— ${pickText}` : ""}{" "}
                  {ok ? "(correct)" : "(incorrect)"}
                </p>
                {!ok && (
                  <p className="mt-1 text-gold">
                    Correct: {q.correctKey} — {rightText}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-gold-light">{app.name}</h1>
      <p className="mt-2 text-sm text-muted">
        {app.jobRole.name} · {app.email} · {app.phone}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card-lux p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted">Total</p>
          <p className="font-display text-2xl text-gold">
            {app.totalScore}/{app.totalMax}
          </p>
        </div>
        <div className="card-lux p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted">General</p>
          <p className="font-display text-2xl text-gold">
            {app.generalScore}/{app.generalMax}
          </p>
        </div>
        <div className="card-lux p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted">Role</p>
          <p className="font-display text-2xl text-gold">
            {app.roleScore}/{app.roleMax}
          </p>
        </div>
      </div>

      <p className="mt-6">
        <a href={app.cvPath} target="_blank" rel="noreferrer" className="text-gold underline">
          Download CV ({app.cvName})
        </a>
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <form key={s} action={updateApplicationStatus.bind(null, app.id, s)}>
            <button
              className={`px-3 py-1 text-[10px] uppercase tracking-widest ${
                app.status === s ? "bg-gold text-ink" : "border border-gold/40 text-gold"
              }`}
            >
              {s}
            </button>
          </form>
        ))}
      </div>

      <form action={saveApplicationNotes} className="mt-8 space-y-2">
        <input type="hidden" name="id" value={app.id} />
        <label className="text-xs uppercase tracking-widest text-gold">Interviewer notes</label>
        <textarea
          name="adminNotes"
          defaultValue={app.adminNotes ?? ""}
          rows={4}
          className="w-full px-3 py-2 text-sm"
        />
        <button className="btn-gold px-4 py-2 text-xs">Save notes</button>
      </form>

      {app.status !== "DRAFT" && (
        <>
          <Block
            title="Section A — General Screening"
            questions={generalRole?.questions ?? []}
          />
          <Block
            title={`Section ${app.jobRole.sectionKey} — ${app.jobRole.name}`}
            questions={app.jobRole.questions}
          />
        </>
      )}
    </div>
  );
}
