import { Navigate, Route, Routes } from "react-router-dom";
import Error from "../src/Components/Error";
import Event from "../src/Components/Event";
import EventDetails from "../src/Components/EventDetails";
import Login from "../src/Components/Login";
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/event" element={<Event />}></Route>
        <Route path="/event/:eventId" element={<EventDetails></EventDetails>} />
        <Route path="/error" element={<Error></Error>}></Route>
        <Route path="*" element={<Error />} />
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes>
    </div>
  );
}

export default App;
