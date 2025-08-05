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
import { CustomerModal, Header, Sidebar, TicketsDisplay } from "./components"

const App = () => {
	const [activeTab, setActiveTab] = useState('overview');
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState(['all']);
	const [groupBy, setGroupBy] = useState('none');
	const [showStatusDropdown, setShowStatusDropdown] = useState(false);
	const [customerSearch, setCustomerSearch] = useState('');
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [showCustomerModal, setShowCustomerModal] = useState(false);
	const [viewingTicket, setViewingTicket] = useState(null);
	const [viewingCustomer, setViewingCustomer] = useState(null);
	const [newUpdate, setNewUpdate] = useState('');
	const [newNote, setNewNote] = useState('');
	const [noteType, setNoteType] = useState('public');
	const [resizing, setResizing] = useState(null);
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [viewingInvoice, setViewingInvoice] = useState(null);
	const [showInvoiceModal, setShowInvoiceModal] = useState(false);
	const [showAttachInvoiceModal, setShowAttachInvoiceModal] = useState(false);

	// Sample customers data
	const [customers, setCustomers] = useState([
		{
			id: 1,
			name: 'John Smith',
			email: 'john.smith@email.com',
			phone: '(555) 123-4567',
			created_at: '2024-01-15'
		},
		{
			id: 2,
			name: 'Sarah Johnson',
			email: 'sarah.j@email.com',
			phone: '(555) 987-6543',
			created_at: '2024-02-20'
		},
		{
			id: 3,
			name: 'Mike Wilson',
			email: 'mike.wilson@email.com',
			phone: '(555) 456-7890',
			created_at: '2024-03-10'
		},
		{
			id: 4,
			name: 'Emma Davis',
			email: 'emma@email.com',
			phone: '(555) 234-5678',
			created_at: '2024-03-25'
		}
	]);

	// Sample invoices data
	const [invoices, setInvoices] = useState([
		{
			id: 1,
			invoice_number: 'INV-2024-001',
			customer_id: 1,
			ticket_ids: [1],
			status: 'paid',
			issue_date: '2024-06-01',
			due_date: '2024-06-15',
			paid_date: '2024-06-03',
			line_items: [
				{ id: 1, description: 'Screen replacement - MacBook Pro 13"', quantity: 1, unit_price: 250.00, total: 250.00 },
				{ id: 2, description: 'Labor - 2 hours', quantity: 2, unit_price: 75.00, total: 150.00 }
			],
			subtotal: 400.00,
			tax_rate: 0.08,
			tax_amount: 32.00,
			total_amount: 432.00,
			notes: 'Payment received via credit card'
		},
		{
			id: 2,
			invoice_number: 'INV-2024-002',
			customer_id: 2,
			ticket_ids: [2],
			status: 'pending',
			issue_date: '2024-06-02',
			due_date: '2024-06-16',
			paid_date: null,
			line_items: [
				{ id: 1, description: 'Diagnostic fee', quantity: 1, unit_price: 50.00, total: 50.00 },
				{ id: 2, description: 'Motherboard replacement', quantity: 1, unit_price: 350.00, total: 350.00 }
			],
			subtotal: 400.00,
			tax_rate: 0.08,
			tax_amount: 32.00,
			total_amount: 432.00,
			notes: 'Awaiting customer approval'
		}
	]);

	const [newInvoice, setNewInvoice] = useState({
		customer_id: null,
		ticket_ids: [],
		due_days: 14,
		line_items: [{ id: 1, description: '', quantity: 1, unit_price: 0 }],
		tax_rate: 0.08,
		notes: ''
	});

	// Sample tickets data
	const [tickets, setTickets] = useState([
		{
			id: 1,
			customer_id: 1,
			issue_description: 'MacBook Pro screen flickering and showing vertical lines',
			status: 'in_progress',
			created_at: '2024-06-01',
			updated_at: '2024-06-02',
			updates: [
				{
					id: 1,
					message: 'Initial diagnosis complete. LCD panel needs replacement.',
					created_at: '2024-06-01',
					type: 'customer_update'
				},
				{
					id: 2,
					message: 'Ordered replacement screen from supplier.',
					created_at: '2024-06-02',
					type: 'customer_update'
				}
			],
			notes: [
				{
					id: 1,
					content: 'Customer mentioned laptop was dropped last week',
					type: 'public',
					created_at: '2024-06-01'
				},
				{
					id: 2,
					content: 'Check for other damage - possible logic board issues',
					type: 'private',
					created_at: '2024-06-01'
				}
			]
		},
		{
			id: 2,
			customer_id: 2,
			issue_description: 'Dell laptop won\'t boot, makes beeping sounds on startup',
			status: 'new',
			created_at: '2024-06-02',
			updated_at: '2024-06-02',
			updates: [],
			notes: []
		},
		{
			id: 3,
			customer_id: 3,
			issue_description: 'iPhone battery drains very quickly, phone gets hot',
			status: 'completed',
			created_at: '2024-05-28',
			updated_at: '2024-06-01',
			updates: [
				{
					id: 1,
					message: 'Battery replacement completed. Device tested and working normally.',
					created_at: '2024-06-01',
					type: 'customer_update'
				}
			],
			notes: [
				{
					id: 1,
					content: 'Battery health was at 67% - within replacement range',
					type: 'public',
					created_at: '2024-05-28'
				}
			]
		},
		{
			id: 4,
			customer_id: 4,
			issue_description: 'Gaming PC randomly shuts down during games, GPU artifacts visible',
			status: 'diagnosed',
			created_at: '2024-06-03',
			updated_at: '2024-06-03',
			updates: [
				{
					id: 1,
					message: 'Initial testing shows GPU overheating. Investigating cooling system.',
					created_at: '2024-06-03',
					type: 'customer_update'
				}
			],
			notes: [
				{
					id: 1,
					content: 'GPU reaching 95°C under load',
					type: 'private',
					created_at: '2024-06-03'
				}
			]
		}
	]);

	const [newTicket, setNewTicket] = useState({
		customer_id: null,
		issue_description: '',
		status: 'new'
	});


	const statusColors = {
		'new': 'bg-blue-100 text-blue-800',
		'diagnosed': 'bg-purple-100 text-purple-800',
		'in_progress': 'bg-yellow-100 text-yellow-800',
		'completed': 'bg-green-100 text-green-800',
		'picked_up': 'bg-gray-100 text-gray-800'
	};

	const getCustomerById = (id) => customers.find(c => c.id === id);

	const handleAddTicket = () => {
		if (newTicket.customer_id && newTicket.issue_description.trim()) {
			const ticket = {
				id: Math.max(...tickets.map(t => t.id), 0) + 1,
				customer_id: newTicket.customer_id,
				issue_description: newTicket.issue_description,
				status: newTicket.status,
				created_at: new Date().toISOString().split('T')[0],
				updated_at: new Date().toISOString().split('T')[0],
				updates: [],
				notes: []
			};
			
			setTickets([...tickets, ticket]);
			setNewTicket({
				customer_id: null,
				issue_description: '',
				status: 'new'
			});
			setSelectedCustomer(null);
			setActiveTab('tickets');
		}
	};

	const handleAddCustomerUpdate = () => {
		if (newUpdate.trim() && viewingTicket) {
			const updatedTickets = tickets.map(ticket => {
				if (ticket.id === viewingTicket.id) {
					const newUpdateObj = {
						id: (ticket.updates?.length || 0) + 1,
						message: newUpdate,
						created_at: new Date().toISOString().split('T')[0],
						type: 'customer_update'
					};
					return {
						...ticket,
						updates: [...(ticket.updates || []), newUpdateObj],
						updated_at: new Date().toISOString().split('T')[0]
					};
				}
				return ticket;
			});
			setTickets(updatedTickets);
			setViewingTicket(updatedTickets.find(t => t.id === viewingTicket.id));
			setNewUpdate('');
		}
	};

	const handleAddNote = () => {
		if (newNote.trim() && viewingTicket) {
			const updatedTickets = tickets.map(ticket => {
				if (ticket.id === viewingTicket.id) {
					const newNoteObj = {
						id: (ticket.notes?.length || 0) + 1,
						content: newNote,
						type: noteType,
						created_at: new Date().toISOString().split('T')[0]
					};
					return {
						...ticket,
						notes: [...(ticket.notes || []), newNoteObj],
						updated_at: new Date().toISOString().split('T')[0]
					};
				}
				return ticket;
			});
			setTickets(updatedTickets);
			setViewingTicket(updatedTickets.find(t => t.id === viewingTicket.id));
			setNewNote('');
		}
	};

	// Close status dropdown when clicking outside
	React.useEffect(() => {
		const handleClickOutside = (event) => {
			if (showStatusDropdown && !event.target.closest('.status-dropdown')) {
				setShowStatusDropdown(false);
			}
		};
		
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showStatusDropdown]);

	const handleCreateInvoice = () => {
		if (newInvoice.customer_id && newInvoice.line_items.some(item => item.description && item.unit_price > 0)) {
			const subtotal = newInvoice.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
			const tax_amount = subtotal * newInvoice.tax_rate;
			const total_amount = subtotal + tax_amount;
			
			const invoice = {
				id: Math.max(...invoices.map(i => i.id), 0) + 1,
				invoice_number: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
				customer_id: newInvoice.customer_id,
				ticket_ids: newInvoice.ticket_ids,
				status: 'pending',
				issue_date: new Date().toISOString().split('T')[0],
				due_date: new Date(Date.now() + newInvoice.due_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
				paid_date: null,
				line_items: newInvoice.line_items.map((item, index) => ({
					...item,
					id: index + 1,
					total: item.quantity * item.unit_price
				})),
				subtotal,
				tax_rate: newInvoice.tax_rate,
				tax_amount,
				total_amount,
				notes: newInvoice.notes
			};
			
			setInvoices([...invoices, invoice]);
			setNewInvoice({
				customer_id: null,
				ticket_ids: [],
				due_days: 14,
				line_items: [{ id: 1, description: '', quantity: 1, unit_price: 0 }],
				tax_rate: 0.08,
				notes: ''
			});
			setShowInvoiceModal(false);
			setSelectedCustomer(null);
		}
	};

	const addLineItem = () => {
		setNewInvoice({
			...newInvoice,
			line_items: [...newInvoice.line_items, {
				id: newInvoice.line_items.length + 1,
				description: '',
				quantity: 1,
				unit_price: 0
			}]
		});
	};

	const updateLineItem = (index, field, value) => {
		const updatedItems = newInvoice.line_items.map((item, i) => 
			i === index ? { ...item, [field]: value } : item
		);
		setNewInvoice({ ...newInvoice, line_items: updatedItems });
	};

	const removeLineItem = (index) => {
		if (newInvoice.line_items.length > 1) {
			setNewInvoice({
				...newInvoice,
				line_items: newInvoice.line_items.filter((_, i) => i !== index)
			});
		}
	};

	const updateInvoiceStatus = (invoiceId, newStatus) => {
		setInvoices(invoices.map(invoice => 
			invoice.id === invoiceId ? { 
				...invoice, 
				status: newStatus,
				paid_date: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null
			} : invoice
		));
	};

	const updateTicketStatus = (id, newStatus) => {
		setTickets(tickets.map(ticket => 
			ticket.id === id ? { 
				...ticket, 
				status: newStatus, 
				updated_at: new Date().toISOString().split('T')[0] 
			} : ticket
		));
	};

	const filteredTickets = tickets.filter(ticket => {
		const customer = getCustomerById(ticket.customer_id);
		const matchesSearch = customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
													customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
													ticket.issue_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
													ticket.id.toString().includes(searchTerm);
		const matchesStatus = statusFilter.includes('all') || statusFilter.includes(ticket.status);
		return matchesSearch && matchesStatus;
	});

	const handleStatusToggle = (status) => {
		if (status === 'all') {
			setStatusFilter(['all']);
		} else {
			let newFilters = statusFilter.filter(f => f !== 'all');
			if (newFilters.includes(status)) {
				newFilters = newFilters.filter(f => f !== status);
				if (newFilters.length === 0) {
					newFilters = ['all'];
				}
			} else {
				newFilters.push(status);
			}
			setStatusFilter(newFilters);
		}
	};

	const groupTickets = (tickets) => {
		if (groupBy === 'none') {
			return { 'All Tickets': tickets };
		}
		
		const grouped = {};
		
		tickets.forEach(ticket => {
			let groupKey;
			
			switch (groupBy) {
				case 'status':
					groupKey = ticket.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
					break;
				case 'customer':
					const customer = getCustomerById(ticket.customer_id);
					groupKey = customer?.name || 'Unknown Customer';
					break;
				case 'created_date':
					groupKey = ticket.created_at;
					break;
				default:
					groupKey = 'All Tickets';
			}
			
			if (!grouped[groupKey]) {
				grouped[groupKey] = [];
			}
			grouped[groupKey].push(ticket);
		});
		
		return grouped;
	};

	const groupedTickets = groupTickets(filteredTickets);

	const filteredCustomers = customers.filter(customer => {
		const searchLower = customerSearch.toLowerCase();
		return customer.name.toLowerCase().includes(searchLower) ||
						customer.email?.toLowerCase().includes(searchLower) ||
						customer.phone.includes(customerSearch);
	});

	const stats = {
		totalTickets: tickets.length,
		newTickets: tickets.filter(t => t.status === 'new').length,
		inProgress: tickets.filter(t => t.status === 'in_progress').length,
		completed: tickets.filter(t => t.status === 'completed').length,
		totalCustomers: customers.length,
		totalInvoices: invoices.length,
		pendingInvoices: invoices.filter(i => i.status === 'pending').length,
		overdueInvoices: invoices.filter(i => i.status === 'pending' && new Date(i.due_date) < new Date()).length
	};

	return (
		<>
			{/* Header 
			<Header 
				setShowCustomerModal={setShowCustomerModal}
				setActiveTab={setActiveTab}
				setShowInvoiceModal={setShowInvoiceModal}
			></Header>
			*/}

			<div className="content-holder">
				{/* Sidebar */}
				<Sidebar 
				sidebarCollapsed={sidebarCollapsed}
				setSidebarCollapsed={setSidebarCollapsed}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			></Sidebar>

				{/* Main Content */}
				<main className="content">
					{/* Ticket Detail View */}
					{viewingTicket && (
						<div className="space-y-6">
							<div className="flex items-center space-x-4">
								<button
									onClick={() => setViewingTicket(null)}
									className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
								>
									<span>←</span>
									<span>Back to Tickets</span>
								</button>
							</div>

							<div className="bg-white rounded-lg shadow-sm">
								<div className="p-6 border-b">
									<div className="flex items-start justify-between">
										<div>
											<h2 className="text-2xl font-semibold text-gray-900">Ticket #{viewingTicket.id}</h2>
											<p className="text-sm text-gray-500 mt-1">
												Created: {viewingTicket.created_at} | Updated: {viewingTicket.updated_at}
											</p>
										</div>
										<span className={`px-3 py-1 text-sm rounded-full ${statusColors[viewingTicket.status]}`}>
											{viewingTicket.status.replace('_', ' ')}
										</span>
									</div>
								</div>

								<div className="p-6 space-y-6">
									{/* Customer Info */}
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
										<div className="bg-gray-50 p-4 rounded-lg">
											{(() => {
												const customer = getCustomerById(viewingTicket.customer_id);
												return (
													<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
														<div>
															<p className="text-sm font-medium text-gray-500">Name</p>
															<p className="text-gray-900">{customer?.name}</p>
														</div>
														<div>
															<p className="text-sm font-medium text-gray-500">Email</p>
															<p className="text-gray-900">{customer?.email}</p>
														</div>
														<div>
															<p className="text-sm font-medium text-gray-500">Phone</p>
															<p className="text-gray-900">{customer?.phone}</p>
														</div>
													</div>
												);
											})()}
										</div>
									</div>

									{/* Issue Description */}
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-3">Issue Description</h3>
										<div className="bg-gray-50 p-4 rounded-lg">
											<p className="text-gray-900">{viewingTicket.issue_description}</p>
										</div>
									</div>

									{/* Status Update */}
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-3">Update Status</h3>
										<select
											value={viewingTicket.status}
											onChange={(e) => updateTicketStatus(viewingTicket.id, e.target.value)}
											className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										>
											<option value="new">New</option>
											<option value="diagnosed">Diagnosed</option>
											<option value="in_progress">In Progress</option>
											<option value="completed">Completed</option>
											<option value="picked_up">Picked Up</option>
										</select>
									</div>

									{/* Customer Updates */}
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-3">Customer Updates</h3>
										<div className="space-y-4">
											{viewingTicket.updates?.map(update => (
												<div key={update.id} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
													<div className="flex justify-between items-start">
														<p className="text-gray-900">{update.message}</p>
														<span className="text-xs text-gray-500 ml-4">{update.created_at}</span>
													</div>
												</div>
											))}
											
											<div className="bg-gray-50 p-4 rounded-lg">
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Add Customer Update
												</label>
												<textarea
													value={newUpdate}
													onChange={(e) => setNewUpdate(e.target.value)}
													rows={3}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
													placeholder="Enter update for customer..."
												/>
												<button
													onClick={handleAddCustomerUpdate}
													disabled={!newUpdate.trim()}
													className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
												>
													Send Update
												</button>
											</div>
										</div>
									</div>

									{/* Invoices Section */}
									<div>
										<div className="flex items-center justify-between mb-3">
											<h3 className="text-lg font-medium text-gray-900">Invoices</h3>
											<button
												onClick={() => {
													setNewInvoice({ ...newInvoice, ticket_ids: [viewingTicket.id] });
													setShowAttachInvoiceModal(true);
												}}
												className="flex items-center space-x-2 text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors"
											>
												<Paperclip className="h-3 w-3" />
												<span>Attach Invoice</span>
											</button>
										</div>
										<div className="space-y-3">
											{invoices
												.filter(invoice => invoice.ticket_ids.includes(viewingTicket.id))
												.map(invoice => {
													const customer = getCustomerById(invoice.customer_id);
													return (
														<div 
															key={invoice.id} 
															className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
															onClick={() => setViewingInvoice(invoice)}
														>
															<div className="flex items-center justify-between">
																<div>
																	<p className="font-medium text-gray-900">{invoice.invoice_number}</p>
																	<p className="text-sm text-gray-500">
																		${invoice.total_amount} • {invoice.status}
																	</p>
																</div>
																<span className={`px-2 py-1 text-xs rounded-full ${
																	invoice.status === 'paid' 
																		? 'bg-green-100 text-green-800'
																		: invoice.status === 'overdue'
																			? 'bg-red-100 text-red-800'
																			: 'bg-yellow-100 text-yellow-800'
																}`}>
																	{invoice.status}
																</span>
															</div>
														</div>
													);
												})}
											
											{invoices.filter(invoice => invoice.ticket_ids.includes(viewingTicket.id)).length === 0 && (
												<p className="text-gray-500 text-sm">No invoices attached to this ticket</p>
											)}
										</div>
									</div>
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
										<div className="space-y-4">
											{viewingTicket.notes?.map(note => (
												<div key={note.id} className={`p-4 rounded-lg border ${
													note.type === 'private' 
														? 'bg-red-50 border-red-200' 
														: 'bg-green-50 border-green-200'
												}`}>
													<div className="flex justify-between items-start">
														<div>
															<div className="flex items-center space-x-2 mb-1">
																<span className={`px-2 py-1 text-xs rounded-full ${
																	note.type === 'private' 
																		? 'bg-red-100 text-red-800' 
																		: 'bg-green-100 text-green-800'
																}`}>
																	{note.type}
																</span>
															</div>
															<p className="text-gray-900">{note.content}</p>
														</div>
														<span className="text-xs text-gray-500 ml-4">{note.created_at}</span>
													</div>
												</div>
											))}
											
											<div className="bg-gray-50 p-4 rounded-lg">
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Add Note
												</label>
												<div className="flex items-center space-x-4 mb-3">
													<label className="flex items-center">
														<input
															type="radio"
															value="public"
															checked={noteType === 'public'}
															onChange={(e) => setNoteType(e.target.value)}
															className="mr-2"
														/>
														Public
													</label>
													<label className="flex items-center">
														<input
															type="radio"
															value="private"
															checked={noteType === 'private'}
															onChange={(e) => setNoteType(e.target.value)}
															className="mr-2"
														/>
														Private
													</label>
												</div>
												<textarea
													value={newNote}
													onChange={(e) => setNewNote(e.target.value)}
													rows={3}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
													placeholder="Enter note..."
												/>
												<button
													onClick={handleAddNote}
													disabled={!newNote.trim()}
													className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300"
												>
													Add Note
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Customer Profile View */}
					{viewingCustomer && (
						<div className="space-y-6">
							<div className="flex items-center space-x-4">
								<button
									onClick={() => setViewingCustomer(null)}
									className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
								>
									<span>←</span>
									<span>Back to Customers</span>
								</button>
							</div>

							<div className="bg-white rounded-lg shadow-sm">
								<div className="p-6 border-b">
									<h2 className="text-2xl font-semibold text-gray-900">{viewingCustomer.name}</h2>
									<p className="text-sm text-gray-500 mt-1">Customer since {viewingCustomer.created_at}</p>
								</div>

								<div className="p-6 space-y-6">
									{/* Customer Details */}
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
										<div className="bg-gray-50 p-4 rounded-lg">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">Email</p>
													<p className="text-gray-900">{viewingCustomer.email}</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">Phone</p>
													<p className="text-gray-900">{viewingCustomer.phone}</p>
												</div>
											</div>
										</div>
									</div>

									{/* Ticket History */}
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-3">Ticket History</h3>
										<div className="space-y-4">
											{tickets
												.filter(ticket => ticket.customer_id === viewingCustomer.id)
												.map(ticket => (
													<div 
														key={ticket.id} 
														className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
														onClick={() => {
															setViewingCustomer(null);
															setViewingTicket(ticket);
														}}
													>
														<div className="flex items-start justify-between">
															<div className="flex-1">
																<div className="flex items-center space-x-3">
																	<span className="font-medium text-gray-900">Ticket #{ticket.id}</span>
																	<span className={`px-2 py-1 text-xs rounded-full ${statusColors[ticket.status]}`}>
																		{ticket.status.replace('_', ' ')}
																	</span>
																</div>
																<p className="text-sm text-gray-600 mt-1">{ticket.issue_description}</p>
																<p className="text-xs text-gray-500 mt-2">
																	Created: {ticket.created_at} | Updated: {ticket.updated_at}
																</p>
															</div>
														</div>
													</div>
												))}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Overview */}
					{!viewingTicket && !viewingCustomer && activeTab === 'overview' && (
						<div className="space-y-6">
							{/* Stats Cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<div className="bg-white p-6 rounded-lg shadow-sm">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-gray-600">Total Tickets</p>
											<p className="text-3xl font-bold text-gray-900">{stats.totalTickets}</p>
										</div>
										<div className="p-3 bg-blue-100 rounded-full">
											<Wrench className="h-6 w-6 text-blue-600" />
										</div>
									</div>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-sm">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-gray-600">New Tickets</p>
											<p className="text-3xl font-bold text-blue-600">{stats.newTickets}</p>
										</div>
										<div className="p-3 bg-blue-100 rounded-full">
											<Clock className="h-6 w-6 text-blue-600" />
										</div>
									</div>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-sm">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-gray-600">In Progress</p>
											<p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
										</div>
										<div className="p-3 bg-yellow-100 rounded-full">
											<Monitor className="h-6 w-6 text-yellow-600" />
										</div>
									</div>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-sm">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-gray-600">Customers</p>
											<p className="text-3xl font-bold text-green-600">{stats.totalCustomers}</p>
										</div>
										<div className="p-3 bg-green-100 rounded-full">
											<Users className="h-6 w-6 text-green-600" />
										</div>
									</div>
								</div>
							</div>

							{/* Recent Tickets */}
							<div className="bg-white rounded-lg shadow-sm">
								<div className="p-6 border-b">
									<h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
								</div>
								<div className="p-6">
									<div className="space-y-4">
										{tickets.slice(-3).reverse().map(ticket => {
											const customer = getCustomerById(ticket.customer_id);
											return (
												<div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
													<div className="flex-1">
														<div className="flex items-center space-x-3">
															<span className="font-medium text-gray-900">Ticket #{ticket.id}</span>
															<span className={`px-2 py-1 text-xs rounded-full ${statusColors[ticket.status]}`}>
																{ticket.status.replace('_', ' ')}
															</span>
														</div>
														<p className="text-sm text-gray-600 mt-1">{customer?.name}</p>
														<p className="text-sm text-gray-500 mt-1 truncate max-w-md">{ticket.issue_description}</p>
													</div>
													<div className="text-right">
														<p className="text-sm text-gray-500">{ticket.created_at}</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* All Tickets */}
					{!viewingTicket && !viewingCustomer && activeTab === 'tickets' && (
						<div className="space-y-6">
							{/* Search and Filter */}
							<div className="bg-white p-6 rounded-lg shadow-sm">
								<div className="flex flex-col lg:flex-row gap-4">
									<div className="flex-1 relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<input
											type="text"
											placeholder="Search tickets by customer, ID, or description..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									
									{/* Multi-select Status Filter */}
									<div className="relative status-dropdown">
										<button
											onClick={() => setShowStatusDropdown(!showStatusDropdown)}
											className="flex items-center justify-between w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
										>
											<div className="flex items-center">
												<Filter className="h-4 w-4 text-gray-400 mr-2" />
												<span className="text-sm">
													{statusFilter.includes('all') 
														? 'All Status' 
														: statusFilter.length === 1 
															? statusFilter[0].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
															: `${statusFilter.length} selected`
													}
												</span>
											</div>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
											</svg>
										</button>
										
										{showStatusDropdown && (
											<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
												{['all', 'new', 'diagnosed', 'in_progress', 'completed', 'picked_up'].map(status => (
													<label
														key={status}
														className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
													>
														<input
															type="checkbox"
															checked={statusFilter.includes(status)}
															onChange={() => handleStatusToggle(status)}
															className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
														/>
														<span className="text-sm">
															{status === 'all' 
																? 'All Status' 
																: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
															}
														</span>
													</label>
												))}
											</div>
										)}
									</div>
									
									{/* Group By Dropdown */}
									<div className="relative">
										<select
											value={groupBy}
											onChange={(e) => setGroupBy(e.target.value)}
											className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
										>
											<option value="none">No Grouping</option>
											<option value="status">Group by Status</option>
											<option value="customer">Group by Customer</option>
											<option value="created_date">Group by Date Created</option>
										</select>
									</div>
								</div>
							</div>

							{/* Tickets Display */}
							<TicketsDisplay 
								groupedTickets={groupedTickets}
								groupBy={groupBy}
								getCustomerById={getCustomerById}
								setViewingTicket={setViewingTicket}
								setViewingCustomer={setViewingCustomer}
								updateTicketStatus={updateTicketStatus}
								statusColors={statusColors}
							></TicketsDisplay>

						</div>
					)}

					{/* Add Ticket */}
					{!viewingTicket && !viewingCustomer && activeTab === 'add-ticket' && (
							<div className="bg-white rounded-lg shadow-sm">
								<div className="p-6 border-b">
									<h2 className="text-lg font-semibold text-gray-900">Create New Ticket</h2>
									<p className="text-sm text-gray-600 mt-1">Select a customer and describe the issue</p>
								</div>
								<div className="p-6 space-y-6">
									{/* Customer Selection */}
									<div className="relative">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Select Customer *
										</label>
										{selectedCustomer ? (
											<div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
												<div>
													<p className="font-medium text-gray-900">{selectedCustomer.name}</p>
													<p className="text-sm text-gray-500">{selectedCustomer.email}</p>
													<p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
												</div>
												<button
													onClick={() => {
														setSelectedCustomer(null);
														setNewTicket({ ...newTicket, customer_id: null });
														setCustomerSearch('');
													}}
													className="text-gray-400 hover:text-gray-600"
												>
													<X className="h-5 w-5" />
												</button>
											</div>
										) : (
											<div className="relative">
												<div className="relative">
													<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
													<input
														type="text"
														placeholder="Start typing to search customers..."
														value={customerSearch}
														onChange={(e) => setCustomerSearch(e.target.value)}
														className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													/>
												</div>
												
												{/* Floating Dropdown */}
												{customerSearch.length > 0 && (
													<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
														{filteredCustomers.length > 0 ? (
															filteredCustomers.map(customer => (
																<button
																	key={customer.id}
																	onClick={() => {
																		setSelectedCustomer(customer);
																		setNewTicket({ ...newTicket, customer_id: customer.id });
																		setCustomerSearch('');
																	}}
																	className="w-full p-4 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
																>
																	<p className="font-medium text-gray-900">{customer.name}</p>
																	<p className="text-sm text-gray-500">{customer.email}</p>
																	<p className="text-sm text-gray-500">{customer.phone}</p>
																</button>
															))
														) : (
															<div className="p-4 text-center text-gray-500">
																No customers found matching "{customerSearch}"
															</div>
														)}
													</div>
												)}
											</div>
										)}
									</div>

									{/* Issue Description */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Issue Description *
										</label>
										<textarea
											value={newTicket.issue_description}
											onChange={(e) => setNewTicket({ ...newTicket, issue_description: e.target.value })}
											rows={4}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											placeholder="Describe the problem in detail..."
										/>
									</div>

									{/* Status */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Initial Status
										</label>
										<select
											value={newTicket.status}
											onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										>
											<option value="new">New</option>
											<option value="diagnosed">Diagnosed</option>
											<option value="in_progress">In Progress</option>
										</select>
									</div>

									<div className="flex justify-end space-x-4">
										<button
											onClick={() => {
												setNewTicket({
													customer_id: null,
													issue_description: '',
													status: 'new'
												});
												setSelectedCustomer(null);
											}}
											className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
										>
											Clear
										</button>
										<button
											onClick={handleAddTicket}
											disabled={!newTicket.customer_id || !newTicket.issue_description.trim()}
											className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
										>
											Create Ticket
										</button>
									</div>
								</div>
						</div>
					)}

					{/* Customers */}
					{!viewingTicket && !viewingCustomer && activeTab === 'customers' && (
						<div className="bg-white rounded-lg shadow-sm">
							<div className="p-6 border-b flex items-center justify-between">
								<h2 className="text-lg font-semibold text-gray-900">Customer Directory</h2>
								<button 
									onClick={() => setShowCustomerModal(true)}
									className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
								>
									<Plus className="h-4 w-4" />
									<span>Add Customer</span>
								</button>
							</div>
							<div className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{customers.map(customer => {
										const customerTickets = tickets.filter(t => t.customer_id === customer.id);
										return (
											<div 
												key={customer.id} 
												className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
												onClick={() => setViewingCustomer(customer)}
											>
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<h3 className="font-medium text-gray-900">{customer.name}</h3>
														<div className="flex items-center text-sm text-gray-500 mt-1">
															<Mail className="h-3 w-3 mr-1" />
															{customer.email}
														</div>
														<div className="flex items-center text-sm text-gray-500 mt-1">
															<Phone className="h-3 w-3 mr-1" />
															{customer.phone}
														</div>
														<div className="flex items-center text-sm text-gray-500 mt-1">
															<Wrench className="h-3 w-3 mr-1" />
															{customerTickets.length} ticket{customerTickets.length !== 1 ? 's' : ''}
														</div>
													</div>
												</div>
												<div className="mt-3 pt-3 border-t">
													<p className="text-xs text-gray-500">Customer since {customer.created_at}</p>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}
				</main>
			</div>

			{/* Add Customer Modal */}
			{showCustomerModal && (
				<CustomerModal
					customers={customers}
					setCustomers={setCustomers}
					setShowCustomerModal={setShowCustomerModal}
				></CustomerModal>
			)}
		</>
	);
};

export default App;