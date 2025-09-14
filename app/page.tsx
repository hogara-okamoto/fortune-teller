'use client';

import { useState } from 'react';

const bloodTypes = ['A', 'B', 'O', 'AB'];
const birthMonths = Array.from({ length: 12 }, (_, i) => i + 1);
const languages = ['English', 'Spanish', 'Japanese', 'Chinese'];

export default function Home() {
  const [input1, setInput1] = useState('A');
  const [input2, setInput2] = useState('1');
  const [language, setLanguage] = useState('English');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFortune = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        input_data_1: input1,
        input_data_2: input2,
        language,
      }),
    });
    const data = await res.json();
    
    // Create audio element and set up for iPhone compatibility
    const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
    
    // Set audio properties for better iPhone compatibility
    audio.preload = 'auto';
    audio.volume = 1.0;
    
    // Play audio with error handling for iPhone
    const playAudio = async () => {
      try {
        await audio.play();
        console.log('Audio playing successfully');
      } catch (error) {
        console.error('Audio play failed:', error);
        // Try again with a slight delay for iPhone
        setTimeout(async () => {
          try {
            await audio.play();
            console.log('Audio playing on retry');
          } catch (retryError) {
            console.error('Audio retry failed:', retryError);
          }
        }, 100);
      }
    };
    
    // Play immediately
    playAudio();
    
    console.log(data);
    setResult(data.text);
    setLoading(false);
  };

  return (
    <main style={{
      padding: '1.5rem',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ fontSize: '1.5rem', textAlign: 'center' }}>🔮 Blood & Birth Fortune Teller</h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
          maxWidth: '100%',
        }}
      >
        {/* Blood Type Selector */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontWeight: 'bold' }}>Blood Type:</span>
          <select
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '0.5rem',
              border: '2px solid #e0e0e0',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '100%',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
          >
            {bloodTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>

        {/* Birth Month Selector */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontWeight: 'bold' }}>Birth Month:</span>
          <select
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '0.5rem',
              border: '2px solid #e0e0e0',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '100%',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
          >
            {birthMonths.map((month) => (
              <option key={month}>{month}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Language Radio Buttons */}
      <fieldset style={{ marginBottom: '1.5rem' }}>
        <legend>Select Language:</legend>
        {languages.map((lang) => (
          <label key={lang} style={{ marginRight: '1rem' }}>
            <input
              type="radio"
              value={lang}
              checked={language === lang}
              onChange={(e) => setLanguage(e.target.value)}
            />
            {lang}
          </label>
        ))}
      </fieldset>

      {/* Submit Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '3rem',
          marginBottom: '1rem',
        }}
      >
        <button
          onClick={fetchFortune}
          style={{
            fontWeight: 'bold',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: '#6a4c93', // Purple
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Reveal Fortune
        </button>
      </div>

      {/* Result Display */}
      <div
        style={{
          maxWidth: '100%',
          lineHeight: '1.6',
          padding: '1rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '0.5rem',
          wordWrap: 'break-word',
        }}
      >
        {loading && <p>Loading...Wait for a while</p>}
        {result && <p style={{ marginTop: '1rem' }}>{result}</p>}
      </div>
    </main>
  );
}
