function initializeThemeToggle() {
  const element = document.getElementById("theme_toggle");
  const theme = localStorage.getItem("theme");

  const prefersTheme = (theme) =>
    window.matchMedia(`(prefers-color-scheme: ${theme})`).matches;

  const setTheme = (theme) => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
    setSwitchState(theme);
  };

  const setSwitchState = (theme) => {
    switch (theme) {
      case "dark":
        element.checked = true;
        break;
      case "light":
        element.checked = false;
        break;
      default:
        throw new Error("unknown theme");
    }
  };

  const determinePosition = () => {
    if (theme) {
      setTheme(theme);
    } else {
      if (prefersTheme("dark")) {
        setTheme("dark");
        return;
      } else {
        setTheme("light");
      }
    }
  };

  element.addEventListener("click", () => {
    if (element.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  });

  determinePosition();
}

document.addEventListener("DOMContentLoaded", initializeThemeToggle);
