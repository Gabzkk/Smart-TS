import React, { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
  HStack,
  VStack,
  Avatar,
  Icon,
  Tag,
  TagLabel,
  useDisclosure,
  useToast,
  Tabs,
  TabList,
  Tab,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiInbox,
  FiUserCheck,
  FiChevronDown,
  FiLayers,
  FiMessageSquare,
  FiTrash2,
  FiBookOpen,
  FiTag,
  FiArrowRight,
  FiCheckSquare,
} from "react-icons/fi";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { useTickets } from "context/TicketContext";

export default function TicketList() {
  const history = useHistory();
  const toast = useToast();
  const {
    tickets,
    users,
    categories,
    currentUser,
    createTicket,
    batchUpdateStatus,
    batchAssign,
    batchDelete,
    knowledgeArticles,
    themeColors,
    isDark,
  } = useTickets();

  // State
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: My Assigned, 2: Unassigned, 3: SLA At Risk, 4: Critical, 5: Resolved
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [agentFilter, setAgentFilter] = useState("ALL");
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
      case "Open":
        return { bg: themeColors.subCardBg, color: themeColors.textPrimary, border: `1px solid ${themeColors.borderMuted}` };
      case "In Progress":
        return { bg: themeColors.buttonPrimaryBg, color: themeColors.buttonPrimaryColor, border: `1px solid ${themeColors.buttonPrimaryBg}` };
      case "Pending (Waiting on Customer)":
      case "Pending (Waiting on Third Party)":
        return { bg: isDark ? "rgba(234, 88, 12, 0.15)" : "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa" };
      case "On Hold":
        return { bg: themeColors.subCardBg, color: themeColors.textSecondary, border: `1px solid ${themeColors.borderLight}` };
      case "Resolved":
        return { bg: isDark ? "rgba(22, 163, 74, 0.15)" : "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" };
      case "Closed":
        return { bg: themeColors.subCardBg, color: themeColors.textMuted, border: `1px solid ${themeColors.borderLight}` };
      case "Reopened":
        return { bg: isDark ? "rgba(220, 38, 38, 0.15)" : "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" };
      default:
        return { bg: themeColors.subCardBg, color: themeColors.textSecondary, border: `1px solid ${themeColors.borderLight}` };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Urgent/Critical":
        return { bg: isDark ? "rgba(220, 38, 38, 0.2)" : "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" };
      case "High":
        return { bg: isDark ? "rgba(234, 88, 12, 0.2)" : "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa" };
      case "Medium":
        return { bg: themeColors.subCardBg, color: themeColors.textPrimary, border: `1px solid ${themeColors.borderMuted}` };
      case "Low":
        return { bg: themeColors.subCardBg, color: themeColors.textSecondary, border: `1px solid ${themeColors.borderLight}` };
      default:
        return { bg: themeColors.subCardBg, color: themeColors.textSecondary, border: `1px solid ${themeColors.borderLight}` };
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "Email-to-ticket":
        return "Email";
      case "Chat/live chat":
        return "Chat";
      case "API/integration":
        return "API";
      case "Phone (manual entry)":
        return "Phone";
      default:
        return "Web Portal";
    }
  };

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    confirmColorScheme: "gray",
    onConfirm: null,
  });

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const handleExecuteConfirm = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
    closeConfirmModal();
  };

  // Create Ticket Modal State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newSeverity, setNewSeverity] = useState("S3 - Moderate");
  const [newCategory, setNewCategory] = useState(categories[0]?.name || "API & Integrations");
  const [newSubcategory, setNewSubcategory] = useState(categories[0]?.subcategories[0] || "");
  const [newChannel, setNewChannel] = useState("Web portal / form");
  const [newAssignedTo, setNewAssignedTo] = useState("");
  const [newAssignedTeam, setNewAssignedTeam] = useState(categories[0]?.defaultTeam || "Tier 1 Support Queue");
  const [newTags, setNewTags] = useState("incident, customer");

  // Dynamic KB suggestions during ticket creation (Deflection)
  const suggestedArticles = useMemo(() => {
    if (!newSubject.trim()) return [];
    const q = newSubject.toLowerCase();
    return knowledgeArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.tags.some((t) => q.includes(t.toLowerCase())) ||
        a.category.toLowerCase().includes(q)
    );
  }, [newSubject, knowledgeArticles]);

  // Handle Category Change in Modal
  const handleCategoryChange = (catName) => {
    setNewCategory(catName);
    const cat = categories.find((c) => c.name === catName);
    if (cat) {
      setNewSubcategory(cat.subcategories[0] || "");
      setNewAssignedTeam(cat.defaultTeam || "Tier 1 Support Queue");
    }
  };

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Saved View Tabs
      if (activeTab === 1 && t.assignedTo?.id !== currentUser.id) return false;
      if (activeTab === 2 && t.assignedTo) return false;
      if (activeTab === 3 && (t.status === "Resolved" || t.status === "Closed" || t.sla.firstResponseMet)) return false;
      if (activeTab === 4 && t.priority !== "Urgent/Critical" && t.priority !== "High") return false;
      if (activeTab === 5 && t.status !== "Resolved" && t.status !== "Closed") return false;

      // Dropdown Filters
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
      if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
      if (teamFilter !== "ALL" && t.assignedTeam !== teamFilter) return false;
      if (agentFilter !== "ALL" && t.assignedTo?.id !== agentFilter) return false;
      if (channelFilter !== "ALL" && t.channel !== channelFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = t.id.toLowerCase().includes(q);
        const matchSub = t.subject.toLowerCase().includes(q);
        const matchReq = t.requester.name.toLowerCase().includes(q) || t.requester.email.toLowerCase().includes(q);
        const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchId && !matchSub && !matchReq && !matchTag) return false;
      }

      return true;
    });
  }, [tickets, activeTab, currentUser, statusFilter, priorityFilter, teamFilter, agentFilter, channelFilter, searchQuery]);

  // Select all / toggle one
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTicketIds(filteredTickets.map((t) => t.id));
    } else {
      setSelectedTicketIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedTicketIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Submit New Ticket
  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Subject and Description are mandatory.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const assignedUser = users.find((u) => u.id === newAssignedTo);

    const created = createTicket({
      subject: newSubject,
      description: newDescription,
      priority: newPriority,
      severity: newSeverity,
      category: newCategory,
      subcategory: newSubcategory,
      channel: newChannel,
      assignedTo: assignedUser || null,
      assignedTeam: newAssignedTeam,
      tags: newTags.split(",").map((s) => s.trim()).filter(Boolean),
    });

    toast({
      title: `Ticket ${created.id} Created`,
      description: "Successfully routed and assigned based on category policies.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    // Reset Form
    setNewSubject("");
    setNewDescription("");
    onClose();
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const total = tickets.length;
    const openCount = tickets.filter((t) => t.status === "Open" || t.status === "New").length;
    const inProgCount = tickets.filter((t) => t.status === "In Progress").length;
    const criticalCount = tickets.filter((t) => t.priority === "Urgent/Critical").length;
    const unassignedCount = tickets.filter((t) => !t.assignedTo).length;
    return { total, openCount, inProgCount, criticalCount, unassignedCount };
  }, [tickets]);

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }} gap='24px'>
      {/* Top Metrics Cards */}
      <SimpleGrid columns={{ base: 2, md: 5 }} spacing='16px'>
        <Card
          p='16px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Text fontSize='xs' color={themeColors.textMuted} textTransform='uppercase' fontWeight='bold'>
                Total Tickets
              </Text>
              <Text fontSize='24px' color={themeColors.textPrimary} fontWeight='extrabold'>
                {metrics.total}
              </Text>
            </Box>
            <Flex
              w='42px'
              h='42px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              borderRadius='12px'
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiLayers} w='20px' h='20px' />
            </Flex>
          </Flex>
        </Card>

        <Card
          p='16px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Text fontSize='xs' color={themeColors.textMuted} textTransform='uppercase' fontWeight='bold'>
                Open / New
              </Text>
              <Text fontSize='24px' color={themeColors.textPrimary} fontWeight='extrabold'>
                {metrics.openCount}
              </Text>
            </Box>
            <Flex
              w='42px'
              h='42px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              borderRadius='12px'
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiInbox} w='20px' h='20px' />
            </Flex>
          </Flex>
        </Card>

        <Card
          p='16px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Text fontSize='xs' color={themeColors.textMuted} textTransform='uppercase' fontWeight='bold'>
                In Progress
              </Text>
              <Text fontSize='24px' color={themeColors.textPrimary} fontWeight='extrabold'>
                {metrics.inProgCount}
              </Text>
            </Box>
            <Flex
              w='42px'
              h='42px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              borderRadius='12px'
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiClock} w='20px' h='20px' />
            </Flex>
          </Flex>
        </Card>

        <Card
          p='16px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Text fontSize='xs' color={themeColors.textMuted} textTransform='uppercase' fontWeight='bold'>
                Critical / Urgent
              </Text>
              <Text fontSize='24px' color='#dc2626' fontWeight='extrabold'>
                {metrics.criticalCount}
              </Text>
            </Box>
            <Flex
              w='42px'
              h='42px'
              bg={isDark ? "rgba(220, 38, 38, 0.2)" : "#fef2f2"}
              border='1px solid #fecaca'
              borderRadius='12px'
              justify='center'
              align='center'
              color='#dc2626'>
              <Icon as={FiAlertTriangle} w='20px' h='20px' />
            </Flex>
          </Flex>
        </Card>

        <Card
          p='16px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Text fontSize='xs' color={themeColors.textMuted} textTransform='uppercase' fontWeight='bold'>
                Unassigned
              </Text>
              <Text fontSize='24px' color={themeColors.textPrimary} fontWeight='extrabold'>
                {metrics.unassignedCount}
              </Text>
            </Box>
            <Flex
              w='42px'
              h='42px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              borderRadius='12px'
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiUserCheck} w='20px' h='20px' />
            </Flex>
          </Flex>
        </Card>
      </SimpleGrid>

      {/* Main Ticket Explorer Card */}
      <Card
        bg={themeColors.cardBg}
        border={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        boxShadow={themeColors.cardShadow}
        p='24px'>
        <CardHeader mb='20px'>
          <Flex direction={{ base: "column", md: "row" }} justify='space-between' align={{ base: "flex-start", md: "center" }} gap='16px' w='100%'>
            <Box>
              <Text fontSize='xl' color={themeColors.textPrimary} fontWeight='bold'>
                Ticket Management & Queue Dispatch
              </Text>
              <Text fontSize='sm' color={themeColors.textSecondary}>
                Real-time incident lifecycle, SLA countdowns, routing, and conversation workbenches.
              </Text>
            </Box>
            <HStack spacing='12px'>
              <Button
                leftIcon={<Icon as={FiPlus} />}
                bg={themeColors.buttonPrimaryBg}
                color={themeColors.buttonPrimaryColor}
                _hover={{ bg: themeColors.buttonPrimaryHover }}
                borderRadius='12px'
                px='20px'
                onClick={onOpen}>
                Create Ticket
              </Button>
            </HStack>
          </Flex>
        </CardHeader>

        <CardBody direction='column'>
          {/* Saved Views Tabs */}
          <Tabs variant='unstyled' index={activeTab} onChange={(idx) => setActiveTab(idx)} mb='20px'>
            <TabList borderBottom={`1px solid ${themeColors.borderLight}`} pb='4px' overflowX='auto'>
              <Tab
                _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }}
                color={themeColors.textSecondary}
                fontWeight='600'
                fontSize='sm'
                pb='10px'>
                All Tickets ({tickets.length})
              </Tab>
              <Tab
                _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }}
                color={themeColors.textSecondary}
                fontWeight='600'
                fontSize='sm'
                pb='10px'>
                Assigned to Me ({tickets.filter((t) => t.assignedTo?.id === currentUser.id).length})
              </Tab>
              <Tab
                _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }}
                color={themeColors.textSecondary}
                fontWeight='600'
                fontSize='sm'
                pb='10px'>
                Unassigned Queue ({tickets.filter((t) => !t.assignedTo).length})
              </Tab>
              <Tab
                _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }}
                color={themeColors.textSecondary}
                fontWeight='600'
                fontSize='sm'
                pb='10px'>
                SLA At Risk ({tickets.filter((t) => t.status !== "Resolved" && t.status !== "Closed" && !t.sla.firstResponseMet).length})
              </Tab>
              <Tab
                _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }}
                color={themeColors.textSecondary}
                fontWeight='600'
                fontSize='sm'
                pb='10px'>
                Critical & Urgent ({tickets.filter((t) => t.priority === "Urgent/Critical" || t.priority === "High").length})
              </Tab>
              <Tab
                _selected={{ color: themeColors.textPrimary, borderBottom: `2px solid ${themeColors.textPrimary}` }}
                color={themeColors.textSecondary}
                fontWeight='600'
                fontSize='sm'
                pb='10px'>
                Resolved & Closed ({tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length})
              </Tab>
            </TabList>
          </Tabs>

          {/* Search & Multi-filter Row */}
          <Flex direction={{ base: "column", lg: "row" }} gap='12px' mb='20px' align='center' justify='space-between'>
            <InputGroup maxW={{ base: "100%", lg: "320px" }}>
              <InputLeftElement pointerEvents='none'>
                <Icon as={FiSearch} color={themeColors.textMuted} />
              </InputLeftElement>
              <Input
                placeholder='Search tickets, subjects, requester, tags...'
                bg={themeColors.inputBg}
                borderColor={themeColors.inputBorder}
                color={themeColors.textPrimary}
                borderRadius='12px'
                fontSize='sm'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                _focus={{ borderColor: themeColors.textPrimary }}
              />
            </InputGroup>

            <Flex wrap='wrap' gap='10px' align='center'>
              {/* Status Filter */}
              <Select
                size='sm'
                w='130px'
                bg={themeColors.inputBg}
                color={themeColors.textPrimary}
                borderColor={themeColors.inputBorder}
                borderRadius='10px'
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>
                <option value='ALL' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Status: All</option>
                <option value='New' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>New</option>
                <option value='Open' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Open</option>
                <option value='In Progress' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>In Progress</option>
                <option value='Pending (Waiting on Customer)' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Pending Customer</option>
                <option value='On Hold' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>On Hold</option>
                <option value='Resolved' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Resolved</option>
                <option value='Closed' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Closed</option>
              </Select>

              {/* Priority Filter */}
              <Select
                size='sm'
                w='130px'
                bg={themeColors.inputBg}
                color={themeColors.textPrimary}
                borderColor={themeColors.inputBorder}
                borderRadius='10px'
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value='ALL' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Priority: All</option>
                <option value='Urgent/Critical' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Urgent</option>
                <option value='High' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>High</option>
                <option value='Medium' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Medium</option>
                <option value='Low' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Low</option>
              </Select>

              {/* Team Filter */}
              <Select
                size='sm'
                w='150px'
                bg={themeColors.inputBg}
                color={themeColors.textPrimary}
                borderColor={themeColors.inputBorder}
                borderRadius='10px'
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}>
                <option value='ALL' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Queue: All</option>
                <option value='Tier 1 Support Queue' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Tier 1 Support</option>
                <option value='Tier 2 Technical Support' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Tier 2 Technical</option>
                <option value='Billing & Subscriptions' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Billing & Subs</option>
                <option value='DevOps & Infrastructure' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>DevOps & Infra</option>
              </Select>

              {/* Channel Filter */}
              <Select
                size='sm'
                w='130px'
                bg={themeColors.inputBg}
                color={themeColors.textPrimary}
                borderColor={themeColors.inputBorder}
                borderRadius='10px'
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}>
                <option value='ALL' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Channel: All</option>
                <option value='Web portal / form' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Web Form</option>
                <option value='Email-to-ticket' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Email</option>
                <option value='Chat/live chat' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Live Chat</option>
                <option value='API/integration' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>API</option>
                <option value='Phone (manual entry)' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Phone</option>
              </Select>

              {/* Reset Filters */}
              {(statusFilter !== "ALL" || priorityFilter !== "ALL" || teamFilter !== "ALL" || channelFilter !== "ALL" || searchQuery) && (
                <Button
                  size='sm'
                  variant='ghost'
                  color={themeColors.textSecondary}
                  _hover={{ color: themeColors.textPrimary }}
                  onClick={() => {
                    setStatusFilter("ALL");
                    setPriorityFilter("ALL");
                    setTeamFilter("ALL");
                    setAgentFilter("ALL");
                    setChannelFilter("ALL");
                    setSearchQuery("");
                  }}>
                  Reset
                </Button>
              )}
            </Flex>
          </Flex>

          {/* Batch Actions Bar (when items selected) */}
          {selectedTicketIds.length > 0 && (
            <Flex
              p='12px 18px'
              mb='16px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.textPrimary}`}
              backdropFilter={themeColors.glassBackdrop}
              borderRadius='12px'
              justify='space-between'
              align='center'>
              <HStack spacing='12px'>
                <Icon as={FiCheckSquare} color={themeColors.textPrimary} />
                <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm'>
                  {selectedTicketIds.length} ticket(s) selected
                </Text>
              </HStack>
              <HStack spacing='10px'>
                {/* Batch Status */}
                <Menu>
                  <MenuButton as={Button} size='sm' bg={themeColors.cardBg} border={`1px solid ${themeColors.borderLight}`} color={themeColors.textPrimary} _hover={{ bg: themeColors.subCardHover }} rightIcon={<FiChevronDown />}>
                    Change Status
                  </MenuButton>
                  <MenuList bg={themeColors.cardBg} borderColor={themeColors.borderLight} backdropFilter={themeColors.glassBackdrop}>
                    <MenuItem
                      _hover={{ bg: themeColors.subCardHover }}
                      color={themeColors.textPrimary}
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          title: "Confirm Status Change",
                          message: `Change status to "In Progress" for ${selectedTicketIds.length} selected ticket(s)?`,
                          confirmLabel: "Update Status",
                          confirmColorScheme: "gray",
                          onConfirm: () => {
                            batchUpdateStatus(selectedTicketIds, "In Progress");
                            setSelectedTicketIds([]);
                            toast({
                              title: "Status Updated",
                              description: `Updated ${selectedTicketIds.length} ticket(s) to In Progress.`,
                              status: "success",
                              duration: 3000,
                            });
                          },
                        })
                      }>
                      Set In Progress
                    </MenuItem>
                    <MenuItem
                      _hover={{ bg: themeColors.subCardHover }}
                      color={themeColors.textPrimary}
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          title: "Confirm Status Change",
                          message: `Change status to "Pending (Waiting on Customer)" for ${selectedTicketIds.length} selected ticket(s)? This will pause their SLA clocks.`,
                          confirmLabel: "Update Status",
                          confirmColorScheme: "gray",
                          onConfirm: () => {
                            batchUpdateStatus(selectedTicketIds, "Pending (Waiting on Customer)");
                            setSelectedTicketIds([]);
                            toast({
                              title: "Status Updated",
                              description: `Updated ${selectedTicketIds.length} ticket(s) to Pending Customer.`,
                              status: "success",
                              duration: 3000,
                            });
                          },
                        })
                      }>
                      Set Pending Customer
                    </MenuItem>
                    <MenuItem
                      _hover={{ bg: themeColors.subCardHover }}
                      color={themeColors.textPrimary}
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          title: "Confirm Ticket Resolution",
                          message: `Mark ${selectedTicketIds.length} selected ticket(s) as "Resolved"?`,
                          confirmLabel: "Mark Resolved",
                          confirmColorScheme: "green",
                          onConfirm: () => {
                            batchUpdateStatus(selectedTicketIds, "Resolved");
                            setSelectedTicketIds([]);
                            toast({
                              title: "Tickets Resolved",
                              description: `Marked ${selectedTicketIds.length} ticket(s) as Resolved.`,
                              status: "success",
                              duration: 3000,
                            });
                          },
                        })
                      }>
                      Set Resolved
                    </MenuItem>
                    <MenuItem
                      _hover={{ bg: themeColors.subCardHover }}
                      color={themeColors.textPrimary}
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          title: "Confirm Ticket Closure",
                          message: `Close ${selectedTicketIds.length} selected ticket(s)? Closed tickets will be archived.`,
                          confirmLabel: "Close Tickets",
                          confirmColorScheme: "gray",
                          onConfirm: () => {
                            batchUpdateStatus(selectedTicketIds, "Closed");
                            setSelectedTicketIds([]);
                            toast({
                              title: "Tickets Closed",
                              description: `Closed ${selectedTicketIds.length} ticket(s).`,
                              status: "info",
                              duration: 3000,
                            });
                          },
                        })
                      }>
                      Set Closed
                    </MenuItem>
                  </MenuList>
                </Menu>

                {/* Batch Assign */}
                <Menu>
                  <MenuButton as={Button} size='sm' bg={themeColors.cardBg} border={`1px solid ${themeColors.borderLight}`} color={themeColors.textPrimary} _hover={{ bg: themeColors.subCardHover }} rightIcon={<FiChevronDown />}>
                    Assign Agent
                  </MenuButton>
                  <MenuList bg={themeColors.cardBg} borderColor={themeColors.borderLight} backdropFilter={themeColors.glassBackdrop}>
                    {users
                      .filter((u) => u.role !== "End User / Requester")
                      .map((u) => (
                        <MenuItem
                          key={u.id}
                          _hover={{ bg: themeColors.subCardHover }}
                          color={themeColors.textPrimary}
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              title: "Confirm Assignment",
                              message: `Assign ${selectedTicketIds.length} selected ticket(s) to ${u.name} (${u.team})?`,
                              confirmLabel: "Assign Tickets",
                              confirmColorScheme: "gray",
                              onConfirm: () => {
                                batchAssign(selectedTicketIds, u.id, u.team);
                                setSelectedTicketIds([]);
                                toast({
                                  title: "Tickets Assigned",
                                  description: `Assigned ${selectedTicketIds.length} ticket(s) to ${u.name}.`,
                                  status: "success",
                                  duration: 3000,
                                });
                              },
                            })
                          }>
                          {u.name} ({u.team})
                        </MenuItem>
                      ))}
                  </MenuList>
                </Menu>

                {/* Batch Delete */}
                <Button
                  size='sm'
                  colorScheme='red'
                  variant='outline'
                  leftIcon={<FiTrash2 />}
                  onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      title: "Confirm Permanent Deletion",
                      message: `Are you sure you want to permanently delete ${selectedTicketIds.length} selected ticket(s)? This will delete all conversation history, attachments, and time logs. This action CANNOT be undone.`,
                      confirmLabel: "Delete Permanently",
                      confirmColorScheme: "red",
                      onConfirm: () => {
                        batchDelete(selectedTicketIds);
                        setSelectedTicketIds([]);
                        toast({
                          title: "Tickets Deleted",
                          description: "Selected tickets have been permanently removed.",
                          status: "info",
                          duration: 3000,
                        });
                      },
                    })
                  }>
                  Delete
                </Button>
              </HStack>
            </Flex>
          )}

          {/* Ticket Table */}
          <Box overflowX='auto'>
            <Table variant='simple'>
              <Thead>
                <Tr borderBottom={`1px solid ${themeColors.borderLight}`}>
                  <Th w='40px' color={themeColors.textMuted} px='8px'>
                    <Checkbox
                      isChecked={selectedTicketIds.length === filteredTickets.length && filteredTickets.length > 0}
                      isIndeterminate={selectedTicketIds.length > 0 && selectedTicketIds.length < filteredTickets.length}
                      onChange={handleSelectAll}
                      colorScheme='gray'
                    />
                  </Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>ID & Subject</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Requester</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Priority</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Status</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Queue & Assignee</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>SLA Monitor</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Channel</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTickets.length === 0 ? (
                  <Tr>
                    <Td colSpan={8} textAlign='center' py='40px'>
                      <VStack spacing='12px'>
                        <Icon as={FiInbox} w='36px' h='36px' color={themeColors.textMuted} />
                        <Text color={themeColors.textSecondary} fontSize='md'>No tickets found matching your filter criteria.</Text>
                      </VStack>
                    </Td>
                  </Tr>
                ) : (
                  filteredTickets.map((ticket) => {
                    const statusStyle = getStatusBadge(ticket.status);
                    const priorityStyle = getPriorityBadge(ticket.priority);

                    return (
                      <Tr
                        key={ticket.id}
                        borderBottom={`1px solid ${themeColors.borderLight}`}
                        _hover={{ bg: themeColors.subCardHover, cursor: "pointer" }}
                        transition='0.15s ease'>
                        <Td px='8px' onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            isChecked={selectedTicketIds.includes(ticket.id)}
                            onChange={() => handleSelectOne(ticket.id)}
                            colorScheme='gray'
                          />
                        </Td>

                        {/* ID & Subject */}
                        <Td onClick={() => history.push(`/admin/tickets/${ticket.id}`)}>
                          <VStack align='flex-start' spacing='4px'>
                            <HStack>
                              <Badge
                                bg={themeColors.subCardBg}
                                color={themeColors.textPrimary}
                                border={`1px solid ${themeColors.borderMuted}`}
                                borderRadius='6px'
                                fontSize='11px'
                                px='6px'>
                                {ticket.id}
                              </Badge>
                              <Text color={themeColors.textPrimary} fontWeight='semibold' fontSize='sm' noOfLines={1} maxW='300px'>
                                {ticket.subject}
                              </Text>
                            </HStack>
                            <HStack spacing='6px'>
                              {ticket.tags.slice(0, 2).map((tag, idx) => (
                                <Tag key={idx} size='sm' bg={themeColors.subCardBg} color={themeColors.textSecondary} border={`1px solid ${themeColors.borderLight}`} borderRadius='4px' fontSize='10px'>
                                  #{tag}
                                </Tag>
                              ))}
                              {ticket.conversation.length > 1 && (
                                <HStack spacing='2px' color={themeColors.textMuted} fontSize='xs'>
                                  <Icon as={FiMessageSquare} w='11px' h='11px' />
                                  <Text fontSize='10px'>{ticket.conversation.length}</Text>
                                </HStack>
                              )}
                            </HStack>
                          </VStack>
                        </Td>

                        {/* Requester */}
                        <Td onClick={() => history.push(`/admin/tickets/${ticket.id}`)}>
                          <HStack spacing='8px'>
                            <Avatar size='xs' name={ticket.requester.name} src={ticket.requester.avatar} />
                            <Box>
                              <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='bold'>
                                {ticket.requester.name}
                              </Text>
                              <Text color={themeColors.textSecondary} fontSize='10px'>
                                {ticket.requester.company || ticket.requester.email}
                              </Text>
                            </Box>
                          </HStack>
                        </Td>

                        {/* Priority */}
                        <Td onClick={() => history.push(`/admin/tickets/${ticket.id}`)}>
                          <Badge
                            bg={priorityStyle.bg}
                            color={priorityStyle.color}
                            border={priorityStyle.border}
                            px='8px'
                            py='3px'
                            borderRadius='6px'
                            fontSize='10px'
                            fontWeight='bold'>
                            {ticket.priority}
                          </Badge>
                        </Td>

                        {/* Status */}
                        <Td onClick={() => history.push(`/admin/tickets/${ticket.id}`)}>
                          <Badge
                            bg={statusStyle.bg}
                            color={statusStyle.color}
                            border={statusStyle.border}
                            px='8px'
                            py='3px'
                            borderRadius='6px'
                            fontSize='10px'
                            textTransform='none'>
                            {ticket.status}
                          </Badge>
                        </Td>

                        {/* Queue & Assignee */}
                        <Td onClick={() => history.push(`/admin/tickets/${ticket.id}`)}>
                          <VStack align='flex-start' spacing='2px'>
                            <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='medium'>
                              {ticket.assignedTo ? ticket.assignedTo.name : "— Unassigned —"}
                            </Text>
                            <Text color={themeColors.textSecondary} fontSize='10px'>
                              {ticket.assignedTeam}
                            </Text>
                          </VStack>
                        </Td>

                        {/* SLA Monitor */}
                        <Td onClick={() => history.push(`/admin/tickets/${ticket.id}`)}>
                          <VStack align='flex-start' spacing='3px'>
                            <HStack spacing='4px'>
                              <Icon
                                as={ticket.sla.isPaused ? FiClock : ticket.sla.firstResponseMet ? FiCheckCircle : FiClock}
                                color={
                                  ticket.sla.isPaused
                                    ? "#ea580c"
                                    : ticket.sla.firstResponseMet
                                    ? "#16a34a"
                                    : themeColors.textPrimary
                                }
                                w='12px'
                                h='12px'
                              />
                              <Text
                                fontSize='11px'
                                fontWeight='semibold'
                                color={
                                  ticket.sla.isPaused
                                    ? "#ea580c"
                                    : ticket.sla.firstResponseMet
                                    ? "#16a34a"
                                    : themeColors.textPrimary
                                }>
                                {ticket.sla.isPaused
                                  ? "Clock Paused"
                                  : ticket.sla.firstResponseMet
                                  ? "Response Met"
                                  : "Due in 35m"}
                              </Text>
                            </HStack>
                            <Text fontSize='9px' color={themeColors.textMuted}>
                              Target: {new Date(ticket.sla.resolutionTarget).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Text>
                          </VStack>
                        </Td>

                        {/* Channel */}
                        <Td onClick={() => history.push(`/admin/tickets/${ticket.id}`)}>
                          <Badge bg={themeColors.subCardBg} color={themeColors.textSecondary} border={`1px solid ${themeColors.borderLight}`} fontSize='10px'>
                            {getChannelIcon(ticket.channel)}
                          </Badge>
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>

      {/* Create Ticket Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay backdropFilter='blur(8px)' />
        <ModalContent
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          color={themeColors.textPrimary}
          borderRadius='16px'>
          <ModalHeader borderBottom={`1px solid ${themeColors.borderLight}`} fontSize='md' fontWeight='bold'>
            Open a New Support Ticket
          </ModalHeader>
          <ModalCloseButton color={themeColors.textPrimary} />
          <form onSubmit={handleCreateTicketSubmit}>
            <ModalBody py='20px'>
              <VStack spacing='16px' align='stretch'>
                {/* Subject */}
                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Ticket Subject</FormLabel>
                  <Input
                    placeholder='e.g. SSO SAML Auth Certificate Renewal Failure'
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                </FormControl>

                {/* KB Deflection Box (Suggested solutions) */}
                {suggestedArticles.length > 0 && (
                  <Box p='12px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='12px'>
                    <HStack spacing='6px' mb='6px'>
                      <Icon as={FiBookOpen} color={themeColors.textPrimary} />
                      <Text fontSize='xs' color={themeColors.textPrimary} fontWeight='bold'>
                        Suggested Knowledge Base Solutions (Deflection):
                      </Text>
                    </HStack>
                    <VStack align='stretch' spacing='4px'>
                      {suggestedArticles.slice(0, 2).map((art) => (
                        <Flex key={art.id} justify='space-between' align='center' p='6px 8px' bg={themeColors.cardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='8px'>
                          <Text fontSize='xs' color={themeColors.textPrimary} noOfLines={1} maxW='80%'>
                            {art.title}
                          </Text>
                          <Button size='xs' variant='link' color={themeColors.textPrimary} fontWeight='bold' onClick={() => window.open(`#/admin/knowledge-base`, "_blank")}>
                            Read
                          </Button>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                )}

                {/* Description */}
                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Incident Details & Reproduction</FormLabel>
                  <Textarea
                    placeholder='Provide step-by-step reproduction steps, stack trace, error message, or customer impact...'
                    rows={4}
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </FormControl>

                {/* Category & Subcategory */}
                <SimpleGrid columns={2} spacing='12px'>
                  <FormControl>
                    <FormLabel fontSize='xs' color={themeColors.textSecondary}>Category</FormLabel>
                    <Select
                      bg={themeColors.inputBg}
                      borderColor={themeColors.inputBorder}
                      color={themeColors.textPrimary}
                      value={newCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name} style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize='xs' color={themeColors.textSecondary}>Subcategory</FormLabel>
                    <Select
                      bg={themeColors.inputBg}
                      borderColor={themeColors.inputBorder}
                      color={themeColors.textPrimary}
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}>
                      {categories
                        .find((c) => c.name === newCategory)
                        ?.subcategories.map((sub, idx) => (
                          <option key={idx} value={sub} style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>
                            {sub}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>

                {/* Priority & Severity */}
                <SimpleGrid columns={2} spacing='12px'>
                  <FormControl>
                    <FormLabel fontSize='xs' color={themeColors.textSecondary}>Priority Level</FormLabel>
                    <Select
                      bg={themeColors.inputBg}
                      borderColor={themeColors.inputBorder}
                      color={themeColors.textPrimary}
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}>
                      <option value='Low' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Low (General Question)</option>
                      <option value='Medium' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Medium (Normal Operations)</option>
                      <option value='High' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>High (Degraded Performance)</option>
                      <option value='Urgent/Critical' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Critical / Urgent (Blocker)</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize='xs' color={themeColors.textSecondary}>Severity Level</FormLabel>
                    <Select
                      bg={themeColors.inputBg}
                      borderColor={themeColors.inputBorder}
                      color={themeColors.textPrimary}
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value)}>
                      <option value='S1 - Critical Blocker' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>S1 - Critical Blocker</option>
                      <option value='S2 - Major Degraded' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>S2 - Major Degraded</option>
                      <option value='S3 - Moderate' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>S3 - Moderate</option>
                      <option value='S4 - Low' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>S4 - Low Inquiry</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>

                {/* Channel & Team Queue */}
                <SimpleGrid columns={2} spacing='12px'>
                  <FormControl>
                    <FormLabel fontSize='xs' color={themeColors.textSecondary}>Source Channel</FormLabel>
                    <Select
                      bg={themeColors.inputBg}
                      borderColor={themeColors.inputBorder}
                      color={themeColors.textPrimary}
                      value={newChannel}
                      onChange={(e) => setNewChannel(e.target.value)}>
                      <option value='Web portal / form' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Web portal / form</option>
                      <option value='Email-to-ticket' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Email-to-ticket</option>
                      <option value='Chat/live chat' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Chat / live chat</option>
                      <option value='Phone (manual entry)' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Phone (manual)</option>
                      <option value='API/integration' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>API / integration</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize='xs' color={themeColors.textSecondary}>Assigned Queue</FormLabel>
                    <Input
                      bg={themeColors.inputBg}
                      borderColor={themeColors.inputBorder}
                      color={themeColors.textPrimary}
                      value={newAssignedTeam}
                      onChange={(e) => setNewAssignedTeam(e.target.value)}
                    />
                  </FormControl>
                </SimpleGrid>

                {/* Tags */}
                <FormControl>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Tags (comma separated)</FormLabel>
                  <Input
                    placeholder='api, production, outage, urgent'
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter borderTop={`1px solid ${themeColors.borderLight}`}>
              <Button variant='ghost' mr={3} onClick={onClose} color={themeColors.textSecondary}>
                Cancel
              </Button>
              <Button type='submit' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }}>
                Submit & Route Ticket
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Confirmation Dialog Modal */}
      <Modal isOpen={confirmModal.isOpen} onClose={closeConfirmModal} isCentered size='md'>
        <ModalOverlay backdropFilter='blur(8px)' />
        <ModalContent
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          color={themeColors.textPrimary}
          borderRadius='16px'>
          <ModalHeader borderBottom={`1px solid ${themeColors.borderLight}`} fontSize='md'>
            <HStack spacing='8px'>
              <Icon
                as={confirmModal.confirmColorScheme === "red" ? FiAlertTriangle : FiCheckSquare}
                color={confirmModal.confirmColorScheme === "red" ? "#dc2626" : themeColors.textPrimary}
              />
              <Text fontWeight='bold'>{confirmModal.title}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color={themeColors.textPrimary} />
          <ModalBody py='20px'>
            <Text color={themeColors.textSecondary} fontSize='sm' lineHeight='1.6'>
              {confirmModal.message}
            </Text>
          </ModalBody>
          <ModalFooter borderTop={`1px solid ${themeColors.borderLight}`}>
            <Button variant='ghost' mr={3} onClick={closeConfirmModal} color={themeColors.textSecondary}>
              Cancel
            </Button>
            <Button
              bg={confirmModal.confirmColorScheme === "red" ? "#dc2626" : themeColors.buttonPrimaryBg}
              color='#fffdfd'
              _hover={{ bg: confirmModal.confirmColorScheme === "red" ? "#b91c1c" : themeColors.buttonPrimaryHover }}
              onClick={handleExecuteConfirm}>
              {confirmModal.confirmLabel || "Confirm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
