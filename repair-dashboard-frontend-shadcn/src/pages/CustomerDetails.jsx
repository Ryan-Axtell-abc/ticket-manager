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
import { BriefcaseBusiness, Check, Dot, Edit3, Mail, MessageCircle, MessageCircleHeart, MessageCircleOff, Phone, ShoppingCart, Smartphone, Ticket } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconBrandPushbullet, IconChevronDown, IconCornerDownRight, IconCornerDownRightDouble, IconDeviceMobile, IconLayoutColumns, IconMail, IconRadiusBottomLeft, IconTicket } from "@tabler/icons-react";
import { formatDate } from "@/functions";

import '@/customerDetails.css';
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { SimpleTooltip } from "@/components/ui/tooltip";

const tickets = [
	{
		number: "1",
		subject: "Ticket subject 1",
		created: "2025-05-15T09:30:00Z",
		status: "New",
	},
	{
		number: "2",
		subject: "Ticket subject 2",
		created: "2025-06-17T09:30:00Z",
		status: "Reply Pending",
	},
]

const invoices = [
	{
		number: "1",
		name: "Unpaid",
		created: "2025-06-17T09:30:00Z",
		total: "$350.00",
	},
	{
		number: "2",
		name: "Unpaid",
		created: "2025-06-17T09:30:00Z",
		total: "$350.00",
	},
	{
		number: "3",
		name: "Cover page",
		created: "2025-06-17T09:30:00Z",
		total: "$350.00",
	},
]

const customer = {
	business: "A and T auto care",
	name: "Jeff Sponsler",
	email: "themecanic11@gmail.com",
	mobile: "5301235850",
	sms: false,
	landline: "5303215850",
	created: "2025-05-15T09:30:00Z",
}



export default function CustomerDetails() {

	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 customer-table-container @container">
			<div className="w-full flex-col justify-start gap-6">
				<div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">

					<div className="px-0 pb-4 flex flex-col gap-2">
						<div className="w-full border-b flex justify-between mb-0">
							<div className="flex flex-col gap-1 pb-2">

								<div className="font-semibold text-xl leading-[.875]">
									{customer.business} - {customer.name}
								</div>

								<div className=" text-muted-foreground font-light">
									<div>Created at {formatDate(customer.created, false)}</div>
								</div>

							</div>
							<div className="flex gap-2">

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="sm">
											<span className="hidden md:inline">Actions</span>
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

						<div className="text-sm text-nowrap w-full flex gap-2">
							<div className="text-sm text-nowrap w-fit flex flex-col @2xl:flex-row gap-2">
								<IconCornerDownRight className="text-muted-foreground size-4 " />
							</div>
							<div className="text-sm text-nowrap w-full flex flex-col @2xl:flex-row gap-2 ">
								<div className="text-sm text-nowrap w-full flex flex-col @2xl:flex-row gap-2">

									<div className="flex items-center gap-2 @2xl:mr-6  justify-start w-full @2xl:w-fit ">

										<SimpleTooltip content="Email">
											<div className="text-muted-foreground flex gap-1 items-center">
												<Mail className="size-4" />
												<div className="hidden">Email:</div>
											</div>
										</SimpleTooltip>
										john.smith@email.com
									</div>
									<div className="flex items-center gap-2 @2xl:mr-6  justify-start w-full @2xl:w-fit ">
										<SimpleTooltip content="Mobile">
											<div className="text-muted-foreground flex gap-1 items-center">
												<Smartphone className="text-muted-foreground size-4" />
												<div className="hidden">Smartphone:</div>
											</div>
										</SimpleTooltip>
										+1 (555) 123-4567
										{customer.sms ?
											<SimpleTooltip content="SMS Available">
												<Check className="text-muted-foreground size-3" />
											</SimpleTooltip>
											:
											<SimpleTooltip content="SMS Unavailable">
												<MessageCircleOff className="text-muted-foreground size-3" />
											</SimpleTooltip>
										}


									</div>
									<div className="flex items-center gap-2 @2xl:mr-6 justify-start w-full @2xl:w-fit">
										<SimpleTooltip content="Landline">
											<div className="text-muted-foreground flex gap-1 items-center">

												<Phone className=" size-4" />
												<div className="hidden">Landline:</div>
											</div>
										</SimpleTooltip>
										+1 (555) 987-6543
									</div>



								</div>
							</div>
						</div>



					</div>
					
					<div className=" overflow-x-auto flex flex-col gap-4"
						style={{
							scrollbarWidth: "thin",
							scrollbarColor: "rgba(0,0,0,.1) transparent"
						}}
					>
						<div className="overflow-hidden rounded-lg border table tickets-table-container ">
							<div className="bg-muted px-4 py-3 border-b">
								<div className="flex gap-3 text-sm text-muted-foreground">
									<div className="text-foreground">Tickets</div>-<div>fake number tickets</div>
								</div>
							</div>


							<Table className="w-full">
								<TableHeader className="bg-muted sticky top-0 z-10">
									<TableRow>
										<TableHead className="pl-4">#</TableHead>
										<TableHead>Subject</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="pr-4">Status</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{tickets.map((ticket) => (
										<TableRow key={ticket.number} className="relative z-0 group">
											<TableCell className="w-[86px] min-w-[86px] max-w-[86px] text-sm pl-4 flex gap-1.5 items-center"><IconTicket className="size-4" /><div className="font-mono translate-y-[1px]">{ticket.number.toString().padStart(4, '0')}</div></TableCell>
											<TableCell style={{ maxWidth: 'max(var(--tickets-subject-width, 200px), 64px)', minWidth: 'max(var(--tickets-subject-width, 200px), 64px)' }}>
												<div className="text-ellipsis truncate font-medium">
													{ticket.subject}
												</div>
											</TableCell>
											<TableCell className="w-[144px] min-w-[144px] max-w-[144px]" >{formatDate(ticket.created, false)}</TableCell>
											<TableCell className="w-[120px] min-w-[120px] max-w-[120px] pr-4">{ticket.status}</TableCell>
										</TableRow>
									))}

								</TableBody>
							</Table>
						</div>


						<div className="overflow-hidden rounded-lg border table invoices-table-container">
							<div className="bg-muted px-4 py-3 border-b">
								<div className="flex gap-3 text-sm text-muted-foreground">
									<div className="text-foreground">Invoices</div>-<div>fake number invoices</div>
								</div>
							</div>


							<Table className="w-full">
								<TableHeader className="bg-muted sticky top-0 z-10">
									<TableRow>
										<TableHead className="pl-4">#</TableHead>
										<TableHead>Name</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="text-right pr-4">Amount</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody className="**:data-[slot=table-cell]:first:w-8">
									{invoices.map((invoice) => (
										<TableRow className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 group">
											<TableCell className="w-[86px] min-w-[86px] max-w-[86px] text-sm pl-4 flex gap-1.5"><ShoppingCart className="size-4 translate-y-[1px]" /><div className="font-mono translate-y-[1px]">{invoice.number.toString().padStart(4, '0')}</div></TableCell>
											<TableCell style={{ maxWidth: 'max(var(--invoice-name-width, 200px), 64px)', minWidth: 'max(var(--invoice-name-width, 200px), 64px)' }}>
												<div className="text-ellipsis truncate font-medium">
													{invoice.name}
												</div>
											</TableCell>
											<TableCell className="w-[144px] min-w-[144px] max-w-[144px]" >{formatDate(invoice.created, false)}</TableCell>
											<TableCell className="w-[120px] min-w-[120px] max-w-[120px] text-right pr-4">{invoice.total}</TableCell>
										</TableRow>
									))}

								</TableBody>
							</Table>
						</div>

					</div>

				</div>
			</div>
		</div>
	)
}
