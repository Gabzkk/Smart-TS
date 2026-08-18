import React from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Badge,
  HStack,
  VStack,
  Avatar,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon, BellIcon } from "@chakra-ui/icons";
import { FiUserCheck, FiPlus, FiAlertTriangle, FiCheck, FiLayers } from "react-icons/fi";
import { SettingsIcon } from "components/Icons/Icons";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import ThemeToggle from "components/ThemeToggle/ThemeToggle";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import routes from "routes.js";
import { useTickets } from "context/TicketContext";

export default function HeaderLinks(props) {
  const { variant, children, fixed, secondary, onOpen, ...rest } = props;
  const history = useHistory();
  const {
    currentUser,
    users,
    switchUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    themeColors,
    isDark,
  } = useTickets();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const settingsRef = React.useRef();

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems='center'
      flexDirection='row'
      gap={{ base: "8px", md: "12px" }}>
      {/* Quick Search */}
      <InputGroup
        cursor='pointer'
        bg={themeColors.inputBg}
        borderRadius='12px'
        border={`1px solid ${themeColors.borderLight}`}
        backdropFilter='blur(12px)'
        w={{ sm: "100px", md: "160px", lg: "200px" }}>
        <InputLeftElement
          children={
            <IconButton
              bg='inherit'
              borderRadius='inherit'
              _hover='none'
              icon={<SearchIcon color={themeColors.textSecondary} w='14px' h='14px' />}
            />
          }
        />
        <Input
          fontSize='xs'
          py='11px'
          color={themeColors.textPrimary}
          placeholder='Quick search...'
          borderRadius='inherit'
          onKeyDown={(e) => {
            if (e.key === "Enter") history.push("/admin/tickets");
          }}
        />
      </InputGroup>

      {/* Role Switcher Menu */}
      <Menu>
        <MenuButton
          as={Button}
          size='sm'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.borderLight}`}
          backdropFilter={themeColors.glassBackdrop}
          borderRadius='12px'
          px='10px'
          _hover={{ bg: themeColors.subCardHover }}>
          <HStack spacing='8px'>
            <Avatar size='xs' name={currentUser.name} src={currentUser.avatar} />
            <VStack align='flex-start' spacing='0' display={{ base: "none", md: "flex" }}>
              <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='bold' lineHeight='1'>
                {currentUser.name}
              </Text>
              <Text color={themeColors.textSecondary} fontSize='9px' lineHeight='1'>
                {currentUser.role}
              </Text>
            </VStack>
          </HStack>
        </MenuButton>
        <MenuList
          bg={themeColors.cardBg}
          borderColor={themeColors.borderLight}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}
          p='8px'>
          <Text px='12px' py='4px' fontSize='10px' color={themeColors.textMuted} fontWeight='bold' textTransform='uppercase'>
            Simulate User Role (RBAC Testing):
          </Text>
          {users.map((u) => (
            <MenuItem
              key={u.id}
              bg={u.id === currentUser.id ? themeColors.subCardBg : "transparent"}
              _hover={{ bg: themeColors.subCardHover }}
              borderRadius='8px'
              onClick={() => switchUser(u.id)}
              mb='4px'>
              <HStack spacing='10px' w='100%' justify='space-between'>
                <HStack spacing='8px'>
                  <Avatar size='xs' name={u.name} src={u.avatar} />
                  <Box>
                    <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='bold'>
                      {u.name}
                    </Text>
                    <Text color={themeColors.textSecondary} fontSize='10px'>
                      {u.role} • {u.team || u.company}
                    </Text>
                  </Box>
                </HStack>
                {u.id === currentUser.id && <Icon as={FiCheck} color={themeColors.textPrimary} />}
              </HStack>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      {/* Theme Toggle with slow ripple animation */}
      <ThemeToggle size='sm' />

      {/* Notifications Popover Menu */}
      <Menu>
        <MenuButton position='relative' p='8px'>
          <BellIcon color={themeColors.textPrimary} w='20px' h='20px' />
          {unreadCount > 0 && (
            <Badge
              position='absolute'
              top='2px'
              right='2px'
              bg={themeColors.buttonPrimaryBg}
              color={themeColors.buttonPrimaryColor}
              borderRadius='full'
              fontSize='9px'
              px='4px'
              py='1px'>
              {unreadCount}
            </Badge>
          )}
        </MenuButton>

        <MenuList
          border={`1px solid ${themeColors.borderLight}`}
          boxShadow={themeColors.cardShadow}
          bg={themeColors.cardBg}
          backdropFilter={themeColors.glassBackdrop}
          borderRadius='16px'
          w='320px'
          p='12px'>
          <Flex justify='space-between' align='center' mb='10px' px='6px'>
            <Text color={themeColors.textPrimary} fontWeight='bold' fontSize='sm'>
              Support Notifications
            </Text>
            {unreadCount > 0 && (
              <Button size='xs' variant='ghost' color={themeColors.textSecondary} _hover={{ color: themeColors.textPrimary }} onClick={markAllNotificationsRead}>
                Mark all read
              </Button>
            )}
          </Flex>

          <VStack align='stretch' spacing='8px' maxH='300px' overflowY='auto'>
            {notifications.map((n) => (
              <Box
                key={n.id}
                p='10px'
                bg={n.read ? themeColors.subCardBg : themeColors.cardBg}
                border={`1px solid ${themeColors.borderLight}`}
                borderRadius='10px'
                _hover={{ bg: themeColors.subCardHover, cursor: "pointer" }}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.ticketId) history.push(`/admin/tickets/${n.ticketId}`);
                }}>
                <Flex justify='space-between' align='flex-start'>
                  <Text color={themeColors.textPrimary} fontSize='xs' fontWeight='bold'>
                    {n.title}
                  </Text>
                  {!n.read && <Badge bg={themeColors.buttonPrimaryBg} boxSize='6px' borderRadius='full' />}
                </Flex>
                <Text color={themeColors.textSecondary} fontSize='11px' mt='2px' noOfLines={2}>
                  {n.message}
                </Text>
                <Text color={themeColors.textMuted} fontSize='9px' mt='4px'>
                  {new Date(n.timestamp).toLocaleTimeString()}
                </Text>
              </Box>
            ))}
          </VStack>
        </MenuList>
      </Menu>

      <SidebarResponsive
        iconColor={themeColors.textPrimary}
        logoText={props.logoText}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />

      <SettingsIcon
        cursor='pointer'
        ref={settingsRef}
        onClick={() => history.push("/admin/settings")}
        color={themeColors.textPrimary}
        w='18px'
        h='18px'
      />
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
