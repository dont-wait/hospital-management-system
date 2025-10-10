import dynamic from "next/dynamic";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultOptions = {
  position: "top-center" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

/* Icons */
export const Calendar = dynamic(() =>
  import("lucide-react").then((mod) => mod.Calendar),
);

export const Users = dynamic(() =>
  import("lucide-react").then((mod) => mod.Users),
);

export const FileText = dynamic(() =>
  import("lucide-react").then((mod) => mod.FileText),
);

export const Activity = dynamic(() =>
  import("lucide-react").then((mod) => mod.Activity),
);

export const Heart = dynamic(() =>
  import("lucide-react").then((mod) => mod.Heart),
);

export const Clock = dynamic(() =>
  import("lucide-react").then((mod) => mod.Clock),
);

export const Dot = dynamic(() => import("lucide-react").then((mod) => mod.Dot));

export const Eye = dynamic(() => import("lucide-react").then((mod) => mod.Eye));

export const EyeOff = dynamic(() =>
  import("lucide-react").then((mod) => mod.EyeOff),
);

export const ArrowLeft = dynamic(() =>
  import("lucide-react").then((mod) => mod.ArrowLeft),
);

export const ArrowRight = dynamic(() =>
  import("lucide-react").then((mod) => mod.ArrowRight),
);

export const Mail = dynamic(() =>
  import("lucide-react").then((mod) => mod.Mail),
);

export const Shield = dynamic(() =>
  import("lucide-react").then((mod) => mod.Shield),
);

export const Key = dynamic(() => import("lucide-react").then((mod) => mod.Key));

export const Star = dynamic(() =>
  import("lucide-react").then((mod) => mod.Star),
);

export const CheckCircle = dynamic(() =>
  import("lucide-react").then((mod) => mod.CheckCircle),
);

export const AlertCircle = dynamic(() =>
  import("lucide-react").then((mod) => mod.AlertCircle),
);

export const LogOut = dynamic(() =>
  import("lucide-react").then((mod) => mod.LogOut),
);

export const LogIn = dynamic(() =>
  import("lucide-react").then((mod) => mod.LogIn),
);

export const Home = dynamic(() =>
  import("lucide-react").then((mod) => mod.Home),
);

export const UserCheck = dynamic(() =>
  import("lucide-react").then((mod) => mod.UserCheck),
);

export const Bell = dynamic(() =>
  import("lucide-react").then((mod) => mod.Bell),
);

export const Menu = dynamic(() =>
  import("lucide-react").then((mod) => mod.Menu),
);

export const CircleX = dynamic(() =>
  import("lucide-react").then((mod) => mod.CircleX),
);

export const Lock = dynamic(() =>
  import("lucide-react").then((mod) => mod.Lock),
);

export const Pencil = dynamic(() =>
  import("lucide-react").then((mod) => mod.Pencil),
);

export const User = dynamic(() =>
  import("lucide-react").then((mod) => mod.User),
);

export const Phone = dynamic(() =>
  import("lucide-react").then((mod) => mod.Phone),
);
