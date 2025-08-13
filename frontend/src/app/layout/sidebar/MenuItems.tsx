import {
  IconCopy,
  IconLayoutDashboard,
  IconServer,
  IconSettings,
  IconActivity
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
];

export default Menuitems;


