import { HamburgerIcon } from "@chakra-ui/icons";
// chakra imports
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Link,
  Stack,
  Text,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import IconBox from "components/Icons/IconBox";
import { FiLayers } from "react-icons/fi";
import { Separator } from "components/Separator/Separator";
import PropTypes from "prop-types";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTickets } from "context/TicketContext";

// FUNCTIONS

function Sidebar(props) {
  const { themeColors, isDark } = useTickets();
  // to check for active links and opened collapses
  let location = useLocation();
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { sidebarVariant } = props;
    // Chakra Color Mode
    let activeBg = themeColors.subCardBg;
    let inactiveBg = "transparent";
    let activeColor = themeColors.textPrimary;
    let inactiveColor = themeColors.textSecondary;

    return routes.map((prop, key) => {
      if (prop.redirect || prop.hideInSidebar) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <React.Fragment key={key}>
            <Text
              color={themeColors.textMuted}
              fontWeight='bold'
              fontSize='xs'
              textTransform='uppercase'
              letterSpacing='1px'
              mb={{
                xl: "12px",
              }}
              mx='auto'
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py='12px'>
              {document.documentElement.dir === "rtl"
                ? prop.rtlName
                : prop.name}
            </Text>
            {createLinks(prop.views)}
          </React.Fragment>
        );
      }
      return (
        <NavLink to={prop.layout + prop.path} key={key}>
          {activeRoute(prop.layout + prop.path) === "active" ? (
            <Button
              boxSize='initial'
              justifyContent='flex-start'
              alignItems='center'
              boxShadow='none'
              bg={activeBg}
              border={`1px solid ${themeColors.borderLight}`}
              backdropFilter={themeColors.glassBackdrop}
              transition={variantChange}
              mb={{
                xl: "10px",
              }}
              mx={{
                xl: "auto",
              }}
              ps={{
                sm: "10px",
                xl: "14px",
              }}
              py='10px'
              borderRadius='12px'
              _hover={{ bg: themeColors.subCardHover }}
              w='100%'
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}>
              <Flex align='center'>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg={themeColors.buttonPrimaryBg}
                    color={themeColors.buttonPrimaryColor}
                    h='28px'
                    w='28px'
                    borderRadius='8px'
                    me='12px'
                    transition={variantChange}>
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={activeColor} my='auto' fontSize='sm' fontWeight='bold'>
                  {document.documentElement.dir === "rtl"
                    ? prop.rtlName
                    : prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize='initial'
              justifyContent='flex-start'
              alignItems='center'
              bg='transparent'
              mb={{
                xl: "8px",
              }}
              mx={{
                xl: "auto",
              }}
              py='10px'
              ps={{
                sm: "10px",
                xl: "14px",
              }}
              borderRadius='12px'
              _hover={{ bg: themeColors.subCardBg, color: themeColors.textPrimary }}
              w='100%'
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}>
              <Flex align='center'>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg={themeColors.subCardBg}
                    color={themeColors.textSecondary}
                    border={`1px solid ${themeColors.borderLight}`}
                    h='28px'
                    w='28px'
                    borderRadius='8px'
                    me='12px'
                    transition={variantChange}>
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={inactiveColor} my='auto' fontSize='sm' fontWeight='medium'>
                  {document.documentElement.dir === "rtl"
                    ? prop.rtlName
                    : prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };
  const { logoText, routes, sidebarVariant } = props;

  var links = <>{createLinks(routes)}</>;
  //  BRAND
  let sidebarRadius = "16px";
  let sidebarMargins = "16px 0px 16px 16px";
  var brand = (
    <Box pt={"25px"} mb='12px'>
      <NavLink
        to='/admin/dashboard'
        style={{
          display: "flex",
          lineHeight: "100%",
          marginBottom: "24px",
          fontWeight: "bold",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "11px",
        }}>
        <Flex w='28px' h='28px' borderRadius='8px' bg={themeColors.buttonPrimaryBg} justify='center' align='center' color={themeColors.buttonPrimaryColor} me='10px'>
          <Icon as={FiLayers} w='15px' h='15px' />
        </Flex>
        <Box>
          <Text fontSize='sm' letterSpacing='2px' mt='3px' color={themeColors.textPrimary} fontWeight='extrabold'>
            {logoText || "S-TICKET-UP"}
          </Text>
        </Box>
      </NavLink>
      <Separator bg={themeColors.borderLight} />
    </Box>
  );

  // SIDEBAR
  return (
    <Box ref={mainPanel}>
      <Box display={{ sm: "none", xl: "block" }} position='fixed'>
        <Box
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}
          boxShadow={themeColors.cardShadow}
          transition={variantChange}
          w='260px'
          maxW='260px'
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          h='calc(100vh - 32px)'
          ps='20px'
          pe='20px'
          m={sidebarMargins}
          borderRadius={sidebarRadius}>
          <Box>{brand}</Box>
          <Stack direction='column' mb='40px'>
            <Box>{links}</Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

// FUNCTIONS

export function SidebarResponsive(props) {
  const { themeColors, isDark } = useTickets();
  // to check for active links and opened collapses
  let location = useLocation();
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  const mainPanel = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { sidebarVariant } = props;
    // Chakra Color Mode
    let activeBg = themeColors.subCardBg;
    let inactiveBg = "transparent";
    let activeColor = themeColors.textPrimary;
    let inactiveColor = themeColors.textSecondary;

    return routes.map((prop, key) => {
      if (prop.redirect || prop.hideInSidebar) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <React.Fragment key={key}>
            <Text
              color={themeColors.textMuted}
              fontWeight='bold'
              fontSize='xs'
              textTransform='uppercase'
              letterSpacing='1px'
              mb={{
                xl: "12px",
              }}
              mx='auto'
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py='12px'>
              {document.documentElement.dir === "rtl"
                ? prop.rtlName
                : prop.name}
            </Text>
            {createLinks(prop.views)}
          </React.Fragment>
        );
      }
      return (
        <NavLink to={prop.layout + prop.path} key={key}>
          {activeRoute(prop.layout + prop.path) === "active" ? (
            <Button
              boxSize='initial'
              justifyContent='flex-start'
              alignItems='center'
              bg={activeBg}
              border={`1px solid ${themeColors.borderLight}`}
              mb={{
                xl: "10px",
              }}
              mx={{
                xl: "auto",
              }}
              ps={{
                sm: "10px",
                xl: "14px",
              }}
              py='10px'
              borderRadius='12px'
              _hover={{ bg: themeColors.subCardHover }}
              w='100%'
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}>
              <Flex align='center'>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg={themeColors.buttonPrimaryBg}
                    color={themeColors.buttonPrimaryColor}
                    h='28px'
                    w='28px'
                    borderRadius='8px'
                    me='12px'>
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={activeColor} my='auto' fontSize='sm' fontWeight='bold'>
                  {document.documentElement.dir === "rtl"
                    ? prop.rtlName
                    : prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize='initial'
              justifyContent='flex-start'
              alignItems='center'
              bg='transparent'
              mb={{
                xl: "8px",
              }}
              mx={{
                xl: "auto",
              }}
              py='10px'
              ps={{
                sm: "10px",
                xl: "14px",
              }}
              borderRadius='12px'
              _hover={{ bg: themeColors.subCardBg, color: themeColors.textPrimary }}
              w='100%'
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}>
              <Flex align='center'>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg={themeColors.subCardBg}
                    color={themeColors.textSecondary}
                    border={`1px solid ${themeColors.borderLight}`}
                    h='28px'
                    w='28px'
                    borderRadius='8px'
                    me='12px'>
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={inactiveColor} my='auto' fontSize='sm' fontWeight='medium'>
                  {document.documentElement.dir === "rtl"
                    ? prop.rtlName
                    : prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };
  const { logoText, routes, iconColor, ...rest } = props;

  var links = <>{createLinks(routes)}</>;
  //  BRAND
  var brand = (
    <Box pt={"35px"} mb='8px'>
      <NavLink
        to='/admin/dashboard'
        style={{
          display: "flex",
          lineHeight: "100%",
          marginBottom: "24px",
          fontWeight: "bold",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "11px",
        }}>
        <Flex w='28px' h='28px' borderRadius='8px' bg={themeColors.buttonPrimaryBg} justify='center' align='center' color={themeColors.buttonPrimaryColor} me='10px'>
          <Icon as={FiLayers} w='15px' h='15px' />
        </Flex>
        <Box>
          <Text fontSize='sm' letterSpacing='2px' mt='3px' color={themeColors.textPrimary} fontWeight='extrabold'>
            {logoText || "S-TICKET-UP"}
          </Text>
        </Box>
      </NavLink>
      <Separator bg={themeColors.borderLight} />
    </Box>
  );

  // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  // Color variables
  return (
    <Flex
      display={{ sm: "flex", xl: "none" }}
      ref={mainPanel}
      alignItems='center'>
      <HamburgerIcon
        color={themeColors.textPrimary}
        w='18px'
        h='18px'
        ref={btnRef}
        cursor='pointer'
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        finalFocusRef={btnRef}>
        <DrawerOverlay backdropFilter='blur(6px)' />
        <DrawerContent
          w='250px'
          maxW='250px'
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          borderRadius='16px'
          bg={themeColors.cardBg}
          border={`1px solid ${themeColors.cardBorder}`}
          backdropFilter={themeColors.glassBackdrop}>
          <DrawerCloseButton
            color={themeColors.textPrimary}
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW='250px' px='1rem'>
            <Box maxW='100%' h='100vh'>
              <Box>{brand}</Box>
              <Stack direction='column' mb='40px'>
                <Box>{links}</Box>
              </Stack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

Sidebar.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};
SidebarResponsive.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

export default Sidebar;
