export const themeOptions = [
  {
    id: "dark",
    label: "Dark",
    description: "Current AstroNexus dark interface.",
    previewClassName: "from-slate-700 via-slate-800 to-slate-900"
  },
  {
    id: "light",
    label: "Light",
    description: "Clean white layout across all pages.",
    previewClassName: "from-slate-100 via-white to-slate-200"
  }
] as const;

export type ThemeName = (typeof themeOptions)[number]["id"];

export const defaultTheme: ThemeName = "dark";

export function isThemeName(value: string | null | undefined): value is ThemeName {
  return themeOptions.some((theme) => theme.id === value);
}

export function getThemeMeta(theme: ThemeName) {
  return themeOptions.find((option) => option.id === theme) ?? themeOptions[0];
}
