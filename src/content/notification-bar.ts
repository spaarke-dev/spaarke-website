/**
 * Top notification bar — dismissible thin strip.
 */

export type NotificationBarContent = {
  text: string;
  cta: {
    label: string;
    href: string;
  };
};

export const notificationBarContent: NotificationBarContent = {
  text: "Now accepting early access partners",
  cta: {
    label: "request access today",
    href: "/access-request",
  },
};
