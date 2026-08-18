import React from "react";
import Dashboard from "views/Dashboard/Dashboard.js";
import TicketList from "views/Tickets/TicketList.js";
import TicketDetail from "views/Tickets/TicketDetail.js";
import CustomerPortal from "views/CustomerPortal/CustomerPortal.js";
import KnowledgeBase from "views/KnowledgeBase/KnowledgeBase.js";
import Analytics from "views/Analytics/Analytics.js";
import AdminSettings from "views/Admin/AdminSettings.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import SignUp from "views/Pages/SignUp.js";

import {
  FiHome,
  FiInbox,
  FiBookOpen,
  FiTrendingUp,
  FiSettings,
  FiUserCheck,
  FiUser,
  FiLayers,
} from "react-icons/fi";
import { Icon } from "@chakra-ui/react";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard Overview",
    icon: <Icon as={FiHome} color='inherit' />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/tickets/:id",
    name: "Ticket Workbench",
    icon: <Icon as={FiLayers} color='inherit' />,
    component: TicketDetail,
    layout: "/admin",
    hideInSidebar: true,
  },
  {
    path: "/tickets",
    name: "Ticket Queue & Dispatch",
    icon: <Icon as={FiInbox} color='inherit' />,
    component: TicketList,
    layout: "/admin",
  },
  {
    path: "/customer-portal",
    name: "Customer Portal",
    icon: <Icon as={FiUserCheck} color='inherit' />,
    component: CustomerPortal,
    layout: "/admin",
  },
  {
    path: "/knowledge-base",
    name: "Knowledge Base",
    icon: <Icon as={FiBookOpen} color='inherit' />,
    component: KnowledgeBase,
    layout: "/admin",
  },
  {
    path: "/analytics",
    name: "SLA & Performance",
    icon: <Icon as={FiTrendingUp} color='inherit' />,
    component: Analytics,
    layout: "/admin",
  },
  {
    path: "/settings",
    name: "Admin Configuration",
    icon: <Icon as={FiSettings} color='inherit' />,
    component: AdminSettings,
    layout: "/admin",
  },
  {
    name: "ACCOUNT",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "My Profile",
        icon: <Icon as={FiUser} color='inherit' />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/signin",
        name: "Sign In",
        icon: <Icon as={FiUser} color='inherit' />,
        component: SignIn,
        layout: "/auth",
      },
      {
        path: "/signup",
        name: "Sign Up",
        icon: <Icon as={FiUser} color='inherit' />,
        secondaryNavbar: true,
        component: SignUp,
        layout: "/auth",
      },
    ],
  },
];

export default dashRoutes;
