
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

const AuthHeader = () => {
  return (
    <div className="flex justify-center mb-6">
      <Link to="/" className="flex items-center gap-2 hover:opacity-90">
        <div className="relative h-10 w-10">
          <Flame className="h-10 w-10 text-flame-600 animate-flame-pulse" />
        </div>
        <span className="font-geist text-2xl font-bold">
          <span className="text-flame-500">Get</span>
          <span className="text-ember-500">Roasted</span>
        </span>
      </Link>
    </div>
  );
};

export default AuthHeader;
