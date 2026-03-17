import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Crosshair,
  MapPin,
  AlertTriangle,
  Settings,
  BarChart3,
  ChevronLeft,
  Activity,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  pendingRaids: number;
  pendingClaims: number;
}

const AppSidebar = ({ activeView, onViewChange, pendingRaids, pendingClaims }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Overview", icon: <BarChart3 size={20} /> },
    { id: "leaderboard", label: "Leaderboard", icon: <Trophy size={20} /> },
    { id: "claims", label: "Claims", icon: <MapPin size={20} />, badge: pendingClaims },
    { id: "raids", label: "Raid Queue", icon: <Crosshair size={20} />, badge: pendingRaids },
    { id: "discipline", label: "Discipline", icon: <AlertTriangle size={20} /> },
    { id: "analytics", label: "Analytics", icon: <Activity size={20} /> },
    { id: "tribes", label: "Tribe Manager", icon: <Shield size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-screen bg-sidebar border-r border-sidebar-border relative z-10"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Zap className="text-primary" size={20} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <h1 className="font-display text-sm font-bold tracking-wider text-foreground">ALPHA</h1>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Dominate Hub</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150",
              activeView === item.id
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 text-left whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {item.badge && item.badge > 0 && !collapsed && (
              <span className="ml-auto text-[11px] font-semibold bg-primary/20 text-primary px-2 py-0.5 rounded-full tabular-nums">
                {item.badge}
              </span>
            )}
            {item.badge && item.badge > 0 && collapsed && (
              <span className="absolute right-2 top-1 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className={cn("transition-transform", collapsed && "rotate-180")} size={18} />
      </button>
    </motion.aside>
  );
};

export default AppSidebar;
