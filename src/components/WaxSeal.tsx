import { cn } from "@/lib/utils";

interface WaxSealProps {
  isSealed: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

export function WaxSeal({ isSealed, onToggle, size = "md" }: WaxSealProps) {
  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-12 h-12";
  
  return (
    <button
      onClick={onToggle}
      title={isSealed ? "Remove seal" : "Add wax seal"}
      className={cn(
        "relative transition-all duration-500 group",
        sizeClasses,
        isSealed ? "scale-100" : "scale-90 opacity-60 hover:opacity-100 hover:scale-100"
      )}
    >
      {/* Wax seal base */}
      <div className={cn(
        "absolute inset-0 rounded-full transition-all duration-300",
        isSealed 
          ? "bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-lg"
          : "bg-gradient-to-br from-red-400/50 via-red-500/50 to-red-700/50 border-2 border-dashed border-red-400/50"
      )}>
        {/* Wax drips */}
        {isSealed && (
          <>
            <div className="absolute -bottom-1 left-1/4 w-2 h-3 bg-red-800 rounded-b-full" />
            <div className="absolute -bottom-2 right-1/3 w-1.5 h-2 bg-red-700 rounded-b-full" />
            <div className="absolute -right-0.5 top-1/3 w-2 h-1.5 bg-red-800 rounded-r-full" />
          </>
        )}
      </div>
      
      {/* Stamp imprint */}
      <div className={cn(
        "absolute inset-1 rounded-full flex items-center justify-center transition-all",
        isSealed 
          ? "bg-gradient-to-br from-red-500 to-red-700" 
          : "bg-transparent"
      )}>
        {isSealed ? (
          <span className="text-xl drop-shadow-lg animate-seal-stamp" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            ⚡
          </span>
        ) : (
          <span className="text-lg text-red-400/70 group-hover:text-red-400">+</span>
        )}
      </div>
      
      {/* Shine effect */}
      {isSealed && (
        <div className="absolute top-1 left-2 w-2 h-2 bg-white/20 rounded-full blur-[1px]" />
      )}
    </button>
  );
}
