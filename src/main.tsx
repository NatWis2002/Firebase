import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <FluentProvider theme={webDarkTheme}>
      <QueryClientProvider client={queryClient}>
        {/* <App /> */}
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </FluentProvider>
  </BrowserRouter>
);
