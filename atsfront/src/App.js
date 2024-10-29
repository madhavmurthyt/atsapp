import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [suitability, setSuitability] = useState(null);
  const [parsedData, setParsedData] = useState(null);


  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleCalculateSuitability = async () => {
    try {
      const formData = new FormData();
      formData.append('jobDescription', jobDescription);
      formData.append('resume', resume);

      const response = await axios.post('http://localhost:3001/api/compare', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuitability(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (suitability) {
      try {
        const textWithCodeBlocks = suitability.candidates[0].content.parts[0].text.trim();
        //console.log("textWithCodeBlocks", textWithCodeBlocks)

        const cleanedText = textWithCodeBlocks.substring(7,textWithCodeBlocks.length-4);
        //console.log("cleanedText", cleanedText)

        const { JDMatch, MissingKeywords, ProfileSummary } = JSON.parse(cleanedText); // Destructure data
        // console.log(JDMatch, MissingKeywords, ProfileSummary);
        setParsedData({ JDMatch, MissingKeywords, ProfileSummary }); // Update state
      } catch (error) {
        console.error('Error parsing response data:', error);
      }
    }
  }, [suitability]); // Run effect only when suitability changes


  return (
    <div className="App">
      <h1>ATS Application</h1>
      <div className="input-group">
        <label htmlFor="job-description">Job Description:</label>
        <textarea
          id="job-description"
          value={jobDescription}
          onChange={handleJobDescriptionChange}
        />
      </div>
      <div className="input-group">
        <label htmlFor="resume-upload">Resume Upload:</label>
        <input
          type="file"
          id="resume-upload"
          onChange={handleResumeUpload}
        />
      </div>
      <button onClick={handleCalculateSuitability}>Calculate Suitability</button>
      <div className="suitability-output">
      {parsedData && (
          <>
            <h3>Suitability: {parsedData.JDMatch}</h3>
            <h4>Missing Keywords:</h4>
            <ul>
              {parsedData.MissingKeywords && parsedData.MissingKeywords.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
             <h4>Profile Summary:</h4>
            <p>{parsedData.ProfileSummary}</p>
          </>
        )}
        {parsedData === null && <p>No suitability data available yet.</p>}  {/* Display a message when no data */}

      </div>
    </div>
  );
}

export default App;