import { Archivo } from "next/font/google";

/**
 * One family carries the whole site: Archivo at normal width for reading,
 * squeezed to its narrowest width for tour-print display type.
 */
export const fontSans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});
