import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
  useToast,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiShield,
  FiClock,
  FiZap,
  FiMessageSquare,
  FiLink,
  FiFileText,
  FiPlus,
  FiCheck,
  FiAlertTriangle,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { useTickets } from "context/TicketContext";

export default function AdminSettings() {
  const toast = useToast();
  const {
    users,
    teams,
    slaPolicies,
    setSlaPolicies,
    automations,
    setAutomations,
    macros,
    setMacros,
    integrations,
    setIntegrations,
    auditLogs,
    resetToDefaults,
    themeColors,
    isDark,
  } = useTickets();

  const [activeTab, setActiveTab] = useState(0);

  // New Automation Modal State
  const { isOpen: isAutoOpen, onOpen: onAutoOpen, onClose: onAutoClose } = useDisclosure();
  const [newAutoName, setNewAutoName] = useState("");
  const [newAutoTrigger, setNewAutoTrigger] = useState("Ticket Created");
  const [newAutoCondition, setNewAutoCondition] = useState("");
  const [newAutoAction, setNewAutoAction] = useState("");

  // New Macro Modal State
  const { isOpen: isMacroOpen, onOpen: onMacroOpen, onClose: onMacroClose } = useDisclosure();
  const [newMacroTitle, setNewMacroTitle] = useState("");
  const [newMacroShortcut, setNewMacroShortcut] = useState("#");
  const [newMacroCategory, setNewMacroCategory] = useState("General Support");
  const [newMacroText, setNewMacroText] = useState("");

  // Webhook Test State
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // Toggle Automation Active State
  const toggleAutomation = (id) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    toast({
      title: "Automation Rule Updated",
      status: "info",
      duration: 2000,
    });
  };

  // Add Automation
  const handleAddAutomation = (e) => {
    e.preventDefault();
    if (!newAutoName || !newAutoCondition || !newAutoAction) return;

    const newRule = {
      id: `auto-${Date.now()}`,
      name: newAutoName,
      trigger: newAutoTrigger,
      condition: newAutoCondition,
      action: newAutoAction,
      active: true,
      executionCount: 0,
    };
    setAutomations((prev) => [newRule, ...prev]);
    toast({
      title: "Automation Rule Created",
      description: `Rule ${newAutoName} is active.`,
      status: "success",
      duration: 3000,
    });
    setNewAutoName("");
    setNewAutoCondition("");
    setNewAutoAction("");
    onAutoClose();
  };

  // Add Macro
  const handleAddMacro = (e) => {
    e.preventDefault();
    if (!newMacroTitle || !newMacroText) return;

    const newM = {
      id: `macro-${Date.now()}`,
      title: newMacroTitle,
      shortcut: newMacroShortcut,
      category: newMacroCategory,
      text: newMacroText,
    };
    setMacros((prev) => [newM, ...prev]);
    toast({
      title: "Macro Template Saved",
      status: "success",
      duration: 3000,
    });
    setNewMacroTitle("");
    setNewMacroShortcut("#");
    setNewMacroText("");
    onMacroClose();
  };

  // Test Webhook
  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      toast({
        title: "Test Payload Delivered (HTTP 200 OK)",
        description: "Payload delivered to configured endpoint within 48ms.",
        status: "success",
        duration: 4000,
      });
    }, 800);
  };

  // RBAC Matrix Definitions
  const rbacMatrix = [
    { permission: "View & Reply to Assigned Tickets", requester: true, agent: true, lead: true, admin: true },
    { permission: "View Internal Agent-Only Notes", requester: false, agent: true, lead: true, admin: true },
    { permission: "Reassign & Route Across Queues", requester: false, agent: true, lead: true, admin: true },
    { permission: "Manage SLA Policies & Escalations", requester: false, agent: false, lead: true, admin: true },
    { permission: "Create Automation & Trigger Rules", requester: false, agent: false, lead: false, admin: true },
    { permission: "Configure Integrations & API Keys", requester: false, agent: false, lead: false, admin: true },
    { permission: "View System-Wide Audit Logs", requester: false, agent: false, lead: true, admin: true },
  ];

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }} gap='24px'>
      {/* Header Banner */}
      <Card
        bg={themeColors.cardBg}
        border={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        borderRadius='18px'
        boxShadow={themeColors.cardShadow}
        p='20px'>
        <Flex direction={{ base: "column", md: "row" }} justify='space-between' align={{ base: "flex-start", md: "center" }} gap='16px'>
          <Box>
            <Text fontSize='xl' color={themeColors.textPrimary} fontWeight='bold'>
              Administration & System Configuration
            </Text>
            <Text fontSize='xs' color={themeColors.textSecondary}>
              Manage team queues, RBAC permissions, SLA policies, automation rules, and webhooks.
            </Text>
          </Box>
          <Button
            size='sm'
            variant='outline'
            colorScheme='red'
            leftIcon={<FiRefreshCw />}
            onClick={() => {
              resetToDefaults();
              toast({
                title: "Factory Defaults Restored",
                description: "Mock tickets, users, and SLA policies reset to clean initial state.",
                status: "info",
                duration: 3000,
              });
            }}>
            Reset System Data
          </Button>
        </Flex>
      </Card>

      {/* Tabbed Admin Controls */}
      <Card
        bg={themeColors.cardBg}
        border={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        borderRadius='18px'
        boxShadow={themeColors.cardShadow}
        p='24px'>
        <Tabs variant='unstyled' index={activeTab} onChange={(idx) => setActiveTab(idx)}>
          <TabList borderBottom={`1px solid ${themeColors.borderLight}`} pb='4px' overflowX='auto'>
            <Tab _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }} color={themeColors.textSecondary} fontWeight='600' fontSize='sm'>
              <HStack spacing='6px'><Icon as={FiUsers} /><Text>Users & Teams ({users.length})</Text></HStack>
            </Tab>
            <Tab _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }} color={themeColors.textSecondary} fontWeight='600' fontSize='sm'>
              <HStack spacing='6px'><Icon as={FiShield} /><Text>RBAC Matrix</Text></HStack>
            </Tab>
            <Tab _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }} color={themeColors.textSecondary} fontWeight='600' fontSize='sm'>
              <HStack spacing='6px'><Icon as={FiClock} /><Text>SLA Policies ({slaPolicies.length})</Text></HStack>
            </Tab>
            <Tab _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }} color={themeColors.textSecondary} fontWeight='600' fontSize='sm'>
              <HStack spacing='6px'><Icon as={FiZap} /><Text>Automations & Triggers ({automations.length})</Text></HStack>
            </Tab>
            <Tab _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }} color={themeColors.textSecondary} fontWeight='600' fontSize='sm'>
              <HStack spacing='6px'><Icon as={FiMessageSquare} /><Text>Canned Macros ({macros.length})</Text></HStack>
            </Tab>
            <Tab _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }} color={themeColors.textSecondary} fontWeight='600' fontSize='sm'>
              <HStack spacing='6px'><Icon as={FiLink} /><Text>Integrations & Webhooks</Text></HStack>
            </Tab>
            <Tab _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }} color={themeColors.textSecondary} fontWeight='600' fontSize='sm'>
              <HStack spacing='6px'><Icon as={FiFileText} /><Text>Audit Logs</Text></HStack>
            </Tab>
          </TabList>

          <TabPanels pt='20px'>
            {/* TAB 0: Users & Team Queues */}
            <TabPanel p='0'>
              <VStack align='stretch' spacing='24px'>
                {/* Teams List */}
                <Box>
                  <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='md' mb='12px'>Department Queues & Routing Strategy</Text>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing='14px'>
                    {teams.map((t) => (
                      <Box key={t.id} p='14px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='12px'>
                        <Flex justify='space-between' align='center' mb='6px'>
                          <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm'>{t.name}</Text>
                          <Badge bg={themeColors.cardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`} fontSize='9px'>{t.routingStrategy}</Badge>
                        </Flex>
                        <Text color={themeColors.textSecondary} fontSize='xs'>Queue Lead: {t.lead}</Text>
                        <Text color={themeColors.textSecondary} fontSize='xs'>Active Members: {t.membersCount} agents</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>

                <Divider borderColor={themeColors.borderLight} />

                {/* Users List */}
                <Box>
                  <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='md' mb='12px'>System Users & Staff Directory</Text>
                  <Box overflowX='auto'>
                    <Table variant='simple'>
                      <Thead>
                        <Tr borderBottom={`1px solid ${themeColors.borderLight}`}>
                          <Th color={themeColors.textMuted} fontSize='xs'>User</Th>
                          <Th color={themeColors.textMuted} fontSize='xs'>Role</Th>
                          <Th color={themeColors.textMuted} fontSize='xs'>Team / Organization</Th>
                          <Th color={themeColors.textMuted} fontSize='xs'>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {users.map((u) => (
                          <Tr key={u.id} borderBottom={`1px solid ${themeColors.borderLight}`} _hover={{ bg: themeColors.subCardHover }}>
                            <Td>
                              <HStack spacing='10px'>
                                <Avatar size='sm' name={u.name} src={u.avatar} />
                                <Box>
                                  <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='xs'>{u.name}</Text>
                                  <Text color={themeColors.textSecondary} fontSize='10px'>{u.email}</Text>
                                </Box>
                              </HStack>
                            </Td>
                            <Td>
                              <Badge
                                bg={
                                  u.role === "Administrator"
                                    ? themeColors.buttonPrimaryBg
                                    : themeColors.subCardBg
                                }
                                color={
                                  u.role === "Administrator"
                                    ? themeColors.buttonPrimaryColor
                                    : themeColors.textPrimary
                                }
                                border={`1px solid ${themeColors.borderLight}`}
                                fontSize='10px'>
                                {u.role}
                              </Badge>
                            </Td>
                            <Td><Text color={themeColors.textSecondary} fontSize='xs'>{u.team || u.company}</Text></Td>
                            <Td>
                              <Badge bg={isDark ? "rgba(22, 163, 74, 0.2)" : "#f0fdf4"} color='#16a34a' border='1px solid #bbf7d0' fontSize='9px'>{u.status || "Active"}</Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </VStack>
            </TabPanel>

            {/* TAB 1: RBAC Matrix */}
            <TabPanel p='0'>
              <Box overflowX='auto'>
                <Table variant='simple'>
                  <Thead>
                    <Tr borderBottom={`1px solid ${themeColors.borderLight}`}>
                      <Th color={themeColors.textMuted}>Feature / Permission</Th>
                      <Th color={themeColors.textMuted} textAlign='center'>End User / Requester</Th>
                      <Th color={themeColors.textMuted} textAlign='center'>Support Agent</Th>
                      <Th color={themeColors.textMuted} textAlign='center'>Team Lead</Th>
                      <Th color={themeColors.textMuted} textAlign='center'>Administrator</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {rbacMatrix.map((row, idx) => (
                      <Tr key={idx} borderBottom={`1px solid ${themeColors.borderLight}`} _hover={{ bg: themeColors.subCardHover }}>
                        <Td color={themeColors.textPrimary} fontSize='xs' fontWeight='semibold'>{row.permission}</Td>
                        <Td textAlign='center'>{row.requester ? <Badge bg={isDark ? "rgba(22, 163, 74, 0.2)" : "#f0fdf4"} color='#16a34a' border='1px solid #bbf7d0'>Allowed</Badge> : <Text color={themeColors.textMuted}>—</Text>}</Td>
                        <Td textAlign='center'>{row.agent ? <Badge bg={isDark ? "rgba(22, 163, 74, 0.2)" : "#f0fdf4"} color='#16a34a' border='1px solid #bbf7d0'>Allowed</Badge> : <Text color={themeColors.textMuted}>—</Text>}</Td>
                        <Td textAlign='center'>{row.lead ? <Badge bg={isDark ? "rgba(22, 163, 74, 0.2)" : "#f0fdf4"} color='#16a34a' border='1px solid #bbf7d0'>Allowed</Badge> : <Text color={themeColors.textMuted}>—</Text>}</Td>
                        <Td textAlign='center'>{row.admin ? <Badge bg={isDark ? "rgba(22, 163, 74, 0.2)" : "#f0fdf4"} color='#16a34a' border='1px solid #bbf7d0'>Allowed</Badge> : <Text color={themeColors.textMuted}>—</Text>}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            {/* TAB 2: SLA Policies */}
            <TabPanel p='0'>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing='16px'>
                {slaPolicies.map((p) => (
                  <Box key={p.id} p='18px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='14px'>
                    <Flex justify='space-between' align='center' mb='10px'>
                      <Badge
                        bg={p.priority === "Urgent/Critical" ? (isDark ? "rgba(220, 38, 38, 0.2)" : "#fef2f2") : p.priority === "High" ? (isDark ? "rgba(234, 88, 12, 0.2)" : "#fff7ed") : themeColors.cardBg}
                        color={p.priority === "Urgent/Critical" ? "#dc2626" : p.priority === "High" ? "#ea580c" : themeColors.textPrimary}
                        border={`1px solid ${themeColors.borderLight}`}
                        fontSize='xs'
                        px='8px'
                        py='2px'
                        borderRadius='6px'>
                        {p.priority}
                      </Badge>
                      <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='bold'>
                        FRT: {p.firstResponseHours}h • Resolution: {p.resolutionHours}h
                      </Text>
                    </Flex>
                    <Text color={themeColors.textSecondary} fontSize='xs' mb='12px' lineHeight='1.5'>
                      {p.description}
                    </Text>
                    <HStack justify='space-between' fontSize='xs' color={themeColors.textMuted} pt='8px' borderTop={`1px solid ${themeColors.borderLight}`}>
                      <Text>Business hours only: {p.businessHoursOnly ? "Yes (9am-6pm)" : "No (24/7)"}</Text>
                      <Text>Auto-escalate: &gt;{p.autoEscalateHours}h</Text>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>

            {/* TAB 3: Automations & Triggers */}
            <TabPanel p='0'>
              <Flex justify='space-between' align='center' mb='16px'>
                <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='md'>Event-driven Triggers & Time-based Automations</Text>
                <Button size='sm' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }} leftIcon={<FiPlus />} onClick={onAutoOpen}>
                  New Automation Rule
                </Button>
              </Flex>

              <VStack align='stretch' spacing='12px'>
                {automations.map((a) => (
                  <Box key={a.id} p='16px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='12px'>
                    <Flex justify='space-between' align='center' mb='8px'>
                      <HStack spacing='10px'>
                        <Icon as={FiZap} color={themeColors.textPrimary} />
                        <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm'>{a.name}</Text>
                      </HStack>
                      <HStack spacing='12px'>
                        <Badge bg={themeColors.cardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`} fontSize='10px'>{a.executionCount} executions</Badge>
                        <Switch isChecked={a.active} onChange={() => toggleAutomation(a.id)} colorScheme='gray' />
                      </HStack>
                    </Flex>
                    <VStack align='flex-start' spacing='4px' fontSize='xs'>
                      <Text color={themeColors.textSecondary}><strong>Trigger:</strong> {a.trigger}</Text>
                      <Text color={themeColors.textSecondary}><strong>Condition:</strong> <code>{a.condition}</code></Text>
                      <Text color={themeColors.textPrimary}><strong>Action:</strong> {a.action}</Text>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </TabPanel>

            {/* TAB 4: Macros */}
            <TabPanel p='0'>
              <Flex justify='space-between' align='center' mb='16px'>
                <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='md'>Canned Macro Templates</Text>
                <Button size='sm' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }} leftIcon={<FiPlus />} onClick={onMacroOpen}>
                  New Macro Template
                </Button>
              </Flex>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing='14px'>
                {macros.map((m) => (
                  <Box key={m.id} p='16px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='12px'>
                    <Flex justify='space-between' align='center' mb='6px'>
                      <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm'>{m.title}</Text>
                      <Badge bg={themeColors.cardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`} fontSize='10px'>{m.shortcut}</Badge>
                    </Flex>
                    <Text color={themeColors.textSecondary} fontSize='xs' mb='8px'>{m.category}</Text>
                    <Text color={themeColors.textSecondary} fontSize='xs' whiteSpace='pre-wrap' noOfLines={3} bg={themeColors.cardBg} border={`1px solid ${themeColors.borderLight}`} p='8px' borderRadius='6px'>
                      {m.text}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>

            {/* TAB 5: Integrations */}
            <TabPanel p='0'>
              <VStack align='stretch' spacing='16px'>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing='16px'>
                  {integrations.map((int) => (
                    <Box key={int.id} p='18px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='14px'>
                      <Flex justify='space-between' align='center' mb='10px'>
                        <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm'>{int.name}</Text>
                        <Badge bg={isDark ? "rgba(22, 163, 74, 0.2)" : "#f0fdf4"} color='#16a34a' border='1px solid #bbf7d0'>{int.status}</Badge>
                      </Flex>
                      <Text color={themeColors.textSecondary} fontSize='xs' mb='8px'>
                        {int.channel || int.project || int.repo || int.endpoint}
                      </Text>
                      <HStack spacing='6px' wrap='wrap'>
                        {int.events?.map((ev, i) => (
                          <Badge key={i} bg={themeColors.cardBg} color={themeColors.textSecondary} border={`1px solid ${themeColors.borderLight}`} fontSize='9px'>{ev}</Badge>
                        ))}
                      </HStack>
                    </Box>
                  ))}
                </SimpleGrid>

                {/* Webhook Endpoint Tester */}
                <Box p='16px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.textPrimary}`} borderRadius='12px'>
                  <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm' mb='6px'>Outbound Webhook Tester</Text>
                  <Text color={themeColors.textSecondary} fontSize='xs' mb='12px'>Send a mock HMAC-SHA256 signed ticket event payload to your endpoint.</Text>
                  <Button size='sm' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }} isLoading={isTestingWebhook} onClick={handleTestWebhook}>
                    Dispatch Test Ping
                  </Button>
                </Box>
              </VStack>
            </TabPanel>

            {/* TAB 6: Audit Logs */}
            <TabPanel p='0'>
              <Box overflowX='auto'>
                <Table variant='simple'>
                  <Thead>
                    <Tr borderBottom={`1px solid ${themeColors.borderLight}`}>
                      <Th color={themeColors.textMuted} fontSize='xs'>Timestamp</Th>
                      <Th color={themeColors.textMuted} fontSize='xs'>User / System</Th>
                      <Th color={themeColors.textMuted} fontSize='xs'>Action Event</Th>
                      <Th color={themeColors.textMuted} fontSize='xs'>IP Address</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {auditLogs.map((log) => (
                      <Tr key={log.id} borderBottom={`1px solid ${themeColors.borderLight}`} _hover={{ bg: themeColors.subCardHover }}>
                        <Td color={themeColors.textSecondary} fontSize='xs'>{new Date(log.timestamp).toLocaleString()}</Td>
                        <Td color={themeColors.textPrimary} fontSize='xs' fontWeight='bold'>{log.user}</Td>
                        <Td color={themeColors.textPrimary} fontSize='xs'>{log.action}</Td>
                        <Td color={themeColors.textMuted} fontSize='xs'>{log.ip}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>

      {/* New Automation Modal */}
      <Modal isOpen={isAutoOpen} onClose={onAutoClose} size='lg'>
        <ModalOverlay backdropFilter='blur(8px)' />
        <ModalContent bg={themeColors.cardBg} border={`1px solid ${themeColors.cardBorder}`} backdropFilter={themeColors.glassBackdrop} color={themeColors.textPrimary} borderRadius='16px'>
          <ModalHeader borderBottom={`1px solid ${themeColors.borderLight}`}>Create Automation Trigger Rule</ModalHeader>
          <ModalCloseButton color={themeColors.textPrimary} />
          <form onSubmit={handleAddAutomation}>
            <ModalBody py='20px'>
              <VStack spacing='14px'>
                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Rule Name</FormLabel>
                  <Input bg={themeColors.inputBg} borderColor={themeColors.inputBorder} color={themeColors.textPrimary} value={newAutoName} onChange={(e) => setNewAutoName(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Trigger Event</FormLabel>
                  <Select bg={themeColors.inputBg} borderColor={themeColors.inputBorder} color={themeColors.textPrimary} value={newAutoTrigger} onChange={(e) => setNewAutoTrigger(e.target.value)}>
                    <option value='Ticket Created' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Ticket Created</option>
                    <option value='Ticket Updated' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Ticket Updated</option>
                    <option value='SLA Threshold Warning' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>SLA Threshold Warning</option>
                    <option value='Time-based Inactivity' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Time-based Inactivity</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Condition Expression</FormLabel>
                  <Input placeholder="e.g. Priority == 'Urgent/Critical' AND Category == 'API'" bg={themeColors.inputBg} borderColor={themeColors.inputBorder} color={themeColors.textPrimary} value={newAutoCondition} onChange={(e) => setNewAutoCondition(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Actions to Execute</FormLabel>
                  <Input placeholder="e.g. Assign to 'DevOps' + Send Slack Alert" bg={themeColors.inputBg} borderColor={themeColors.inputBorder} color={themeColors.textPrimary} value={newAutoAction} onChange={(e) => setNewAutoAction(e.target.value)} />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter borderTop={`1px solid ${themeColors.borderLight}`}>
              <Button variant='ghost' mr={3} onClick={onAutoClose} color={themeColors.textSecondary}>Cancel</Button>
              <Button type='submit' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }}>Save Rule</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* New Macro Modal */}
      <Modal isOpen={isMacroOpen} onClose={onMacroClose} size='lg'>
        <ModalOverlay backdropFilter='blur(8px)' />
        <ModalContent bg={themeColors.cardBg} border={`1px solid ${themeColors.cardBorder}`} backdropFilter={themeColors.glassBackdrop} color={themeColors.textPrimary} borderRadius='16px'>
          <ModalHeader borderBottom={`1px solid ${themeColors.borderLight}`}>Create Canned Macro Template</ModalHeader>
          <ModalCloseButton color={themeColors.textPrimary} />
          <form onSubmit={handleAddMacro}>
            <ModalBody py='20px'>
              <VStack spacing='14px'>
                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Template Title</FormLabel>
                  <Input bg={themeColors.inputBg} borderColor={themeColors.inputBorder} color={themeColors.textPrimary} value={newMacroTitle} onChange={(e) => setNewMacroTitle(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Shortcut Prefix</FormLabel>
                  <Input bg={themeColors.inputBg} borderColor={themeColors.inputBorder} color={themeColors.textPrimary} value={newMacroShortcut} onChange={(e) => setNewMacroShortcut(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Template Body (Placeholders: {`{{requester_name}}`}, {`{{ticket_id}}`}, {`{{agent_name}}`})</FormLabel>
                  <Textarea rows={4} bg={themeColors.inputBg} borderColor={themeColors.inputBorder} color={themeColors.textPrimary} value={newMacroText} onChange={(e) => setNewMacroText(e.target.value)} />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter borderTop={`1px solid ${themeColors.borderLight}`}>
              <Button variant='ghost' mr={3} onClick={onMacroClose} color={themeColors.textSecondary}>Cancel</Button>
              <Button type='submit' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }}>Save Macro</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
