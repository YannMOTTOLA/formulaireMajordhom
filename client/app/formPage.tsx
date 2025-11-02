"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./form.css";

export default function FormPage() {
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+33");
  const [localPhone, setLocalPhone] = useState("");
  const [topic, setTopic] = useState<"VISIT" | "CALLBACK" | "PICTURES" | "">("");
  const [message, setMessage] = useState("");
  const [day, setDay] = useState<"MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "">("");
  const [hour, setHour] = useState<number | "">("");
  const [minute, setMinute] = useState<number | "">("");
  const [availabilities, setAvailabilities] = useState<{ day: string; hour: number; minute: number }[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

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
    setSuccess(false);

    try {

      let normalizedPhone = localPhone.trim();
      if (normalizedPhone.startsWith("0")) {
        normalizedPhone = normalizedPhone.substring(1);
      }
      const fullPhone = `${countryCode}${normalizedPhone}`;

      if (!captchaToken) {
        setError("Veuillez valider le reCAPTCHA avant d’envoyer.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender,
          firstName,
          lastName,
          email,
          phone: fullPhone,
          message,
          topic,
          availabilities,
          captchaToken
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        if (Array.isArray(data.errors)) {
          throw new Error(data.errors.map((err: { field: string; message: string }) => err.message).join("\n"));
        }


        throw new Error(data.message || "Erreur lors de l’envoi du formulaire.");
      }

      setSuccess(true);

      setGender("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setLocalPhone("");
      setTopic("");
      setMessage("");
      setAvailabilities([]);
      setDay("");
      setHour("");
      setMinute("");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur inconnue.");
      }
    }
  };

  function translateDay(day: string) {
    switch (day) {
      case "MONDAY": return "Lundi";
      case "TUESDAY": return "Mardi";
      case "WEDNESDAY": return "Mercredi";
      case "THURSDAY": return "Jeudi";
      case "FRIDAY": return "Vendredi";
      case "SATURDAY": return "Samedi";
      default: return day;
    }
  }


  return (
    <div className="main-wrapper">
      <div className="form-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>CONTACTEZ L’AGENCE</h2>

          <div className="form-columns">
            <div className="left-column">
              <h3>VOS COORDONNÉES</h3>

              <div className="radio-group">
                <label className="labelGender">
                  <input type="radio" value="FEMALE" checked={gender === "FEMALE"} onChange={(event) => setGender(event.target.value as "FEMALE")} /> Mme
                </label>
                <label className="labelGender">
                  <input type="radio" value="MALE" checked={gender === "MALE"} onChange={(event) => setGender(event.target.value as "MALE")} /> M.
                </label>
              </div>

              <div className="inline-fields">
                <input type="text" placeholder="Nom" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
                <input type="text" placeholder="Prénom" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
              </div>

              <input type="email" placeholder="Adresse mail" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <div className="phone-input">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-code-select"
                >
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+351">🇵🇹 +351</option>
                  <option value="+31">🇳🇱 +31</option>
                  <option value="+352">🇱🇺 +352</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+353">🇮🇪 +353</option>
                  <option value="+46">🇸🇪 +46</option>
                  <option value="+45">🇩🇰 +45</option>
                  <option value="+47">🇳🇴 +47</option>
                  <option value="+48">🇵🇱 +48</option>
                  <option value="+30">🇬🇷 +30</option>
                  <option value="+40">🇷🇴 +40</option>
                  <option value="+212">🇲🇦 +212</option>
                  <option value="+213">🇩🇿 +213</option>
                  <option value="+216">🇹🇳 +216</option>
                  <option value="+225">🇨🇮 +225</option>
                  <option value="+221">🇸🇳 +221</option>
                  <option value="+228">🇹🇬 +228</option>
                  <option value="+229">🇧🇯 +229</option>
                  <option value="+237">🇨🇲 +237</option>
                  <option value="+27">🇿🇦 +27</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+82">🇰🇷 +82</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+972">🇮🇱 +972</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+64">🇳🇿 +64</option>
                </select>



                <input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={localPhone}
                  onChange={(e) => setLocalPhone(e.target.value)}
                  required
                />
              </div>


              <h3>DISPONIBILITÉS POUR UNE VISITE</h3>
              <div className="availability-group">
                <select value={day} onChange={(event) => setDay(event.target.value as "")}>
                  <option value="jour"></option>
                  <option value="MONDAY">Lundi</option>
                  <option value="TUESDAY">Mardi</option>
                  <option value="WEDNESDAY">Mercredi</option>
                  <option value="THURSDAY">Jeudi</option>
                  <option value="FRIDAY">Vendredi</option>
                  <option value="SATURDAY">Samedi</option>
                </select>

                <select value={hour} onChange={(event) => setHour(Number(event.target.value))}>
                  <option value="heures"></option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}h
                    </option>
                  ))}
                </select>

                <select value={minute} onChange={(event) => setMinute(Number(event.target.value))}>
                  <option value="minutes"></option>
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString()}m
                    </option>
                  ))}
                </select>

                <button type="button" className="add-btn" onClick={addAvailability}>
                  AJOUTER DISPO
                </button>
              </div>
              <div className="availability-list">
                {availabilities.map((availability, index) => (
                  <div key={index} className="availability-item">
                    <div>
                      {translateDay(availability.day)} à {availability.hour}h{availability.minute.toString()}
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => {
                        setAvailabilities(availabilities.filter((_, i) => i !== index));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="right-column">
              <h3>VOTRE MESSAGE</h3>

              <div className="radio-group">
                <label className="labelTopic">
                  <input type="radio" value="VISIT" checked={topic === "VISIT"} onChange={(event) => setTopic(event.target.value as "VISIT")} />
                  Demande de visite
                </label>
                <label className="labelTopic">
                  <input type="radio" value="CALLBACK" checked={topic === "CALLBACK"} onChange={(event) => setTopic(event.target.value as "CALLBACK")} />
                  Être rappelé.e
                </label>
                <label className="labelTopic">
                  <input type="radio" value="PICTURES" checked={topic === "PICTURES"} onChange={(event) => setTopic(event.target.value as "PICTURES")} />
                  Plus de photos
                </label>
              </div>

              <div className="textareaContainer">
                <textarea placeholder="Votre message" value={message} onChange={(event) => setMessage(event.target.value)} required></textarea>
              </div>

              <div className="captcha">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                  onChange={(token) => setCaptchaToken(token)}
                />
              </div>

              <button type="submit" className="submit-btn">
                {"ENVOYER"}
              </button>

              {success && <p className="success">Message envoyé avec succès !</p>}

              {error && (
                <div className="error">
                  {error.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div >
  );
}