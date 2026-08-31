"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Option = { key: string; text: string };
type Q = { id: string; number: number; prompt: string; options: Option[] };
type Section = { title: string; description: string; questions: Q[] };

async function readJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

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
  const [cvName, setCvName] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [general, setGeneral] = useState<Section | null>(null);
  const [roleSection, setRoleSection] = useState<Section | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  async function onDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      form.set("slug", slug);
      const res = await fetch("/api/apply/start", { method: "POST", body: form });
      const data = await readJson(res);
      if (!res.ok) {
        setError(data.error || "Could not save your details. Please try again.");
        return;
      }
      const qRes = await fetch(`/api/apply/${data.applicationId}/questions`);
      const quiz = await readJson(qRes);
      if (!qRes.ok) {
        setError(quiz.error || "Details saved, but questions could not load. Refresh and continue.");
        return;
      }
      setApplicationId(data.applicationId);
      setGeneral(quiz.general);
      setRoleSection(quiz.roleSection);
      setStep("quiz");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
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
    try {
      const res = await fetch(`/api/apply/${applicationId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await readJson(res);
      if (!res.ok) {
        setError(data.error || "Submit failed. Please try again.");
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
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Step 1 of 2</p>
        <h1 className="font-display text-4xl text-gold-light">{roleName}</h1>
        {focus && <p className="text-muted">{focus}</p>}
        <p className="text-sm leading-6 text-muted">
          Fill in your details and attach your CV. On the next page you will answer a short
          screening. After you submit, M11 receives your application in the admin inbox.
        </p>
        <label className="block text-xs uppercase tracking-[0.2em] text-gold">
          Full name
          <input name="name" required placeholder="Your name" className="mt-2 w-full px-3 py-2 normal-case tracking-normal text-sm text-cream" />
        </label>
        <label className="block text-xs uppercase tracking-[0.2em] text-gold">
          Email
          <input name="email" type="email" required placeholder="you@email.com" className="mt-2 w-full px-3 py-2 normal-case tracking-normal text-sm text-cream" />
        </label>
        <label className="block text-xs uppercase tracking-[0.2em] text-gold">
          Phone / WhatsApp
          <input name="phone" required placeholder="0800 000 0000" className="mt-2 w-full px-3 py-2 normal-case tracking-normal text-sm text-cream" />
        </label>
        <label className="block text-xs uppercase tracking-[0.2em] text-gold">
          CV (PDF or Word, max 4MB)
          <input
            name="cv"
            type="file"
            required
            accept=".pdf,.doc,.docx,application/pdf"
            className="mt-2 block w-full text-sm normal-case tracking-normal text-cream"
            onChange={(e) => setCvName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
        {cvName && <p className="text-xs text-gold-light">Selected: {cvName}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={loading} className="btn-gold w-full py-3 text-xs">
          {loading ? "Saving your details…" : "Continue to questions"}
        </button>
      </form>
    );
  }

  const answered = Object.keys(answers).length;
  const totalQs = (general?.questions.length ?? 0) + (roleSection?.questions.length ?? 0);

  return (
    <form onSubmit={onSubmitQuiz} className="mx-auto max-w-3xl space-y-12">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Step 2 of 2</p>
        <h1 className="font-display text-3xl text-gold-light">{roleName}</h1>
        <p className="mt-2 text-sm text-muted">
          Answer every question, then submit. Your application is sent to M11. You will see
          your overall score — not which answers were right or wrong.
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-gold">
          {answered} / {totalQs} answered
        </p>
      </div>
      {general && <SectionBlock section={general} />}
      {roleSection && <SectionBlock section={roleSection} />}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={loading} className="btn-gold w-full py-3 text-xs">
        {loading ? "Sending to M11…" : "Submit application"}
      </button>
    </form>
  );
}
