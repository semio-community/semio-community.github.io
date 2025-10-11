import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { clsx } from "clsx";
import { CallToActionButton } from "../CallToActionButton";

interface MobileNavigationProps {
  menuLinks: Array<{
    path: string;
    title: string;
    inHeader: boolean;
    callToAction?: boolean;
  }>;
  currentPath: string;
  urlPrefix?: string;
}

// Helper function to construct URLs
const makeUrl = (path: string, prefix: string = "") => {
  // Handle absolute paths
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${prefix}${normalizedPath}`;
};

// Hamburger menu icon
const HamburgerIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1={3}
      y1={6}
      x2={21}
      y2={6}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <line
      x1={3}
      y1={12}
      x2={21}
      y2={12}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <line
      x1={3}
      y1={18}
      x2={21}
      y2={18}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

// Close (X) icon
const CloseIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1={6}
      y1={6}
      x2={18}
      y2={18}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <line
      x1={18}
      y1={6}
      x2={6}
      y2={18}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  menuLinks,
  currentPath,
  urlPrefix = "",
}) => {
  const [open, setOpen] = React.useState(false);

  const url = (path: string) => makeUrl(path, urlPrefix);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="relative h-8 w-8 rounded-lg bg-color-100 hover:bg-accent-base/10 text-accent-base md:hidden flex items-center justify-center transition-colors"
          aria-label="Open navigation menu"
        >
          <HamburgerIcon />
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-surface/80 backdrop-blur-xl lg:bg-surface/85 lg:backdrop-blur-lg z-50 focus:outline-none overflow-hidden flex flex-col shadow-2xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[-40%] right-[-20%] w-[60%] h-[60%] bg-gradient-to-b from-orange-500 via-amber-400 to-transparent rounded-full opacity-20 dark:opacity-10 blur-3xl" />
                  <div className="absolute bottom-[-40%] left-[-20%] w-[60%] h-[60%] bg-gradient-to-t from-teal-400 via-amber-400 to-transparent rounded-full opacity-20 dark:opacity-10 blur-3xl" />
                </div>

                <div className="relative flex h-full flex-col">
                  {/* Header */}
                  <motion.div
                    className="flex items-center justify-between p-4 border-b border-accent-base/10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Dialog.Title className="text-lg font-semibold text-foreground">
                      Menu
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="relative h-8 w-8 rounded-lg bg-color-100 hover:bg-accent-base/10 text-accent-base flex items-center justify-center transition-colors focus:outline-2 focus:outline-accent-two outline-offset-2"
                        aria-label="Close navigation"
                      >
                        <CloseIcon />
                      </button>
                    </Dialog.Close>
                  </motion.div>

                  {/* Navigation Items */}
                  <nav className="flex-1 overflow-y-auto p-4">
                    <motion.ul
                      className="space-y-2"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.2,
                          },
                        },
                      }}
                    >
                      {menuLinks
                        .filter((link) => link.inHeader)
                        .map((link) => (
                          <motion.li
                            key={link.path}
                            variants={{
                              hidden: { opacity: 0, x: -20 },
                              visible: { opacity: 1, x: 0 },
                            }}
                          >
                            {link.callToAction ? (
                              <CallToActionButton
                                href={url(link.path)}
                                size="medium"
                                fullWidth
                                className="text-center"
                              >
                                {link.title}
                              </CallToActionButton>
                            ) : (
                              <a
                                href={url(link.path)}
                                className={clsx(
                                  "block px-4 py-3 rounded-lg transition-all duration-200",
                                  currentPath === link.path
                                    ? "bg-accent-base/10 text-accent-two font-semibold"
                                    : "text-foreground hover:bg-accent-base/5 hover:text-accent-base",
                                )}
                              >
                                {link.title}
                              </a>
                            )}
                          </motion.li>
                        ))}
                    </motion.ul>
                  </nav>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
