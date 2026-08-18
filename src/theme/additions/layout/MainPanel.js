const MainPanel = {
  baseStyle: {
    float: "right",
    maxWidth: "100%",
    minHeight: "100vh",
    position: "relative",
    transition: "all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)",
    transitionDuration: ".2s, .2s, .35s",
    transitionProperty: "top, bottom, width, background-color",
    transitionTimingFunction: "linear, linear, ease, ease",
  },
  variants: {
    main: (props) => ({
      float: "right",
    }),
    rtl: (props) => ({
      float: "left",
    }),
  },
  defaultProps: {
    variant: "main",
  },
};

export const MainPanelComponent = {
  components: {
    MainPanel,
  },
};
