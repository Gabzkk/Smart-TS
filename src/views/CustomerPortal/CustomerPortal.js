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
  Textarea,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Icon,
  useToast,
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
  Divider,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiBookOpen,
  FiClock,
  FiArrowRight,
  FiThumbsUp,
  FiThumbsDown,
  FiInbox,
  FiCheckCircle,
  FiHelpCircle,
  FiEye,
  FiLayers,
} from "react-icons/fi";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { useTickets } from "context/TicketContext";

export default function CustomerPortal() {
  const history = useHistory();
  const toast = useToast();
  const {
    tickets,
    currentUser,
    knowledgeArticles,
    rateKnowledgeArticle,
    createTicket,
    categories,
    themeColors,
    isDark,
  } = useTickets();

  // Search KB
  const [kbSearchQuery, setKbSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedArticle, setSelectedArticle] = useState(null);

  // New Request Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reqSubject, setReqSubject] = useState("");
  const [reqDescription, setReqDescription] = useState("");
  const [reqCategory, setReqCategory] = useState("API & Integrations");
  const [reqSubcategory, setReqSubcategory] = useState("Webhooks Failure");
  const [reqPriority, setReqPriority] = useState("Medium");

  // Filtered KB Articles
  const filteredArticles = useMemo(() => {
    return knowledgeArticles.filter((a) => {
      if (selectedCategory !== "ALL" && a.category !== selectedCategory) return false;
      if (kbSearchQuery.trim()) {
        const q = kbSearchQuery.toLowerCase();
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchSummary = a.summary.toLowerCase().includes(q);
        const matchTag = a.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchTag) return false;
      }
      return true;
    });
  }, [knowledgeArticles, kbSearchQuery, selectedCategory]);

  // Customer's Tickets
  const customerTickets = useMemo(() => {
    if (currentUser.role === "End User / Requester") {
      return tickets.filter((t) => t.requester.id === currentUser.id);
    }
    return tickets.slice(0, 4);
  }, [tickets, currentUser]);

  // Handle New Ticket Submit
  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!reqSubject.trim() || !reqDescription.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter a subject and detailed description.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    const created = createTicket({
      subject: reqSubject,
      description: reqDescription,
      category: reqCategory,
      subcategory: reqSubcategory,
      priority: reqPriority,
      channel: "Web portal / form",
      assignedTeam: "Tier 1 Support Queue",
      tags: ["portal", "customer-created"],
    });

    toast({
      title: "Support Request Submitted",
      description: `Request ${created.id} is now queued for triage.`,
      status: "success",
      duration: 4000,
    });

    setReqSubject("");
    setReqDescription("");
    onClose();
  };

  // 4-Step Status Index
  const getTimelineStep = (status) => {
    switch (status) {
      case "New":
        return 1;
      case "Open":
      case "In Progress":
        return 2;
      case "Pending (Waiting on Customer)":
      case "Pending (Waiting on Third Party)":
      case "On Hold":
        return 3;
      case "Resolved":
      case "Closed":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }} gap='24px' w='100%'>
      {/* Hero Welcome & Search Banner */}
      <Card
        p={{ base: "20px", md: "32px" }}
        bg={themeColors.cardBg}
        border={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        borderRadius='18px'
        boxShadow={themeColors.cardShadow}
        w='100%'>
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify='space-between'
          align={{ base: "flex-start", lg: "center" }}
          gap='24px'>
          <Box maxW='620px'>
            <HStack spacing='8px' mb='8px'>
              <Badge
                bg={themeColors.subCardBg}
                color={themeColors.textPrimary}
                border={`1px solid ${themeColors.borderLight}`}
                px='10px'
                py='3px'
                borderRadius='8px'
                fontSize='xs'
                fontWeight='bold'>
                CUSTOMER SELF-SERVICE HUB
              </Badge>
              <Badge
                bg={themeColors.buttonPrimaryBg}
                color={themeColors.buttonPrimaryColor}
                px='8px'
                py='3px'
                borderRadius='8px'
                fontSize='xs'>
                {currentUser.company || "Enterprise Support"}
              </Badge>
            </HStack>
            <Text
              fontSize={{ base: "22px", md: "28px" }}
              color={themeColors.textPrimary}
              fontWeight='extrabold'
              lineHeight='1.2'
              mb='8px'>
              Welcome, {currentUser.name}
            </Text>
            <Text fontSize='sm' color={themeColors.textSecondary} lineHeight='1.6'>
              Search knowledge base documentation, track your existing support requests, or submit a new technical inquiry.
            </Text>
          </Box>

          <HStack spacing='12px' w={{ base: "100%", lg: "auto" }}>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              bg={themeColors.buttonPrimaryBg}
              color={themeColors.buttonPrimaryColor}
              _hover={{ bg: themeColors.buttonPrimaryHover }}
              borderRadius='12px'
              px='22px'
              h='44px'
              w={{ base: "100%", sm: "auto" }}
              onClick={onOpen}>
              Submit New Request
            </Button>
          </HStack>
        </Flex>
      </Card>

      {/* Symmetrically Aligned 2-Column Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing='24px' alignItems='stretch' w='100%'>
        {/* Left Panel: My Support Requests */}
        <Card
          h='100%'
          display='flex'
          flexDirection='column'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          borderRadius='18px'
          boxShadow={themeColors.cardShadow}
          p='24px'>
          <CardHeader mb='18px' minH='44px' p='0'>
            <Flex justify='space-between' align='center' w='100%'>
              <HStack spacing='10px'>
                <Flex
                  w='36px'
                  h='36px'
                  borderRadius='10px'
                  bg={themeColors.subCardBg}
                  border={`1px solid ${themeColors.borderLight}`}
                  justify='center'
                  align='center'
                  color={themeColors.textPrimary}>
                  <Icon as={FiInbox} w='18px' h='18px' />
                </Flex>
                <Box>
                  <Text fontSize='md' color={themeColors.textPrimary} fontWeight='bold' lineHeight='1.2'>
                    My Support Requests
                  </Text>
                  <Text fontSize='xs' color={themeColors.textSecondary}>
                    {customerTickets.length} active ticket(s) tracked
                  </Text>
                </Box>
              </HStack>
              <Badge
                bg={themeColors.subCardBg}
                color={themeColors.textPrimary}
                border={`1px solid ${themeColors.borderLight}`}
                px='10px'
                py='4px'
                borderRadius='8px'
                fontSize='xs'>
                Live Updates
              </Badge>
            </Flex>
          </CardHeader>

          <CardBody flexDirection='column' p='0' flex='1'>
            <VStack spacing='14px' align='stretch' flex='1' maxH='560px' overflowY='auto' pr='4px'>
              {customerTickets.length === 0 ? (
                <Flex
                  direction='column'
                  align='center'
                  justify='center'
                  p='40px'
                  bg={themeColors.subCardBg}
                  borderRadius='14px'
                  border={`1px dashed ${themeColors.borderLight}`}>
                  <Icon as={FiInbox} w='32px' h='32px' color={themeColors.textMuted} mb='8px' />
                  <Text color={themeColors.textSecondary} fontSize='sm'>You have no open support requests.</Text>
                </Flex>
              ) : (
                customerTickets.map((t) => {
                  const step = getTimelineStep(t.status);
                  return (
                    <Box
                      key={t.id}
                      p='16px'
                      bg={themeColors.subCardBg}
                      border={`1px solid ${themeColors.subCardBorder}`}
                      borderRadius='14px'
                      _hover={{ borderColor: themeColors.textPrimary, bg: themeColors.subCardHover, cursor: "pointer" }}
                      transition='0.2s ease'
                      onClick={() => history.push(`/admin/tickets/${t.id}`)}>
                      <Flex justify='space-between' align='flex-start' mb='10px' gap='8px'>
                        <VStack align='flex-start' spacing='4px' maxW='72%'>
                          <HStack spacing='8px'>
                            <Badge
                              bg={themeColors.inputBg}
                              color={themeColors.textPrimary}
                              border={`1px solid ${themeColors.borderMuted}`}
                              borderRadius='6px'
                              fontSize='11px'
                              px='6px'>
                              {t.id}
                            </Badge>
                            <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm' noOfLines={1}>
                              {t.subject}
                            </Text>
                          </HStack>
                          <Text color={themeColors.textSecondary} fontSize='11px'>
                            {t.category} › {t.subcategory}
                          </Text>
                        </VStack>

                        <Badge
                          bg={
                            t.status === "Resolved" || t.status === "Closed"
                              ? isDark ? "rgba(22, 163, 74, 0.2)" : "#f0fdf4"
                              : t.status.startsWith("Pending")
                              ? isDark ? "rgba(234, 88, 12, 0.2)" : "#fff7ed"
                              : themeColors.subCardBg
                          }
                          color={
                            t.status === "Resolved" || t.status === "Closed"
                              ? "#16a34a"
                              : t.status.startsWith("Pending")
                              ? "#ea580c"
                              : themeColors.textPrimary
                          }
                          border={`1px solid ${themeColors.borderLight}`}
                          px='8px'
                          py='3px'
                          borderRadius='6px'
                          fontSize='10px'>
                          {t.status}
                        </Badge>
                      </Flex>

                      {/* 4-Step Progress Tracker */}
                      <Box pt='10px' mt='6px' borderTop={`1px solid ${themeColors.borderLight}`}>
                        <Flex justify='space-between' align='center' position='relative'>
                          {["Submitted", "In Review", "Action Required", "Resolved"].map((label, idx) => {
                            const isCurrentOrPassed = step >= idx + 1;
                            const isCurrent = step === idx + 1;
                            return (
                              <VStack key={idx} spacing='4px' align='center' zIndex='1'>
                                <Flex
                                  w='22px'
                                  h='22px'
                                  borderRadius='50%'
                                  bg={isCurrentOrPassed ? themeColors.buttonPrimaryBg : themeColors.borderLight}
                                  border={isCurrent ? `2px solid ${themeColors.textPrimary}` : "none"}
                                  color={isCurrentOrPassed ? themeColors.buttonPrimaryColor : themeColors.textSecondary}
                                  justify='center'
                                  align='center'
                                  fontSize='10px'
                                  fontWeight='bold'>
                                  {isCurrentOrPassed ? "✓" : idx + 1}
                                </Flex>
                                <Text
                                  color={isCurrentOrPassed ? themeColors.textPrimary : themeColors.textMuted}
                                  fontSize='10px'
                                  fontWeight={isCurrent ? "bold" : "normal"}>
                                  {label}
                                </Text>
                              </VStack>
                            );
                          })}
                        </Flex>
                      </Box>
                    </Box>
                  );
                })
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Right Panel: Solution Guides & Knowledge Base Deflection */}
        <Card
          h='100%'
          display='flex'
          flexDirection='column'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          borderRadius='18px'
          boxShadow={themeColors.cardShadow}
          p='24px'>
          <CardHeader mb='16px' minH='44px' p='0'>
            <Flex justify='space-between' align='center' w='100%'>
              <HStack spacing='10px'>
                <Flex
                  w='36px'
                  h='36px'
                  borderRadius='10px'
                  bg={themeColors.subCardBg}
                  border={`1px solid ${themeColors.borderLight}`}
                  justify='center'
                  align='center'
                  color={themeColors.textPrimary}>
                  <Icon as={FiBookOpen} w='18px' h='18px' />
                </Flex>
                <Box>
                  <Text fontSize='md' color={themeColors.textPrimary} fontWeight='bold' lineHeight='1.2'>
                    Featured Knowledge Base
                  </Text>
                  <Text fontSize='xs' color={themeColors.textSecondary}>
                    Instant self-service answers & documentation
                  </Text>
                </Box>
              </HStack>
              <Button
                size='xs'
                variant='ghost'
                color={themeColors.textPrimary}
                fontWeight='bold'
                rightIcon={<FiArrowRight />}
                onClick={() => history.push("/admin/knowledge-base")}>
                Full Directory
              </Button>
            </Flex>
          </CardHeader>

          <CardBody flexDirection='column' p='0' flex='1'>
            {/* Centered Topic Filter & Search Section */}
            <VStack spacing='14px' mb='18px' align='stretch' w='100%'>
              {/* Centered Search Bar */}
              <Flex justify='center' w='100%'>
                <InputGroup size='sm' w='100%'>
                  <InputLeftElement pointerEvents='none'>
                    <Icon as={FiSearch} color={themeColors.textMuted} w='14px' h='14px' />
                  </InputLeftElement>
                  <Input
                    placeholder='Search self-service solutions, errors, guides...'
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    borderRadius='12px'
                    fontSize='xs'
                    value={kbSearchQuery}
                    onChange={(e) => setKbSearchQuery(e.target.value)}
                    _focus={{ borderColor: themeColors.textPrimary, boxShadow: "none" }}
                  />
                </InputGroup>
              </Flex>

              {/* Centered & Scrollable Topic Chips Row */}
              <Box
                w='100%'
                overflowX='auto'
                py='4px'
                px='2px'
                css={{
                  "&::-webkit-scrollbar": { height: "4px" },
                  "&::-webkit-scrollbar-thumb": { background: isDark ? "#3f3f46" : "#c5c2c2", borderRadius: "4px" },
                }}>
                <Flex justify={{ base: "flex-start", sm: "center" }} gap='8px' minW='max-content' wrap='nowrap'>
                  <Button
                    size='xs'
                    borderRadius='20px'
                    px='12px'
                    py='6px'
                    bg={selectedCategory === "ALL" ? themeColors.buttonPrimaryBg : themeColors.subCardBg}
                    color={selectedCategory === "ALL" ? themeColors.buttonPrimaryColor : themeColors.textSecondary}
                    border={`1px solid ${selectedCategory === "ALL" ? themeColors.buttonPrimaryBg : themeColors.borderLight}`}
                    _hover={{ bg: selectedCategory === "ALL" ? themeColors.buttonPrimaryHover : themeColors.subCardHover }}
                    onClick={() => setSelectedCategory("ALL")}>
                    All Topics ({knowledgeArticles.length})
                  </Button>
                  {categories.map((c) => {
                    const isSelected = selectedCategory === c.name;
                    const count = knowledgeArticles.filter((a) => a.category === c.name).length;
                    return (
                      <Button
                        key={c.id}
                        size='xs'
                        borderRadius='20px'
                        px='12px'
                        py='6px'
                        bg={isSelected ? themeColors.buttonPrimaryBg : themeColors.subCardBg}
                        color={isSelected ? themeColors.buttonPrimaryColor : themeColors.textSecondary}
                        border={`1px solid ${isSelected ? themeColors.buttonPrimaryBg : themeColors.borderLight}`}
                        _hover={{ bg: isSelected ? themeColors.buttonPrimaryHover : themeColors.subCardHover }}
                        onClick={() => setSelectedCategory(c.name)}>
                        {c.name} {count > 0 ? `(${count})` : ""}
                      </Button>
                    );
                  })}
                </Flex>
              </Box>
            </VStack>

            {/* Scrollable Articles List */}
            <VStack spacing='14px' align='stretch' flex='1' maxH='480px' overflowY='auto' pr='4px'>
              {filteredArticles.length === 0 ? (
                <Flex
                  direction='column'
                  align='center'
                  justify='center'
                  p='32px'
                  bg={themeColors.subCardBg}
                  borderRadius='14px'
                  border={`1px dashed ${themeColors.borderLight}`}>
                  <Icon as={FiBookOpen} w='28px' h='28px' color={themeColors.textMuted} mb='8px' />
                  <Text color={themeColors.textSecondary} fontSize='sm'>No knowledge articles found for this topic.</Text>
                </Flex>
              ) : (
                filteredArticles.map((art) => (
                  <Box
                    key={art.id}
                    p='16px'
                    bg={themeColors.subCardBg}
                    border={`1px solid ${themeColors.subCardBorder}`}
                    borderRadius='14px'
                    _hover={{ borderColor: themeColors.textPrimary, bg: themeColors.subCardHover }}
                    transition='0.2s ease'>
                    <Flex justify='space-between' align='flex-start' mb='6px'>
                      <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm' noOfLines={1} maxW='260px'>
                        {art.title}
                      </Text>
                      <Badge
                        bg={themeColors.inputBg}
                        color={themeColors.textPrimary}
                        border={`1px solid ${themeColors.borderLight}`}
                        fontSize='9px'
                        px='6px'
                        py='2px'
                        borderRadius='4px'>
                        {art.category}
                      </Badge>
                    </Flex>

                    <Text color={themeColors.textSecondary} fontSize='xs' mb='10px' lineHeight='1.5' noOfLines={2}>
                      {art.summary}
                    </Text>

                    <Flex justify='space-between' align='center' pt='8px' borderTop={`1px solid ${themeColors.borderLight}`}>
                      <HStack spacing='12px' fontSize='xs' color={themeColors.textSecondary}>
                        <HStack spacing='4px'>
                          <Icon as={FiEye} w='11px' h='11px' />
                          <Text fontSize='10px'>{art.views} views</Text>
                        </HStack>
                        <HStack spacing='4px'>
                          <Icon
                            as={FiThumbsUp}
                            _hover={{ color: "#16a34a", cursor: "pointer" }}
                            onClick={() => rateKnowledgeArticle(art.id, true)}
                          />
                          <Text fontSize='10px'>{art.helpfulYes}</Text>
                        </HStack>
                      </HStack>

                      <Button
                        size='xs'
                        variant='link'
                        color={themeColors.textPrimary}
                        fontWeight='bold'
                        rightIcon={<FiArrowRight />}
                        onClick={() => setSelectedArticle(art)}>
                        Read Solution
                      </Button>
                    </Flex>
                  </Box>
                ))
              )}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Submit Ticket Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='lg'>
        <ModalOverlay backdropFilter='blur(8px)' />
        <ModalContent
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          color={themeColors.textPrimary}
          borderRadius='16px'>
          <ModalHeader borderBottom={`1px solid ${themeColors.borderLight}`}>Submit a Technical Request</ModalHeader>
          <ModalCloseButton color={themeColors.textPrimary} />
          <form onSubmit={handleCreateRequest}>
            <ModalBody py='20px'>
              <VStack spacing='14px' align='stretch'>
                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Issue Summary</FormLabel>
                  <Input
                    placeholder='Brief summary of the issue...'
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={reqSubject}
                    onChange={(e) => setReqSubject(e.target.value)}
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing='12px'>
                  <FormControl>
                    <FormLabel fontSize='xs' color={themeColors.textSecondary}>Category</FormLabel>
                    <Select
                      bg={themeColors.inputBg}
                      borderColor={themeColors.inputBorder}
                      color={themeColors.textPrimary}
                      value={reqCategory}
                      onChange={(e) => {
                        setReqCategory(e.target.value);
                        const cat = categories.find((c) => c.name === e.target.value);
                        if (cat) setReqSubcategory(cat.subcategories[0]);
                      }}>
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
                      value={reqSubcategory}
                      onChange={(e) => setReqSubcategory(e.target.value)}>
                      {categories
                        .find((c) => c.name === reqCategory)
                        ?.subcategories.map((sub, idx) => (
                          <option key={idx} value={sub} style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>
                            {sub}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Full Incident Description</FormLabel>
                  <Textarea
                    placeholder='Please describe what happened, expected outcome, error messages...'
                    rows={4}
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={reqDescription}
                    onChange={(e) => setReqDescription(e.target.value)}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter borderTop={`1px solid ${themeColors.borderLight}`}>
              <Button variant='ghost' mr={3} onClick={onClose} color={themeColors.textSecondary}>
                Cancel
              </Button>
              <Button type='submit' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }}>
                Submit Request
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Read Article Modal */}
      {selectedArticle && (
        <Modal isOpen={!!selectedArticle} onClose={() => setSelectedArticle(null)} size='xl'>
          <ModalOverlay backdropFilter='blur(8px)' />
          <ModalContent
            bg={themeColors.cardBg}
            border={`1px solid ${themeColors.cardBorder}`}
            backdropFilter={themeColors.glassBackdrop}
            color={themeColors.textPrimary}
            borderRadius='16px'>
            <ModalHeader borderBottom={`1px solid ${themeColors.borderLight}`}>
              <HStack spacing='8px'>
                <Badge bg={themeColors.subCardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`}>
                  {selectedArticle.category}
                </Badge>
                <Text fontSize='md' fontWeight='bold' noOfLines={1}>
                  {selectedArticle.title}
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color={themeColors.textPrimary} />
            <ModalBody py='20px'>
              <Text color={themeColors.textPrimary} fontSize='sm' whiteSpace='pre-wrap' lineHeight='1.8'>
                {selectedArticle.content}
              </Text>
              <Divider my='16px' borderColor={themeColors.borderLight} />
              <Flex justify='space-between' align='center'>
                <Text color={themeColors.textSecondary} fontSize='xs'>Was this article helpful?</Text>
                <HStack spacing='8px'>
                  <Button
                    size='xs'
                    bg={themeColors.subCardBg}
                    border={`1px solid ${themeColors.borderLight}`}
                    color={themeColors.textPrimary}
                    leftIcon={<FiThumbsUp />}
                    onClick={() => {
                      rateKnowledgeArticle(selectedArticle.id, true);
                      toast({ title: "Feedback Recorded", status: "success", duration: 2000 });
                    }}>
                    Yes ({selectedArticle.helpfulYes})
                  </Button>
                  <Button
                    size='xs'
                    bg={themeColors.subCardBg}
                    border={`1px solid ${themeColors.borderLight}`}
                    color={themeColors.textPrimary}
                    leftIcon={<FiThumbsDown />}
                    onClick={() => {
                      rateKnowledgeArticle(selectedArticle.id, false);
                      toast({ title: "Feedback Recorded", status: "info", duration: 2000 });
                    }}>
                    No ({selectedArticle.helpfulNo})
                  </Button>
                </HStack>
              </Flex>
            </ModalBody>
            <ModalFooter borderTop={`1px solid ${themeColors.borderLight}`}>
              <Button bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }} onClick={() => setSelectedArticle(null)}>
                Close Article
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
}
