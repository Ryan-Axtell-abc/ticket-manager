import { AppSidebar } from "@/components/app-sidebar"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';


import TicketsPage from '@/pages/TicketsPage';
import TicketDetails from '@/pages/TicketDetails';
//import CustomersPage from "@/pages/CustomersPage";
import CustomerDetails from '@/pages/CustomerDetails';
import InvoicesPage from "@/pages/InvoicesPage"
import DashboardPage from "@/pages/DashboardPage"
import InvoiceDetails from "@/pages/InvoiceDetails"
import { useState, createContext, useContext, useLayoutEffect } from "react";

import { AppContext } from "@/components/AppContext";
import { Header } from "@/components/header"
import { TooltipProvider } from "@/components/ui/tooltip"


function AppContent() {
	return (
		<SidebarProvider className="h-full">
			<AppSidebar />

			<SidebarInset className="h-full">
				<div className="@container/main flex flex-col h-full min-h-0">
					<Header />
					<Routes>
						<Route path="/" element={<DashboardPage />} />
						<Route path="/tickets" element={<TicketsPage />} />
						<Route path="/tickets/:id" element={<TicketDetails />} />
						<Route path="/customers" element={<CustomerDetails />} />
						<Route path="/invoices" element={<InvoicesPage />} />
						<Route path="/invoices/:id" element={<InvoiceDetails />} />
					</Routes>
				</div>
			</SidebarInset>

		</SidebarProvider>
	);
}

function AppProvider({ children }) {

	const [hasRightSidebar, setHasRightSidebar] = useState(false);

	return (
		<AppContext.Provider value={{ hasRightSidebar, setHasRightSidebar }}>
			{children}
		</AppContext.Provider>
	);
}


export default function App() {

	useLayoutEffect(() => {
		const updateContentWidth = () => {
		  const contentWidth = document.documentElement.clientWidth;
		  document.documentElement.style.setProperty('--content-width', `${contentWidth}px`);
		};
		
		updateContentWidth();
		window.addEventListener('resize', updateContentWidth);
		return () => window.removeEventListener('resize', updateContentWidth);
	  }, []);

	return (
		<div className="h-screen font-sans">
			<AppProvider>
				<TooltipProvider>
					<BrowserRouter>
						<AppContent />
					</BrowserRouter>
				</TooltipProvider>
			</AppProvider>
		</div>
	)
}
