import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState("Lade...");

  useEffect(() => {
    fetch('https://<DEIN-BACKEND>.railway.app/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Fehler beim Laden"));
  }, []);

  return <h1>{message}</h1>
}

export default App;
