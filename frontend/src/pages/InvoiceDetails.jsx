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
import { BriefcaseBusiness, Edit3, Mail, Phone, ShoppingCart, Smartphone, Ticket } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconChevronDown, IconCircleCheckFilled, IconDeviceMobile, IconLayoutColumns, IconMail, IconTicket, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { formatDate } from "@/functions";

import '@/customerDetails.css';
import { useRef, useState } from "react";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const invoice = {
	number: "2546",
	name: "Laptop Lenovo charger port broke",
	linkedTicket: "5477",
	createdBy: "joeyetta1@gmail.com",
	created: "2025-06-17T09:30:00Z",
	due: "2025-07-17T05:10:05Z",
	paid: true,
	paymentMethod: null,
}

const customer = {
	business: "A and T auto care",
	name: "Jeff Sponsler",
	email: "themecanic11@gmail.com",
	mobile: "5301235850",
	sms: false,
	landline: "5303215850",
}



export default function InvoiceDetails() {


	const taxRate = .075;

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
			description: 'Diagnostic and refrigerant refill service',
			quantity: 3,
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
			priceEach: 99129.00,
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

	



	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"
			style={{ '--grid-gap': "0rem" }}
		>
			<div className="w-full flex-col justify-start gap-6">
				<div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">

					<div className="w-full border-b flex flex-col mb-4 pb-2">
						<div className="w-full flex justify-between ">

							<div className="flex-col flex gap-1">
								<div className="text-foreground font-semibold text-xl leading-[.875]">
									Invoice #{invoice.number}
								</div>
								<div className="font-light text-muted-foreground">
									{invoice.name}
								</div>
							</div>
							<div className="flex gap-2 z-10">

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="sm">
											<span className="hidden sm:inline">Actions</span>
											<IconChevronDown />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">

										<DropdownMenuItem
											key={1}
											className="capitalize">
											Merge
										</DropdownMenuItem>
										<DropdownMenuItem
											key={2}
											className="capitalize">
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<Button variant="default" size="sm">
									<Edit3 className="h-4 w-4" />
									Edit
								</Button>
							</div>

						</div>
					</div>



					<div className="grid grid-cols-1 gap-[var(--grid-gap)] mb-4 gap-y-8
													@xs/main:grid-cols-2 @lg/main:grid-cols-4
													
													[&>*]:flex [&>*]:flex-col [&>*]:gap-2
													 ">
						<div className="">
							<div className="font-medium text-sm leading-none">Customer</div>
							<Button 
								variant="link"
								className="p-0 justify-start h-fit pr-4"
								asChild
							>
								<Link to={`/customers/${''}`}>
									<div className="font-normal underline text-wrap" >
										{customer.business} - {customer.name}
									</div>
								</Link>
							</Button>
						</div>
						<div className="">
							<div className="font-medium text-sm leading-none">Linked Ticket:</div>
							<Button 
								variant="link"
								className="p-0 justify-start h-fit"
								asChild
							>
								<Link to={`/tickets/${invoice.linkedTicket}`}>
									<div className="font-mono translate-y-[1px] underline" >
										{invoice.linkedTicket}
									</div>
								</Link>
							</Button>

						</div>
						<div className="">
							<div className="font-medium text-sm leading-none">
								Payment Status
							</div>
							<div className="text-sm">
								<Badge className={` ${(invoice.paid) ? "bg-green-200/50 text-green-800/100 border-green-800/40": "bg-red-200/50 text-red-800 border-red-800/40"} mb-[-2px]`} variant="secondary" >
									{(invoice.paid) ? "Paid" : "Unpaid"}
								</Badge>
							</div>

						</div>
						<div className="">

							<div className="font-medium text-sm leading-none">Invoice Date</div>
							<div className=" text-sm">{new Date(invoice.created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>

						</div>
					</div>



					<div
						className="flex-1 overflow-auto"
						style={{
							scrollbarWidth: "thin",
							scrollbarColor: "rgba(0,0,0,.1) transparent"
						}}
					>
						<div className="flex flex-col min-w-160 text-sm ">

							<div className="flex min-w-full gap-[var(--grid-gap)] font-medium py-2.5 border-b text-xs text-muted-foreground
																	[&>*]:flex [&>*]:w-full [&>*]:gap-[var(--grid-gap)]
																	[&>*]:[&>*]:w-full [&>*]:[&>*]:flex [&>*]:[&>*]:py-0 [&>*]:[&>*]:items-center
																	[&>*]:[&>*]:wrap-anywhere">

								<div className="">
									<div className="ml-0">
										<div className="hidden lg:flex">
											Name
										</div>
										<div className="lg:hidden">
											Name / Desc
										</div>

									</div>
									<div className="!hidden lg:!flex">
										Description
									</div>
								</div>

								<div className="">
									<div className=" justify-end">
										Qty
									</div>
									<div className=" justify-end">
										Tax
									</div>
									<div className=" justify-end">
										Price
									</div>
									<div className="mr-0 justify-end">
										<div className="pr-0">
											Extended
										</div>
									</div>
								</div>

							</div>

							{lineItems.map((item) => (
								<div className="flex min-w-full gap-[var(--grid-gap)] border-b group hover:bg-muted/50 py-2.5 lg:py-2.5
																	[&>*]:flex [&>*]:w-full [&>*]:gap-[var(--grid-gap)]
																	[&>*]:[&>*]:w-full [&>*]:[&>*]:flex [&>*]:[&>*]:items-center
																	[&>*]:[&>*]:wrap-anywhere">
									<div className="">
										<div className="flex flex-col justify-center !items-start ml-0 font-medium">
											<div className="pl-0">
												{item.name}
											</div>

											<div className=" lg:!hidden text-muted-foreground font-light">
												{item.description}
											</div>

										</div>
										<div className="!hidden lg:!flex font-normal">
											{item.description}
										</div>
									</div>

									<div className="">

										<div className=" justify-end">
											{item.quantity?.toFixed(1)} U
										</div>
										<div className=" justify-end">
											<div className={`${item.hasTax ? '' : '' }`}>
												${
													(
														(item.priceEach * item.quantity) * (item.hasTax ? (taxRate) : 0)
													).toFixed(2)
												}
											</div>
										</div>
										<div className=" justify-end">
											${item.priceEach?.toFixed(2)}
										</div>
										<div className="mr-0 justify-end font-medium">
											<div className="pr-0">
												${
													(
														(item.priceEach * item.quantity) * (item.hasTax ? (1 + taxRate) : 1)
													).toFixed(2)
												}
											</div>

										</div>

									</div>
								</div>
							))}
						</div>
						

					</div>

					<div className="flex gap-[var(--grid-gap)]
										[&>*]:flex [&>*]:w-full 
										[&>*]:[&>*]:flex [&>*]:[&>*]:w-full 
										">


							<div className="">
								<div className=" flex-col py-4 gap-2 text-sm">
									<div className="font-medium leading-none">Payment Method</div>
									<div className="">Cash</div>

								</div>
							</div>
							<div className="">
								<div className="!hidden lg:!flex">

								</div>
								<div className="flex-col text-sm
												[&>*]:w-full [&>*]:flex [&>*]:justify-between [&>*]:border-b
												[&>*]:py-4 
												[&>*]:items-center [&>*]:wrap-anywhere">
									<div className=" ">
										<div className=" font-medium ">
											Subtotal
										</div>
										<div className="font-medium ">
											$100,000
										</div>

									</div>
									<div className=" ">
										<div className=" font-medium ">
											Tax
										</div>
										<div className="font-medium ">
											$100,000
										</div>

									</div>
									<div className=" ">
										<div className=" font-medium ">
											Total
										</div>
										<div className="font-medium ">
											$100,000
										</div>

									</div>

								</div>
							</div>
						</div>



				</div>
			</div>
		</div>
	)
}
