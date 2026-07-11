import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main>
      <h1>404</h1>

      <p>The page you requested could not be found.</p>

      <Link to="/">Return to Home</Link>
    </main>
  );
}

export default NotFoundPage;