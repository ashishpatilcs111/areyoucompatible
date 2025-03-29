import React, { useState } from "react";
import "./ResumeUpload.css";
import { useNavigate } from "react-router-dom";

const FirstPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!pdfFile || !description.trim()) {
      setError("Both fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", pdfFile);
    formData.append("description", description);

    try {
      const response = await fetch("http://localhost:5000/api/resume", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("Resume uploaded successfully!");
        navigate("/");
      } else {
        setError("Failed to upload resume. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="resume-upload-container">
      <h2>Upload Your Resume</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="resume-form">
        <label>Upload PDF Resume:</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <label>Additional Information:</label>
        <textarea
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter additional information here..."
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FirstPage;
