import { useEffect, useState } from "react";
import logo from "./images/spudson_img.png";
import invitationalPoster from "./images/spudson-invitational-2026.png";
import "./App.css";

const tabs = [
  "Home",
  "About Us",
  "Get Involved",
  "Products and Services",
  "Events",
];
const eventTabs = [
  "Spudson Farms Invitational",
  "Harvest Festival",
  "Beer Mile",
];
const leaderboardStorageKey = "spudsonInvitationalLeaderboard";
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseTable = "invitational_entries";
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function getSavedLeaderboard() {
  try {
    const savedLeaderboard = window.localStorage.getItem(leaderboardStorageKey);
    return savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
  } catch {
    return [];
  }
}

function sortBySpeed(leaderboard) {
  return [...leaderboard].sort((firstEntry, secondEntry) => {
    return secondEntry.perceivedSpeed - firstEntry.perceivedSpeed;
  });
}

function normalizeSupabaseEntries(entries) {
  return entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    perceivedSpeed: entry.perceived_speed,
  }));
}

async function supabaseRequest(path, options = {}) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function fetchLeaderboard() {
  const entries = await supabaseRequest(
    `${supabaseTable}?select=id,name,perceived_speed,created_at&order=perceived_speed.desc&order=created_at.asc`
  );

  return normalizeSupabaseEntries(entries);
}

async function addLeaderboardEntry(name, perceivedSpeed) {
  await supabaseRequest(supabaseTable, {
    method: "POST",
    headers: {
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name,
      perceived_speed: perceivedSpeed,
    }),
  });
}

async function clearLeaderboard() {
  await supabaseRequest(`${supabaseTable}?id=not.is.null`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal",
    },
  });
}

function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [activeEventTab, setActiveEventTab] = useState(
    "Spudson Farms Invitational"
  );
  const [registration, setRegistration] = useState({
    name: "",
    password: "",
    perceivedSpeed: "",
  });
  const [leaderboard, setLeaderboard] = useState(getSavedLeaderboard);
  const [submittedName, setSubmittedName] = useState("");
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    async function loadLeaderboard() {
      setFormStatus("Loading leaderboard...");

      try {
        const entries = await fetchLeaderboard();

        if (isMounted) {
          setLeaderboard(entries);
          setFormStatus("");
        }
      } catch {
        if (isMounted) {
          setFormStatus("Leaderboard is temporarily unavailable.");
        }
      }
    }

    loadLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      return;
    }

    window.localStorage.setItem(
      leaderboardStorageKey,
      JSON.stringify(leaderboard)
    );
  }, [leaderboard]);

  const handleRegistrationChange = (event) => {
    const { name, value } = event.target;

    setRegistration((currentRegistration) => ({
      ...currentRegistration,
      [name]: value,
    }));
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();

    const submittedNameValue =
      registration.name.trim() || "Mystery potato athlete";
    const submittedSpeed = Number.parseInt(registration.perceivedSpeed, 10);
    const isAdminReset =
      submittedNameValue.toLowerCase() === "admin" && submittedSpeed === 69420;

    setFormStatus("");

    if (isAdminReset) {
      try {
        if (isSupabaseConfigured) {
          await clearLeaderboard();
        }

        setLeaderboard([]);
        setSubmittedName("Leaderboard cleared");
        setRegistration({
          name: "",
          password: "",
          perceivedSpeed: "",
        });
      } catch {
        setFormStatus("Leaderboard could not be cleared. Try again in a minute.");
      }

      return;
    }

    try {
      if (isSupabaseConfigured) {
        await addLeaderboardEntry(submittedNameValue, submittedSpeed);
        setLeaderboard(await fetchLeaderboard());
      } else {
        setLeaderboard((currentLeaderboard) =>
          sortBySpeed([
            ...currentLeaderboard,
            {
              id: Date.now(),
              name: submittedNameValue,
              perceivedSpeed: submittedSpeed,
            },
          ])
        );
      }

      setSubmittedName(submittedNameValue);
      setRegistration({
        name: "",
        password: "",
        perceivedSpeed: "",
      });
    } catch {
      setFormStatus("Submission failed. Try again in a minute.");
    }
  };

  const rankedLeaderboard = sortBySpeed(leaderboard);

  return (
    <main className="app-shell">
      <header className="site-header">
        <img src={logo} alt="Spudson Farms - Est. 2025" className="logo" />
        <div>
          <p className="eyebrow">Established 2025</p>
          <h1>Spudson Farms</h1>
          <p className="subtitle">Small farm energy. Big potato ambition.</p>
        </div>
      </header>

      <nav className="primary-tabs" aria-label="Spudson Farms sections">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab ? "tab active" : "tab"}
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="content-panel">
        {activeTab === "Home" && (
          <div className="home-panel">
            <img
              src={logo}
              alt="Spudson Farms - Est. 2025"
              className="home-logo"
            />
          </div>
        )}

        {activeTab === "About Us" && (
          <div className="section-grid">
            <article className="bio-card">
              <h2>Mitch Wall</h2>
              <p className="role">Chief Technology Officer</p>
              <p>
                Mitch keeps Spudson Farms moving with practical systems,
                field-tested ideas, and a steady eye on what should be easier
                for customers, crews, and potato enthusiasts alike.
              </p>
            </article>

            <article className="bio-card">
              <h2>Duncan Bark</h2>
              <p className="role">Chief Operating Officer</p>
              <p>
                Duncan handles day-to-day operations with a focus on dependable
                service, strong community relationships, and making every
                Spudson Farms event feel organized from start to finish.
              </p>
            </article>
          </div>
        )}

        {activeTab === "Get Involved" && (
          <div className="copy-block">
            <h2>Get Involved</h2>
            <p>
              Want to volunteer, collaborate, place an order, or ask about an
              event? Reach out and we will point you in the right direction.
            </p>
            <div className="contact-list">
              <a href="mailto:hello@spudsonfarms.com">hello@spudsonfarms.com</a>
              <a href="tel:+15550197026">(555) 019-7026</a>
            </div>
          </div>
        )}

        {activeTab === "Products and Services" && (
          <div className="copy-block">
            <h2>Products and Services</h2>
            <p>Contact Mitch and Duncan for potato orders and event booking.</p>
          </div>
        )}

        {activeTab === "Events" && (
          <div>
            <div className="event-tabs" aria-label="Spudson Farms events">
              {eventTabs.map((eventTab) => (
                <button
                  className={
                    activeEventTab === eventTab ? "event-tab active" : "event-tab"
                  }
                  key={eventTab}
                  onClick={() => setActiveEventTab(eventTab)}
                  type="button"
                >
                  {eventTab}
                </button>
              ))}
            </div>

            {activeEventTab === "Spudson Farms Invitational" && (
              <article className="event-page">
                <div className="event-hero">
                  <img
                    src={invitationalPoster}
                    alt="2nd inaugural Spudson Farms Invitational poster"
                  />
                  <div className="event-hero-copy">
                    <p className="eyebrow">Spudson Farms Invitational - 2026</p>
                    <h2>Run hard. Tater harder.</h2>
                    <p>Spudson Farms Invitational coming soon on July 5th 2026.</p>
                  </div>
                </div>

                <div className="registration-layout">
                  <form
                    className="registration-form"
                    onSubmit={handleRegistrationSubmit}
                  >
                    <h3>Enter your perceived speed</h3>
                    <label>
                      Name
                      <input
                        name="name"
                        onChange={handleRegistrationChange}
                        required
                        type="text"
                        value={registration.name}
                      />
                    </label>
                    <label>
                      Password
                      <input
                        name="password"
                        onChange={handleRegistrationChange}
                        type="password"
                        value={registration.password}
                      />
                    </label>
                    <label>
                      Perceived speed
                      <input
                        min="0"
                        name="perceivedSpeed"
                        onChange={handleRegistrationChange}
                        required
                        step="1"
                        type="number"
                        value={registration.perceivedSpeed}
                      />
                    </label>
                    <button type="submit">Submit</button>
                    {submittedName && (
                      <p className="form-success">
                        {submittedName === "Leaderboard cleared"
                          ? submittedName
                          : `${submittedName}, your submission has been recieved.`}
                      </p>
                    )}
                    {formStatus && <p className="form-status">{formStatus}</p>}
                  </form>

                  <aside
                    className="leaderboard"
                    aria-label="Perceived speed leaderboard"
                  >
                    <h3>Leaderboard</h3>
                    {rankedLeaderboard.length > 0 ? (
                      <ol>
                        {rankedLeaderboard.map((entry) => (
                          <li key={entry.id}>
                            <span>{entry.name}</span>
                            <strong>{entry.perceivedSpeed}</strong>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>No submissions yet.</p>
                    )}
                  </aside>
                </div>
              </article>
            )}

            {activeEventTab === "Harvest Festival" && (
              <div className="copy-block">
                <h2>Harvest Festival</h2>
                <p>
                  Details are coming soon for a seasonal Spudson Farms gathering
                  with food, friends, and fresh farm energy.
                </p>
              </div>
            )}

            {activeEventTab === "Beer Mile" && (
              <div className="copy-block">
                <h2>Beer Mile</h2>
                <p>
                  The Spudson Farms Beer Mile is in planning. Check back for
                  registration details, rules, and start times.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
