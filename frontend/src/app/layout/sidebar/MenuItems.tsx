import {
  IconCopy,
  IconLayoutDashboard,
  IconServer,
  IconSettings,
  IconActivity,
  IconUser,
  IconUsersGroup,
  IconChartColumn,
  IconDevicesPc,
  IconUserShield
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "HOME",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "SERVIDORES",
  },
  {
    id: uniqueId(),
    title: "Servidores",
    icon: IconServer,
    href: "/utilities/machines",
  },
  {
    id: uniqueId(),
    title: "Serviços",
    icon: IconActivity,
    href: "/utilities/services",
  },
  {
    navlabel: true,
    subheader: "LDAP",
  },
  {
    id: uniqueId(),
    title: "Usuários",
    icon: IconUser,
    href: "/utilities/users",
  },
    {
    id: uniqueId(),
    title: "Grupos",
    icon: IconUsersGroup,
    href: "/utilities/groups",
  },
  {
    navlabel: true,
    subheader: "RACKS",
  },
  {
    id: uniqueId(),
    title: "Racks",
    icon: IconChartColumn,
    href: "/utilities/racks",
  },
  {
    id: uniqueId(),
    title: "Equipamentos",
    icon: IconDevicesPc,
    href: "/utilities/equipamentos",
  },
  {
    id: uniqueId(),
    title: "Responsáveis",
    icon: IconUserShield,
    href: "/utilities/responsaveis",
  },
];

export default Menuitems;


