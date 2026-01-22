import Analytics from './pages/Analytics';
import ArchetypeChat from './pages/ArchetypeChat';
import Home from './pages/Home';
import Insights from './pages/Insights';
import Journal from './pages/Journal';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import AboutYou from './pages/AboutYou';
import EditProfile from './pages/EditProfile';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Analytics": Analytics,
    "ArchetypeChat": ArchetypeChat,
    "Home": Home,
    "Insights": Insights,
    "Journal": Journal,
    "Onboarding": Onboarding,
    "Profile": Profile,
    "Friends": Friends,
    "AboutYou": AboutYou,
    "EditProfile": EditProfile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};