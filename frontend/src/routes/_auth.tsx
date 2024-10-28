import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import BottomNavigation from "../components/BottomNavigation";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/_auth")({
  component: () => <AuthLayout />,
});

function AuthLayout() {
  const location = useLocation();

  return (
    <div id="auth" className={cn("flex flex-col h-full")}>
      <div id="auth-content" className="flex flex-col justify-around overflow-auto pb-16">
        <Outlet />
        <BottomNavigation currentUrl={location.pathname.trim()} />
      </div>
    </div>
  );
}
