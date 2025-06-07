import { useEffect, useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function App() {
  const [message, setMessage] = useState("Lade...");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [submissionError, setSubmissionError] = useState(null);
  const [entries, setEntries] = useState([]);
  const [fetchEntriesError, setFetchEntriesError] = useState(null);
  const [selectedDb, setSelectedDb] = useState('db1'); // 'db1' or 'db2'

  const fetchEntries = useCallback(async () => {
    setFetchEntriesError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/entries`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching entries - Status:', response.status, 'Response:', errorText);
        setFetchEntriesError(`Fehler ${response.status} beim Laden der Einträge.`); // User message can be simpler
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      // Log the full error object, including the custom message from the throw above if it's an HTTP error
      console.error('Error fetching entries:', error);
      // If setFetchEntriesError wasn't set before for an HTTP error, set a generic one here.
      if (!fetchEntriesError) { // Avoid overwriting specific HTTP error message
        setFetchEntriesError("Fehler beim Laden der Einträge.");
      }
    }
  }, []); // Empty dependency array: fetchEntries is stable and doesn't depend on component state/props

  useEffect(() => {
    // Fetch initial message
    fetch(`${API_BASE_URL}/api`)
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            console.error('Error fetching initial message - Status:', res.status, 'Response:', text);
            setMessage(`Fehler: ${res.status} - ${text || 'Serverfehler'}`);
            throw new Error(`HTTP error ${res.status}: ${text}`); // To be caught by .catch
          });
        }
        return res.json();
      })
      .then(data => setMessage(data.message))
      .catch(error => { // Catches network errors and errors thrown above
        console.error('Error fetching initial message:', error);
        // If setMessage hasn't been updated with a specific error, set a generic one.
        if (message === "Lade...") { // Check if message is still in initial loading state
           setMessage("Fehler beim Laden der initialen Nachricht.");
        }
      });

    // Fetch entries
    fetchEntries();
  }, [fetchEntries]); // fetchEntries is stable due to useCallback

  const handleCreateEntry = async (event) => {
    event.preventDefault();
    setSubmissionError(null);

    if (!newEntryContent.trim()) {
      setSubmissionError("Entry content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newEntryContent, dbIdentifier: selectedDb }),
      });

      if (response.status === 201) {
        setNewEntryContent("");
        console.log("Entry created successfully!");
        fetchEntries(); // Refresh entries list
      } else {
        const errorText = await response.text();
        console.error('Error creating entry - Status:', response.status, 'Response:', errorText);
        try {
          const parsedError = JSON.parse(errorText);
          setSubmissionError(parsedError.error || `Fehler ${response.status}: ${errorText}`);
        } catch (e) {
          setSubmissionError(`Fehler ${response.status}: ${errorText || 'Konnte Eintrag nicht erstellen'}`);
        }
      }
    } catch (error) {
      console.error('Error creating entry (network/fetch):', error);
      setSubmissionError("Netzwerkfehler oder anderer Fehler beim Erstellen des Eintrags. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div>
      <h1>{message}</h1>

      <h2>Create New Entry</h2>
      <form onSubmit={handleCreateEntry}>
        <div>
          <label>
            <input
              type="radio"
              value="db1"
              checked={selectedDb === 'db1'}
              onChange={(e) => setSelectedDb(e.target.value)}
            />
            Database 1
          </label>
          <label style={{ marginLeft: '10px' }}>
            <input
              type="radio"
              value="db2"
              checked={selectedDb === 'db2'}
              onChange={(e) => setSelectedDb(e.target.value)}
            />
            Database 2
          </label>
        </div>
        <div>
          <input
            type="text"
            value={newEntryContent}
            onChange={(e) => setNewEntryContent(e.target.value)}
            placeholder="Enter entry content"
          />
        </div>
        <button type="submit">Add Entry</button>
      </form>
      {submissionError && <p style={{ color: 'red' }}>{submissionError}</p>}

      <h2>Entries</h2>
      {fetchEntriesError && <p style={{ color: 'red' }}>{fetchEntriesError}</p>}
      {entries.length === 0 && !fetchEntriesError ? (
        <p>No entries yet.</p>
      ) : (
        <ul>
          {entries.map(entry => (
            <li key={`${entry.source_db}-${entry.id}`}>
              ID: {entry.id} - Source: {entry.source_db === 'db1' ? 'Database 1' : 'Database 2'} - Content: {entry.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
