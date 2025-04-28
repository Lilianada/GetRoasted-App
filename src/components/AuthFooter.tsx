// Footer component for authentication pages
const AuthFooter: React.FC = () => {
  return (
    <footer className="border-t border-night-800 py-6 mt-12">
      <div className="container text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} GetRoastedOnline. All rights reserved. Keep it fiery, keep it fair.</p>
      </div>
    </footer>
  );
};

export default AuthFooter;