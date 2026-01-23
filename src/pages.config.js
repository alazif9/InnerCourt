import AboutYou from './pages/AboutYou';
import Analytics from './pages/Analytics';
import ArchetypeChat from './pages/ArchetypeChat';
import EditProfile from './pages/EditProfile';
import Friends from './pages/Friends';
import Home from './pages/Home';
import Insights from './pages/Insights';
import Journal from './pages/Journal';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AboutYou": AboutYou,
    "Analytics": Analytics,
    "ArchetypeChat": ArchetypeChat,
    "EditProfile": EditProfile,
    "Friends": Friends,
    "Home": Home,
    "Insights": Insights,
    "Journal": Journal,
    "Onboarding": Onboarding,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};