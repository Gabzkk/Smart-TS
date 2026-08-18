import React from "react";
import { Box, useStyleConfig } from "@chakra-ui/react";

const MainPanel = React.forwardRef((props, ref) => {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig("MainPanel", { variant });
  return (
    <Box ref={ref} __css={styles} {...rest}>
      {children}
    </Box>
  );
});

export default MainPanel;
