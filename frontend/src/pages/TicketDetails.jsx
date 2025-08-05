import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
	IconMail,
	IconSend2,
	IconLayoutColumns,
	IconChevronDown,
	IconAlignJustified,
	IconProgressHelp,
	IconCalendar,
	IconRefresh,
	IconMessageQuestion,
	IconMessage2Question,
	IconMessageCircleQuestion,
	IconPhone,
	IconDeviceMobile,
	IconBriefcase,
	IconBriefcase2,
	IconSignature,
	IconUserEdit,
	IconReceipt,
	IconEyeDollar,
	IconReceiptDollar,
	IconFileDollar,
} from "@tabler/icons-react"

import {
	Edit3,
	User,
	Mail,
	FileText,
	Send,
	Settings,
	Plus,
	MessageSquare,
	DollarSign,
	StickyNote,
	Network,
	Globe,
	User2,
	MessageCircleQuestion,
	Smartphone,
	Briefcase,
	Signature,
	Phone,
	UserPen,
	CalendarSync,
	Calendar1,
	RefreshCcw,
	AlignLeft,
	CircleFadingPlus,
	Receipt,
	ReceiptText,
	CircleDollarSignIcon,
	CircleDollarSign
} from "lucide-react"

import { Checkbox } from '@/components/ui/checkbox';
import { SimpleTooltip } from '@/components/ui/tooltip';
import { TextareaMessage } from '@/components/ui/textarea-message';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { RightSidebar } from '@/components/ui/sidebar';
import { formatDate } from "@/functions";



function ChargesEditor({ ticketData, lineItems, setLineItems }) {

	// React Hook Form setup
	const form = useForm({
		defaultValues: {
			name: '',
			description: '',
			quantity: 1,
			priceEach: '',
			hasTax: false
		}
	});

	const estimateChWidth = (text) => {
		// Most of your characters are "0" width, but account for variations
		const charWeights = {
			'$': 1.0,  // Assume same as "0" 
			'.': 0.47,  // Periods are narrower
			// All digits: assume same as "0" (that's what ch represents)
		};

		let totalWeight = 0;
		for (const char of text) {
			totalWeight += charWeights[char] || 1.0;
		}

		return totalWeight;
	};

	const updateLineItems = (items, id, property, newValue) => {
		let cleanNewValue = newValue;
		if (property != 'hasTax') {
			cleanNewValue = parseFloat(newValue.replace(/[^0-9.-]/g, ''));
		}
		return items.map(item =>
			item.id === id
				? { ...item, [property]: cleanNewValue }
				: item
		);
	};

	const calculatePriceColumnWidth = (lineItems) => {


		const info = {
			priceEach:
			{
				multiplier: 1,
				currentMaxWidth: 0,
				widthBuffer: 0,
				finalWidth: 0,
				extractString: (item) => {
					return `$${item.priceEach.toFixed(2)}`;
				}
			},
			quantity:
			{
				multiplier: 1,
				currentMaxWidth: 0,
				widthBuffer: 1,
				finalWidth: 0,
				extractString: (item) => {
					return String(item.quantity);
				}
			},
			hasTax:
			{
				multiplier: .945,
				currentMaxWidth: 0,
				widthBuffer: 0,
				finalWidth: 0,
				extractString: (item) => {
					return item.hasTax ? "Tax" : "No Tax";
				}
			},
		}

		lineItems.forEach(item => {
			for (const key in info) {
				const nestedObj = info[key];
				//console.log(`Processing ${key}:`, nestedObj);
				const string = nestedObj.extractString(item);
				//console.log("string:", string);
				const width = estimateChWidth(string) * nestedObj.multiplier;
				nestedObj.currentMaxWidth = Math.max(nestedObj.currentMaxWidth, width);
			}
		});

		for (const key in info) {
			const nestedObj = info[key];
			nestedObj.finalWidth = Math.min(Math.max(nestedObj.currentMaxWidth + nestedObj.widthBuffer, 1), 128);
		}
		const output = Object.keys(info).reduce((acc, key) => {
			acc[key] = info[key].finalWidth;
			return acc;
		}, {});

		return output;
	};

	/*
	
	*/
	const columnWidths = useMemo(() => {
		return calculatePriceColumnWidth(lineItems);
	}, [lineItems]);

	// Form submission handler
	const onSubmit = (data) => {
		const newLineItem = {
			id: Math.max(...lineItems.map(item => item.id), 0) + 1, // Generate unique ID
			name: data.name,
			description: data.description,
			quantity: parseInt(data.quantity) || 1,
			priceEach: parseFloat(data.priceEach) || 0,
			hasTax: data.hasTax
		};

		setLineItems([...lineItems, newLineItem]);

		// Reset form after successful submission
		form.reset();
	};


	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Plus className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent style={{ width: "min(calc(100% - 2rem), 64rem)", maxHeight: "calc(100% - 2rem)" }} className="!max-w-full !sm:max-h-[80vh] h-full sm:h-[unset] overflow-hidden sm:overflow-visible flex flex-col px-0">
				<DialogHeader className="px-6">
					<DialogTitle>Manage Charges</DialogTitle>
					<DialogDescription className="hidden sm:inline">
						Add new line items and manage existing charges for this ticket.
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-hidden sm:overflow-visible">
					<ScrollArea className="h-full sm:h-auto">
						<div className="flex flex-col sm:grid gap-6 h-full sm:h-auto px-6" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "min-content" }}>
							{/* Add New Item Section with React Hook Form */}
							<div className="flex flex-col justify-between gap-4 ">
								<Form {...form}>
									<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
										<h4 className="font-medium text-sm">Add New Line Item</h4>

										<FormField
											control={form.control}
											name="name"
											rules={{ required: true }}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs">Name</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder="e.g., Crucial BX500 1TB SSD"
															className="text-sm"
														/>
													</FormControl>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs">Description</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder="e.g., 3D NAND SATA 2.5-Inch Internal SSD"
															className="text-sm"
														/>
													</FormControl>
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-2 gap-2">
											<FormField
												control={form.control}
												name="quantity"
												rules={{
													required: true,
													min: 1
												}}
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-xs">Quantity</FormLabel>
														<FormControl>
															<Input
																{...field}
																type="number"
																className="text-sm"
																onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
															/>
														</FormControl>
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="priceEach"
												rules={{
													required: true,
													min: 0
												}}
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-xs">Price Each ($)</FormLabel>
														<FormControl>
															<Input
																{...field}
																type="number"
																step="0.01"
																placeholder="71.88"
																className="text-sm"
																onChange={(e) => field.onChange(e.target.value)}
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name="hasTax"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<FormLabel className="text-sm font-normal">
														Subject to tax
													</FormLabel>
												</FormItem>
											)}
										/>

										<Button type="submit" className="w-full">
											<Plus className="h-4 w-4 mr-2" />
											Add Item
										</Button>
									</form>
								</Form>
							</div>

							{/* Current Items Section - unchanged */}
							<div className="flex flex-col gap-4 overflow-hidden min-h-40 sm:h-0 sm:min-h-full">
								<h4 className="font-medium text-sm flex-shrink-0">Current Line Items</h4>
								<div className="flex flex-col gap-1 flex-1 overflow-hidden">
									{/* Items */}
									<ScrollArea
										className="flex-1 overflow-auto"
										style={{
											scrollbarWidth: "thin",
											scrollbarGutter: "stable",
											scrollbarColor: "rgba(0,0,0,.1) transparent"
										}}
									>
										<Table className="text-xs" style={{
											display: 'grid',
											gridTemplateColumns: `minmax(0, 1fr) calc(${columnWidths.quantity}ch + 20px) calc(${columnWidths.priceEach}ch + 20px) calc(${columnWidths.hasTax}ch + 26px) 32px`,
											gap: '0',
											minWidth: '100%'
										}}>
											<TableHeader className="sticky top-0 hover:bg-transparent contents">
												<TableRow className="hover:bg-transparent h-fit contents">
													<TableHead className="text-xs font-medium text-muted-foreground pb-2 px-0 h-[unset]">
														Item
													</TableHead>
													<TableHead className="text-xs font-medium text-muted-foreground pb-2 px-1 pl-2 h-[unset]">
														Qty
													</TableHead>
													<TableHead className="text-xs font-medium text-muted-foreground pb-2 px-1 pl-2 h-[unset]">
														Price
													</TableHead>
													<TableHead className="text-xs font-medium text-muted-foreground pb-2 px-1 h-[unset]">
														Tax
													</TableHead>
													<TableHead className="text-xs font-medium text-muted-foreground pb-2 px-1 h-[unset]">
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody className="contents">
												{lineItems.map((item) => (
													<TableRow key={item.id} className="group contents">
														<TableCell className="py-2 px-0">
															<div className="font-medium text-ellipsis overflow-hidden">
																<span className="block truncate">
																	{item.name}
																</span>
															</div>
															<div className="text-muted-foreground text-ellipsis overflow-hidden">
																<span className="block truncate">
																	{item.description}
																</span>
															</div>
														</TableCell>
														<TableCell className="py-2 px-1">

															<Input
																key={`${item.id}-quantity`}
																className={`hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 shadow-none focus-visible:border dark:bg-transparent border-transparent bg-transparent
														h-8 py-0 text-left px-1 text-xs md:text-xs`}
																defaultValue={item.quantity}
																id={`${item.id}-quantity`}
																style={{ width: `calc(${columnWidths.quantity}ch + 10px + 1px)` }}
																onBlur={(e) => {
																	const newLineItems = updateLineItems(lineItems, item.id, 'quantity', e.target.value);
																	//setLineItems(newLineItems);
																	setTimeout(() => {
																		setLineItems(newLineItems);
																	}, 0);
																}}
															/>
														</TableCell>
														<TableCell className="py-2 px-1">
															<Input
																className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 shadow-none focus-visible:border dark:bg-transparent
															border-transparent bg-transparent h-8 w-16 py-0 text-left px-1 text-xs md:text-xs"

																defaultValue={`$${item.priceEach?.toFixed(2)}`}
																id={`${item.id}-price`}
																style={{ width: `calc(${columnWidths.priceEach}ch + 10px + 1px)` }}
																onBlur={(e) => {
																	// Remove dollar sign if present, then validate
																	let value = e.target.value.trim();
																	if (value.startsWith('$')) {
																		value = value.slice(1);
																	}

																	const numValue = parseFloat(value);

																	// Check if it's a valid number
																	if (isNaN(numValue) || !isFinite(numValue) || value === '') {
																		// Reset to original value if invalid
																		e.target.value = `$${item.priceEach.toFixed(2)}`;
																	} else {
																		// Format valid number
																		e.target.value = `$${Math.max(0, numValue).toFixed(2)}`;
																	}

																	const newLineItems = updateLineItems(lineItems, item.id, 'priceEach', e.target.value);
																	//setLineItems(newLineItems);
																	setTimeout(() => {
																		setLineItems(newLineItems);
																	}, 0);
																}}
															/>
														</TableCell>
														<TableCell className="py-2 px-1 flex flex-col justify-center">
															<Badge
																variant="secondary"
																className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
																onClick={() => {
																	const newLineItems = updateLineItems(lineItems, item.id, 'hasTax', !item.hasTax);
																	setLineItems(newLineItems);
																}}
															>
																{item.hasTax ? 'Tax' : 'No Tax'}
															</Badge>
														</TableCell>
														<TableCell className="py-2 px-1 flex flex-col justify-center">
															<button
																className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded opacity-100 sm:group-hover:opacity-100 sm:opacity-0 transition-opacity"
																onClick={() => {
																	const newLineItems = lineItems.filter(lineItem => lineItem.id !== item.id);
																	setLineItems(newLineItems);
																}}
															>
																<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
																</svg>
															</button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</ScrollArea>

									{/* Total */}
									<div className="border-t pt-2 mt-2 flex-shrink-0">
										<div className="flex justify-between text-sm font-semibold">
											<span>Total:</span>
											<span>
												${lineItems.reduce((sum, item) => sum + (item.quantity * item.priceEach), 0).toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</ScrollArea>
				</div>

				<DialogFooter className="px-6">
					<DialogClose asChild>
						<Button variant="outline">Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}


function CustomerEditor({ customerData }) {

	return (
		<Dialog >
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Edit3 className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Customer Information</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-3">
						<Label htmlFor="name">Name</Label>
						<Input id="name" defaultValue={customerData.name} />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" defaultValue={customerData.email} />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="mobile">Mobile</Label>
						<Input id="mobile" defaultValue={customerData.mobile} />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="landline">Landline</Label>
						<Input id="landline" defaultValue={customerData.landline} />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="company">Company</Label>
						<Input id="company" defaultValue={customerData.company} />
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button>
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)

}

function TicketEditor({ customerData }) {

	return (
		<Dialog >
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Edit3 className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Ticket Information</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-3">
						<Label htmlFor="name">Name</Label>
						<Input id="name" defaultValue={customerData.name} />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" defaultValue={customerData.email} />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="mobile">Mobile</Label>
						<Input id="mobile" defaultValue={customerData.mobile} />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="landline">Landline</Label>
						<Input id="landline" defaultValue={customerData.landline} />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="company">Company</Label>
						<Input id="company" defaultValue={customerData.company} />
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button>
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)

}

export default function TicketDetails() {

	const [newMessage, setNewMessage] = useState('');
	const [ticketStatus, setTicketStatus] = useState('in-progress');
	const [lineItems, setLineItems] = useState([
		{
			id: 1,
			name: 'Refrigerant R-410A',
			description: '2lb canister of R-410A refrigerant',
			quantity: 1,
			priceEach: 85.00,
			hasTax: true
		},
		{
			id: 2,
			name: 'LABOR AC Repair',
			description: 'Diagnostic and refrigerant refill service asd asd asd asd asd asd asd asd ',
			quantity: 1,
			priceEach: 129.00,
			hasTax: false
		},
		{
			id: 3,
			name: 'LABOR AC Repair',
			description: 'Diagnostic and refrigerant refill service asd asd asd asd ',
			quantity: 1,
			priceEach: 129.00,
			hasTax: false
		},
		{
			id: 4,
			name: 'LABOR AC Repair',
			description: 'Diagnostic and refrigerant refill service asd asd asd asd ',
			quantity: 1,
			priceEach: 129.00,
			hasTax: false
		},
		{
			id: 5,
			name: 'LABOR AC Repair',
			description: 'Diagnostic and refrigerant refill service asd asd asd asd ',
			quantity: 1,
			priceEach: 129.00,
			hasTax: false
		},
		{
			id: 6,
			name: 'LABOR AC Repair',
			description: 'Diagnostic and refrigerant refill service asd asd asd asd ',
			quantity: 1,
			priceEach: 129.00,
			hasTax: false
		},
		{
			id: 7,
			name: 'LABOR AC Repair',
			description: 'Diagnostic and refrigerant refill service asd asd asd asd ',
			quantity: 1,
			priceEach: 129.00,
			hasTax: false
		},
		{
			id: 8,
			name: 'LABOR AC Repair',
			description: 'Diagnostic and refrigerant refill service asd asd asd asd ',
			quantity: 1,
			priceEach: 129.00,
			hasTax: false
		}
	]);


	const [line, setLine] = React.useState("Email")

	// Mock data
	const ticketData = {
		id: 'TK-2024-001',
		customerId: 1,
		title: 'AC Unit Not Cooling Properly',
		status: 'in-progress',
		created: '2024-06-10T09:00:00Z',
		lastUpdated: '2024-06-12T14:30:00Z',
		invoiced: false,
	};

	const customerData = {
		name: 'John Smith',
		company: 'Smith Industries',
		email: 'john.smith@email.com',
		mobile: '+1 (555) 123-4567',
		landline: '+1 (555) 987-6543',
		smsEnabled: true
	};

	const messages = [
		{
			id: 1,
			senderName: 'John Smith',
			senderType: 'customer',
			method: 'Email Message',
			line: customerData.email,
			message: 'Hi, my AC unit stopped cooling properly yesterday. The air is barely cold.',
			timestamp: '2024-06-10T09:15:00Z'
		},
		{
			id: 2,
			senderName: 'Mike Johnson',
			senderType: 'technician',
			method: 'Email Message',
			line: customerData.email,
			message: 'Thanks for reaching out. I can schedule a service visit for today afternoon. Can you confirm you\'ll be available around 2 PM?',
			timestamp: '2024-06-10T09:30:00Z'
		},
		{
			id: 3,
			senderName: 'John Smith',
			senderType: 'customer',
			method: 'SMS Message',
			line: customerData.mobile,
			message: 'Yes, 2 PM works perfectly. Thank you!',
			timestamp: '2024-06-10T09:35:00Z'
		},
		{
			id: 4,
			senderName: 'Mike Johnson',
			senderType: 'technician',
			method: 'Private Note',
			line: "Internal",
			message: 'I\'ve completed the initial inspection. The issue appears to be with the refrigerant levels. I\'ll need to add refrigerant and check for any leaks. This should take about 2-3 hours total.',
			timestamp: '2024-06-12T14:30:00Z'
		},
		{
			id: 5,
			senderName: 'Mike Johnson',
			senderType: 'technician',
			method: 'Public Note',
			line: "Internal",
			message: 'Sounds good, please proceed with the repair.',
			timestamp: '2024-06-12T14:45:00Z'
		},
		{
			id: 6,
			senderName: 'John Smith',
			senderType: 'customer',
			method: 'SMS Message',
			line: customerData.mobile,
			message: 'Sounds good, please proceed with the repair.',
			timestamp: '2024-06-12T14:45:00Z'
		},
		{
			id: 7,
			senderName: 'John Smith',
			senderType: 'customer',
			method: 'SMS Message',
			line: customerData.mobile,
			message: 'Sounds good, please proceed with the repair.',
			timestamp: '2024-06-12T14:45:00Z'
		},
		{
			id: 8,
			senderName: 'John Smith',
			senderType: 'customer',
			method: 'SMS Message',
			line: customerData.mobile,
			message: 'Sounds good, please proceed with the repair.',
			timestamp: '2024-06-12T14:45:00Z'
		},
		{
			id: 9,
			senderName: 'John Smith',
			senderType: 'customer',
			method: 'SMS Message',
			line: customerData.mobile,
			message: 'Sounds good, please proceed with the repair.',
			timestamp: '2024-06-12T14:45:00Z'
		},
		{
			id: 10,
			senderName: 'John Smith',
			senderType: 'customer',
			method: 'SMS Message',
			line: customerData.mobile,
			message: 'Sounds good, please proceed with the repair.',
			timestamp: '2024-06-12T14:45:00Z'
		},
		{
			id: 11,
			senderName: 'John Smith',
			senderType: 'customer',
			method: 'SMS Message',
			line: customerData.mobile,
			message: '.',
			timestamp: '2024-06-12T14:45:00Z'
		}
	];


	const handleSendMessage = () => {
		if (newMessage.trim()) {
			// Handle message sending logic here
			setNewMessage('');
		}
	};

	const getMethodIcon = (method) => {
		switch (method) {
			case 'Email Message': return <IconMail className="h-3 w-3" />;
			case 'SMS Message': return <MessageSquare className="h-3 w-3" />;
			default: return <StickyNote className="h-3 w-3" />;
		}
	};

	const getChatColors = (method, senderType, senderName ) => {

		// Message from other by default
		let bg = 'bg-muted';
		let text = 'text-primary';

		if (method == 'Public Note') {
			// Is a public note
			bg = 'bg-blue-600';
			text = 'text-primary-foreground';

		} else if (method == 'Private Note') {
			// Is a private note
			bg = 'bg-yellow-400';

		} else if (senderType == 'technician' && senderName == 'Mike Johnson') {
			// Is from you
			bg = 'bg-primary';
			text = 'text-primary-foreground';

		}
		
		return {bg: bg, text: text}

	};

	const formatTimestamp = (timestamp) => {
		const now = new Date();
		const date = new Date(timestamp);
		const diffMs = now - date;
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffYears = now.getFullYear() - date.getFullYear();

		// If older than 24 hours, return full timestamp
		if (diffHours >= 24) {
			const formatOptions = {
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			};

			// Add year if it's over a year old
			if (diffYears >= 1) {
				formatOptions.year = 'numeric';
			}

			return date.toLocaleString(undefined, formatOptions);
		}

		// If less than 1 hour, show minutes
		if (diffHours < 1) {
			return diffMinutes <= 0 ? 'just now' : `${diffMinutes} minutes ago`;
		}

		// Show hours
		return `${diffHours} hours ago`;
	};

	return (
		<div className='h-full overflow-hidden min-h-0'>
			<div className="flex flex-col-reverse sm:flex-row h-full min-h-0">
				{/* Main Content Area */}
				<div className="w-full flex flex-col h-full min-h-0">

					{/* Communication Timeline */}
					<div className="flex flex-col h-full relative min-h-0">

						<ScrollArea className="h-full min-h-0">
							<div className="space-y-2 px-4 md:px-6 py-6">

								{messages.map((message) => (

									

									<div className={`w-full flex ${(message.senderType == 'technician' && message.senderName == 'Mike Johnson') ? 'justify-end' : 'justify-start'}`}>

									<div key={message.id} className="flex flex-col gap-1 w-fit max-w-[75%]">
										<div className={`flex items-center gap-2 mx-3 justify-start ${(message.senderType == 'technician' && message.senderName == 'Mike Johnson') ? 'flex-row-reverse' : 'flex-row'}`}>
											<span className=" text-xs font-medium ">{message.senderName}</span>

											<div className='flex gap-2 items-center text-muted-foreground'>
												<span className="text-xs">{formatTimestamp(message.timestamp)}</span>



											</div>
										</div>
										<div data-slot="card" className={`flex-1 rounded-lg flex flex-col px-4 py-2 w-fit

																			${ getChatColors(message.method, message.senderType, message.senderName).bg }
																			${ getChatColors(message.method, message.senderType, message.senderName).text }

																		`}>

											<div className='flex gap-1 items-center mb-2'>
												<SimpleTooltip content={message.line}>
													<div className={`flex items-center justify-center size-5 rounded-full bg-current/6 text-current/75
																								`}>
														{getMethodIcon(message.method)}
													</div>
												</SimpleTooltip>
												<span className="text-xs text-current/60 " >{message.method}</span>
											</div>
											<p className="text-sm">{message.message}</p>
										</div>
									</div>

									</div>
								))}
							</div>
						</ScrollArea>

						{/* Chat Input */}
						<div className=" p-4 w-full border-t">
							{/* shadow-xs border-input focus-within:border-ring*/}
							<div className="
								flex flex-col gap-2 p-3.5 rounded-xl min-h-16  shadow-sm text-base md:text-sm transition-[color,box-shadow]
								border bg-[hsl(var(--custom-muted-background))]
								focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:border-ring
								dark:bg-input/30 relative z-1
								">
								<TextareaMessage
									placeholder="Type a message..."
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									className="min-h-[30px] resize-none max-h-100 placeholder:text-muted-primary"
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleSendMessage();
										}
									}}
								/>
								<div className='flex justify-between'>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" size="sm">
												<IconLayoutColumns />
												{line}
												<IconChevronDown />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start">

											<DropdownMenuItem
												key={1}
												className="capitalize"
												onClick={() => setLine("Email")}
											>

												Email
											</DropdownMenuItem>
											<DropdownMenuItem
												key={2}
												className="capitalize"
												onClick={() => setLine("SMS")}
											>
												SMS
											</DropdownMenuItem>
											<DropdownMenuItem
												key={3}
												className="capitalize"
												onClick={() => setLine("Private Note")}
											>
												Private Note
											</DropdownMenuItem>
											<DropdownMenuItem
												key={3}
												className="capitalize"
												onClick={() => setLine("Public Note")}
											>
												Public Note
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>

									<Button onClick={handleSendMessage} size="icon" className="!size-[unset] p-2  !rounded-lg"
										disabled={!newMessage}>
										{/* lg:px-4  
										md:px-4
										
										<span className="hidden lg:inline leading-0.5">Send</span>
										<span className="hidden md:inline">Send</span>
										*/}
										<IconSend2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>

					</div>
				</div>

				<RightSidebar>
					<ScrollArea className="flex transition-all flex-col h-full min-h-0 flex-1/3">
						<div className="py-2 px-2 space-y-6">

							<div className='flex flex-col gap-6 text-sm
											[&>*]:bg-card/0
											[&>*]:pb-0.5
											[&>*]:rounded-lg
											[&>*]:border-0
											[&>*]:[&>*:first-child]:py-1
											[&>*]:[&>*:not(:first-child)]:py-1.5
											[&>*]:[&>*:not(:last-child)]:border-b-none
											[&>*]:[&>*:not(:first-child)]:[&>*:first-child]:min-w-24
											[&>*]:[&>*]:px-2
							'>

								<div className='' >
									<div className='flex items-center justify-between bg-muted/0 border-b-none rounded-t-lg' >
										<div className='flex gap-2 items-center'>
											<Settings className='border rounded-sm bg-sidebar-accent/0 size-7 p-[5px]' />
											Ticket Info
										</div>
										<TicketEditor customerData={customerData} />
									</div>

									<div className='font-normal flex gap-0  justify-between !pb-0 flex-col items-start' >

										<div className='text-muted-foreground flex items-center gap-1.5 font-light text-xs'> <AlignLeft className='size-3' /> Subject</div>
										<div className='text-base font-medium'>AC Unit Not Cooling Properly</div>
									</div>

									<div className='font-normal flex gap-0.5 justify-between !py-2 flex-col items-start' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light text-xs'> <CircleFadingPlus className='size-3' />Status</div>
										<Select value={ticketStatus} onValueChange={setTicketStatus} >
											<SelectTrigger className="w-full bg-card">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="open">Open</SelectItem>
												<SelectItem value="in-progress">In Progress</SelectItem>
												<SelectItem value="completed">Completed</SelectItem>
												<SelectItem value="closed">Closed</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className='font-normal flex items-center gap-1 justify-between' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light '> <Calendar1 className='size-4' />Created</div>
										<div>{formatDate(ticketData.created, true)}</div>
									</div>

									<div className='font-normal flex items-center gap-1 justify-between' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light '> <RefreshCcw className='size-4' />Updated</div>
										<div>{formatDate(ticketData.lastUpdated, true)}</div>
									</div>

								</div>

								<div className='' >
									<div className='flex items-center justify-between py-1 bg-muted/0 border-b-none rounded-t-lg' >
										<div className='flex gap-2 items-center'>
											<User2 className='border rounded-sm bg-sidebar-accent/0 size-7 p-[5px]' />
											Customer Info
										</div>
										<CustomerEditor customerData={customerData} />
									</div>
									<div className='font-normal flex items-center gap-1 py-1 justify-between' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light'> <UserPen className='size-4' />Name</div>
										<div className='font-base'>{customerData.name}</div>
									</div>
									<div className='font-normal flex items-center gap-1 py-1 justify-between' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light'> <Briefcase className='size-4' />Company</div>
										<div className='font-base'>{customerData.company}</div>
									</div>
									<div className='font-normal flex items-center gap-1 py-1 justify-between' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light'> <Mail className='size-4' />Email</div>
										<div className='font-base'>{customerData.email}</div>
									</div>
									<div className='font-normal flex items-center gap-1 py-1 justify-between' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light'> <Smartphone className='size-4' />Mobile</div>
										<div className='font-base'>{customerData.mobile}</div>
									</div>
									<div className='font-normal flex items-center gap-1 py-1 justify-between' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light'> <Phone className='size-4' />Landline</div>
										<div className='font-base'>{customerData.landline}</div>
									</div>
									<div className='font-normal flex items-center gap-1 py-1 justify-between' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light'> <MessageCircleQuestion className='size-4' />SMS</div>
										<Badge variant={customerData.smsEnabled ? "default" : "secondary"}>
											{customerData.smsEnabled ? 'Enabled' : 'Disabled'}
										</Badge>
									</div>

								</div>

								<div className='' >
									<div className='flex items-center justify-between py-1 bg-muted/0 border-b-none rounded-t-lg' >
										<div className='flex gap-2 items-center'>
											<DollarSign className='border rounded-sm bg-sidebar-accent/0 size-7 p-[5px]' />
											Charges & Billing
										</div>
										<ChargesEditor ticketData={ticketData} lineItems={lineItems} setLineItems={setLineItems} />
									</div>
									<div className='font-normal flex items-center gap-1 py-1 justify-between' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light'> <CircleDollarSign className='size-4' />Total Charges</div>
										<span className="font-medium">
											${lineItems.reduce((sum, item) => sum + (item.quantity * item.priceEach), 0).toFixed(2)}
										</span>
									</div>
									<div className='font-normal flex items-center gap-1 py-1 justify-between' >
										<div className='text-muted-foreground flex items-center gap-1.5 font-light'> <ReceiptText className='size-4' />Invoiced</div>
										<Badge variant={ticketData.invoiced ? "default" : "secondary"}>
											{ticketData.invoiced ? 'Yes' : 'No'}
										</Badge>
									</div>
									<div className='font-normal flex items-center gap-1 py-1 justify-between' >
										<Button className="w-full">
											<FileText className="h-4 w-4 mr-2" />
											Generate Invoice
										</Button>
									</div>

								</div>
							</div>
						</div>
					</ScrollArea>

				</RightSidebar>

			</div>
		</div>
	);
}