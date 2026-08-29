"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Option = { key: string; text: string };
type Q = { id: string; number: number; prompt: string; options: Option[] };
type Section = { title: string; description: string; questions: Q[] };

export function ApplyFlow({
  slug,
  roleName,
  focus,
}: {
  slug: string;
  roleName: string;
  focus: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "quiz">("details");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [general, setGeneral] = useState<Section | null>(null);
  const [roleSection, setRoleSection] = useState<Section | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  async function onDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    form.set("slug", slug);
    const res = await fetch("/api/apply/start", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Could not start application.");
      return;
    }
    const qRes = await fetch(`/api/apply/${data.applicationId}/questions`);
    const quiz = await qRes.json();
    setLoading(false);
    if (!qRes.ok) {
      setError(quiz.error || "Could not load questions.");
      return;
    }
    setApplicationId(data.applicationId);
    setGeneral(quiz.general);
    setRoleSection(quiz.roleSection);
    setStep("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmitQuiz(e: FormEvent) {
    e.preventDefault();
    const needed = [...(general?.questions ?? []), ...(roleSection?.questions ?? [])];
    if (needed.some((q) => !answers[q.id])) {
      setError("Please answer every question before submitting.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch(`/api/apply/${applicationId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Submit failed.");
      return;
    }
    const qs = new URLSearchParams({
      score: String(data.totalScore),
      max: String(data.totalMax),
      g: String(data.generalScore),
      gm: String(data.generalMax),
      r: String(data.roleScore),
      rm: String(data.roleMax),
      role: roleName,
    });
    router.push(`/careers/complete?${qs.toString()}`);
  }

  function SectionBlock({ section }: { section: Section }) {
    return (
      <fieldset className="space-y-8">
        <legend className="font-display text-2xl text-gold-light">{section.title}</legend>
        {section.description && <p className="text-sm text-muted">{section.description}</p>}
        {section.questions.map((q) => (
          <div key={q.id} className="card-lux p-5">
            <p className="text-sm text-cream">
              <span className="text-gold">{q.number}.</span> {q.prompt}
            </p>
            <div className="mt-4 space-y-2">
              {q.options.map((o) => (
                <label
                  key={o.key}
                  className={`flex cursor-pointer gap-3 border px-3 py-2 text-sm ${
                    answers[q.id] === o.key ? "border-gold bg-gold/10" : "border-gold/20"
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1 accent-gold"
                    name={q.id}
                    value={o.key}
                    checked={answers[q.id] === o.key}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.key }))}
                  />
                  <span>
                    <span className="text-gold">{o.key})</span> {o.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </fieldset>
    );
  }

  if (step === "details") {
    return (
      <form onSubmit={onDetails} className="mx-auto max-w-xl space-y-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Apply</p>
        <h1 className="font-display text-4xl text-gold-light">{roleName}</h1>
        {focus && <p className="text-muted">{focus}</p>}
        <p className="text-sm text-muted">
          Enter your details and upload a CV to unlock the questionnaire. You cannot see
          which questions you got right or wrong after you submit.
        </p>
        <input name="name" required placeholder="Full name" className="w-full px-3 py-2" />
        <input name="email" type="email" required placeholder="Email" className="w-full px-3 py-2" />
        <input name="phone" required placeholder="Phone" className="w-full px-3 py-2" />
        <label className="block text-xs uppercase tracking-[0.2em] text-gold">
          CV (PDF or Word)
          <input
            name="cv"
            type="file"
            required
            accept=".pdf,.doc,.docx,application/pdf"
            className="mt-2 block w-full text-sm text-cream"
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={loading} className="btn-gold w-full py-3 text-xs">
          {loading ? "Starting…" : "Start questionnaire"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmitQuiz} className="mx-auto max-w-3xl space-y-12">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Questionnaire</p>
        <h1 className="font-display text-3xl text-gold-light">{roleName}</h1>
        <p className="mt-2 text-sm text-muted">Answer every question, then submit once.</p>
      </div>
      {general && <SectionBlock section={general} />}
      {roleSection && <SectionBlock section={roleSection} />}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={loading} className="btn-gold w-full py-3 text-xs">
        {loading ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
