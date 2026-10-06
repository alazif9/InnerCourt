/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * PAGES maps a page name to its component; Layout wraps every page.
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AboutYou from './pages/AboutYou';
import EditProfile from './pages/EditProfile';
import HelpSupport from './pages/HelpSupport';
import Home from './pages/Home';
import InsightDetail from './pages/InsightDetail';
import Insights from './pages/Insights';
import Journal from './pages/Journal';
import Library from './pages/Library';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import TermsOfService from './pages/TermsOfService';
import __Layout from './Layout';


export const PAGES = {
    "AboutYou": AboutYou,
    "EditProfile": EditProfile,
    "HelpSupport": HelpSupport,
    "Home": Home,
    "InsightDetail": InsightDetail,
    "Insights": Insights,
    "Journal": Journal,
    "Library": Library,
    "Onboarding": Onboarding,
    "Profile": Profile,
    "Settings": Settings,
    "TermsOfService": TermsOfService,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};