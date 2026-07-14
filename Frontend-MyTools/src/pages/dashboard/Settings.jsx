import { useState } from 'react';
import { Bell, Globe2, Lock, Moon, Settings, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useKeycloak } from '../../providers/KeycloakProvider';

const Section = ({ icon: Icon, title, description, children }) => (
  <section className="rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] bg-[#f5f5f3] dark:bg-[#2d2a27] p-5">
    <div className="flex items-start gap-3 mb-4"><div className="p-2 rounded-xl bg-white dark:bg-[#1a1816]"><Icon size={18} className="text-[#6d2842]" /></div><div><h3 className="font-bold text-lg text-[#2d2a27] dark:text-white">{title}</h3><p className="text-sm text-[#8a8580]">{description}</p></div></div>
    {children}
  </section>
);

const SettingsPage = () => {
  const { user } = useKeycloak();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState({ email: true, booking: true, marketing: false });
  const [language, setLanguage] = useState('en');

  return (
    <div>
      <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-gradient-to-br from-[#4a4642] to-[#6d6762] rounded-2xl shadow-lg shadow-[#4a4642]/30"><Settings className="w-6 h-6 text-[#fafaf9]" /></div><div><h2 className="text-3xl font-bold text-[#2d2a27] dark:text-[#fafaf9]">{t('settings.title')}</h2><p className="text-sm text-[#8a8580]">{t('settings.description')}</p></div></div>
      <div className="space-y-4">
        <Section icon={User} title={t('settings.profile')} description={t('settings.profileDescription')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm"><div><span className="text-[#8a8580]">{t('settings.username')}</span><p className="font-semibold">{user?.username || '—'}</p></div><div><span className="text-[#8a8580]">{t('settings.email')}</span><p className="font-semibold">{user?.email || '—'}</p></div></div>
        </Section>
        <Section icon={Lock} title={t('settings.password')} description={t('settings.passwordDescription')}>
          <p className="text-sm text-[#8a8580]">{t('settings.passwordHelp')}</p>
        </Section>
        <Section icon={Bell} title={t('settings.notifications')} description={t('settings.notificationsDescription')}>
          <div className="space-y-2">{Object.entries(notifications).map(([key, value]) => <label key={key} className="flex items-center justify-between rounded-xl bg-white dark:bg-[#1a1816] p-3 text-sm capitalize"><span>{key} notifications</span><input type="checkbox" checked={value} onChange={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))} /></label>)}</div>
        </Section>
        <Section icon={Moon} title={t('settings.theme')} description={t('settings.themeDescription')}>
          <button onClick={toggleTheme} className="rounded-xl bg-[#6d2842] text-white px-4 py-2 font-semibold">{t('settings.useMode', { mode: isDarkMode ? 'Light' : 'Dark' })}</button>
        </Section>
        <Section icon={Globe2} title={t('settings.language')} description={t('settings.languageDescription')}>
          <select value={language} onChange={(e) => { setLanguage(e.target.value); i18n.changeLanguage(e.target.value); }} className="w-full md:w-64 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#1a1816] px-3 py-2"><option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option></select>
        </Section>
      </div>
    </div>
  );
};

export default SettingsPage;
