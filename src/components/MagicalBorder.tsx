import { cn } from "@/lib/utils";

interface MagicalBorderProps {
  className?: string;
}

export function MagicalBorder({ className }: MagicalBorderProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* Corner Ornaments */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />
    </div>
  );
}

function CornerOrnament({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const positionClasses = {
    "top-left": "top-1 left-1",
    "top-right": "top-1 right-1 -scale-x-100",
    "bottom-left": "bottom-1 left-1 -scale-y-100",
    "bottom-right": "bottom-1 right-1 -scale-x-100 -scale-y-100",
  };

  return (
    <div className={cn("absolute w-10 h-10 lg:w-12 lg:h-12", positionClasses[position])}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-gold/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* Outer curl */}
        <path d="M5 5 Q5 30, 25 35 Q45 40, 50 60 Q55 80, 75 85" />
        <path d="M5 5 Q30 5, 35 25 Q40 45, 60 50 Q80 55, 85 75" />
        
        {/* Inner decorative elements */}
        <circle cx="15" cy="15" r="2.5" fill="currentColor" opacity="0.5" />
        <circle cx="28" cy="28" r="1.5" fill="currentColor" opacity="0.3" />
        
        {/* Star accent */}
        <path d="M8 8 L10 12 L14 12 L11 15 L12 19 L8 16 L4 19 L5 15 L2 12 L6 12 Z" 
              fill="currentColor" 
              opacity="0.6" />
      </svg>
    </div>
  );
}

export function PageBorderLines({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      {/* Double border effect */}
      <div className="absolute inset-2 border border-gold/15 rounded-sm" />
      <div className="absolute inset-4 border border-gold/8 rounded-sm" />
      
      {/* Top center ornament */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 text-gold/35">
        <span className="text-[10px]">✧</span>
        <span className="text-xs">❖</span>
        <span className="text-[10px]">✧</span>
      </div>
      
      {/* Bottom center ornament */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 text-gold/35">
        <span className="text-[10px]">✧</span>
        <span className="text-xs">❖</span>
        <span className="text-[10px]">✧</span>
      </div>
    </div>
  );
}

export function DividerOrnament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-1.5 text-gold/35 my-1.5", className)}>
      <span className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <span className="text-[10px]">✦</span>
      <span className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
    </div>
  );
}
