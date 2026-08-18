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
  Tag,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiPlus,
  FiBookOpen,
  FiThumbsUp,
  FiThumbsDown,
  FiEye,
  FiFolder,
  FiCheckCircle,
} from "react-icons/fi";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { useTickets } from "context/TicketContext";

export default function KnowledgeBase() {
  const toast = useToast();
  const {
    knowledgeArticles,
    rateKnowledgeArticle,
    addKnowledgeArticle,
    categories,
    themeColors,
    isDark,
  } = useTickets();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeArticle, setActiveArticle] = useState(null);

  // New Article Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("API & Integrations");
  const [newSummary, setNewSummary] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  const filteredArticles = useMemo(() => {
    return knowledgeArticles.filter((art) => {
      if (selectedCategory !== "ALL" && art.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = art.title.toLowerCase().includes(q);
        const inSum = art.summary.toLowerCase().includes(q);
        const inTag = art.tags.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inSum && !inTag) return false;
      }
      return true;
    });
  }, [knowledgeArticles, selectedCategory, searchQuery]);

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim() || !newContent.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill out title, summary, and content.",
        status: "warning",
      });
      return;
    }

    addKnowledgeArticle({
      title: newTitle,
      category: newCategory,
      summary: newSummary,
      content: newContent,
      tags: newTags.split(",").map((s) => s.trim()).filter(Boolean),
    });

    toast({
      title: "Article Published",
      description: `"${newTitle}" added to knowledge directory.`,
      status: "success",
      duration: 3000,
    });

    setNewTitle("");
    setNewSummary("");
    setNewContent("");
    setNewTags("");
    onClose();
  };

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }} gap='24px'>
      {/* Header Banner */}
      <Card
        p='24px'
        bg={themeColors.cardBg}
        border={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        borderRadius='18px'
        boxShadow={themeColors.cardShadow}>
        <Flex direction={{ base: "column", md: "row" }} justify='space-between' align={{ base: "flex-start", md: "center" }} gap='16px'>
          <Box>
            <HStack spacing='8px' mb='6px'>
              <Badge bg={themeColors.subCardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`} px='8px' py='2px' borderRadius='6px' fontSize='xs' fontWeight='bold'>
                DOCUMENTATION DIRECTORY
              </Badge>
              <Badge bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} px='8px' py='2px' borderRadius='6px' fontSize='xs'>
                {knowledgeArticles.length} Published Articles
              </Badge>
            </HStack>
            <Text fontSize='22px' color={themeColors.textPrimary} fontWeight='extrabold'>
              Knowledge Base & Self-Service Deflection
            </Text>
            <Text fontSize='xs' color={themeColors.textSecondary}>
              Browse official runbooks, troubleshooting guides, architecture diagrams, and known workarounds.
            </Text>
          </Box>

          <Button leftIcon={<FiPlus />} bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }} borderRadius='12px' onClick={onOpen}>
            Publish Article
          </Button>
        </Flex>
      </Card>

      {/* Search & Topic Filters */}
      <Card
        p='18px'
        bg={themeColors.cardBg}
        border={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        borderRadius='16px'
        boxShadow={themeColors.cardShadow}>
        <Flex direction={{ base: "column", md: "row" }} gap='14px' align='center' justify='space-between'>
          <InputGroup maxW={{ base: "100%", md: "400px" }}>
            <InputLeftElement pointerEvents='none'>
              <Icon as={FiSearch} color={themeColors.textMuted} />
            </InputLeftElement>
            <Input
              placeholder='Search articles by keyword, error code, tag...'
              bg={themeColors.inputBg}
              borderColor={themeColors.inputBorder}
              color={themeColors.textPrimary}
              borderRadius='12px'
              fontSize='sm'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <HStack spacing='8px' wrap='wrap'>
            <Button
              size='sm'
              borderRadius='20px'
              px='12px'
              bg={selectedCategory === "ALL" ? themeColors.buttonPrimaryBg : themeColors.subCardBg}
              color={selectedCategory === "ALL" ? themeColors.buttonPrimaryColor : themeColors.textSecondary}
              border={`1px solid ${selectedCategory === "ALL" ? themeColors.buttonPrimaryBg : themeColors.borderLight}`}
              _hover={{ bg: selectedCategory === "ALL" ? themeColors.buttonPrimaryHover : themeColors.subCardHover }}
              onClick={() => setSelectedCategory("ALL")}>
              All Categories
            </Button>
            {categories.map((c) => (
              <Button
                key={c.id}
                size='sm'
                borderRadius='20px'
                px='12px'
                bg={selectedCategory === c.name ? themeColors.buttonPrimaryBg : themeColors.subCardBg}
                color={selectedCategory === c.name ? themeColors.buttonPrimaryColor : themeColors.textSecondary}
                border={`1px solid ${selectedCategory === c.name ? themeColors.buttonPrimaryBg : themeColors.borderLight}`}
                _hover={{ bg: selectedCategory === c.name ? themeColors.buttonPrimaryHover : themeColors.subCardHover }}
                onClick={() => setSelectedCategory(c.name)}>
                {c.name}
              </Button>
            ))}
          </HStack>
        </Flex>
      </Card>

      {/* Articles Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing='20px'>
        {filteredArticles.map((art) => (
          <Card
            key={art.id}
            bg={themeColors.cardBg}
            border={`1px solid ${themeColors.cardBorder}`}
            backdropFilter={themeColors.glassBackdrop}
            borderRadius='16px'
            boxShadow={themeColors.cardShadow}
            p='20px'
            _hover={{ borderColor: themeColors.textPrimary, transform: "translateY(-2px)" }}
            transition='all 0.2s ease'
            cursor='pointer'
            onClick={() => setActiveArticle(art)}>
            <Flex justify='space-between' align='flex-start' mb='10px'>
              <Badge bg={themeColors.subCardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`} fontSize='10px' px='8px' py='2px' borderRadius='6px'>
                {art.category}
              </Badge>
              <HStack spacing='4px' fontSize='xs' color={themeColors.textMuted}>
                <Icon as={FiEye} w='12px' h='12px' />
                <Text fontSize='10px'>{art.views} views</Text>
              </HStack>
            </Flex>

            <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='md' mb='8px' noOfLines={2}>
              {art.title}
            </Text>

            <Text color={themeColors.textSecondary} fontSize='xs' mb='14px' lineHeight='1.6' noOfLines={3} flex='1'>
              {art.summary}
            </Text>

            <Flex justify='space-between' align='center' pt='12px' borderTop={`1px solid ${themeColors.borderLight}`}>
              <HStack spacing='4px' wrap='wrap'>
                {art.tags.slice(0, 2).map((t, idx) => (
                  <Tag key={idx} size='sm' bg={themeColors.subCardBg} color={themeColors.textSecondary} border={`1px solid ${themeColors.borderLight}`} fontSize='9px'>
                    #{t}
                  </Tag>
                ))}
              </HStack>

              <HStack spacing='8px' fontSize='xs' color={themeColors.textSecondary} onClick={(e) => e.stopPropagation()}>
                <HStack spacing='2px'>
                  <Icon as={FiThumbsUp} _hover={{ color: "#16a34a", cursor: "pointer" }} onClick={() => rateKnowledgeArticle(art.id, true)} />
                  <Text fontSize='10px'>{art.helpfulYes}</Text>
                </HStack>
                <HStack spacing='2px'>
                  <Icon as={FiThumbsDown} _hover={{ color: "#dc2626", cursor: "pointer" }} onClick={() => rateKnowledgeArticle(art.id, false)} />
                  <Text fontSize='10px'>{art.helpfulNo}</Text>
                </HStack>
              </HStack>
            </Flex>
          </Card>
        ))}
      </SimpleGrid>

      {/* Read Article Modal */}
      {activeArticle && (
        <Modal isOpen={!!activeArticle} onClose={() => setActiveArticle(null)} size='2xl'>
          <ModalOverlay backdropFilter='blur(8px)' />
          <ModalContent
            bg={themeColors.cardBg}
            border={`1px solid ${themeColors.cardBorder}`}
            backdropFilter={themeColors.glassBackdrop}
            color={themeColors.textPrimary}
            borderRadius='16px'>
            <ModalHeader borderBottom={`1px solid ${themeColors.borderLight}`}>
              <HStack spacing='10px'>
                <Badge bg={themeColors.subCardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`}>
                  {activeArticle.category}
                </Badge>
                <Text fontSize='md' fontWeight='bold' noOfLines={1}>
                  {activeArticle.title}
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color={themeColors.textPrimary} />
            <ModalBody py='20px'>
              <Text color={themeColors.textPrimary} fontSize='sm' whiteSpace='pre-wrap' lineHeight='1.8'>
                {activeArticle.content}
              </Text>
            </ModalBody>
            <ModalFooter borderTop={`1px solid ${themeColors.borderLight}`}>
              <Button bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }} onClick={() => setActiveArticle(null)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Publish Article Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay backdropFilter='blur(8px)' />
        <ModalContent
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          color={themeColors.textPrimary}
          borderRadius='16px'>
          <ModalHeader borderBottom={`1px solid ${themeColors.borderLight}`}>Publish Knowledge Base Guide</ModalHeader>
          <ModalCloseButton color={themeColors.textPrimary} />
          <form onSubmit={handlePublish}>
            <ModalBody py='20px'>
              <VStack spacing='14px' align='stretch'>
                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Article Title</FormLabel>
                  <Input
                    placeholder='e.g. Resolving SSO 502 Bad Gateway during IdP Metadata Rotation'
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Category</FormLabel>
                  <Select
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name} style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Executive Summary / Abstract</FormLabel>
                  <Input
                    placeholder='Brief 1-2 sentence solution summary for quick indexing...'
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Step-by-Step Resolution Guide</FormLabel>
                  <Textarea
                    placeholder='Provide formatted markdown instructions, CLI commands, diagnostic steps...'
                    rows={6}
                    bg={themeColors.inputBg}
                    borderColor={themeColors.inputBorder}
                    color={themeColors.textPrimary}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize='xs' color={themeColors.textSecondary}>Search Tags (comma separated)</FormLabel>
                  <Input
                    placeholder='sso, auth, saml, error-502'
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
              <Button variant='ghost' mr={3} onClick={onClose} color={themeColors.textSecondary}>Cancel</Button>
              <Button type='submit' bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} _hover={{ bg: themeColors.buttonPrimaryHover }}>
                Publish Guide
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
