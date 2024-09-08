import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="text-center p-5 bg-white rounded shadow-lg">
        <h1 className="display-1 text-danger mb-4">404</h1>
        <h2 className="h3 mb-3">Oops!</h2>
        <p className="text-muted mb-4">Error</p>
        <Link to="/" className="btn btn-primary">
          Go Back to Events
        </Link>
      </div>
    </div>
  );
};

export default Error;
