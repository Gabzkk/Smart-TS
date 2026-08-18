import React, { useState } from "react";
import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  Switch,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Divider,
  Icon,
  Avatar,
  useToast,
  Select,
} from "@chakra-ui/react";
import {
  FiSliders,
  FiBell,
  FiZap,
  FiClock,
  FiRefreshCw,
  FiVolume2,
  FiShield,
  FiCheck,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { Separator } from "components/Separator/Separator";
import ThemeToggle from "components/ThemeToggle/ThemeToggle";
import PropTypes from "prop-types";
import { useTickets } from "context/TicketContext";

export default function Configurator(props) {
  const { secondary, isOpen, onClose, fixed, onSwitch, ...rest } = props;
  const toast = useToast();
  const {
    currentUser,
    users,
    switchUser,
    resetToDefaults,
    tickets,
    colorMode,
    isDark,
    toggleColorMode,
    themeColors,
  } = useTickets();

  // Local Preferences
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [slaPulse, setSlaPulse] = useState(true);
  const [isFixedNavbar, setIsFixedNavbar] = useState(fixed || false);

  const handleResetData = () => {
    resetToDefaults();
    toast({
      title: "System Data Reset",
      description: "Clean initial state restored for all tickets, SLA policies, and users.",
      status: "info",
      duration: 3000,
    });
  };

  const handleTestPing = () => {
    toast({
      title: "Dispatch Heartbeat Normal",
      description: `All 5 queue channels operational. ${tickets.length} tickets synced.`,
      status: "success",
      duration: 2500,
    });
  };

  const settingsRef = React.useRef();

  return (
    <Drawer
      isOpen={props.isOpen}
      onClose={props.onClose}
      placement={document.documentElement.dir === "rtl" ? "left" : "right"}
      finalFocusRef={settingsRef}
      blockScrollOnMount={false}
      size='sm'>
      <DrawerOverlay backdropFilter='blur(6px)' />
      <DrawerContent
        bg={themeColors.cardBg}
        borderLeft={`1px solid ${themeColors.cardBorder}`}
        backdropFilter={themeColors.glassBackdrop}
        boxShadow={themeColors.cardShadow}
        color={themeColors.textPrimary}>
        <DrawerHeader pt='24px' px='24px'>
          <DrawerCloseButton color={themeColors.textPrimary} mt='8px' />
          <HStack spacing='10px' mb='6px'>
            <Flex
              w='32px'
              h='32px'
              borderRadius='8px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              justify='center'
              align='center'
              color={themeColors.textPrimary}>
              <Icon as={FiSliders} w='18px' h='18px' />
            </Flex>
            <Text color={themeColors.textPrimary} fontSize='lg' fontWeight='bold'>
              Helpdesk Quick Controls
            </Text>
          </HStack>
          <Text color={themeColors.textSecondary} fontSize='xs'>
            Live support dispatch preferences, theme modes, alerts, and active role.
          </Text>
          <Separator bg={themeColors.borderLight} mt='16px' />
        </DrawerHeader>

        <DrawerBody px='24px' pb='32px'>
          <VStack align='stretch' spacing='20px'>
            {/* Dark Mode / Light Mode Quick Toggle with Ripple Animation */}
            <Box
              p='16px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              backdropFilter={themeColors.glassBackdrop}
              borderRadius='14px'>
              <Flex justify='space-between' align='center'>
                <HStack spacing='12px'>
                  <Icon as={isDark ? FiMoon : FiSun} color={themeColors.textPrimary} w='18px' h='18px' />
                  <Box>
                    <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='bold'>
                      {isDark ? "Dark Glass Theme" : "Pure Light Glass Theme"}
                    </Text>
                    <Text color={themeColors.textSecondary} fontSize='10px'>
                      Monochrome palette with soft glass depth
                    </Text>
                  </Box>
                </HStack>
                <ThemeToggle size='sm' />
              </Flex>
            </Box>

            {/* Active User / Role Switcher */}
            <Box
              p='16px'
              bg={themeColors.subCardBg}
              border={`1px solid ${themeColors.borderLight}`}
              backdropFilter={themeColors.glassBackdrop}
              borderRadius='14px'>
              <Text color={themeColors.textMuted} fontSize='xs' fontWeight='bold' textTransform='uppercase' mb='10px'>
                Active Operator Profile
              </Text>
              <HStack spacing='12px' mb='12px'>
                <Avatar size='sm' name={currentUser.name} src={currentUser.avatar} />
                <Box>
                  <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm'>
                    {currentUser.name}
                  </Text>
                  <Badge bg={themeColors.inputBg} color={themeColors.textPrimary} border={`1px solid ${themeColors.borderLight}`} fontSize='10px'>
                    {currentUser.role}
                  </Badge>
                </Box>
              </HStack>

              <Select
                size='sm'
                bg={themeColors.inputBg}
                borderColor={themeColors.inputBorder}
                color={themeColors.textPrimary}
                borderRadius='10px'
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}>
                {users.map((u) => (
                  <option key={u.id} value={u.id} style={{ background: isDark ? "#121214" : "#fffdfd", color: isDark ? "#fff" : "#000" }}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </Select>
            </Box>

            {/* Helpdesk Preferences Toggles */}
            <Box>
              <Text color={themeColors.textMuted} fontSize='xs' fontWeight='bold' textTransform='uppercase' mb='12px'>
                Live Dispatch Preferences
              </Text>
              <VStack spacing='14px' align='stretch'>
                <Flex justify='space-between' align='center'>
                  <HStack spacing='10px'>
                    <Icon as={FiVolume2} color={themeColors.textPrimary} />
                    <Box>
                      <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='semibold'>
                        Audio Chime on Urgent SLA
                      </Text>
                      <Text color={themeColors.textSecondary} fontSize='10px'>
                        Sound alert when S1/S2 incident arrives
                      </Text>
                    </Box>
                  </HStack>
                  <Switch
                    colorScheme='gray'
                    isChecked={soundAlerts}
                    onChange={(e) => setSoundAlerts(e.target.checked)}
                  />
                </Flex>

                <Flex justify='space-between' align='center'>
                  <HStack spacing='10px'>
                    <Icon as={FiRefreshCw} color={themeColors.textPrimary} />
                    <Box>
                      <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='semibold'>
                        Auto-Refresh Queue (Live)
                      </Text>
                      <Text color={themeColors.textSecondary} fontSize='10px'>
                        Simulate background queue streaming
                      </Text>
                    </Box>
                  </HStack>
                  <Switch
                    colorScheme='gray'
                    isChecked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                </Flex>

                <Flex justify='space-between' align='center'>
                  <HStack spacing='10px'>
                    <Icon as={FiClock} color={themeColors.textPrimary} />
                    <Box>
                      <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='semibold'>
                        SLA Breach Pulse Indicator
                      </Text>
                      <Text color={themeColors.textSecondary} fontSize='10px'>
                        Visual badge highlight on critical tickets
                      </Text>
                    </Box>
                  </HStack>
                  <Switch
                    colorScheme='gray'
                    isChecked={slaPulse}
                    onChange={(e) => setSlaPulse(e.target.checked)}
                  />
                </Flex>

                <Flex justify='space-between' align='center'>
                  <HStack spacing='10px'>
                    <Icon as={FiZap} color={themeColors.textPrimary} />
                    <Box>
                      <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='semibold'>
                        Fixed Sticky Navbar
                      </Text>
                      <Text color={themeColors.textSecondary} fontSize='10px'>
                        Lock top header navigation bar
                      </Text>
                    </Box>
                  </HStack>
                  <Switch
                    colorScheme='gray'
                    isChecked={isFixedNavbar}
                    onChange={(e) => {
                      setIsFixedNavbar(e.target.checked);
                      if (onSwitch) onSwitch(e.target.checked);
                    }}
                  />
                </Flex>
              </VStack>
            </Box>

            <Divider borderColor={themeColors.borderLight} />

            {/* Quick Actions */}
            <VStack spacing='10px' align='stretch'>
              <Text color={themeColors.textMuted} fontSize='xs' fontWeight='bold' textTransform='uppercase'>
                System Diagnostic Tools
              </Text>
              <Button
                size='sm'
                bg={themeColors.buttonPrimaryBg}
                color={themeColors.buttonPrimaryColor}
                _hover={{ bg: themeColors.buttonPrimaryHover }}
                leftIcon={<FiZap />}
                onClick={handleTestPing}>
                Test Queue Dispatch Ping
              </Button>

              <Button
                size='sm'
                variant='outline'
                borderColor={themeColors.borderMuted}
                color={themeColors.textPrimary}
                _hover={{ bg: themeColors.subCardHover }}
                leftIcon={<FiRefreshCw />}
                onClick={handleResetData}>
                Reset Sample Mock Data
              </Button>
            </VStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

Configurator.propTypes = {
  secondary: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  fixed: PropTypes.bool,
  onSwitch: PropTypes.func,
};
