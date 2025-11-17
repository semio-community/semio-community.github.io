import { menuLinks, siteConfig } from "@/site.config";
import { url } from "@/utils/url";

const shortMenuLinks = menuLinks.map((link) => ({
  ...link,
  title: link.title === "Call for Papers" ? "CfP" : link.title,
}));

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="semibold mt-auto flex w-full flex-col items-center justify-center gap-y-3 sm:gap-y-2 pb-4 pt-8 text-center align-top text-accent sm:flex-row sm:justify-between text-xs sm:text-sm">
      <div className="me-0 font-semibold sm:me-4">
        &copy; {siteConfig.author} {year}.
      </div>
      <nav
        aria-label="More on this site"
        className="flex flex-wrap justify-center sm:justify-between gap-x-1.5 sm:gap-x-2 md:gap-x-3 gap-y-1 font-medium text-light w-full sm:w-auto max-w-full"
      >
        {shortMenuLinks.map((link) => (
          <a
            key={link.path}
            className="underline-offset-2 hover:text-accent hover:underline text-xs sm:text-sm whitespace-nowrap"
            href={url(link.path)}
          >
            {link.title}
          </a>
        ))}
      </nav>
    </footer>
  );
}
