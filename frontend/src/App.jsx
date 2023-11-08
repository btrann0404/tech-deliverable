import React, { useState, useEffect } from 'react';
import "./App.css";

function App() {
	const [quotes, setQuotes] = useState([]);

	useEffect(() => {
		fetch('http://localhost:8000/quote') 
		.then(response => {
			if (response.ok) {
			return response.json();
			}
			throw new Error('Network response was not ok.');
		})
		.then(data => setQuotes(data))
		.catch(error => console.error('Fetch error:', error));
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault(); 
		
		const formData = new FormData(event.target);
		
		fetch('http://localhost:8000/quote', { 
		  method: 'POST',
		  body: formData 
		})
		.then(response => {
		  if (response.ok) {
			console.log('Quote added!');
			return fetch('http://localhost:8000/quote');
		  } else {
			return response.text().then(text => Promise.reject(text));
		  }
		})
		.then(response => {
		  if (!response.ok) {
			return response.text().then(text => Promise.reject(text));
		  }
		  return response.json(); 
		})
		.then(data => {
		  setQuotes(data); 
		})
		.catch(error => {
		  console.error('Error posting or fetching quotes:', error);

		});
	  };
	  

	return (
		<div className="App">
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
			{/* TODO: Display the actual quotes from the database */}

			<div className="prevMessages">
				{quotes.map((quote, index) => (
					<div key={index}>
						<p>{quote.name}: {quote.message} (submitted at {quote.time})</p>
					</div>
				))}
			</div>

			<div className="messages">
				<p>Peter Anteater</p>
				<p>Zot Zot Zot!</p>
				<p>Every day</p>
			</div>
		</div>
	);
}

export default App;
