import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Edit3, Mail, Phone, Smartphone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconChevronDown, IconDeviceMobile, IconLayoutColumns, IconMail } from "@tabler/icons-react";
import { formatDate } from "@/functions";

import '@/customerDetails.css';
import { useEffect, useRef, useState } from "react";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";



export default function DashboardPage() {


	const [customers, setCustomers] = useState([]);
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Fetch both customers and tickets
		Promise.all([
			fetch('http://localhost:3001/api/customers').then(res => res.json()),
			fetch('http://localhost:3001/api/tickets').then(res => res.json())
		])
			.then(([customersData, ticketsData]) => {
				setCustomers(customersData);
				setTickets(ticketsData);
				setLoading(false);
			})
			.catch(err => {
				setError('Failed to fetch data');
				setLoading(false);
			});
	}, []);

	console.log("tickets:", tickets)

	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<div className="w-full flex-col justify-start gap-6">
				<div className="relative flex flex-col gap-4 overflow-auto">

					<SectionCards />
					<div className="px-4 lg:px-6">
						<ChartAreaInteractive />
					</div>


					{loading && <p>Loading...</p>}
					{error && <p>Error: {error}</p>}

					{!loading && !error && (
						<div>
							<h2>Tickets ({tickets.length})</h2>
							{tickets.map(ticket => (
								<div key={ticket.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
									<p><strong>ID:</strong> {ticket.id}</p>
									<p><strong>Number:</strong> {ticket.ticket_number}</p>
									<p><strong>Customer ID:</strong> {ticket.customer_id}</p>
									<p><strong>Title:</strong> {ticket.title}</p>
									<p><strong>Description:</strong> {ticket.description}</p>
									<p><strong>Status:</strong> {ticket.status}</p>
									<p><strong>Customer:</strong> {ticket.customer_name}</p>
									<p><strong>Customer Phone:</strong> {ticket.customer_phone}</p>
									<p><strong>Customer Email:</strong> {ticket.customer_email}</p>
									<p><strong>Company:</strong> {ticket.customer_company}</p>
									<p><strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
									<p><strong>Updated:</strong> {new Date(ticket.updated_at).toLocaleString()}</p>
								</div>
							))}
						</div>
					)}

				</div>
			</div>
		</div>
	)
}
