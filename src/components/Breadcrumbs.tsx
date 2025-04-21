import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

// Utility for className concatenation (if you have a cn() utility, import it)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;

  // Hide breadcrumbs on the /battles home page
  if (pathname === "/battles" || pathname === "/" || pathname === "/signup" || pathname === "/terms" || pathname === "/privacy") {
    return null;
  }

  // Remove leading /battles from segments for breadcrumb trail
  let segments = pathname.startsWith("/battles") ? pathname.slice(8).split("/").filter(Boolean) : pathname.split("/").filter(Boolean);

  // Special case for dynamic routes (not typical in react-router, but future-proof)
  const processedSegments = segments.map(segment => {
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return segment.slice(1, -1);
    }
    return segment;
  });

  // Build breadcrumb items (relative to /battles)
  const breadcrumbItems = processedSegments.map((segment, index) => {
    const path = ["/battles", ...segments.slice(0, index + 1)].join("/");
    const label = segment.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
    return {
      label,
      path,
      isLast: index === processedSegments.length - 1
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="p-4 flex items-center text-sm text-muted-foreground border-none bg-night-900">
      <ol className="flex flex-wrap items-center space-x-1">
        <li className="flex items-center">
          <Link
            to="/battles"
            className="flex items-center rounded px-2 py-1 hover:bg-accent hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center">
            <ChevronRight className="h-4 w-4" />
            <div
              className={cn(
                "px-2 py-1 rounded",
                item.isLast
                  ? "font-medium text-accent"
                  : "hover:bg-accent hover:text-foreground transition-colors"
              )}
            >
              {item.isLast ? (
                <span>{item.label}</span>
              ) : (
                <Link to={item.path}>{item.label}</Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
