import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main>
      <h1>Smart Online Examination System</h1>

      <p>
        A secure and intelligent platform for creating,
        managing, and attempting online examinations.
      </p>

      <nav>
        <Link to="/login">Login</Link>
        {" | "}
        <Link to="/register">Register</Link>
      </nav>
    </main>
  );
}

export default HomePage;