import { useEffect, useState, useCallback } from 'react';

function App() {
  const [message, setMessage] = useState("Lade...");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [submissionError, setSubmissionError] = useState(null);
  const [entries, setEntries] = useState([]);
  const [fetchEntriesError, setFetchEntriesError] = useState(null);

  const fetchEntries = useCallback(async () => {
    setFetchEntriesError(null);
    try {
      const response = await fetch('/api/entries');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
      setFetchEntriesError("Fehler beim Laden der Einträge.");
      // Optionally set entries to empty array on error
      // setEntries([]);
    }
  }, []); // Empty dependency array means this function is memoized and doesn't change

  useEffect(() => {
    // Fetch initial message
    fetch('/api') // Changed to relative path
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => {
        console.error("Error fetching initial message:", err);
        setMessage("Fehler beim Laden der initialen Nachricht");
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
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newEntryContent }),
      });

      if (response.status === 201) {
        setNewEntryContent("");
        console.log("Entry created successfully!");
        fetchEntries(); // Refresh entries list
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        setSubmissionError(errorData.error || `Error ${response.status}: Failed to create entry.`);
      }
    } catch (error) {
      console.error("Network or other error creating entry:", error);
      setSubmissionError("Network error. Please try again.");
    }
  };

  return (
    <div>
      <h1>{message}</h1>

      <h2>Create New Entry</h2>
      <form onSubmit={handleCreateEntry}>
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
            <li key={entry.id}>
              ID: {entry.id} - Content: {entry.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
