import Footer from "./components/Footer/Footer";
import Navbar from "./components/NavBar/NavBar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <main>
        <Outlet />
      </main>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
