import { useState } from "react";
import logo from "./images/spudson_img.png";
import invitationalPoster from "./images/spudson-invitational-2026.png";
import "./App.css";

const tabs = ["About Us", "Get Involved", "Products and Services", "Events"];
const eventTabs = [
  "Spudson Farms Invitational",
  "Harvest Festival",
  "Beer Mile",
];

function App() {
  const [activeTab, setActiveTab] = useState("About Us");
  const [activeEventTab, setActiveEventTab] = useState(
    "Spudson Farms Invitational"
  );
  const [registration, setRegistration] = useState({
    name: "",
    password: "",
    perceivedSpeed: "",
  });
  const [submittedName, setSubmittedName] = useState("");

  const handleRegistrationChange = (event) => {
    const { name, value } = event.target;

    setRegistration((currentRegistration) => ({
      ...currentRegistration,
      [name]: value,
    }));
  };

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();
    setSubmittedName(registration.name.trim() || "Mystery potato athlete");
    setRegistration({
      name: "",
      password: "",
      perceivedSpeed: "",
    });
  };

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
                    <p>Spudson Farms Invitational coming soon on July 7th 2026.</p>
                  </div>
                </div>

                <form
                  className="registration-form"
                  onSubmit={handleRegistrationSubmit}
                >
                  <h3>Request Your Spot</h3>
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
                      {submittedName}, your extremely official request is in.
                    </p>
                  )}
                </form>
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
