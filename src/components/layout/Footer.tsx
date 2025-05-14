
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with ❤️ using React, Tailwind & shadcn/ui
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link
            to="/terms"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Terms
          </Link>
          <Link
            to="/privacy"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
