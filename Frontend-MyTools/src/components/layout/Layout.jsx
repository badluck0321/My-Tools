import Navbar from './Navbar';
import Footer from './Footer';
import { Chatbot } from '../common';
import { useTheme } from '../../hooks/useTheme';
// import { useKeycloak } from '../../providers/KeycloakProvider';

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();
  // const { user } = useKeycloak();
  
  // Show chatbot only to visitors (non-artists or unauthenticated users)
  // const showChatbot = !user || user.role !== 'artist';
    const showChatbot = 'artist';

  
  return (
    <div 
      className="flex flex-col min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: isDarkMode ? '#1a1816' : '#fafaf9',
        color: isDarkMode ? '#fafaf9' : '#2d2a27'
      }}
    >
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      
      {/* AI Chatbot - Only visible to visitors */}
      {showChatbot && <Chatbot />}
    </div>
  );
};

export default Layout;
