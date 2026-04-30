import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/layout";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
{/* 
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        /> */}
      </Router>
    </ThemeProvider>
  );
}

export default App;