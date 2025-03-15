import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { FolderSimpleLock as FolderSimpleLockIcon } from '@phosphor-icons/react/dist/ssr/FolderSimpleLock';

import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import AccountTreeIcon from '@mui/icons-material/AccountTree';


export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'foldersimplelockicon': FolderSimpleLockIcon,
  user: UserIcon,
  users: UsersIcon,
  'habits': AppRegistrationIcon,
  'finances': AssuredWorkloadIcon,
  'finances': AssuredWorkloadIcon,
  'projects': AccountTreeIcon,
} as Record<string, Icon>;
