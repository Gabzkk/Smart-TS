import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialUsers,
  initialTeams,
  initialCategories,
  initialSlaPolicies,
  initialKnowledgeArticles,
  initialMacros,
  initialAutomations,
  initialTickets,
  initialIntegrations,
  initialAuditLogs,
} from "data/mockData";

const TicketContext = createContext();

const STORAGE_KEYS = {
  TICKETS: "ticketflow_tickets_v1",
  USERS: "ticketflow_users_v1",
  CURRENT_USER_ID: "ticketflow_current_user_id_v1",
  KB: "ticketflow_kb_v1",
  MACROS: "ticketflow_macros_v1",
  AUTOMATIONS: "ticketflow_automations_v1",
  INTEGRATIONS: "ticketflow_integrations_v1",
  NOTIFICATIONS: "ticketflow_notifications_v1",
  AUDIT: "ticketflow_audit_v1",
  COLOR_MODE: "s_ticket_color_mode_v1",
};

export const TicketProvider = ({ children }) => {
  // Color Mode State (Light Glass <-> Dark Glass)
  const [colorMode, setColorMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLOR_MODE);
    return saved || "light";
  });

  const isDark = colorMode === "dark";

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const bg = isDark ? "#09090b" : "#f4f4f4";
    const color = isDark ? "#f4f4f5" : "#18181b";
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
    document.body.style.color = color;
    localStorage.setItem(STORAGE_KEYS.COLOR_MODE, colorMode);
  }, [colorMode, isDark]);

  // Dynamic Theme Palette Values with Glassmorphism
  const themeColors = {
    colorMode,
    isDark,
    toggleColorMode,
    // Cards & Surfaces (Glassmorphic)
    cardBg: isDark ? "rgba(18, 18, 24, 0.78)" : "rgba(255, 253, 253, 0.78)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(225, 225, 227, 0.7)",
    cardShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.45)" : "0 8px 32px 0 rgba(0, 0, 0, 0.05)",
    // Sub-containers / secondary boxes
    subCardBg: isDark ? "rgba(28, 28, 38, 0.65)" : "rgba(244, 244, 244, 0.75)",
    subCardBorder: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(225, 225, 227, 0.6)",
    subCardHover: isDark ? "rgba(38, 38, 50, 0.85)" : "rgba(235, 235, 238, 0.9)",
    // Canvas / Body
    bodyBg: isDark ? "#09090b" : "#f4f4f4",
    // Typography
    textPrimary: isDark ? "#f4f4f5" : "#18181b",
    textSecondary: isDark ? "#a1a0a0" : "#71717a",
    textMuted: isDark ? "#71717a" : "#a1a0a0",
    // Borders & Dividers
    borderLight: isDark ? "#27272a" : "#e1e1e3",
    borderMuted: isDark ? "#3f3f46" : "#c5c2c2",
    // Inputs & Dropdowns
    inputBg: isDark ? "rgba(24, 24, 32, 0.8)" : "rgba(255, 253, 253, 0.85)",
    inputBorder: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(225, 225, 227, 0.85)",
    inputColor: isDark ? "#f4f4f5" : "#18181b",
    // Primary Action Buttons
    buttonPrimaryBg: isDark ? "#f4f4f5" : "#18181b",
    buttonPrimaryColor: isDark ? "#09090b" : "#fffdfd",
    buttonPrimaryHover: isDark ? "#e4e4e7" : "#27272a",
    // Glass styling helper
    glassBackdrop: "blur(20px) saturate(180%)",
  };

  // Load state or fallback
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!saved) return initialUsers;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((u) => (u.id === "usr-admin-1" || u.name === "Elena Rostova" ? { ...u, name: "Burnz", email: "burnz.admin@ticketflow.io" } : u));
      }
      return initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || "usr-admin-1";
  });

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!saved) return initialTickets;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((t) => {
          if (t.requester && (t.requester.name === "Elena Rostova" || t.requester.id === "usr-admin-1")) {
            return {
              ...t,
              requester: { ...t.requester, name: "Burnz", email: "burnz.admin@ticketflow.io" },
            };
          }
          return t;
        });
      }
      return initialTickets;
    } catch {
      return initialTickets;
    }
  });

  const [teams] = useState(initialTeams);
  const [categories] = useState(initialCategories);
  const [slaPolicies, setSlaPolicies] = useState(initialSlaPolicies);

  const [knowledgeArticles, setKnowledgeArticles] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KB);
    if (!saved) return initialKnowledgeArticles;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialKnowledgeArticles;
    } catch {
      return initialKnowledgeArticles;
    }
  });

  const [macros, setMacros] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MACROS);
    if (!saved) return initialMacros;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialMacros;
    } catch {
      return initialMacros;
    }
  });

  const [automations, setAutomations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTOMATIONS);
    if (!saved) return initialAutomations;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialAutomations;
    } catch {
      return initialAutomations;
    }
  });

  const [integrations, setIntegrations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
    if (!saved) return initialIntegrations;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialIntegrations;
    } catch {
      return initialIntegrations;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (!saved) return initialAuditLogs;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialAuditLogs;
    } catch {
      return initialAuditLogs;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "notif-1",
            title: "S1 Outage Alert",
            message: "Critical Webhook Failure on TICK-1082 requires DevOps intervention",
            type: "sla_warning",
            ticketId: "TICK-1082",
            timestamp: "2026-08-18T14:32:00+08:00",
            read: false,
          },
          {
            id: "notif-2",
            title: "New Ticket Assigned",
            message: "You have been assigned to TICK-1081: Azure AD SAML error",
            type: "assignment",
            ticketId: "TICK-1081",
            timestamp: "2026-08-18T10:40:00+08:00",
            read: false,
          },
          {
            id: "notif-3",
            title: "Customer Reply",
            message: "Sophia Martinez replied to TICK-1080 (Billing)",
            type: "reply",
            ticketId: "TICK-1080",
            timestamp: "2026-08-17T09:00:00+08:00",
            read: true,
          },
        ];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KB, JSON.stringify(knowledgeArticles));
  }, [knowledgeArticles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MACROS, JSON.stringify(macros));
  }, [macros]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTOMATIONS, JSON.stringify(automations));
  }, [automations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Actions
  const switchUser = (userId) => {
    setCurrentUserId(userId);
  };

  const addAuditLog = (action, level = "info") => {
    const newEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: currentUser.name,
      action,
      ip: "192.168.1.50",
      level,
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  const addNotification = ({ title, message, type = "info", ticketId = null }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      ticketId,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Create ticket
  const createTicket = ({
    subject,
    description,
    priority = "Medium",
    severity = "S3 - Moderate",
    category = "General Support",
    subcategory = "Other",
    channel = "Web portal / form",
    requester = null,
    assignedTo = null,
    assignedTeam = "Tier 1 Support Queue",
    tags = [],
    customFields = {},
  }) => {
    const now = new Date();
    const nextNum = tickets.length + 1083;
    const ticketId = `TICK-${nextNum}`;

    const actualRequester =
      requester ||
      (currentUser.role === "End User / Requester"
        ? {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            company: currentUser.company || "Self",
            tier: currentUser.tier || "Standard",
            avatar: currentUser.avatar,
          }
        : {
            id: "usr-customer-1",
            name: "Sophia Martinez",
            email: "sophia.martinez@acmecorp.com",
            company: "Acme Corp",
            tier: "Enterprise Diamond",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
          });

    // Determine SLA target
    const policy = slaPolicies.find((p) => p.priority === priority) || slaPolicies[2];
    const frTarget = new Date(now.getTime() + policy.firstResponseHours * 3600000).toISOString();
    const resTarget = new Date(now.getTime() + policy.resolutionHours * 3600000).toISOString();

    const newTicket = {
      id: ticketId,
      subject,
      description,
      requester: actualRequester,
      status: "New",
      priority,
      severity,
      category,
      subcategory,
      channel,
      assignedTeam,
      assignedTo: assignedTo ? users.find((u) => u.id === assignedTo) || null : null,
      tags: tags.length > 0 ? tags : ["general"],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      sla: {
        policy: policy.id,
        firstResponseTarget: frTarget,
        firstResponseActual: null,
        firstResponseMet: null,
        resolutionTarget: resTarget,
        isPaused: false,
        breached: false,
        escalated: false,
      },
      timeTracking: { totalMinutes: 0, billable: false, logs: [] },
      customFields: {
        environment: customFields.environment || "Production",
        productVersion: customFields.productVersion || "v4.18.2",
        affectedUsers: customFields.affectedUsers || "1",
        rootCause: customFields.rootCause || "Under Investigation",
      },
      watchers: [],
      subtasks: [],
      conversation: [
        {
          id: `msg-${Date.now()}`,
          senderType: "customer",
          author: actualRequester.name,
          authorEmail: actualRequester.email,
          authorAvatar: actualRequester.avatar,
          type: "public",
          timestamp: now.toISOString(),
          message: description,
          attachments: [],
        },
      ],
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          action: `Ticket Created via ${channel}`,
          actor: currentUser.name,
          timestamp: now.toISOString(),
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    addAuditLog(`Created ticket ${ticketId}: "${subject.slice(0, 30)}..."`);
    addNotification({
      title: "New Ticket Created",
      message: `${ticketId}: ${subject}`,
      type: "new_ticket",
      ticketId,
    });

    return newTicket;
  };

  // Update Ticket Status
  const updateTicketStatus = (ticketId, newStatus, reasonNote = "") => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const isPausing =
          newStatus === "Pending (Waiting on Customer)" ||
          newStatus === "Pending (Waiting on Third Party)" ||
          newStatus === "On Hold";

        const newAudit = [
          ...t.auditTrail,
          {
            id: `aud-${Date.now()}`,
            action: `Status changed from '${t.status}' to '${newStatus}'${reasonNote ? ` (${reasonNote})` : ""}${
              isPausing ? ". SLA Timer Paused." : ""
            }`,
            actor: currentUser.name,
            timestamp: now,
          },
        ];

        return {
          ...t,
          status: newStatus,
          updatedAt: now,
          sla: {
            ...t.sla,
            isPaused: isPausing,
          },
          auditTrail: newAudit,
        };
      })
    );
    addAuditLog(`Updated ${ticketId} status to '${newStatus}'`);
  };

  // Assign Ticket
  const assignTicket = (ticketId, agentId, teamName) => {
    const now = new Date().toISOString();
    const agent = users.find((u) => u.id === agentId) || null;
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newAudit = [
          ...t.auditTrail,
          {
            id: `aud-${Date.now()}`,
            action: `Assigned to ${agent ? agent.name : "Unassigned"}${teamName ? ` (${teamName})` : ""}`,
            actor: currentUser.name,
            timestamp: now,
          },
        ];
        return {
          ...t,
          assignedTo: agent,
          assignedTeam: teamName || t.assignedTeam,
          status: t.status === "New" ? "Open" : t.status,
          updatedAt: now,
          auditTrail: newAudit,
        };
      })
    );
    if (agent) {
      addNotification({
        title: "Ticket Assigned",
        message: `${ticketId} assigned to ${agent.name}`,
        type: "assignment",
        ticketId,
      });
    }
    addAuditLog(`Reassigned ${ticketId} to ${agent ? agent.name : "None"}`);
  };

  // Add Comment (Public or Internal Note)
  const addComment = (ticketId, { message, type = "public", attachments = [] }) => {
    const now = new Date().toISOString();
    const isFirstAgentReply = currentUser.role !== "End User / Requester" && type === "public";

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const newMsg = {
          id: `msg-${Date.now()}`,
          senderType: currentUser.role === "End User / Requester" ? "customer" : "agent",
          author: currentUser.name,
          authorEmail: currentUser.email,
          authorAvatar: currentUser.avatar,
          type,
          timestamp: now,
          message,
          attachments,
        };

        // SLA First Response Met calculation
        let updatedSla = { ...t.sla };
        if (isFirstAgentReply && !t.sla.firstResponseActual) {
          const met = new Date(now) <= new Date(t.sla.firstResponseTarget);
          updatedSla = {
            ...updatedSla,
            firstResponseActual: now,
            firstResponseMet: met,
          };
        }

        const newAudit = [
          ...t.auditTrail,
          {
            id: `aud-${Date.now()}`,
            action: `Added ${type === "internal" ? "Internal Note" : "Public Reply"}`,
            actor: currentUser.name,
            timestamp: now,
          },
        ];

        return {
          ...t,
          conversation: [...t.conversation, newMsg],
          updatedAt: now,
          status: t.status === "New" ? "Open" : t.status,
          sla: updatedSla,
          auditTrail: newAudit,
        };
      })
    );

    addAuditLog(`Added ${type} reply to ${ticketId}`);
  };

  // Subtasks
  const toggleSubtask = (ticketId, subtaskId) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const addSubtask = (ticketId, title) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newSt = { id: `st-${Date.now()}`, title, completed: false };
        return {
          ...t,
          subtasks: [...t.subtasks, newSt],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Time tracking
  const addTimeLog = (ticketId, { minutes, note, billable = false }) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newLog = {
          id: `tl-${Date.now()}`,
          agent: currentUser.name,
          minutes: parseInt(minutes, 10) || 0,
          note,
          timestamp: now,
        };
        return {
          ...t,
          timeTracking: {
            totalMinutes: (t.timeTracking?.totalMinutes || 0) + (parseInt(minutes, 10) || 0),
            billable: billable || t.timeTracking?.billable,
            logs: [...(t.timeTracking?.logs || []), newLog],
          },
          updatedAt: now,
        };
      })
    );
    addAuditLog(`Logged ${minutes}m on ${ticketId}`);
  };

  // Batch actions
  const batchUpdateStatus = (ticketIds, newStatus) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (!ticketIds.includes(t.id)) return t;
        return {
          ...t,
          status: newStatus,
          updatedAt: now,
          auditTrail: [
            ...t.auditTrail,
            {
              id: `aud-${Date.now()}`,
              action: `Batch status changed to '${newStatus}'`,
              actor: currentUser.name,
              timestamp: now,
            },
          ],
        };
      })
    );
    addAuditLog(`Batch updated ${ticketIds.length} tickets to '${newStatus}'`);
  };

  const batchAssign = (ticketIds, agentId, teamName) => {
    const now = new Date().toISOString();
    const agent = users.find((u) => u.id === agentId) || null;
    setTickets((prev) =>
      prev.map((t) => {
        if (!ticketIds.includes(t.id)) return t;
        return {
          ...t,
          assignedTo: agent,
          assignedTeam: teamName || t.assignedTeam,
          updatedAt: now,
          auditTrail: [
            ...t.auditTrail,
            {
              id: `aud-${Date.now()}`,
              action: `Batch assigned to ${agent ? agent.name : "Unassigned"}`,
              actor: currentUser.name,
              timestamp: now,
            },
          ],
        };
      })
    );
    addAuditLog(`Batch assigned ${ticketIds.length} tickets`);
  };

  const batchDelete = (ticketIds) => {
    setTickets((prev) => prev.filter((t) => !ticketIds.includes(t.id)));
    addAuditLog(`Deleted ${ticketIds.length} tickets`, "warn");
  };

  // Merge tickets
  const mergeTickets = (sourceId, targetId, note = "") => {
    const source = tickets.find((t) => t.id === sourceId);
    if (!source) return;

    // Append source conversation to target and mark source as closed/merged
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === targetId) {
          return {
            ...t,
            conversation: [
              ...t.conversation,
              {
                id: `msg-merge-${Date.now()}`,
                senderType: "agent",
                author: "System (Merge)",
                authorAvatar: currentUser.avatar,
                type: "internal",
                timestamp: now,
                message: `[Merged Ticket] Ticket ${sourceId} was merged into this ticket. Note: ${note || "Merged duplicate"}.\n\nOriginal Subject: "${source.subject}"\nOriginal Description: "${source.description}"`,
              },
            ],
            auditTrail: [
              ...t.auditTrail,
              {
                id: `aud-${Date.now()}`,
                action: `Merged ${sourceId} into this ticket`,
                actor: currentUser.name,
                timestamp: now,
              },
            ],
          };
        }
        if (t.id === sourceId) {
          return {
            ...t,
            status: "Closed",
            updatedAt: now,
            auditTrail: [
              ...t.auditTrail,
              {
                id: `aud-${Date.now()}`,
                action: `Closed and merged into ${targetId}`,
                actor: currentUser.name,
                timestamp: now,
              },
            ],
          };
        }
        return t;
      })
    );
    addAuditLog(`Merged ${sourceId} into ${targetId}`);
  };

  // Knowledge Base Actions
  const rateKnowledgeArticle = (articleId, isHelpful) => {
    setKnowledgeArticles((prev) =>
      prev.map((a) =>
        a.id === articleId
          ? {
              ...a,
              helpfulYes: isHelpful ? a.helpfulYes + 1 : a.helpfulYes,
              helpfulNo: !isHelpful ? a.helpfulNo + 1 : a.helpfulNo,
            }
          : a
      )
    );
  };

  const addKnowledgeArticle = ({ title, category, summary, content, tags = [] }) => {
    const newArt = {
      id: `kb-${Date.now()}`,
      title,
      category,
      summary,
      content,
      tags,
      views: 1,
      helpfulYes: 0,
      helpfulNo: 0,
    };
    setKnowledgeArticles((prev) => [newArt, ...prev]);
    addAuditLog(`Published KB article: "${title}"`);
    return newArt;
  };

  // Reset to initial factory defaults
  const resetToDefaults = () => {
    localStorage.clear();
    setTickets(initialTickets);
    setUsers(initialUsers);
    setCurrentUserId("usr-admin-1");
    setKnowledgeArticles(initialKnowledgeArticles);
    setMacros(initialMacros);
    setAutomations(initialAutomations);
    setIntegrations(initialIntegrations);
    setAuditLogs(initialAuditLogs);
  };

  const value = {
    colorMode,
    isDark,
    toggleColorMode,
    themeColors,
    currentUser,
    currentUserId,
    users,
    teams,
    categories,
    slaPolicies,
    setSlaPolicies,
    knowledgeArticles,
    macros,
    setMacros,
    automations,
    setAutomations,
    integrations,
    setIntegrations,
    auditLogs,
    notifications,
    tickets,
    switchUser,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    createTicket,
    updateTicketStatus,
    assignTicket,
    addComment,
    toggleSubtask,
    addSubtask,
    addTimeLog,
    logTime: addTimeLog,
    batchUpdateStatus,
    batchAssign,
    batchDelete,
    mergeTickets,
    rateKnowledgeArticle,
    addKnowledgeArticle,
    resetToDefaults,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};

export default TicketContext;
