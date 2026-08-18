import React from "react";
import { Button, Tooltip, Icon, Box } from "@chakra-ui/react";
import { FiSliders } from "react-icons/fi";
import PropTypes from "prop-types";
import { useTickets } from "context/TicketContext";

export default function FixedPlugin(props) {
  const { onOpen } = props;
  const { themeColors } = useTickets();

  return (
    <Box
      position='fixed'
      right={document.documentElement.dir === "rtl" ? "" : "28px"}
      left={document.documentElement.dir === "rtl" ? "28px" : ""}
      bottom='28px'
      zIndex='99'>
      <Tooltip label='Helpdesk Quick Controls' placement='left'>
        <Button
          h='48px'
          w='48px'
          onClick={onOpen}
          bg={themeColors.buttonPrimaryBg}
          color={themeColors.buttonPrimaryColor}
          _hover={{ bg: themeColors.buttonPrimaryHover, transform: "scale(1.05)" }}
          _active={{ transform: "scale(0.95)" }}
          transition='all 0.2s ease'
          borderRadius='50%'
          boxShadow={themeColors.cardShadow}
          backdropFilter='blur(12px)'>
          <Icon as={FiSliders} w='20px' h='20px' />
        </Button>
      </Tooltip>
    </Box>
  );
}

FixedPlugin.propTypes = {
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
