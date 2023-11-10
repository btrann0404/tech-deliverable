import React, { useState, useEffect } from "react";
import quotelogo from "/assets/quotebook.png";
import "./App.css";

function App() {
  const [quotes, setQuotes] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/quote?skip=${skip}&limit=${limit}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => setQuotes(data))
      .catch((error) => console.error("Fetch error:", error));
  }, [skip, limit]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    fetch("http://localhost:8000/quote", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log(response);
          console.log("Quote added!");
          event.target.reset();
          return fetch(
            `http://localhost:8000/quote?skip=${skip}&limit=${limit}`
          );
        } else {
          return response.text().then((text) => Promise.reject(text));
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        setQuotes(data);
      })
      .catch((error) => {
        console.error("Error posting or fetching quotes:", error);
      });
  };

  const handlePrevious = () => {
    const newSkip = Math.max(0, skip - limit);
    setSkip(newSkip);

    if (quotes.length > 0) {
      const newUrl = `/items/?skip=${newSkip}&limit=${limit}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  const handleNext = () => {
    if (quotes.length > 0) {
      const newSkip = skip + limit;
      setSkip(newSkip);

      const newUrl = `/items/?skip=${newSkip}&limit=${limit}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  const handleLimitChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value.trim() !== "") {
      setLimit(Number(value));
    } else {
      setLimit(10);
    }
    if (quotes.length > 0) {
      const newUrl = `/items/?skip=0&limit=${newLimit}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  return (
    <div className="App">
      <img src={quotelogo} alt="" />

      <h1>Hack @ UCI Tech Deliverable</h1>

      <h2>Submit a quote</h2>
      {/* TODO: implement custom form submission logic to not refresh the page */}
	  
      <form action="/api/quote" method="post" onSubmit={handleSubmit}>
        <label htmlFor="input-name">Name</label>
        <input type="text" name="name" id="input-name" required />
        <label htmlFor="input-message">Quote</label>
        <input type="text" name="message" id="input-message" required />
        <button type="submit">Submit</button>
      </form>

      <h2>Previous Quotes</h2>

      <div>
        <button onClick={handlePrevious} disabled={skip === 0}>
          Previous
        </button>
        <button onClick={handleNext}>Next</button>
      </div>

      <input
        type="text"
        placeholder="Quote Limit"
        className="quote-limit"
        onChange={handleLimitChange}
      />

      {/* TODO: Display the actual quotes from the database */}

      <div className="prevMessages">
        {quotes.length > 0 ? (
          quotes.map((quote, index) => (
            <div key={index}>
              <p>
                {quote.name}: {quote.message} (submitted at {quote.time})
              </p>
            </div>
          ))
        ) : (
          <p>No more quotes.</p>
        )}
      </div>

      {/* <div className="messages">
				<p>Peter Anteater</p>
				<p>Zot Zot Zot!</p>
				<p>Every day</p>
			</div> */}
    </div>
  );
}

export default App;
