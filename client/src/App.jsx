import Navbar from "./components/Navbar";
import ProfileProgress from "./components/ProfileProgress";

function App() {
  return (
    <>
      <Navbar appName="CareerForge" />

      <main>
        <h1>CareerForge</h1>

        <p>Turn your skills into a career roadmap.</p>

        <button>Get Started</button>

        <ProfileProgress />
      </main>
    </>
  );
}

export default App;