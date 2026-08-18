import React, { useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  SimpleGrid,
  Badge,
  HStack,
  VStack,
  Icon,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import {
  FiInbox,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiSmile,
  FiArrowRight,
  FiPlus,
  FiActivity,
  FiZap,
} from "react-icons/fi";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import ReactApexChart from "react-apexcharts";
import { useTickets } from "context/TicketContext";

export default function Dashboard() {
  const history = useHistory();
  const { tickets, currentUser, themeColors, isDark } = useTickets();

  // Metrics
  const metrics = useMemo(() => {
    const total = tickets.length;
    const openCount = tickets.filter((t) => t.status === "Open" || t.status === "New").length;
    const inProgCount = tickets.filter((t) => t.status === "In Progress").length;
    const urgentCount = tickets.filter((t) => t.priority === "Urgent/Critical").length;
    const pendingCount = tickets.filter((t) => t.status.startsWith("Pending") || t.status === "On Hold").length;
    const resolvedCount = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
    const atRiskCount = tickets.filter((t) => !t.sla.firstResponseMet && t.status !== "Resolved" && t.status !== "Closed").length;

    return { total, openCount, inProgCount, urgentCount, pendingCount, resolvedCount, atRiskCount };
  }, [tickets]);

  // Urgent / At-Risk Queue
  const urgentTickets = useMemo(() => {
    return tickets.filter((t) => t.priority === "Urgent/Critical" || t.priority === "High").slice(0, 5);
  }, [tickets]);

  // ApexChart: Live Volume Trends
  const volumeChartOptions = {
    chart: { toolbar: { show: false }, type: "area" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"],
      labels: { style: { colors: themeColors.textMuted } },
    },
    yaxis: {
      labels: { style: { colors: themeColors.textMuted } },
    },
    colors: isDark ? ["#f4f4f5", "#a1a0a0"] : ["#18181b", "#71717a"],
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: isDark ? 0.4 : 0.3, opacityTo: 0.05 },
    },
    grid: { borderColor: themeColors.borderLight },
    tooltip: { theme: isDark ? "dark" : "light" },
    legend: { labels: { colors: themeColors.textPrimary } },
  };

  const volumeChartSeries = [
    { name: "Tickets Received", data: [4, 9, 14, 22, 18, 12, 6] },
    { name: "Tickets Resolved", data: [2, 7, 12, 19, 17, 14, 8] },
  ];

  // ApexChart: Channel Breakdown
  const channelChartOptions = {
    chart: { type: "donut" },
    labels: ["Web Portal", "Email", "Live Chat", "API / Webhook", "Phone"],
    colors: isDark
      ? ["#f4f4f5", "#d4d4d8", "#a1a0a0", "#71717a", "#3f3f46"]
      : ["#18181b", "#52525b", "#71717a", "#a1a0a0", "#c5c2c2"],
    stroke: { show: false },
    legend: { position: "bottom", labels: { colors: themeColors.textPrimary } },
    tooltip: { theme: isDark ? "dark" : "light" },
  };

  const channelChartSeries = [42, 26, 18, 10, 4];

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }} gap='24px'>
      {/* Welcome Banner */}
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
              <Badge
                bg={themeColors.subCardBg}
                color={themeColors.textPrimary}
                border={`1px solid ${themeColors.borderLight}`}
                px='8px'
                py='2px'
                borderRadius='6px'
                fontSize='xs'
                fontWeight='bold'>
                COMMAND CENTER
              </Badge>
              <Badge
                bg={themeColors.buttonPrimaryBg}
                color={themeColors.buttonPrimaryColor}
                px='8px'
                py='2px'
                borderRadius='6px'
                fontSize='xs'>
                Role: {currentUser.role}
              </Badge>
            </HStack>
            <Text fontSize='22px' color={themeColors.textPrimary} fontWeight='extrabold'>
              Welcome back, {currentUser.name}
            </Text>
            <Text fontSize='xs' color={themeColors.textSecondary}>
              All systems operational. {metrics.openCount} open tickets currently awaiting dispatch.
            </Text>
          </Box>

          <HStack spacing='10px'>
            <Button
              size='sm'
              bg={themeColors.buttonPrimaryBg}
              color={themeColors.buttonPrimaryColor}
              _hover={{ bg: themeColors.buttonPrimaryHover }}
              leftIcon={<FiPlus />}
              onClick={() => history.push("/admin/tickets")}>
              Create / View Tickets
            </Button>
            <Button
              size='sm'
              variant='outline'
              color={themeColors.textPrimary}
              borderColor={themeColors.borderMuted}
              _hover={{ bg: themeColors.subCardBg }}
              onClick={() => history.push("/admin/analytics")}>
              SLA Analytics
            </Button>
          </HStack>
        </Flex>
      </Card>

      {/* Top 5 Support KPIs */}
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
                Open Tickets
              </Text>
              <Text fontSize='24px' color={themeColors.textPrimary} fontWeight='extrabold'>
                {metrics.openCount}
              </Text>
            </Box>
            <Flex
              w='40px'
              h='40px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              borderRadius='10px'
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiInbox} w='18px' h='18px' />
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
              w='40px'
              h='40px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              borderRadius='10px'
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiClock} w='18px' h='18px' />
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
                Critical Blocker
              </Text>
              <Text fontSize='24px' color='#dc2626' fontWeight='extrabold'>
                {metrics.urgentCount}
              </Text>
            </Box>
            <Flex
              w='40px'
              h='40px'
              bg={isDark ? "rgba(220, 38, 38, 0.15)" : "#fef2f2"}
              border='1px solid #fecaca'
              borderRadius='10px'
              justify='center'
              align='center'
              color='#dc2626'>
              <Icon as={FiAlertTriangle} w='18px' h='18px' />
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
                SLA Compliance
              </Text>
              <Text fontSize='24px' color='#16a34a' fontWeight='extrabold'>
                97.4%
              </Text>
            </Box>
            <Flex
              w='40px'
              h='40px'
              bg={isDark ? "rgba(22, 163, 74, 0.15)" : "#f0fdf4"}
              border='1px solid #bbf7d0'
              borderRadius='10px'
              justify='center'
              align='center'
              color='#16a34a'>
              <Icon as={FiCheckCircle} w='18px' h='18px' />
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
                Avg CSAT Score
              </Text>
              <Text fontSize='24px' color={themeColors.textPrimary} fontWeight='extrabold'>
                4.86 / 5.0
              </Text>
            </Box>
            <Flex
              w='40px'
              h='40px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              borderRadius='10px'
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiSmile} w='18px' h='18px' />
            </Flex>
          </Flex>
        </Card>
      </SimpleGrid>

      {/* Charts Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing='20px'>
        {/* Real-time Inflow vs Outflow */}
        <Card
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}
          p='20px'>
          <CardHeader mb='10px'>
            <Text fontSize='md' color={themeColors.textPrimary} fontWeight='bold'>
              Hourly Ticket Inflow vs Outflow
            </Text>
          </CardHeader>
          <CardBody>
            <Box w='100%' h='260px'>
              <ReactApexChart options={volumeChartOptions} series={volumeChartSeries} type='area' width='100%' height='100%' />
            </Box>
          </CardBody>
        </Card>

        {/* Channel Breakdown */}
        <Card
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}
          p='20px'>
          <CardHeader mb='10px'>
            <Text fontSize='md' color={themeColors.textPrimary} fontWeight='bold'>
              Support Channel Ingestion Breakdown
            </Text>
          </CardHeader>
          <CardBody>
            <Box w='100%' h='260px'>
              <ReactApexChart options={channelChartOptions} series={channelChartSeries} type='donut' width='100%' height='100%' />
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* High-Priority / Escalation Queue Table */}
      <Card
        bg={themeColors.cardBg}
        border={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        boxShadow={themeColors.cardShadow}
        p='20px'>
        <CardHeader mb='16px'>
          <Flex justify='space-between' align='center' w='100%'>
            <HStack spacing='8px'>
              <Icon as={FiAlertTriangle} color='#dc2626' w='18px' h='18px' />
              <Text fontSize='md' color={themeColors.textPrimary} fontWeight='bold'>
                Critical & High Priority Incident Queue
              </Text>
            </HStack>
            <Button
              size='xs'
              variant='link'
              color={themeColors.textPrimary}
              fontWeight='bold'
              rightIcon={<FiArrowRight />}
              onClick={() => history.push("/admin/tickets")}>
              View All Queue Tickets
            </Button>
          </Flex>
        </CardHeader>

        <CardBody>
          <Box overflowX='auto' w='100%'>
            <Table variant='simple'>
              <Thead>
                <Tr borderBottom={`1px solid ${themeColors.borderLight}`}>
                  <Th color={themeColors.textMuted} fontSize='xs'>Ticket ID</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Subject</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Requester</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Priority</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Status</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Assignee</Th>
                  <Th color={themeColors.textMuted} fontSize='xs'>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {urgentTickets.map((t) => (
                  <Tr
                    key={t.id}
                    borderBottom={`1px solid ${themeColors.borderLight}`}
                    _hover={{ bg: themeColors.subCardHover, cursor: "pointer" }}
                    onClick={() => history.push(`/admin/tickets/${t.id}`)}>
                    <Td>
                      <Badge
                        bg={themeColors.subCardBg}
                        color={themeColors.textPrimary}
                        border={`1px solid ${themeColors.borderMuted}`}
                        borderRadius='6px'
                        fontSize='11px'>
                        {t.id}
                      </Badge>
                    </Td>
                    <Td>
                      <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='xs' noOfLines={1} maxW='260px'>
                        {t.subject}
                      </Text>
                    </Td>
                    <Td>
                      <Text color={themeColors.textSecondary} fontSize='xs'>{t.requester.name}</Text>
                    </Td>
                    <Td>
                      <Badge
                        bg={isDark ? "rgba(220, 38, 38, 0.2)" : "#fef2f2"}
                        color='#dc2626'
                        border='1px solid #fecaca'
                        fontSize='10px'>
                        {t.priority}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        bg={themeColors.subCardBg}
                        color={themeColors.textPrimary}
                        border={`1px solid ${themeColors.borderLight}`}
                        fontSize='10px'>
                        {t.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Text color={themeColors.textSecondary} fontSize='xs'>{t.assignedTo ? t.assignedTo.name : "Unassigned"}</Text>
                    </Td>
                    <Td>
                      <Button
                        size='xs'
                        bg={themeColors.buttonPrimaryBg}
                        color={themeColors.buttonPrimaryColor}
                        _hover={{ bg: themeColors.buttonPrimaryHover }}>
                        Open Workbench
                      </Button>
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
