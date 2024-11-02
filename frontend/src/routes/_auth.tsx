import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNavigation } from '../components/BottomNavigation/BottomNavigation.tsx';

import styles from './index.module.scss'

export const Route = createFileRoute("/_auth")({
  component: () => <AuthLayout />,
});

function AuthLayout() {
  return (
    <div id="auth" className={styles.auth}>
      <div id="auth-content" className={styles.auth__container}>
        <Outlet />
        <BottomNavigation />
      </div>
    </div>
  );
}
