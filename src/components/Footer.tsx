import { Link } from "react-router-dom";

const Footer = () => {
return ( <footer className="border-t border-night-800 py-6 mt-12">
    <div className="container text-center text-sm text-muted-foreground">
      <p>© 2025 GetRoastedOnline. All rights reserved.</p>
      <div className="flex items-center justify-center gap-4 mt-2">
        <Link to="/terms" className="text-flame-500 hover:underline">
          Terms of Service
        </Link>
        <Link to="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  </footer>
  )
};
export default Footer;