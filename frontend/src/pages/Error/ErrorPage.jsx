// src/routes/ErrorPage.jsx
import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <div style={{ padding: 20 }}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p><i>{error.statusText || error.message}</i></p>
      <Link to={'/'}>Home</Link>
    </div>
  );
}
