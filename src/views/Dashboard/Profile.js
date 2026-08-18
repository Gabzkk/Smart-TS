import React, { useState } from "react";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Switch,
  Text,
  Badge,
  HStack,
  VStack,
  SimpleGrid,
  Progress,
  Divider,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiAward,
  FiActivity,
  FiLayers,
  FiKey,
  FiEdit2,
  FiBell,
  FiZap,
} from "react-icons/fi";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { useTickets } from "context/TicketContext";
import { useHistory } from "react-router-dom";

export default function Profile() {
  const history = useHistory();
  const toast = useToast();
  const { currentUser, tickets, themeColors, isDark } = useTickets();

  // Notification Preferences State
  const [prefAssignments, setPrefAssignments] = useState(true);
  const [prefEscalations, setPrefEscalations] = useState(true);
  const [prefCustomerReplies, setPrefCustomerReplies] = useState(true);
  const [prefSystemIncidents, setPrefSystemIncidents] = useState(true);
  const [prefWeeklyReports, setPrefWeeklyReports] = useState(false);

  // Tickets assigned or created
  const userTickets = tickets.filter(
    (t) =>
      (t.assignedTo && t.assignedTo.name === currentUser.name) ||
      (t.requester && t.requester.name === currentUser.name)
  );

  const handleSavePref = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification and profile settings have been updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }} gap='24px'>
      {/* Top Profile Header Card */}
      <Card
        p='24px'
        bg={themeColors.cardBg}
        border={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        borderRadius='18px'
        boxShadow={themeColors.cardShadow}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify='space-between'
          align={{ base: "flex-start", md: "center" }}
          gap='20px'>
          <HStack spacing='20px'>
            <Avatar
              size='xl'
              name={currentUser.name}
              src={currentUser.avatar}
              borderRadius='16px'
              border={`2px solid ${themeColors.borderLight}`}>
              <AvatarBadge boxSize='1.2em' bg='#16a34a' border={`2px solid ${themeColors.bodyBg}`} />
            </Avatar>
            <VStack align='flex-start' spacing='4px'>
              <HStack spacing='10px'>
                <Text fontSize='2xl' fontWeight='bold' color={themeColors.textPrimary}>
                  {currentUser.name}
                </Text>
                <Badge
                  bg={isDark ? "rgba(244, 244, 245, 0.15)" : "#18181b"}
                  color={isDark ? "#f4f4f5" : "#fffdfd"}
                  px='8px'
                  py='2px'
                  borderRadius='6px'
                  fontSize='xs'>
                  {currentUser.role}
                </Badge>
              </HStack>
              <Text fontSize='sm' color={themeColors.textSecondary}>
                {currentUser.email} • {currentUser.team || "Operations & Leadership"}
              </Text>
              <HStack spacing='8px' pt='4px'>
                <Badge bg='green.500' color='white' px='6px' py='1px' borderRadius='4px' fontSize='10px'>
                  Status: Online
                </Badge>
                <Badge bg={themeColors.subCardBg} color={themeColors.textSecondary} border={`1px solid ${themeColors.borderLight}`} px='6px' py='1px' borderRadius='4px' fontSize='10px'>
                  MFA Active
                </Badge>
                <Badge bg={themeColors.subCardBg} color={themeColors.textSecondary} border={`1px solid ${themeColors.borderLight}`} px='6px' py='1px' borderRadius='4px' fontSize='10px'>
                  UTC+8 Manila
                </Badge>
              </HStack>
            </VStack>
          </HStack>

          <HStack spacing='10px' alignSelf={{ base: "flex-start", md: "center" }}>
            <Button
              size='sm'
              variant='outline'
              borderColor={themeColors.borderLight}
              color={themeColors.textPrimary}
              _hover={{ bg: themeColors.subCardHover }}
              leftIcon={<FiKey />}
              onClick={() => history.push("/admin/settings")}>
              API Access
            </Button>
            <Button
              size='sm'
              bg={themeColors.buttonPrimaryBg}
              color={themeColors.buttonPrimaryColor}
              _hover={{ bg: themeColors.buttonPrimaryHover }}
              leftIcon={<FiEdit2 />}
              onClick={handleSavePref}>
              Save Profile
            </Button>
          </HStack>
        </Flex>
      </Card>

      {/* KPI Overview Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing='20px'>
        <Card
          p='20px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          borderRadius='16px'
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <VStack align='flex-start' spacing='2px'>
              <Text fontSize='xs' color={themeColors.textSecondary} fontWeight='bold' textTransform='uppercase'>
                Assigned Tickets
              </Text>
              <Text fontSize='2xl' fontWeight='bold' color={themeColors.textPrimary}>
                {userTickets.length || 4} Active
              </Text>
              <Text fontSize='11px' color='#16a34a'>
                100% In SLA Window
              </Text>
            </VStack>
            <Flex
              w='44px'
              h='44px'
              borderRadius='12px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiLayers} w='20px' h='20px' />
            </Flex>
          </Flex>
        </Card>

        <Card
          p='20px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          borderRadius='16px'
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <VStack align='flex-start' spacing='2px'>
              <Text fontSize='xs' color={themeColors.textSecondary} fontWeight='bold' textTransform='uppercase'>
                Avg Resolution Time
              </Text>
              <Text fontSize='2xl' fontWeight='bold' color={themeColors.textPrimary}>
                1.4 hrs
              </Text>
              <Text fontSize='11px' color='#16a34a'>
                ↓ 24% faster than target
              </Text>
            </VStack>
            <Flex
              w='44px'
              h='44px'
              borderRadius='12px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiClock} w='20px' h='20px' />
            </Flex>
          </Flex>
        </Card>

        <Card
          p='20px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          borderRadius='16px'
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <VStack align='flex-start' spacing='2px'>
              <Text fontSize='xs' color={themeColors.textSecondary} fontWeight='bold' textTransform='uppercase'>
                Satisfaction (CSAT)
              </Text>
              <Text fontSize='2xl' fontWeight='bold' color={themeColors.textPrimary}>
                4.94 / 5.0
              </Text>
              <Text fontSize='11px' color='#16a34a'>
                98.2% Positive Ratings
              </Text>
            </VStack>
            <Flex
              w='44px'
              h='44px'
              borderRadius='12px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiAward} w='20px' h='20px' />
            </Flex>
          </Flex>
        </Card>

        <Card
          p='20px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          borderRadius='16px'
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <VStack align='flex-start' spacing='2px'>
              <Text fontSize='xs' color={themeColors.textSecondary} fontWeight='bold' textTransform='uppercase'>
                First Contact Res.
              </Text>
              <Text fontSize='2xl' fontWeight='bold' color={themeColors.textPrimary}>
                86.8%
              </Text>
              <Text fontSize='11px' color='#16a34a'>
                Benchmark: 75%
              </Text>
            </VStack>
            <Flex
              w='44px'
              h='44px'
              borderRadius='12px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiCheckCircle} w='20px' h='20px' />
            </Flex>
          </Flex>
        </Card>
      </SimpleGrid>

      {/* Main Grids Section */}
      <Grid templateColumns={{ base: "1fr", xl: "1fr 1.6fr" }} gap='24px' alignItems='start'>
        {/* Left Column: Profile Details & Core Competencies */}
        <VStack spacing='24px' align='stretch'>
          <Card
            p='24px'
            bg={themeColors.cardBg}
            border={`1px solid ${themeColors.cardBorder}`}
            backdropFilter={themeColors.glassBackdrop}
            borderRadius='18px'
            boxShadow={themeColors.cardShadow}>
            <CardHeader p='0' mb='16px'>
              <Text fontSize='md' fontWeight='bold' color={themeColors.textPrimary}>
                Administrator Bio & Account Details
              </Text>
            </CardHeader>
            <CardBody p='0' flexDirection='column'>
              <Text fontSize='xs' color={themeColors.textSecondary} mb='18px' lineHeight='1.6'>
                Principal Systems Administrator & Technical Support Lead overseeing ticket dispatch algorithms, automated webhook integrations, custom escalation matrices, and SLA policy compliance.
              </Text>
              <Divider borderColor={themeColors.borderLight} mb='18px' />

              <VStack spacing='14px' align='stretch'>
                <Flex justify='space-between' align='center'>
                  <HStack spacing='8px' color={themeColors.textSecondary} fontSize='xs'>
                    <Icon as={FiUser} />
                    <Text>Full Name:</Text>
                  </HStack>
                  <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                    {currentUser.name}
                  </Text>
                </Flex>

                <Flex justify='space-between' align='center'>
                  <HStack spacing='8px' color={themeColors.textSecondary} fontSize='xs'>
                    <Icon as={FiMail} />
                    <Text>Email:</Text>
                  </HStack>
                  <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                    {currentUser.email}
                  </Text>
                </Flex>

                <Flex justify='space-between' align='center'>
                  <HStack spacing='8px' color={themeColors.textSecondary} fontSize='xs'>
                    <Icon as={FiPhone} />
                    <Text>Direct Phone:</Text>
                  </HStack>
                  <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                    {currentUser.phone || "+1 (555) 234-5678"}
                  </Text>
                </Flex>

                <Flex justify='space-between' align='center'>
                  <HStack spacing='8px' color={themeColors.textSecondary} fontSize='xs'>
                    <Icon as={FiShield} />
                    <Text>Access Role:</Text>
                  </HStack>
                  <Badge bg={themeColors.buttonPrimaryBg} color={themeColors.buttonPrimaryColor} fontSize='10px' px='6px' py='1px' borderRadius='4px'>
                    Super Administrator
                  </Badge>
                </Flex>

                <Flex justify='space-between' align='center'>
                  <HStack spacing='8px' color={themeColors.textSecondary} fontSize='xs'>
                    <Icon as={FiMapPin} />
                    <Text>Location / HQ:</Text>
                  </HStack>
                  <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                    San Francisco, CA (Remote Manila Hub)
                  </Text>
                </Flex>
              </VStack>

              <Divider borderColor={themeColors.borderLight} my='18px' />

              <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary} mb='10px'>
                Core Skills & Domain Expertise
              </Text>
              <Flex gap='8px' wrap='wrap'>
                {(currentUser.skills || ["RBAC", "SLA Policy", "System Admin", "Integrations", "Postgres", "Redis"]).map((skill, idx) => (
                  <Badge
                    key={idx}
                    bg={themeColors.subCardBg}
                    color={themeColors.textPrimary}
                    border={`1px solid ${themeColors.borderLight}`}
                    px='10px'
                    py='4px'
                    borderRadius='8px'
                    fontSize='xs'>
                    {skill}
                  </Badge>
                ))}
              </Flex>
            </CardBody>
          </Card>

          {/* Notification & Automation Preferences */}
          <Card
            p='24px'
            bg={themeColors.cardBg}
            border={`1px solid ${themeColors.cardBorder}`}
            backdropFilter={themeColors.glassBackdrop}
            borderRadius='18px'
            boxShadow={themeColors.cardShadow}>
            <CardHeader p='0' mb='16px'>
              <HStack spacing='8px'>
                <Icon as={FiBell} color={themeColors.textPrimary} />
                <Text fontSize='md' fontWeight='bold' color={themeColors.textPrimary}>
                  Event Subscriptions & Alerts
                </Text>
              </HStack>
            </CardHeader>
            <CardBody p='0' flexDirection='column'>
              <VStack spacing='16px' align='stretch'>
                <Flex justify='space-between' align='center'>
                  <Box>
                    <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                      Ticket Assignment & Re-route Alerts
                    </Text>
                    <Text fontSize='11px' color={themeColors.textSecondary}>
                      Instant broadcast when an incident is assigned to your queue.
                    </Text>
                  </Box>
                  <Switch isChecked={prefAssignments} onChange={(e) => setPrefAssignments(e.target.checked)} />
                </Flex>

                <Flex justify='space-between' align='center'>
                  <Box>
                    <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                      SLA Warning & Escalation Alerts
                    </Text>
                    <Text fontSize='11px' color={themeColors.textSecondary}>
                      Receive notifications 30 mins before SLA policy threshold breaches.
                    </Text>
                  </Box>
                  <Switch isChecked={prefEscalations} onChange={(e) => setPrefEscalations(e.target.checked)} />
                </Flex>

                <Flex justify='space-between' align='center'>
                  <Box>
                    <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                      Customer Replies & Public Updates
                    </Text>
                    <Text fontSize='11px' color={themeColors.textSecondary}>
                      Real-time alert when a requester updates an active thread.
                    </Text>
                  </Box>
                  <Switch isChecked={prefCustomerReplies} onChange={(e) => setPrefCustomerReplies(e.target.checked)} />
                </Flex>

                <Flex justify='space-between' align='center'>
                  <Box>
                    <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                      System Outages & P1 Incident Pager
                    </Text>
                    <Text fontSize='11px' color={themeColors.textSecondary}>
                      Emergency push notifications for critical database or API downtime.
                    </Text>
                  </Box>
                  <Switch isChecked={prefSystemIncidents} onChange={(e) => setPrefSystemIncidents(e.target.checked)} />
                </Flex>

                <Flex justify='space-between' align='center'>
                  <Box>
                    <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                      Weekly SLA Digest & Executive KPI Report
                    </Text>
                    <Text fontSize='11px' color={themeColors.textSecondary}>
                      Digest sent every Monday morning with CSAT breakdown.
                    </Text>
                  </Box>
                  <Switch isChecked={prefWeeklyReports} onChange={(e) => setPrefWeeklyReports(e.target.checked)} />
                </Flex>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Right Column: Active Incidents & Audit Activities */}
        <VStack spacing='24px' align='stretch'>
          <Card
            p='24px'
            bg={themeColors.cardBg}
            border={`1px solid ${themeColors.cardBorder}`}
            backdropFilter={themeColors.glassBackdrop}
            borderRadius='18px'
            boxShadow={themeColors.cardShadow}>
            <CardHeader p='0' mb='16px'>
              <Flex justify='space-between' align='center' w='100%'>
                <HStack spacing='8px'>
                  <Icon as={FiZap} color={themeColors.textPrimary} />
                  <Text fontSize='md' fontWeight='bold' color={themeColors.textPrimary}>
                    Active Incidents Involving {currentUser.name}
                  </Text>
                </HStack>
                <Button size='xs' variant='ghost' color={themeColors.textPrimary} onClick={() => history.push("/admin/tickets")}>
                  View All Tickets →
                </Button>
              </Flex>
            </CardHeader>
            <CardBody p='0' flexDirection='column'>
              <VStack spacing='12px' align='stretch'>
                {tickets.slice(0, 4).map((ticket) => (
                  <Box
                    key={ticket.id}
                    p='14px'
                    bg={themeColors.subCardBg}
                    border={`1px solid ${themeColors.subCardBorder}`}
                    borderRadius='12px'
                    _hover={{ borderColor: themeColors.textPrimary, bg: themeColors.subCardHover, cursor: "pointer" }}
                    transition='0.2s ease'
                    onClick={() => history.push(`/admin/tickets/${ticket.id}`)}>
                    <Flex justify='space-between' align='flex-start' mb='6px'>
                      <HStack spacing='8px'>
                        <Badge bg={themeColors.inputBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`} borderRadius='4px' fontSize='10px'>
                          {ticket.id}
                        </Badge>
                        <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary} noOfLines={1} maxW='260px'>
                          {ticket.subject}
                        </Text>
                      </HStack>
                      <Badge
                        bg={
                          ticket.priority === "Urgent/Critical"
                            ? isDark ? "rgba(220, 38, 38, 0.2)" : "#fef2f2"
                            : themeColors.inputBg
                        }
                        color={ticket.priority === "Urgent/Critical" ? "#dc2626" : themeColors.textSecondary}
                        border={`1px solid ${themeColors.borderLight}`}
                        fontSize='9px'
                        px='6px'
                        borderRadius='4px'>
                        {ticket.priority}
                      </Badge>
                    </Flex>
                    <Flex justify='space-between' align='center' fontSize='11px' color={themeColors.textSecondary}>
                      <Text>{ticket.category} › {ticket.subcategory}</Text>
                      <Text>{ticket.status}</Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Security Sessions & Login Integrity */}
          <Card
            p='24px'
            bg={themeColors.cardBg}
            border={`1px solid ${themeColors.cardBorder}`}
            backdropFilter={themeColors.glassBackdrop}
            borderRadius='18px'
            boxShadow={themeColors.cardShadow}>
            <CardHeader p='0' mb='16px'>
              <HStack spacing='8px'>
                <Icon as={FiShield} color={themeColors.textPrimary} />
                <Text fontSize='md' fontWeight='bold' color={themeColors.textPrimary}>
                  Security & Active Sessions
                </Text>
              </HStack>
            </CardHeader>
            <CardBody p='0' flexDirection='column'>
              <VStack spacing='12px' align='stretch'>
                <Flex
                  p='12px'
                  bg={themeColors.subCardBg}
                  border={`1px solid ${themeColors.borderLight}`}
                  borderRadius='12px'
                  justify='space-between'
                  align='center'>
                  <VStack align='flex-start' spacing='2px'>
                    <HStack spacing='6px'>
                      <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                        Brave Browser on Linux (x86_64)
                      </Text>
                      <Badge bg='#16a34a' color='white' fontSize='9px' px='4px' py='1px' borderRadius='3px'>
                        Current
                      </Badge>
                    </HStack>
                    <Text fontSize='10px' color={themeColors.textSecondary}>
                      IP: 127.0.0.1 • Port: 3000 • Active Now
                    </Text>
                  </VStack>
                  <Button size='xs' variant='outline' borderColor={themeColors.borderLight} color={themeColors.textSecondary} isDisabled>
                    Active
                  </Button>
                </Flex>

                <Flex
                  p='12px'
                  bg={themeColors.subCardBg}
                  border={`1px solid ${themeColors.borderLight}`}
                  borderRadius='12px'
                  justify='space-between'
                  align='center'>
                  <VStack align='flex-start' spacing='2px'>
                    <Text fontSize='xs' fontWeight='bold' color={themeColors.textPrimary}>
                      TicketFlow Mobile App (iOS 17.4)
                    </Text>
                    <Text fontSize='10px' color={themeColors.textSecondary}>
                      IP: 10.0.4.12 • Last active 2 hours ago
                    </Text>
                  </VStack>
                  <Button size='xs' variant='ghost' color='red.400' _hover={{ bg: "rgba(220, 38, 38, 0.1)" }}>
                    Revoke
                  </Button>
                </Flex>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Grid>
    </Flex>
  );
}
