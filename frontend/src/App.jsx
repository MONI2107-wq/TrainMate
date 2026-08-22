import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:8080";

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [fromSelected, setFromSelected] = useState(null);
  const [toSelected, setToSelected] = useState(null);

  const [fromLoading, setFromLoading] = useState(false);
  const [toLoading, setToLoading] = useState(false);

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fromRequest = useRef(0);
  const toRequest = useRef(0);

  // =====================================================
  // SEARCH STATIONS
  // =====================================================

  const searchStations = async (value, type) => {
    const query = value.trim();

    if (type === "from") {
      fromRequest.current += 1;
    } else {
      toRequest.current += 1;
    }

    const requestId =
      type === "from" ? fromRequest.current : toRequest.current;

    if (query.length === 0) {
      if (type === "from") {
        setFromSuggestions([]);
        setFromLoading(false);
      } else {
        setToSuggestions([]);
        setToLoading(false);
      }
      return;
    }

    if (type === "from") {
      setFromLoading(true);
    } else {
      setToLoading(true);
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/stations/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Station search failed");
      }

      const result = await response.json();

      const stations = Array.isArray(result.data)
        ? result.data
        : [];

      // Ignore old response
      if (
        type === "from" &&
        requestId !== fromRequest.current
      ) {
        return;
      }

      if (
        type === "to" &&
        requestId !== toRequest.current
      ) {
        return;
      }

      if (type === "from") {
        setFromSuggestions(stations);
      } else {
        setToSuggestions(stations);
      }
    } catch (err) {
      console.error("Station search error:", err);

      if (
        type === "from" &&
        requestId === fromRequest.current
      ) {
        setFromSuggestions([]);
      }

      if (
        type === "to" &&
        requestId === toRequest.current
      ) {
        setToSuggestions([]);
      }
    } finally {
      if (
        type === "from" &&
        requestId === fromRequest.current
      ) {
        setFromLoading(false);
      }

      if (
        type === "to" &&
        requestId === toRequest.current
      ) {
        setToLoading(false);
      }
    }
  };

  // =====================================================
  // DEBOUNCE FROM
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      searchStations(from, "from");
    }, 120);

    return () => clearTimeout(timer);
  }, [from]);

  // =====================================================
  // DEBOUNCE TO
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      searchStations(to, "to");
    }, 120);

    return () => clearTimeout(timer);
  }, [to]);

  // =====================================================
  // SELECT FROM
  // =====================================================

  const selectFromStation = (station) => {
    setFrom(`${station.name} (${station.code})`);
    setFromSelected(station);
    setFromSuggestions([]);
    setFromLoading(false);
  };

  // =====================================================
  // SELECT TO
  // =====================================================

  const selectToStation = (station) => {
    setTo(`${station.name} (${station.code})`);
    setToSelected(station);
    setToSuggestions([]);
    setToLoading(false);
  };

  // =====================================================
  // SEARCH TRAINS
  // =====================================================

  const searchTrains = async () => {
    setError("");
    setTrains([]);

    if (!fromSelected || !toSelected) {
      setError("Please select both stations from the dropdown.");
      return;
    }

    if (fromSelected.code === toSelected.code) {
      setError("From and To stations cannot be the same.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/trains/search?from=${encodeURIComponent(
          fromSelected.code
        )}&to=${encodeURIComponent(toSelected.code)}`
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Railway API rate limit reached. Please wait a minute and try again."
          );
        }

        throw new Error("Failed to fetch trains");
      }

      const result = await response.json();

      const trainData = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : [];

      setTrains(trainData);

      if (trainData.length === 0) {
        setError(
          `No trains found from ${fromSelected.name} (${fromSelected.code}) to ${toSelected.name} (${toSelected.code}).`
        );
      }
    } catch (err) {
      console.error("Train search error:", err);

      setError(
        err.message ||
          "Unable to fetch trains right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SWAP
  // =====================================================

  const swapStations = () => {
    const oldFrom = from;
    const oldFromSelected = fromSelected;

    setFrom(to);
    setFromSelected(toSelected);

    setTo(oldFrom);
    setToSelected(oldFromSelected);

    setFromSuggestions([]);
    setToSuggestions([]);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="hero">
        <div className="hero-inner">

          <div className="brand">

            <div className="logo">
              🚆
            </div>

            <div>
              <h1>TrainMate</h1>

              <p>
                Find trains. Plan your journey. Travel smarter.
              </p>
            </div>

          </div>

        </div>
      </header>

      {/* MAIN */}

      <main className="main">

        {/* SEARCH */}

        <section className="search-section">

          <div className="section-heading">

            <span className="eyebrow">
              TRAIN SEARCH
            </span>

            <h2>
              Where are you travelling?
            </h2>

            <p>
              Select your departure and destination stations.
            </p>

          </div>


          <div className="journey-box">

            {/* FROM */}

            <div className="station-wrapper">

              <label>
                FROM
              </label>

              <div className="station-input">

                <span className="station-icon">
                  ●
                </span>

                <input
                  type="text"
                  value={from}
                  placeholder="Search departure station"
                  autoComplete="off"
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setFromSelected(null);
                    setError("");
                  }}
                  onFocus={() => {
                    if (from.trim()) {
                      searchStations(from, "from");
                    }
                  }}
                />

                {fromLoading && (
                  <span className="input-loading">
                    ...
                  </span>
                )}

              </div>


              {/* FROM DROPDOWN */}

              {(fromSuggestions.length > 0 || fromLoading) &&
                !fromSelected && (

                  <div className="dropdown">

                    {fromLoading && (
                      <div className="dropdown-loading">
                        Searching stations...
                      </div>
                    )}

                    {!fromLoading &&
                      fromSuggestions.map((station) => (

                        <button
                          type="button"
                          className="station-option"
                          key={`${station.code}-${station.name}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectFromStation(station);
                          }}
                        >

                          <div className="station-main">

                            <strong>
                              {station.name}
                            </strong>

                            <span className="station-code">
                              {station.code}
                            </span>

                          </div>

                          <div className="station-city">

                            {station.city ||
                              "Indian Railways"}

                            {station.isActive && (
                              <span className="active-dot">
                                ● Active
                              </span>
                            )}

                          </div>

                        </button>

                      ))}

                  </div>

                )}

            </div>


            {/* SWAP */}

            <button
              type="button"
              className="swap-button"
              onClick={swapStations}
              title="Swap stations"
            >
              ⇅
            </button>


            {/* TO */}

            <div className="station-wrapper">

              <label>
                TO
              </label>

              <div className="station-input">

                <span className="station-icon destination">
                  ●
                </span>

                <input
                  type="text"
                  value={to}
                  placeholder="Search destination station"
                  autoComplete="off"
                  onChange={(e) => {
                    setTo(e.target.value);
                    setToSelected(null);
                    setError("");
                  }}
                  onFocus={() => {
                    if (to.trim()) {
                      searchStations(to, "to");
                    }
                  }}
                />

                {toLoading && (
                  <span className="input-loading">
                    ...
                  </span>
                )}

              </div>


              {/* TO DROPDOWN */}

              {(toSuggestions.length > 0 || toLoading) &&
                !toSelected && (

                  <div className="dropdown">

                    {toLoading && (
                      <div className="dropdown-loading">
                        Searching stations...
                      </div>
                    )}

                    {!toLoading &&
                      toSuggestions.map((station) => (

                        <button
                          type="button"
                          className="station-option"
                          key={`${station.code}-${station.name}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectToStation(station);
                          }}
                        >

                          <div className="station-main">

                            <strong>
                              {station.name}
                            </strong>

                            <span className="station-code">
                              {station.code}
                            </span>

                          </div>

                          <div className="station-city">

                            {station.city ||
                              "Indian Railways"}

                            {station.isActive && (
                              <span className="active-dot">
                                ● Active
                              </span>
                            )}

                          </div>

                        </button>

                      ))}

                  </div>

                )}

              </div>


            {/* SEARCH */}

            <button
              type="button"
              className="search-button"
              onClick={searchTrains}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Searching...
                </>
              ) : (
                <>
                  Search Trains
                  <span>→</span>
                </>
              )}

            </button>

          </div>

        </section>


        {/* ERROR */}

        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}


        {/* RESULTS */}

        {trains.length > 0 && (

          <section className="results-section">

            <div className="results-heading">

              <div>

                <span className="eyebrow">
                  RESULTS
                </span>

                <h2>
                  Available Trains
                </h2>

              </div>

              <div className="result-count">
                {trains.length} trains
              </div>

            </div>


            <div className="train-list">

              {trains.map((item, index) => (

                <div
                  className="train-card"
                  key={index}
                >

                  <div className="train-name">

                    <span className="train-number">
                      #{item.train?.number || "N/A"}
                    </span>

                    <h3>
                      {item.train?.name || "Train"}
                    </h3>

                    <span className="train-type">
                      {item.train?.type || "Express"}
                    </span>

                  </div>


                  <div className="time-section">

                    <div className="time-block">

                      <strong>
                        {item.from?.departure || "--"}
                      </strong>

                      <span>
                        {item.from?.code || fromSelected?.code}
                      </span>

                    </div>


                    <div className="route-line">

                      <span></span>

                      🚆

                      <span></span>

                    </div>


                    <div className="time-block">

                      <strong>
                        {item.to?.arrival || "--"}
                      </strong>

                      <span>
                        {item.to?.code || toSelected?.code}
                      </span>

                    </div>

                  </div>


                  <div className="train-details">

                    <div>
                      <span>Distance</span>
                      <strong>
                        {item.distance ?? "--"} km
                      </strong>
                    </div>

                    <div>
                      <span>Duration</span>
                      <strong>
                        {item.duration ?? "--"} min
                      </strong>
                    </div>

                    <div>
                      <span>Halts</span>
                      <strong>
                        {item.totalHaltsBetween ?? "--"}
                      </strong>
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default App;