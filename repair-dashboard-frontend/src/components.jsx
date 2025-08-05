import React, { useState } from 'react';
import { 
	Monitor, 
	Wrench, 
	Clock, 
	CheckCircle, 
	XCircle, 
	Plus, 
	Search, 
	Filter,
	Calendar,
	DollarSign,
	Users,
	AlertTriangle,
	Phone,
	Mail,
	MapPin,
	User,
	X,
	Menu,
	ChevronLeft,
	FileText,
	Paperclip
} from 'lucide-react';
import './App.css'

export function Header({ setShowCustomerModal, setActiveTab, setShowInvoiceModal }) {

	return (
		<header>
			<div className="header-items-holder">
				<div>
					<div className="logo">
						<Wrench className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1>TechFix Pro</h1>
						<p>Repair Ticket Management</p>
					</div>
				</div>
				<div>
					
					<AddInvoiceButton setShowInvoiceModal={setShowInvoiceModal}></AddInvoiceButton>
					<AddCustomerButton setShowCustomerModal={setShowCustomerModal}></AddCustomerButton>
					<AddTicketButton setActiveTab={setActiveTab}></AddTicketButton>
					
				</div>
			</div>
		</header>
	)
}

export function AddCustomerButton({ setShowCustomerModal }) {
	return (
		<button 
			onClick={() => setShowCustomerModal(true)}
			className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
		>
			<User className="h-4 w-4" />
			<span>Add Customer</span>
		</button>
	)
}

export function AddTicketButton({ setActiveTab }) {
	return (
		<button 
			onClick={() => setActiveTab('add-ticket')}
			className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
		>
			<Plus className="h-4 w-4" />
			<span>New Ticket</span>
		</button>
	)
}

export function AddInvoiceButton({ setShowInvoiceModal }) {
	return (
		<button 
			onClick={() => setShowInvoiceModal(true)}
			className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
		>
			<FileText className="h-4 w-4" />
			<span>New Invoice</span>
		</button>
	)
}


export function Sidebar({ sidebarCollapsed, setSidebarCollapsed, activeTab, setActiveTab }) {

	return (
		<nav className={"sidebar"} style={{maxWidth: sidebarCollapsed ? '3.25rem' : '12rem' }}>
				{/* Collapse Button */}
				<div className="flex justify-end mb-4">
					<button
						onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
						className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
					>
						{sidebarCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
					</button>
				</div>
				
				{/* Navigation Items */}
				<div className="sidebar-button-holder">
					{[
						{ id: 'overview', label: 'Overview', icon: Monitor },
						{ id: 'tickets', label: 'All Tickets', icon: Wrench },
						{ id: 'add-ticket', label: 'Add Ticket', icon: Plus },
						{ id: 'invoices', label: 'Invoices', icon: FileText },
						{ id: 'customers', label: 'Customers', icon: Users }
					].map(({ id, label, icon: Icon }) => (
						<button
							key={id}
							onClick={() => setActiveTab(id)}
							className={`sidebar-button ${
								activeTab === id 
									? 'bg-blue-50 text-blue-700' 
									: 'text-gray-600 hover:bg-gray-50'
							}`}
							style={{paddingInline: sidebarCollapsed ? '.5rem' : '.75rem' }}
							title={sidebarCollapsed ? label : undefined}
						>
							<Icon/>
							<span>{label}</span>
						</button>
					))}
				</div>
		</nav>
	)
}


export function CustomerModal({ customers, setCustomers, setShowCustomerModal }) {

	const [newCustomer, setNewCustomer] = useState({
		name: '',
		email: '',
		phone: ''
	});

	const handleAddCustomer = () => {
		if (newCustomer.name.trim()) {
			const customer = {
				id: Math.max(...customers.map(c => c.id), 0) + 1,
				name: newCustomer.name,
				email: newCustomer.email,
				phone: newCustomer.phone,
				created_at: new Date().toISOString().split('T')[0]
			};
			
			setCustomers([...customers, customer]);
			setNewCustomer({ name: '', email: '', phone: '' });
			setShowCustomerModal(false);
		}
	};

	return (
		<div className="customer-modal-overlay">
			<div className="customer-modal">
				<div className="modal-header">
					<h3>Add New Customer</h3>
					<button onClick={() => setShowCustomerModal(false)} >
						<X/>
					</button>
				</div>
				<div className="modal-form-holder">
					<div>
						<label>Name</label>
						<input
							type="text"
							value={newCustomer.name}
							onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
							placeholder="Enter customer name"
						/>
					</div>
					<div>
						<label>Email</label>
						<input
							type="email"
							value={newCustomer.email}
							onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
							placeholder="Enter email address"
						/>
					</div>
					<div>
						<label>Phone</label>
						<input
							type="tel"
							value={newCustomer.phone}
							onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
							placeholder="(555) 123-4567"
						/>
					</div>
				</div>
				<div className="modal-button-holder">
					<button
						onClick={() => {
							setShowCustomerModal(false);
							setNewCustomer({ name: '', email: '', phone: '' });
						}}
						className="cancel-customer"
					>
						Cancel
					</button>
					<button
						onClick={handleAddCustomer}
						disabled={!newCustomer.name.trim()}
						className="add-customer"
					>
						Add Customer
					</button>
				</div>
			</div>
		</div>
	)
}

export function TicketsDisplay({ groupedTickets, groupBy, getCustomerById, setViewingTicket, setViewingCustomer, updateTicketStatus, statusColors }) {
	
	function snakeCaseToTitleCase(str) {
		return str
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}
	
	return (
		<>
			{Object.entries(groupedTickets).map(([groupName, groupTickets]) => (

				<div key={groupName} className="ticket-group">
					{groupBy !== 'none' && (
						<div className="px-6 py-3 bg-gray-50 border-b rounded-t-lg">
							<h3 className="text-lg font-medium text-gray-900">
								{groupName} ({groupTickets.length})
							</h3>
						</div>
					)}
					
						<table>
							
							{(groupBy === 'none' || Object.keys(groupedTickets)[0] === groupName) && (
								<thead>
									<tr>
										<th className="table-header-item">#</th>
										<th className="table-header-item">Customer</th>
										<th className="table-header-item">Subject</th>
										<th className="table-header-item">Status</th>
										<th className="table-header-item">Created</th>
										<th className="table-header-item">Updated</th>
									</tr>
								</thead>
							)}

							<tbody>
								{groupTickets.map(ticket => {
									const customer = getCustomerById(ticket.customer_id);
									return (
										<tr key={ticket.id}>

											<td className="px-3 py-3 text-sm font-medium text-gray-900">
												<button 
													onClick={() => setViewingTicket(ticket)}
													className="text-blue-600 hover:text-blue-800 block w-full text-left"
													title={`#${ticket.id}`}
												>
													{ticket.id}
												</button>
											</td>

											<td className="customer">
												<button
													onClick={() => setViewingCustomer(customer)}
													className="text-sm font-medium text-blue-600 hover:text-blue-800 block w-full text-left"
													title={customer?.name}
												>
													{customer?.name}
												</button>
											</td>

											<td className="description">
												<span
													onClick={() => setViewingTicket(ticket)}
													title={ticket.issue_description}
												>
													{ticket.issue_description}
												</span>
											</td>

											<td className="status">
												<span
													className={`status-label text-xs px-2 py-1 rounded-full border-0 w-full ${statusColors[ticket.status]}`}
													>{snakeCaseToTitleCase(ticket.status)}</span>

											</td>

											<td className="date">
												<span title={ticket.created_at}>
													{ticket.created_at}
												</span>
											</td>

											<td className="date">
												<span title={ticket.updated_at}>
													{ticket.updated_at}
												</span>
											</td>

										</tr>

									);
								})}

							</tbody>
						</table>
					
				</div>

			))}
		</>
	)
}