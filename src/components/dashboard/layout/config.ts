import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';


export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Outstanding Leaders', href: paths.dashboard.customers, icon: 'users' },

  { key: 'habits', title: 'Habits', href: paths.dashboard.customers, icon: 'habits' },
  { key: 'finances', title: 'Personal Finances', href: paths.dashboard.customers, icon: 'finances' },
  { key: 'projects', title: 'Projects', href: paths.dashboard.customers, icon: 'projects' },



  
  { key: 'history', title: 'History', href: paths.dashboard.history, icon: 'foldersimplelockicon' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
