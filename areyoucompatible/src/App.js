import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FirstPage from "./FirstPage";

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to Resume Uploader</h1>} />
        <Route path="/upload" element={<FirstPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
