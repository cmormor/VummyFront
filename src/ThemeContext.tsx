// import { createContext, useMemo, useState, useContext } from "react";
// import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// // eslint-disable-next-line react-refresh/only-export-components
// export const ThemeContext = createContext({
//   toggleTheme: () => {},
//   mode: "dark",
// });

// // eslint-disable-next-line react-refresh/only-export-components
// export const useThemeContext = () => useContext(ThemeContext);

// export const ThemeContextProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [mode, setMode] = useState<"light" | "dark">("dark");

//   const toggleTheme = () => {
//     setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
//   };

//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode,
//           ...(mode === "dark"
//             ? {
//                 background: {
//                   default: "#121212",
//                   paper: "#1e1e1e",
//                 },
//                 text: {
//                   primary: "#ffffff",
//                 },
//               }
//             : {
//                 background: {
//                   default: "#ffffff",
//                   paper: "#f5f5f5",
//                 },
//                 text: {
//                   primary: "#000000",
//                 },
//               }),
//         },
//       }),
//     [mode]
//   );

//   return (
//     <ThemeContext.Provider value={{ toggleTheme, mode }}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </ThemeContext.Provider>
//   );
// };
