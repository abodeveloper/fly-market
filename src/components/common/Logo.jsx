import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({ onClick, className = "" }) {
  return (
    <Link 
      to="/" 
      onClick={onClick} 
      className={`flex items-center gap-2 group ${className}`}
    >
      <div className="bg-primary text-primary-foreground p-1.5 rounded-xl shadow-lg shadow-primary/30 group-hover:-translate-y-0.5 transition-transform">
        <Rocket className="h-5 w-5 fill-current" />
      </div>
      <span className="font-black text-2xl tracking-tighter text-foreground drop-shadow-sm">
        Fly<span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-500">Market</span>
      </span>
    </Link>
  );
}
