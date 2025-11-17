export default function ThemeProvider() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
const lightModePref = window.matchMedia("(prefers-color-scheme: light)");
function getUserPref() {
  const storedTheme = typeof localStorage !== "undefined" && localStorage.getItem("theme");
  return storedTheme || (lightModePref.matches ? "light" : "dark");
}
function setTheme(newTheme) {
  if (newTheme !== "light" && newTheme !== "dark") {
    return console.warn(
      \`Invalid theme value '\${newTheme}' received. Expected 'light' or 'dark'.\`
    );
  }
  const root = document.documentElement;
  if (newTheme === root.getAttribute("data-theme")) return;
  root.setAttribute("data-theme", newTheme);
  const colorThemeMetaTag = document.querySelector("meta[name='theme-color']");
  if (colorThemeMetaTag) {
    const bgColor = getComputedStyle(document.body).getPropertyValue("--theme-bg");
    colorThemeMetaTag.setAttribute("content", \`hsl(\${bgColor})\`);
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme", newTheme);
  }
}
setTheme(getUserPref());
document.addEventListener("astro:after-swap", () => setTheme(getUserPref()));
document.addEventListener("theme-change", (e) => {
  setTheme(e.detail.theme);
});
lightModePref.addEventListener("change", (e) =>
  setTheme(e.matches ? "light" : "dark")
);
`,
      }}
    />
  );
}
