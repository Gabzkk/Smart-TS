import React from "react";
import {
  Box,
  Flex,
  Text,
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
  Progress,
  HStack,
  VStack,
} from "@chakra-ui/react";
import {
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiSmile,
  FiAlertCircle,
  FiAward,
} from "react-icons/fi";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import ReactApexChart from "react-apexcharts";
import { useTickets } from "context/TicketContext";

export default function Analytics() {
  const { tickets, users, themeColors, isDark } = useTickets();

  // Inflow / Outflow Trends Chart Data
  const volumeChartOptions = {
    chart: {
      toolbar: { show: false },
      type: "area",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { colors: themeColors.textMuted } },
    },
    yaxis: {
      labels: { style: { colors: themeColors.textMuted } },
    },
    colors: isDark ? ["#f4f4f5", "#a1a0a0"] : ["#18181b", "#71717a"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: isDark ? 0.4 : 0.35,
        opacityTo: 0.05,
      },
    },
    grid: { borderColor: themeColors.borderLight },
    tooltip: { theme: isDark ? "dark" : "light" },
    legend: { labels: { colors: themeColors.textPrimary } },
  };

  const volumeChartSeries = [
    { name: "Tickets Created", data: [18, 24, 32, 28, 45, 14, 8] },
    { name: "Tickets Resolved", data: [15, 21, 30, 26, 40, 16, 9] },
  ];

  // Channel Distribution Donut Chart
  const channelChartOptions = {
    chart: { type: "donut" },
    labels: ["Web Portal", "Email", "Live Chat", "API / System", "Phone"],
    colors: isDark
      ? ["#f4f4f5", "#d4d4d8", "#a1a0a0", "#71717a", "#3f3f46"]
      : ["#18181b", "#52525b", "#71717a", "#a1a0a0", "#c5c2c2"],
    stroke: { show: false },
    legend: { position: "bottom", labels: { colors: themeColors.textPrimary } },
    tooltip: { theme: isDark ? "dark" : "light" },
    dataLabels: { enabled: true },
  };

  const channelChartSeries = [44, 28, 16, 12, 6];

  // Agent Leaderboard
  const agentLeaderboard = [
    { name: "Sarah Chen", team: "Tier 2 Technical Support", resolved: 38, frt: "14m", csat: 4.9, compliance: 98 },
    { name: "David Kim", team: "Billing & Subscriptions", resolved: 32, frt: "18m", csat: 4.8, compliance: 96 },
    { name: "Alex Rivera", team: "DevOps & Infrastructure", resolved: 26, frt: "11m", csat: 4.9, compliance: 100 },
    { name: "Marcus Vance", team: "Escalations & QA", resolved: 22, frt: "22m", csat: 4.7, compliance: 94 },
  ];

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }} gap='24px'>
      {/* KPI Highlight Row */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing='16px'>
        <Card
          p='18px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Text fontSize='xs' color={themeColors.textMuted} textTransform='uppercase' fontWeight='bold'>
                SLA Compliance Rate
              </Text>
              <Text fontSize='26px' color='#16a34a' fontWeight='extrabold'>
                97.4%
              </Text>
              <Text fontSize='10px' color='#16a34a'>+1.2% vs last month</Text>
            </Box>
            <Flex w='44px' h='44px' bg={isDark ? "rgba(22, 163, 74, 0.15)" : "#f0fdf4"} border='1px solid #bbf7d0' borderRadius='12px' justify='center' align='center' color='#16a34a'>
              <Icon as={FiCheckCircle} w='22px' h='22px' />
            </Flex>
          </Flex>
        </Card>

        <Card
          p='18px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Text fontSize='xs' color={themeColors.textMuted} textTransform='uppercase' fontWeight='bold'>
                Avg First Response (FRT)
              </Text>
              <Text fontSize='26px' color={themeColors.textPrimary} fontWeight='extrabold'>
                16.4m
              </Text>
              <Text fontSize='10px' color='#16a34a'>Target: &lt; 30 mins</Text>
            </Box>
            <Flex w='44px' h='44px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='12px' justify='center' align='center' color={themeColors.textPrimary}>
              <Icon as={FiClock} w='22px' h='22px' />
            </Flex>
          </Flex>
        </Card>

        <Card
          p='18px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Text fontSize='xs' color={themeColors.textMuted} textTransform='uppercase' fontWeight='bold'>
                Mean Time to Resolve (MTTR)
              </Text>
              <Text fontSize='26px' color={themeColors.textPrimary} fontWeight='extrabold'>
                2.8h
              </Text>
              <Text fontSize='10px' color='#16a34a'>-18m vs target</Text>
            </Box>
            <Flex w='44px' h='44px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='12px' justify='center' align='center' color={themeColors.textPrimary}>
              <Icon as={FiTrendingUp} w='22px' h='22px' />
            </Flex>
          </Flex>
        </Card>

        <Card
          p='18px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Text fontSize='xs' color={themeColors.textMuted} textTransform='uppercase' fontWeight='bold'>
                Customer Satisfaction (CSAT)
              </Text>
              <Text fontSize='26px' color={themeColors.textPrimary} fontWeight='extrabold'>
                4.86 / 5.0
              </Text>
              <Text fontSize='10px' color='#16a34a'>Based on 142 ratings</Text>
            </Box>
            <Flex w='44px' h='44px' bg={themeColors.subCardBg} border={`1px solid ${themeColors.borderLight}`} borderRadius='12px' justify='center' align='center' color={themeColors.textPrimary}>
              <Icon as={FiSmile} w='22px' h='22px' />
            </Flex>
          </Flex>
        </Card>
      </SimpleGrid>

      {/* Analytics Charts Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing='20px'>
        {/* 7-day Volume Inflow vs Outflow */}
        <Card
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}
          p='20px'>
          <CardHeader mb='12px'>
            <Text fontSize='md' color={themeColors.textPrimary} fontWeight='bold'>
              7-Day Ticket Inflow vs Outflow Velocity
            </Text>
          </CardHeader>
          <CardBody>
            <Box w='100%' h='280px'>
              <ReactApexChart options={volumeChartOptions} series={volumeChartSeries} type='area' width='100%' height='100%' />
            </Box>
          </CardBody>
        </Card>

        {/* Channel Ingestion Distribution */}
        <Card
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}
          p='20px'>
          <CardHeader mb='12px'>
            <Text fontSize='md' color={themeColors.textPrimary} fontWeight='bold'>
              Omnichannel Ingestion Share (% Volume)
            </Text>
          </CardHeader>
          <CardBody>
            <Box w='100%' h='280px'>
              <ReactApexChart options={channelChartOptions} series={channelChartSeries} type='donut' width='100%' height='100%' />
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Agent Performance Leaderboard Table */}
      <Card
        bg={themeColors.cardBg}
        border={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        boxShadow={themeColors.cardShadow}
        p='24px'>
        <CardHeader mb='16px'>
          <Flex justify='space-between' align='center' w='100%'>
            <HStack spacing='8px'>
              <Icon as={FiAward} color={themeColors.textPrimary} />
              <Text fontSize='md' color={themeColors.textPrimary} fontWeight='bold'>
                Support Agent Operational Leaderboard
              </Text>
            </HStack>
            <Badge bg={themeColors.subCardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`}>
              Live SLA Metrics
            </Badge>
          </Flex>
        </CardHeader>

        <CardBody>
          <Box overflowX='auto' w='100%'>
            <Table variant='simple'>
              <Thead>
                <Tr borderBottom={`1px solid ${themeColors.borderLight}`}>
                  <Th color={themeColors.textMuted} fontSize='xs'>Agent Name</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Queue Team</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Tickets Resolved</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Avg FRT</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>CSAT Rating</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>SLA Compliance</Th>
                </Tr>
              </Thead>
              <Tbody>
                {agentLeaderboard.map((a, idx) => (
                  <Tr key={idx} borderBottom={`1px solid ${themeColors.borderLight}`} _hover={{ bg: themeColors.subCardHover }}>
                    <Td>
                      <HStack spacing='10px'>
                        <Avatar size='sm' name={a.name} />
                        <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='xs'>{a.name}</Text>
                      </HStack>
                    </Td>
                    <Td><Text color={themeColors.textSecondary} fontSize='xs'>{a.team}</Text></Td>
                    <Td><Badge bg={themeColors.subCardBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`}>{a.resolved} closed</Badge></Td>
                    <Td><Text color={themeColors.textPrimary} fontSize='xs' fontWeight='bold'>{a.frt}</Text></Td>
                    <Td>
                      <HStack spacing='4px'>
                        <Icon as={FiSmile} color='#16a34a' w='12px' h='12px' />
                        <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='bold'>{a.csat}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing='8px' minW='120px'>
                        <Progress value={a.compliance} size='xs' colorScheme='green' flex='1' borderRadius='full' />
                        <Text color='#16a34a' fontSize='xs' fontWeight='bold'>{a.compliance}%</Text>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </Flex>
  );
}
