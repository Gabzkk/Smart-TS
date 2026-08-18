import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  HStack,
  VStack,
  Avatar,
  Icon,
  Tag,
  TagLabel,
  Input,
  Textarea,
  Select,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Checkbox,
  Divider,
  useToast,
  IconButton,
  Tooltip,
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
} from "@chakra-ui/react";
import { useParams, useHistory } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiSend,
  FiLock,
  FiPaperclip,
  FiTag,
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiCheck,
  FiAlertTriangle,
  FiChevronDown,
  FiMessageSquare,
  FiPlus,
  FiCopy,
  FiZap,
} from "react-icons/fi";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { useTickets } from "context/TicketContext";

export default function TicketDetail() {
  const { id } = useParams();
  const history = useHistory();
  const toast = useToast();

  const {
    tickets,
    users,
    macros,
    currentUser,
    updateTicketStatus,
    assignTicket,
    addComment,
    toggleSubtask,
    addSubtask,
    logTime,
    mergeTickets,
    themeColors,
    isDark,
  } = useTickets();

  const ticket = tickets.find((t) => t.id === id);

  // Conversation Composer
  const [replyMessage, setReplyMessage] = useState("");
  const [replyTab, setReplyTab] = useState(0); // 0: Public, 1: Internal
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Subtask Input
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  // Workbench Stopwatch
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [manualTimeMinutes, setManualTimeMinutes] = useState("");
  const [manualTimeNote, setManualTimeNote] = useState("");

  // Merge modal
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [mergeTargetId, setMergeTargetId] = useState("");
  const [mergeNote, setMergeNote] = useState("");

  // Tab Index for main panel
  const [activeMainTab, setActiveMainTab] = useState(0);

  // Stopwatch effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((sec) => sec + 1);
      }, 1000);
    } else if (!isTimerRunning && elapsedSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, elapsedSeconds]);

  // Handle Stop & Save Timer
  const handleStopAndLogTimer = () => {
    setIsTimerRunning(false);
    if (elapsedSeconds < 10) return;
    const mins = Math.max(1, Math.round(elapsedSeconds / 60));
    logTime(ticket.id, mins, "Live stopwatch tracking session");
    setElapsedSeconds(0);
    toast({
      title: "Time Log Saved",
      description: `Recorded ${mins} min(s) to workbench activity.`,
      status: "success",
      duration: 3000,
    });
  };

  // Handle Manual Time Log
  const handleManualTimeSubmit = (e) => {
    e.preventDefault();
    const mins = parseInt(manualTimeMinutes, 10);
    if (!mins || mins <= 0) return;

    logTime(ticket.id, mins, manualTimeNote || "Manual time entry");
    setManualTimeMinutes("");
    setManualTimeNote("");
    toast({
      title: "Time Log Saved",
      description: `Logged ${mins} minutes.`,
      status: "success",
      duration: 3000,
    });
  };

  // Handle Subtask Add
  const handleAddSubtaskSubmit = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(ticket.id, newSubtaskTitle.trim());
    setNewSubtaskTitle("");
  };

  // Handle Reply Submit
  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    setIsSubmittingReply(true);

    setTimeout(() => {
      const isInternal = replyTab === 1;
      addComment(ticket.id, {
        author: currentUser,
        isInternal,
        message: replyMessage,
        type: isInternal ? "internal_note" : "reply",
      });

      setReplyMessage("");
      setIsSubmittingReply(false);
      toast({
        title: isInternal ? "Internal Note Appended" : "Public Customer Response Sent",
        description: isInternal
          ? "Visible only to authorized support agents."
          : "Dispatched to customer notification channel.",
        status: "success",
        duration: 3000,
      });
    }, 300);
  };

  // Apply Macro
  const handleApplyMacro = (m) => {
    let replacedText = m.text
      .replace(/{{requester_name}}/g, ticket.requester.name)
      .replace(/{{ticket_id}}/g, ticket.id)
      .replace(/{{agent_name}}/g, currentUser.name);

    setReplyMessage((prev) => (prev ? `${prev}\n\n${replacedText}` : replacedText));
    toast({
      title: `Applied Macro: ${m.title}`,
      status: "info",
      duration: 2000,
    });
  };

  // Merge Ticket
  const handleExecuteMerge = () => {
    if (!mergeTargetId || mergeTargetId === ticket.id) {
      toast({
        title: "Invalid Target Ticket",
        description: "Please specify a distinct valid ticket ID to merge into.",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    mergeTickets(ticket.id, mergeTargetId);
    setIsMergeModalOpen(false);
    toast({
      title: "Tickets Merged",
      description: `Merged ${ticket.id} into ${mergeTargetId}. Redirecting...`,
      status: "success",
      duration: 3000,
    });
    history.push(`/admin/tickets/${mergeTargetId}`);
  };

  if (!ticket) {
    return (
      <Flex direction='column' pt={{ base: "120px", md: "75px" }} align='center' justify='center' minH='400px'>
        <Icon as={FiAlertTriangle} w='48px' h='48px' color={themeColors.textMuted} mb='16px' />
        <Text fontSize='lg' color={themeColors.textPrimary} fontWeight='bold'>
          Ticket Not Found
        </Text>
        <Text color={themeColors.textSecondary} fontSize='sm' mb='20px'>
          The ticket identifier "{id}" does not exist in the active queue database.
        </Text>
        <Button leftIcon={<FiArrowLeft />} bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} onClick={() => history.push("/admin/tickets")}>
          Back to Ticket Queue
        </Button>
      </Flex>
    );
  }

  // Format Stopwatch Display
  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }} gap='20px'>
      {/* Top Breadcrumb & Quick Action Workbench Bar */}
      <Card
        p='18px 24px'
        bg={themeColors.cardBg}
        border={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        borderRadius='16px'
        boxShadow={themeColors.cardShadow}>
        <Flex direction={{ base: "column", lg: "row" }} justify='space-between' align={{ base: "flex-start", lg: "center" }} gap='16px'>
          <HStack spacing='14px'>
            <Button
              size='sm'
              variant='outline'
              borderColor={themeColors.borderMuted}
              color={themeColors.textPrimary}
              _hover={{ bg: themeColors.subCardBg }}
              leftIcon={<FiArrowLeft />}
              onClick={() => history.push("/admin/tickets")}>
              Queue
            </Button>
            <Box>
              <HStack spacing='10px' mb='2px'>
                <Badge bg={themeColors.subCardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderMuted}`} fontSize='xs' px='8px' py='2px' borderRadius='6px'>
                  {ticket.id}
                </Badge>
                <Text fontSize='lg' color={themeColors.textPrimary} fontWeight='bold' noOfLines={1} maxW={{ base: "260px", md: "500px" }}>
                  {ticket.subject}
                </Text>
              </HStack>
              <Text fontSize='xs' color={themeColors.textSecondary}>
                Channel: {ticket.channel} • Created {new Date(ticket.createdAt).toLocaleString()}
              </Text>
            </Box>
          </HStack>

          {/* Quick Lifecycle Status Dropdown */}
          <HStack spacing='12px'>
            <Select
              size='sm'
              w='180px'
              bg={themeColors.inputBg}
              borderColor={themeColors.inputBorder}
              color={themeColors.textPrimary}
              borderRadius='10px'
              fontWeight='bold'
              value={ticket.status}
              onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}>
              <option value='New' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Status: New</option>
              <option value='Open' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Status: Open</option>
              <option value='In Progress' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Status: In Progress</option>
              <option value='Pending (Waiting on Customer)' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Pending (Customer)</option>
              <option value='Pending (Waiting on Third Party)' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Pending (3rd Party)</option>
              <option value='On Hold' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Status: On Hold</option>
              <option value='Resolved' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Status: Resolved</option>
              <option value='Closed' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>Status: Closed</option>
            </Select>

            <Button
              size='sm'
              variant='outline'
              borderColor={themeColors.borderMuted}
              color={themeColors.textPrimary}
              _hover={{ bg: themeColors.subCardBg }}
              leftIcon={<FiCopy />}
              onClick={() => setIsMergeModalOpen(true)}>
              Merge
            </Button>
          </HStack>
        </Flex>
      </Card>

      {/* Main Grid: 2/3 Conversation & Workbench + 1/3 Metadata Sidebar */}
      <SimpleGrid columns={{ base: 1, lg: 12 }} spacing='20px' alignItems='start'>
        {/* Left Side: Conversation Stream, Composer, Subtasks (8 cols) */}
        <Box gridColumn={{ base: "span 1", lg: "span 8" }}>
          <VStack spacing='20px' align='stretch'>
            {/* Conversation Stream Card */}
            <Card
              bg={themeColors.cardBg}
              border={`1px solid ${themeColors.cardBorder}`}
              backdropFilter={themeColors.glassBackdrop}
              borderRadius='16px'
              boxShadow={themeColors.cardShadow}
              p='24px'>
              <CardHeader mb='18px'>
                <Flex justify='space-between' align='center' w='100%'>
                  <HStack spacing='8px'>
                    <Icon as={FiMessageSquare} color={themeColors.textPrimary} />
                    <Text fontSize='md' color={themeColors.textPrimary} fontWeight='bold'>
                      Conversation Stream ({ticket.conversation.length} events)
                    </Text>
                  </HStack>
                  <HStack spacing='6px'>
                    <Badge bg={themeColors.subCardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`}>Public Responses</Badge>
                    <Badge bg={isDark ? "rgba(234, 179, 8, 0.15)" : "#fef9c3"} color='#ca8a04' border='1px solid #fde047'>Internal Agent Notes</Badge>
                  </HStack>
                </Flex>
              </CardHeader>

              <CardBody direction='column'>
                <VStack spacing='16px' align='stretch'>
                  {ticket.conversation.map((entry) => {
                    const isNote = entry.isInternal;
                    return (
                      <Box
                        key={entry.id}
                        p='16px'
                        borderRadius='14px'
                        bg={
                          isNote
                            ? isDark ? "rgba(234, 179, 8, 0.1)" : "#fffbeb"
                            : themeColors.subCardBg
                        }
                        border={
                          isNote
                            ? isDark ? "1px solid rgba(234, 179, 8, 0.3)" : "1px solid #fde68a"
                            : `1px solid ${themeColors.borderLight}`
                        }>
                        <Flex justify='space-between' align='flex-start' mb='8px'>
                          <HStack spacing='10px'>
                            <Avatar size='xs' name={entry.author.name} src={entry.author.avatar} />
                            <Box>
                              <HStack spacing='6px'>
                                <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='bold'>
                                  {entry.author.name}
                                </Text>
                                <Badge
                                  bg={themeColors.cardBg}
                                  color={themeColors.textPrimary}
                                  border={`1px solid ${themeColors.borderLight}`}
                                  fontSize='9px'>
                                  {entry.author.role}
                                </Badge>
                              </HStack>
                              <Text color={themeColors.textMuted} fontSize='10px'>
                                {new Date(entry.timestamp).toLocaleString()}
                              </Text>
                            </Box>
                          </HStack>

                          {isNote && (
                            <Badge bg={isDark ? "rgba(234, 179, 8, 0.2)" : "#fef08a"} color='#854d0e' border='1px solid #facc15' fontSize='10px'>
                              <HStack spacing='4px'><Icon as={FiLock} w='10px' h='10px' /><Text>Internal Note</Text></HStack>
                            </Badge>
                          )}
                        </Flex>

                        <Text color={themeColors.textPrimary} fontSize='sm' whiteSpace='pre-wrap' lineHeight='1.6'>
                          {entry.message}
                        </Text>
                      </Box>
                    );
                  })}
                </VStack>

                {/* Reply Composer */}
                <Box mt='24px' pt='20px' borderTop={`1px solid ${themeColors.borderLight}`}>
                  <Tabs index={replyTab} onChange={(idx) => setReplyTab(idx)} variant='unstyled' mb='10px'>
                    <TabList gap='10px'>
                      <Tab
                        _selected={{ bg: themeColors.buttonPrimaryBg, color: themeColors.buttonPrimaryColor }}
                        bg={themeColors.subCardBg}
                        color={themeColors.textSecondary}
                        border={`1px solid ${themeColors.borderLight}`}
                        borderRadius='10px'
                        fontSize='xs'
                        fontWeight='bold'
                        px='14px'
                        py='6px'>
                        Public Customer Reply
                      </Tab>
                      <Tab
                        _selected={{ bg: isDark ? "rgba(234, 179, 8, 0.25)" : "#fef08a", color: "#854d0e", border: "1px solid #eab308" }}
                        bg={themeColors.subCardBg}
                        color={themeColors.textSecondary}
                        border={`1px solid ${themeColors.borderLight}`}
                        borderRadius='10px'
                        fontSize='xs'
                        fontWeight='bold'
                        px='14px'
                        py='6px'>
                        <HStack spacing='4px'><Icon as={FiLock} /><Text>Internal Agent Note</Text></HStack>
                      </Tab>
                    </TabList>
                  </Tabs>

                  {/* Macro Toolbar */}
                  <Flex justify='space-between' align='center' mb='10px'>
                    <Menu>
                      <MenuButton as={Button} size='xs' variant='outline' borderColor={themeColors.borderMuted} color={themeColors.textPrimary} _hover={{ bg: themeColors.subCardBg }} leftIcon={<FiZap />} rightIcon={<FiChevronDown />}>
                        Insert Canned Macro
                      </MenuButton>
                      <MenuList bg={themeColors.cardBg} borderColor={themeColors.borderLight} backdropFilter={themeColors.glassBackdrop}>
                        {macros.map((m) => (
                          <MenuItem key={m.id} _hover={{ bg: themeColors.subCardHover }} color={themeColors.textPrimary} onClick={() => handleApplyMacro(m)}>
                            <Box>
                              <Text fontSize='xs' fontWeight='bold'>{m.title} ({m.shortcut})</Text>
                              <Text fontSize='10px' color={themeColors.textSecondary} noOfLines={1}>{m.text}</Text>
                            </Box>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                    <Text fontSize='10px' color={themeColors.textMuted}>
                      {replyTab === 1 ? "Visible to team only" : "Will email/notify customer"}
                    </Text>
                  </Flex>

                  <Textarea
                    rows={4}
                    placeholder={
                      replyTab === 1
                        ? "Type internal handover notes, reproduction logs, triage info..."
                        : "Type customer response... (use macros above for instant canned answers)"
                    }
                    bg={replyTab === 1 ? (isDark ? "rgba(234, 179, 8, 0.08)" : "#fffbeb") : themeColors.inputBg}
                    borderColor={replyTab === 1 ? (isDark ? "rgba(234, 179, 8, 0.3)" : "#fde68a") : themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    borderRadius='12px'
                    fontSize='sm'
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    mb='12px'
                  />

                  <Flex justify='flex-end'>
                    <Button
                      bg={replyTab === 1 ? "#ca8a04" : themeColors.buttonPrimaryBg}
                      color='#fffdfd'
                      _hover={{ bg: replyTab === 1 ? "#a16207" : themeColors.buttonPrimaryHover }}
                      borderRadius='10px'
                      px='20px'
                      isLoading={isSubmittingReply}
                      leftIcon={<FiSend />}
                      onClick={handleSendReply}>
                      {replyTab === 1 ? "Save Internal Note" : "Send Response"}
                    </Button>
                  </Flex>
                </Box>
              </CardBody>
            </Card>

            {/* Subtasks / Checklist Card */}
            <Card
              bg={themeColors.cardBg}
              border={`1px solid ${themeColors.cardBorder}`}
              backdropFilter={themeColors.glassBackdrop}
              borderRadius='16px'
              boxShadow={themeColors.cardShadow}
              p='20px'>
              <Flex justify='space-between' align='center' mb='14px'>
                <HStack spacing='8px'>
                  <Icon as={FiCheck} color={themeColors.textPrimary} />
                  <Text fontSize='md' color={themeColors.textPrimary} fontWeight='bold'>
                    Resolution Checklist & Subtasks ({ticket.subtasks.filter((s) => s.completed).length}/{ticket.subtasks.length})
                  </Text>
                </HStack>
              </Flex>

              <VStack align='stretch' spacing='10px' mb='14px'>
                {ticket.subtasks.map((st) => (
                  <Flex
                    key={st.id}
                    p='10px 14px'
                    bg={themeColors.subCardBg}
                    border={`1px solid ${themeColors.borderLight}`}
                    borderRadius='10px'
                    justify='space-between'
                    align='center'>
                    <Checkbox
                      isChecked={st.completed}
                      onChange={() => toggleSubtask(ticket.id, st.id)}
                      colorScheme='gray'>
                      <Text
                        color={st.completed ? themeColors.textMuted : themeColors.textPrimary}
                        textDecoration={st.completed ? "line-through" : "none"}
                        fontSize='xs'
                        fontWeight='medium'>
                        {st.title}
                      </Text>
                    </Checkbox>
                    <Badge bg={st.completed ? (isDark ? "rgba(22, 163, 74, 0.2)" : "#f0fdf4") : themeColors.cardBg} color={st.completed ? "#16a34a" : themeColors.textMuted} border={`1px solid ${themeColors.borderLight}`} fontSize='9px'>
                      {st.completed ? "Done" : "Pending"}
                    </Badge>
                  </Flex>
                ))}
              </VStack>

              {/* Add Subtask Input */}
              <form onSubmit={handleAddSubtaskSubmit}>
                <HStack spacing='8px'>
                  <Input
                    placeholder='Add diagnostic or triage subtask...'
                    size='sm'
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    borderRadius='10px'
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  />
                  <Button type='submit' size='sm' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }} leftIcon={<FiPlus />}>
                    Add
                  </Button>
                </HStack>
              </form>
            </Card>
          </VStack>
        </Box>

        {/* Right Side: SLA Timer, Requester Card, Metadata, Time Logs (4 cols) */}
        <Box gridColumn={{ base: "span 1", lg: "span 4" }}>
          <VStack spacing='20px' align='stretch'>
            {/* Live Stopwatch & Time Tracker */}
            <Card
              bg={themeColors.cardBg}
              border={`1px solid ${themeColors.cardBorder}`}
              backdropFilter={themeColors.glassBackdrop}
              borderRadius='16px'
              boxShadow={themeColors.cardShadow}
              p='20px'>
              <Flex justify='space-between' align='center' mb='10px'>
                <Text fontSize='sm' color={themeColors.textPrimary} fontWeight='bold'>
                  Live Workbench Stopwatch
                </Text>
                <Badge bg={themeColors.subCardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`}>
                  {ticket.timeSpentMinutes} mins total
                </Badge>
              </Flex>

              <Flex justify='center' align='center' py='12px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='12px' mb='12px'>
                <Text fontSize='28px' fontFamily='mono' color={themeColors.textPrimary} fontWeight='bold'>
                  {formatTimer(elapsedSeconds)}
                </Text>
              </Flex>

              <HStack spacing='10px' mb='14px'>
                {!isTimerRunning ? (
                  <Button size='sm' flex='1' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }} leftIcon={<FiPlay />} onClick={() => setIsTimerRunning(true)}>
                    Start Timer
                  </Button>
                ) : (
                  <Button size='sm' flex='1' colorScheme='orange' leftIcon={<FiPause />} onClick={handleStopAndLogTimer}>
                    Stop & Log Time
                  </Button>
                )}
                <Button size='sm' variant='outline' borderColor={themeColors.borderMuted} color={themeColors.textPrimary} _hover={{ bg: themeColors.subCardBg }} onClick={() => { setIsTimerRunning(false); setElapsedSeconds(0); }}>
                  Reset
                </Button>
              </HStack>

              {/* Manual Time Log Dropdown */}
              <form onSubmit={handleManualTimeSubmit}>
                <HStack spacing='6px'>
                  <Input
                    size='xs'
                    type='number'
                    placeholder='Mins'
                    w='70px'
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={manualTimeMinutes}
                    onChange={(e) => setManualTimeMinutes(e.target.value)}
                  />
                  <Input
                    size='xs'
                    placeholder='Activity note...'
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={manualTimeNote}
                    onChange={(e) => setManualTimeNote(e.target.value)}
                  />
                  <Button size='xs' type='submit' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }}>
                    Log
                  </Button>
                </HStack>
              </form>
            </Card>

            {/* Requester Profile Card */}
            <Card
              bg={themeColors.cardBg}
              border={`1px solid ${themeColors.cardBorder}`}
              backdropFilter={themeColors.glassBackdrop}
              borderRadius='16px'
              boxShadow={themeColors.cardShadow}
              p='20px'>
              <Text fontSize='sm' color={themeColors.textPrimary} fontWeight='bold' mb='12px'>
                Customer & Requester
              </Text>
              <HStack spacing='12px' mb='12px'>
                <Avatar size='md' name={ticket.requester.name} src={ticket.requester.avatar} />
                <Box>
                  <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm'>
                    {ticket.requester.name}
                  </Text>
                  <Text color={themeColors.textSecondary} fontSize='xs'>
                    {ticket.requester.email}
                  </Text>
                  <Badge bg={themeColors.subCardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`} fontSize='10px' mt='2px'>
                    {ticket.requester.company || "Enterprise Tier"}
                  </Badge>
                </Box>
              </HStack>
            </Card>

            {/* SLA Target Monitor */}
            <Card
              bg={themeColors.cardBg}
              border={`1px solid ${themeColors.cardBorder}`}
              backdropFilter={themeColors.glassBackdrop}
              borderRadius='16px'
              boxShadow={themeColors.cardShadow}
              p='20px'>
              <Text fontSize='sm' color={themeColors.textPrimary} fontWeight='bold' mb='12px'>
                SLA Policy Monitor
              </Text>
              <VStack align='stretch' spacing='10px' fontSize='xs'>
                <Flex justify='space-between'>
                  <Text color={themeColors.textSecondary}>First Response Target:</Text>
                  <Text color={ticket.sla.firstResponseMet ? "#16a34a" : themeColors.textPrimary} fontWeight='bold'>
                    {ticket.sla.firstResponseMet ? "Met within 18m" : "Due in 35m"}
                  </Text>
                </Flex>
                <Flex justify='space-between'>
                  <Text color={themeColors.textSecondary}>Resolution Target:</Text>
                  <Text color={themeColors.textPrimary} fontWeight='bold'>
                    {new Date(ticket.sla.resolutionTarget).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </Flex>
                <Flex justify='space-between'>
                  <Text color={themeColors.textSecondary}>SLA Clock Status:</Text>
                  <Badge bg={ticket.sla.isPaused ? (isDark ? "rgba(234, 88, 12, 0.2)" : "#fff7ed") : (isDark ? "rgba(22, 163, 74, 0.2)" : "#f0fdf4")} color={ticket.sla.isPaused ? "#ea580c" : "#16a34a"} border={`1px solid ${themeColors.borderLight}`}>
                    {ticket.sla.isPaused ? "Paused (Pending Customer)" : "Active Running"}
                  </Badge>
                </Flex>
              </VStack>
            </Card>

            {/* Ticket Properties / Routing Card */}
            <Card
              bg={themeColors.cardBg}
              border={`1px solid ${themeColors.cardBorder}`}
              backdropFilter={themeColors.glassBackdrop}
              borderRadius='16px'
              boxShadow={themeColors.cardShadow}
              p='20px'>
              <Text fontSize='sm' color={themeColors.textPrimary} fontWeight='bold' mb='14px'>
                Ticket Attributes
              </Text>
              <VStack align='stretch' spacing='12px'>
                {/* Assignee */}
                <Box>
                  <Text color={themeColors.textSecondary} fontSize='xs' mb='4px'>Assigned Agent:</Text>
                  <Select
                    size='sm'
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    borderRadius='10px'
                    value={ticket.assignedTo?.id || ""}
                    onChange={(e) => assignTicket(ticket.id, e.target.value, ticket.assignedTeam)}>
                    <option value='' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>— Unassigned —</option>
                    {users
                      .filter((u) => u.role !== "End User / Requester")
                      .map((u) => (
                        <option key={u.id} value={u.id} style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>
                          {u.name} ({u.team})
                        </option>
                      ))}
                  </Select>
                </Box>

                {/* Team */}
                <Box>
                  <Text color={themeColors.textSecondary} fontSize='xs' mb='4px'>Queue / Team:</Text>
                  <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='bold' p='6px 10px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='8px'>
                    {ticket.assignedTeam}
                  </Text>
                </Box>

                {/* Priority */}
                <Box>
                  <Text color={themeColors.textSecondary} fontSize='xs' mb='4px'>Priority:</Text>
                  <Badge
                    bg={ticket.priority === "Urgent/Critical" ? (isDark ? "rgba(220, 38, 38, 0.2)" : "#fef2f2") : themeColors.subCardBg}
                    color={ticket.priority === "Urgent/Critical" ? "#dc2626" : themeColors.textPrimary}
                    border={`1px solid ${themeColors.borderLight}`}
                    p='4px 8px'
                    borderRadius='6px'>
                    {ticket.priority} • {ticket.severity}
                  </Badge>
                </Box>

                {/* Tags */}
                <Box>
                  <Text color={themeColors.textSecondary} fontSize='xs' mb='4px'>Tags:</Text>
                  <HStack spacing='4px' wrap='wrap'>
                    {ticket.tags.map((tag, idx) => (
                      <Tag key={idx} size='sm' bg={themeColors.subCardBg} color={themeColors.textSecondary} border={`1px solid ${themeColors.borderLight}`} borderRadius='4px'>
                        <TagLabel>#{tag}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              </VStack>
            </Card>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Merge Modal */}
      <Modal isOpen={isMergeModalOpen} onClose={() => setIsMergeModalOpen(false)} size='md'>
        <ModalOverlay backdropFilter='blur(8px)' />
        <ModalContent
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          color={themeColors.textPrimary}
          borderRadius='16px'>
          <ModalHeader borderBottom={`1px solid ${themeColors.borderLight}`}>Merge Ticket {ticket.id}</ModalHeader>
          <ModalCloseButton color={themeColors.textPrimary} />
          <ModalBody py='20px'>
            <VStack spacing='14px' align='stretch'>
              <Text fontSize='xs' color={themeColors.textSecondary}>
                Merging will close <strong>{ticket.id}</strong>, append all conversation items and subtasks to the target ticket, and notify participants.
              </Text>
              <FormControl isRequired>
                <FormLabel fontSize='xs' color={themeColors.textSecondary}>Target Ticket ID</FormLabel>
                <Select
                  bg={themeColors.inputBg}
                  borderColor={themeColors.inputBorder}
                  color={themeColors.textPrimary}
                  value={mergeTargetId}
                  onChange={(e) => setMergeTargetId(e.target.value)}>
                  <option value='' style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>— Select Target Ticket —</option>
                  {tickets
                    .filter((t) => t.id !== ticket.id)
                    .map((t) => (
                      <option key={t.id} value={t.id} style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>
                        {t.id} - {t.subject.slice(0, 40)}...
                      </option>
                    ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter borderTop={`1px solid ${themeColors.borderLight}`}>
            <Button variant='ghost' mr={3} onClick={() => setIsMergeModalOpen(false)} color={themeColors.textSecondary}>
              Cancel
            </Button>
            <Button bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }} onClick={handleExecuteMerge}>
              Confirm Merge
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
