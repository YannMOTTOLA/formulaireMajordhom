"use client";

import { useState } from "react";
import "./homePage.css";

export default function FormPage() {
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState<"VISIT" | "CALLBACK" | "PICTURES" | "">("");
  const [message, setMessage] = useState("");
  const [day, setDay] = useState<"MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "">("");
  const [hour, setHour] = useState<number | "">("");
  const [minute, setMinute] = useState<number | "">("");
  const [availabilities, setAvailabilities] = useState<{ day: string; hour: number; minute: number }[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const addAvailability = () => {
    if (day && hour !== "" && minute !== "") {
      setAvailabilities([...availabilities, { day, hour: Number(hour), minute: Number(minute) }]);
      setDay("");
      setHour("");
      setMinute("");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:3001/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender,
          firstName,
          lastName,
          email,
          phone,
          message,
          topic,
          availabilities,
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        // 🔍 Cas des erreurs de validation (422)
        if (res.status === 422 && Array.isArray(data.errors)) {
          const errorMap: Record<string, string> = {};
          for (const err of data.errors) {
            errorMap[err.field] = err.message;
          }
          setFieldErrors(errorMap);
          throw new Error(data.message || "Erreur de validation.");
        }

        throw new Error(data.message || "Erreur lors de l’envoi du formulaire.");
      }

      // ✅ Succès
      setSuccess(true);
      setGender("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setTopic("");
      setMessage("");
      setAvailabilities([]);
      setDay("");
      setHour("");
      setMinute("");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Erreur inconnue.");
    }
  };

  function translateDay(day: string) {
    const days: Record<string, string> = {
      MONDAY: "Lundi",
      TUESDAY: "Mardi",
      WEDNESDAY: "Mercredi",
      THURSDAY: "Jeudi",
      FRIDAY: "Vendredi",
      SATURDAY: "Samedi",
    };
    return days[day] || day;
  }

  return (
    <div className="main-wrapper">
      <div className="form-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>CONTACTEZ L’AGENCE</h2>

          <div className="form-columns">
            {/* === COORDONNÉES === */}
            <div className="left-column">
              <h3>VOS COORDONNÉES</h3>

              <div className="radio-group">
                <label>
                  <input type="radio" value="FEMALE" checked={gender === "FEMALE"} onChange={(e) => setGender(e.target.value as "FEMALE")} /> Mme
                </label>
                <label>
                  <input type="radio" value="MALE" checked={gender === "MALE"} onChange={(e) => setGender(e.target.value as "MALE")} /> M.
                </label>
              </div>
              {fieldErrors.gender && <p className="error">{fieldErrors.gender}</p>}

              <div className="inline-fields">
                <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              {fieldErrors.firstName && <p className="error">{fieldErrors.firstName}</p>}
              {fieldErrors.lastName && <p className="error">{fieldErrors.lastName}</p>}

              <input type="email" placeholder="Adresse mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
              {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}

              <input type="tel" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              {fieldErrors.phone && <p className="error">{fieldErrors.phone}</p>}

              {/* DISPONIBILITÉS */}
              <h3>DISPONIBILITÉS POUR UNE VISITE</h3>
              <div className="availability-group">
                <select value={day} onChange={(e) => setDay(e.target.value as "")}>
                  <option value="">Jour</option>
                  <option value="MONDAY">Lundi</option>
                  <option value="TUESDAY">Mardi</option>
                  <option value="WEDNESDAY">Mercredi</option>
                  <option value="THURSDAY">Jeudi</option>
                  <option value="FRIDAY">Vendredi</option>
                  <option value="SATURDAY">Samedi</option>
                </select>
                <select value={hour} onChange={(e) => setHour(Number(e.target.value))}>
                  <option value="">Heure</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}h
                    </option>
                  ))}
                </select>
                <select value={minute} onChange={(e) => setMinute(Number(e.target.value))}>
                  <option value="">Minutes</option>
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}m
                    </option>
                  ))}
                </select>

                <button type="button" className="add-btn" onClick={addAvailability}>
                  AJOUTER DISPO
                </button>
              </div>
              {fieldErrors.availabilities && <p className="error">{fieldErrors.availabilities}</p>}

              <div className="availability-list">
                {availabilities.map((availability, index) => (
                  <div key={index} className="availability-item">
                    <div>
                      {translateDay(availability.day)} à {availability.hour}h{availability.minute.toString()}
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => setAvailabilities(availabilities.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* === MESSAGE === */}
            <div className="right-column">
              <h3>VOTRE MESSAGE</h3>
              <div className="radio-group">
                <label>
                  <input type="radio" value="VISIT" checked={topic === "VISIT"} onChange={(e) => setTopic(e.target.value as "VISIT")} />
                  Demande de visite
                </label>
                <label>
                  <input type="radio" value="CALLBACK" checked={topic === "CALLBACK"} onChange={(e) => setTopic(e.target.value as "CALLBACK")} />
                  Être rappelé.e
                </label>
                <label>
                  <input type="radio" value="PICTURES" checked={topic === "PICTURES"} onChange={(e) => setTopic(e.target.value as "PICTURES")} />
                  Plus de photos
                </label>
              </div>
              {fieldErrors.topic && <p className="error">{fieldErrors.topic}</p>}

              <textarea placeholder="Votre message" value={message} onChange={(e) => setMessage(e.target.value)} required />
              {fieldErrors.message && <p className="error">{fieldErrors.message}</p>}

              <button type="submit" className="submit-btn">
                ENVOYER
              </button>

              {success && <p className="success">Message envoyé avec succès !</p>}
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
