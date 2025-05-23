import { CloudOff } from "lucide-react";
import { useLocation, useRouteError } from "react-router-dom";

interface ErrorDetails {
  status: number | React.ReactNode;
  title: string;
  description: string | React.ReactNode;
}

const ErrorPage = () => {
  const error = useRouteError() as Response & { stack: Error["stack"] };
  const location = useLocation();
  let errorDetails: ErrorDetails;

  if (import.meta.env.DEV && error.stack) {
    return <pre>{error.stack?.toString()}</pre>;
  }

  if (error.status === 401) {
    return "Loading.....";
  }

  if (error.status) {
    switch (error.status) {
      case 400: {
        errorDetails = {
          status: 400,
          title: "Something Went Wrong",
          description:
            "The server couldn't understand your request due to an error. Double-check the URL or refresh the page to see if that helps.",
        };

        break;
      }
      case 403: {
        errorDetails = {
          status: 403,
          title: "Access Denied",
          description:
            "Sorry, but you’re not authorized to access this page. Please check your login status or contact your administrator if you think you should have access.",
        };

        break;
      }
      case 404: {
        errorDetails = {
          status: 404,
          title: "Page Not Found",
          description:
            "Sorry, the page you're looking for can't be found. This could be due to a mistyped URL or the page may have been moved or deleted.",
        };

        break;
      }
      case 405: {
        errorDetails = {
          status: 405,
          title: "Method Not Allowed",
          description:
            "It seems like the action you tried to perform isn’t allowed. Please check if you’re using the correct method and try again.",
        };

        break;
      }
      case 408: {
        errorDetails = {
          status: 408,
          title: "Request Timeout",
          description:
            "It looks like your request took too long to process. Please check your internet connection and try refreshing the page.",
        };

        break;
      }
      case 414: {
        errorDetails = {
          status: 414,
          title: "URL Too Long",
          description:
            "It looks like the URL you’re trying to reach is too lengthy. Consider simplifying your request or using a different method to access the content.",
        };

        break;
      }
      case 500: {
        errorDetails = {
          status: 500,
          title: "Internal Server Error",
          description:
            "It seems our server is having trouble processing your request. Please refresh the page or check back shortly while we resolve the issue.",
        };

        break;
      }
      case 502: {
        errorDetails = {
          status: 502,
          title: "Bad Gateway",
          description:
            "We’re experiencing a temporary issue with our server. Please try refreshing the page or check back soon for updates.",
        };

        break;
      }
      case 504: {
        errorDetails = {
          status: 504,
          title: "Gateway Timeout",
          description:
            "The server didn’ t respond in time, causing a timeout. Please reload the page or come back later to see if the issue is resolved.",
        };

        break;
      }

      default: {
        errorDetails = {
          status: 500,
          title: "Internal Server Error",
          description:
            "The request was unsuccessful due to an unexpected condition encountered by the server.",
        };
      }
    }
  } else if (!window.navigator.onLine) {
    errorDetails = {
      status: (
        <div className="w-32 m-auto">
          <CloudOff className="w-28 h-28" />
        </div>
      ),
      title: "You're Currently Offline",
      description: (
        <>
          It looks like you’re not connected to the internet right now. Please
          check your connection and{" "}
          <a
            href={location.pathname + "?" + location.search}
            className="underline"
          >
            try again
          </a>
          .
        </>
      ),
    };
  } else {
    errorDetails = {
      status: 500,
      title: "Internal Server Error",
      description: (
        <>
          The request was unsuccessful due to an unexpected condition
          encountered by the server. Please{" "}
          <a
            href={location.pathname + "?" + location.search}
            className="underline"
          >
            try again
          </a>
          .
        </>
      ),
    };
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="mx-auto max-w-screen-sm min-h-[100%] text-center">
        <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary lg:text-9xl">
          {errorDetails.status}
        </h1>
        <p className="mb-12 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl ">
          {errorDetails.title}
        </p>
        <p className="mb-16 text-md font-light text-gray-500">
          {errorDetails.description}
        </p>

        <p className="text-sm text-gray-500/50">
          If you need further assistance, feel free to contact our support team
          at{" "}
          <a
            href="mailto:serviceconcierge@bfifinancial.com"
            className="underline"
          >
            serviceconcierge@bfifinancial.com
          </a>{" "}
          or call us at{" "}
          <a href="tel:+18003241234" className="underline">
            1-800-<span className="font-semibold">BFI</span>-1234
          </a>{" "}
          .
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
