import {
  IconCopy,
  IconLayoutDashboard,
  IconServer,
  IconSettings,
  IconActivity,
  IconUser,
  IconUsersGroup
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
];

export default Menuitems;


