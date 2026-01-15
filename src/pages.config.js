import Home from './pages/Home';
import ArchetypeChat from './pages/ArchetypeChat';
import Journal from './pages/Journal';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "ArchetypeChat": ArchetypeChat,
    "Journal": Journal,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};