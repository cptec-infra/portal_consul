import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "HOME",
  },
  {
    id: uniqueId(),
    title: "Inicio",
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
    icon: IconTypography,
    href: "/utilities/machines",
  },
  {
    id: uniqueId(),
    title: "Serviços",
    icon: IconCopy,
    href: "/utilities/shadow",
  },
];

export default Menuitems;


