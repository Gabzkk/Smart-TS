import React, { useState } from "react";
import { Box, IconButton, Tooltip, keyframes } from "@chakra-ui/react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTickets } from "context/TicketContext";

// Continuous ambient slow ripple pulse wave
const ambientRipple = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.7;
    box-shadow: 0 0 0 0 rgba(24, 24, 27, 0.3);
  }
  50% {
    transform: scale(1.05);
    opacity: 0.3;
    box-shadow: 0 0 0 16px rgba(24, 24, 27, 0);
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
    box-shadow: 0 0 0 0 rgba(24, 24, 27, 0);
  }
`;

const darkAmbientRipple = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.8;
    box-shadow: 0 0 0 0 rgba(244, 244, 245, 0.35);
  }
  50% {
    transform: scale(1.05);
    opacity: 0.2;
    box-shadow: 0 0 0 16px rgba(244, 244, 245, 0);
  }
  100% {
    transform: scale(0.95);
    opacity: 0.8;
    box-shadow: 0 0 0 0 rgba(244, 244, 245, 0);
  }
`;

// Fast expanding click ripple wave
const clickRippleAnim = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`;

export default function ThemeToggle({ size = "md", ...props }) {
  const { colorMode, isDark, toggleColorMode, themeColors } = useTickets();
  const [isRippling, setIsRippling] = useState(false);

  const handleClick = () => {
    setIsRippling(true);
    toggleColorMode();
    setTimeout(() => setIsRippling(false), 600);
  };

  return (
    <Tooltip
      label={isDark ? "Switch to Pure Light Glass" : "Switch to Deep Dark Glass"}
      placement='bottom'
      hasArrow>
      <Box position='relative' display='inline-flex' alignItems='center' justifyContent='center'>
        {/* Ambient Expanding Wave Ring */}
        <Box
          position='absolute'
          inset='-2px'
          borderRadius='14px'
          pointerEvents='none'
          animation={`${isDark ? darkAmbientRipple : ambientRipple} 3s infinite ease-in-out`}
        />

        {/* Click Expanding Wave Overlay */}
        {isRippling && (
          <Box
            position='absolute'
            inset='0'
            borderRadius='12px'
            border='2px solid'
            borderColor={isDark ? "rgba(244, 244, 245, 0.8)" : "rgba(24, 24, 27, 0.6)"}
            pointerEvents='none'
            animation={`${clickRippleAnim} 0.6s ease-out forwards`}
          />
        )}

        <IconButton
          aria-label='Toggle theme mode'
          icon={
            <Box
              transition='transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              _hover={{ transform: "rotate(25deg) scale(1.15)" }}>
              {isDark ? <FiSun size='16px' /> : <FiMoon size='16px' />}
            </Box>
          }
          size={size}
          onClick={handleClick}
          bg={isDark ? "rgba(32, 32, 40, 0.8)" : "rgba(255, 253, 253, 0.8)"}
          color={isDark ? "#f4f4f5" : "#18181b"}
          border='1px solid'
          borderColor={isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(225, 225, 227, 0.8)"}
          backdropFilter='blur(16px) saturate(180%)'
          boxShadow={isDark ? "0 4px 16px rgba(0, 0, 0, 0.4)" : "0 2px 12px rgba(0, 0, 0, 0.05)"}
          borderRadius='12px'
          _hover={{
            bg: isDark ? "rgba(42, 42, 52, 0.95)" : "rgba(244, 244, 244, 0.95)",
            borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(24, 24, 27, 0.3)",
            transform: "translateY(-1px)",
          }}
          _active={{
            transform: "scale(0.92)",
          }}
          transition='all 0.25s ease'
          {...props}
        />
      </Box>
    </Tooltip>
  );
}
