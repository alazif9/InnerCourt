import Home from './pages/Home';
import ArchetypeChat from './pages/ArchetypeChat';
import Journal from './pages/Journal';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "ArchetypeChat": ArchetypeChat,
    "Journal": Journal,
    "Analytics": Analytics,
    "Insights": Insights,
    "Profile": Profile,
    "Onboarding": Onboarding,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};