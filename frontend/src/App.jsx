import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Processing from "./pages/Processing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/process" element={<Processing />} />
        <Route path="/dashboard/:uploadId" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
