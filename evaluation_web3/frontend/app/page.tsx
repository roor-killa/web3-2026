"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type Certificate = {
  id: number;
  student_name: string;
  certification_title: string;
  issued_at: string;
  blockchain_hash: string | null;
};

const DEFAULT_API = "http://localhost:8002";

const MONTHS_FR: { value: number; label: string }[] = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function formatIssuedFr(iso: string): string {
  const parts = iso.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return iso;
  const [y, m, d] = parts;
  const dt = new Date(y, m - 1, d);
  const s = dt.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API).replace(/\/$/, "");
}

export default function HomePage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);

  const today = useMemo(() => new Date(), []);
  const defaultYear = today.getFullYear();
  const defaultMonth = today.getMonth() + 1;
  const defaultDay = today.getDate();

  const [form, setForm] = useState({
    student_name: "",
    certification_title: "",
    issueDay: defaultDay,
    issueMonth: defaultMonth,
    issueYear: defaultYear,
    blockchain_hash: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const listeRef = useRef<HTMLElement>(null);
  const formulaireRef = useRef<HTMLElement>(null);

  function allerListeCertificats() {
    listeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    listeRef.current?.focus({ preventScroll: true });
  }

  function allerFormulaire() {
    formulaireRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    formulaireRef.current?.focus({ preventScroll: true });
  }

  const maxDay = daysInMonth(form.issueYear, form.issueMonth);
  const yearMin = defaultYear - 50;
  const yearMax = defaultYear + 1;

  const yearOptions = useMemo(() => {
    const out: number[] = [];
    for (let y = yearMax; y >= yearMin; y--) out.push(y);
    return out;
  }, [yearMin, yearMax]);

  const dayOptions = useMemo(() => {
    const n = daysInMonth(form.issueYear, form.issueMonth);
    return Array.from({ length: n }, (_, i) => i + 1);
  }, [form.issueYear, form.issueMonth]);

  function setIssuePart(
    partial: Partial<{
      issueDay: number;
      issueMonth: number;
      issueYear: number;
    }>,
  ) {
    setForm((f) => {
      const next = { ...f, ...partial };
      const y = next.issueYear;
      const m = next.issueMonth;
      const cap = daysInMonth(y, m);
      const d = Math.min(next.issueDay, cap);
      return { ...next, issueDay: d };
    });
  }

  const loadCerts = useCallback(async () => {
    const base = apiBase();
    const r = await fetch(`${base}/api/certificates`, { cache: "no-store" });
    if (!r.ok) {
      throw new Error(
        `Erreur serveur (${r.status}). Vérifiez que l’API est démarrée : ${base}`,
      );
    }
    const data: Certificate[] = await r.json();
    setCerts(data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingList(true);
      setLoadError(null);
      try {
        await loadCerts();
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Impossible de charger la liste");
        }
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadCerts]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormMsg(null);
    setSubmitting(true);
    const base = apiBase();
    const issued_at = toIsoDate(form.issueYear, form.issueMonth, form.issueDay);
    const body = {
      student_name: form.student_name.trim(),
      certification_title: form.certification_title.trim(),
      issued_at,
      blockchain_hash: form.blockchain_hash.trim() || null,
    };
    try {
      const r = await fetch(`${base}/api/certificates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        const detail = data?.detail;
        const text =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? JSON.stringify(detail)
              : r.statusText;
        throw new Error(text || "Création refusée");
      }
      setFormMsg({ type: "ok", text: "Certificat enregistré dans la base." });
      const now = new Date();
      setForm((f) => ({
        ...f,
        student_name: "",
        certification_title: "",
        blockchain_hash: "",
        issueDay: now.getDate(),
        issueMonth: now.getMonth() + 1,
        issueYear: now.getFullYear(),
      }));
      await loadCerts();
    } catch (err) {
      setFormMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Erreur réseau",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>CertiChain</h1>
      <p className="subtitle">
        Publiez un certificat numérique pour un étudiant et consultez tous les
        certificats enregistrés dans la base de données.
      </p>

      <div className="page-actions" role="navigation" aria-label="Navigation rapide">
        <button
          type="button"
          className="btn-secondary"
          onClick={allerListeCertificats}
        >
          Voir les certificats
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={allerFormulaire}
        >
          Nouveau certificat
        </button>
      </div>

      <div className="grid">
        <section
          ref={formulaireRef}
          id="formulaire-certificat"
          className="card"
          tabIndex={-1}
          aria-labelledby="titre-formulaire"
        >
          <h2 id="titre-formulaire">Nouveau certificat</h2>
          {formMsg ? (
            <div
              className={`banner ${formMsg.type === "ok" ? "ok" : "err"}`}
              role="status"
            >
              {formMsg.text}
            </div>
          ) : null}
          <form onSubmit={onSubmit}>
            <label htmlFor="student_name">Nom de l’étudiant</label>
            <input
              id="student_name"
              name="student_name"
              required
              autoComplete="name"
              value={form.student_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, student_name: e.target.value }))
              }
            />

            <label htmlFor="certification_title">Intitulé de la certification</label>
            <p className="hint field-intro" id="hint-certification-title">
              Titre du diplôme ou de la formation attestée (tel qu’il doit apparaître sur
              le certificat).
            </p>
            <input
              id="certification_title"
              name="certification_title"
              required
              maxLength={500}
              autoComplete="off"
              placeholder="Ex. Certification Web3 — parcours Licence et blockchain"
              aria-describedby="hint-certification-title"
              value={form.certification_title}
              onChange={(e) =>
                setForm((f) => ({ ...f, certification_title: e.target.value }))
              }
            />

            <div className="date-field-group">
              <span className="field-label">Date d’émission</span>
              <div className="date-row">
                <div className="date-part">
                  <label htmlFor="issue_day">Jour</label>
                  <select
                    id="issue_day"
                    name="issue_day"
                    required
                    value={Math.min(form.issueDay, maxDay)}
                    onChange={(e) =>
                      setIssuePart({ issueDay: Number(e.target.value) })
                    }
                  >
                    {dayOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="date-part">
                  <label htmlFor="issue_month">Mois</label>
                  <select
                    id="issue_month"
                    name="issue_month"
                    required
                    value={form.issueMonth}
                    onChange={(e) =>
                      setIssuePart({ issueMonth: Number(e.target.value) })
                    }
                  >
                    {MONTHS_FR.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="date-part">
                  <label htmlFor="issue_year">Année</label>
                  <select
                    id="issue_year"
                    name="issue_year"
                    required
                    value={form.issueYear}
                    onChange={(e) =>
                      setIssuePart({ issueYear: Number(e.target.value) })
                    }
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <label htmlFor="blockchain_hash">Hash blockchain / identifiant de preuve</label>
            <input
              id="blockchain_hash"
              name="blockchain_hash"
              placeholder="ex. 0xabc123… (optionnel)"
              value={form.blockchain_hash}
              onChange={(e) =>
                setForm((f) => ({ ...f, blockchain_hash: e.target.value }))
              }
            />
            <p className="hint">
              Laissez vide si le certificat n’est pas encore ancré sur une chaîne.
            </p>

            <button type="submit" disabled={submitting}>
              {submitting ? "Enregistrement…" : "Créer le certificat"}
            </button>
          </form>
        </section>

        <section
          ref={listeRef}
          id="liste-certificats"
          className="card"
          tabIndex={-1}
          aria-labelledby="titre-liste"
        >
          <div className="card-title-row">
            <h2 id="titre-liste">Certificats enregistrés</h2>
            {!loadingList && certs.length > 0 ? (
              <span className="badge-count" aria-live="polite">
                {certs.length} certificat{certs.length > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>
          {loadError ? (
            <div className="banner err" role="alert">
              {loadError}
            </div>
          ) : null}
          {loadingList ? (
            <p className="empty">Chargement…</p>
          ) : certs.length === 0 ? (
            <p className="empty">Aucun certificat pour l’instant.</p>
          ) : (
            <ul className="cert-list">
              {certs.map((c) => (
                <li key={c.id} className="cert-item">
                  <div className="cert-intitule">
                    <span className="cert-label">Intitulé de la certification</span>
                    <strong className="cert-intitule-text">{c.certification_title}</strong>
                  </div>
                  <div className="cert-meta">
                    <span className="cert-label-inline">Étudiant :</span> {c.student_name}{" "}
                    — <span className="cert-label-inline">émis le</span>{" "}
                    {formatIssuedFr(c.issued_at)} — <span className="cert-label-inline">n°</span>{" "}
                    {c.id}
                  </div>
                  {c.blockchain_hash ? (
                    <div className="hash">{c.blockchain_hash}</div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="api-foot">
        <span className="api-foot-label">Adresse de l’API :</span>{" "}
        <code>{apiBase()}</code>
        <br />
        <span className="api-foot-label">Documentation interactive :</span>{" "}
        <a className="link-doc" href={`${apiBase()}/docs`}>
          ouvrir la page Swagger (/docs)
        </a>
      </p>
    </main>
  );
}
