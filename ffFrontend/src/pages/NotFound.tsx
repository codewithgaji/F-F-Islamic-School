import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center">
        <img
          src="/fandf.png"
          alt="F&F Islamic Super Kiddies Centre"
          className="mx-auto mb-6 h-16 w-auto"
        />
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;