export default defineAppConfig({
  ui: {
    colors: {
      primary: "sand",
      neutral: "warm",
    },
    button: {
      slots: {
        base: "cursor-pointer",
      },
    },
    navigationMenu: {
      compoundVariants: [
        {
          color: "primary",
          variant: "link",
          active: true,
          class: {
            link: "bg-primary/10 rounded",
          },
        },
      ],
    },
  },
});
