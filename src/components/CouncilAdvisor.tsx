import { FormEvent, useState } from 'react';
import { Loader2, Send } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'How does the 70/30 zero-PVC sponsorship model keep every bench self-maintaining?',
  'What does a Founding Green Patron receive for ₹18,000 in Hisar?',
  'How are weekly crew washes and native tree plantations verified?',
];

export function CouncilAdvisor() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitQuery = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) {
      setError('Please enter a question about The Hundred project.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Advisor request failed.');
      }
      setAnswer(data.answer);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to reach the Council Advisor right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitQuery(question);
  };

  return (
    <section
      id="advisor"
      className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] py-20"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-green-primary)] uppercase">
            Donor &amp; CSR Briefing
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight font-medium text-[var(--color-dark-base)] md:text-4xl">
            Ask the Founding Green Council Advisor
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-dark-muted)] md:text-base">
            Have a question on Hisar corridor NOCs, 70/30 zero-PVC sponsorship
            economics, or CSR documentation? Query the official project brief
            directly.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuestion(q);
                  void submitQuery(q);
                }}
                className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] px-3 py-2 text-left text-xs text-[var(--color-dark-base)] transition-colors duration-150 hover:border-[var(--color-green-primary)] cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="advisor-question-input" className="sr-only">
              Ask a question about The Hundred project
            </label>
            <input
              id="advisor-question-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about unit economics, weekly maintenance SLA, or Razorpay/SBI transfer..."
              className="min-h-[46px] flex-1 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] px-4 text-sm text-[var(--color-dark-base)] placeholder:text-[var(--color-green-mid)] focus:border-[var(--color-green-primary)] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[var(--color-green-primary)] px-6 py-3 text-xs font-semibold tracking-[0.08em] text-white uppercase whitespace-nowrap transition-colors duration-150 hover:bg-[#097557] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Analyzing
                </>
              ) : (
                <>
                  Ask Advisor
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-800"
            >
              {error}
            </div>
          )}

          {answer && (
            <div className="mt-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] p-5">
              <p className="text-xs font-medium tracking-wider text-[var(--color-green-primary)] uppercase">
                Council Brief Response
              </p>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-dark-base)]">
                {answer}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
