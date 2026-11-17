import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Instrument_Serif as FontDisplay,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-fira",
});

export const fontDisplay = FontDisplay({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});
