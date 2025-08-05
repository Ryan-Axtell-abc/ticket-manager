import * as React from "react"
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconCircleCheckFilled,
	IconCheck,
	IconGripVertical,
	IconLayoutColumns,
	IconLoader,
	IconPlus,
	IconTrendingUp,
	IconArrowsUpDown,
	IconMail,
	IconSparkles,
	IconTruck,
	IconTruckLoading,
	IconTruckDelivery,
	IconCirclePlus,
	IconCirclePlus2,
	IconCalendarPlus,
	IconCalendar,
	IconRefresh,
	IconProgressHelp,
	IconUser,
	IconAlignJustified,
	IconHash,
} from "@tabler/icons-react"
import {
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	SimpleTooltip,
} from "@/components/ui/tooltip"
import { Link } from "react-router-dom";


import { useState, useEffect, useRef } from 'react';
import { useSidebar, useSidebarRef, useSidebarState } from "@/components/ui/sidebar";
import { useMemo } from "react";
import { useCallback } from "react";


import '@/ticketsPage.css';
import { ShoppingCart, Ticket } from "lucide-react";

export const schema = z.object({
	ticketNumber: z.number(),
	customer: z.string(),
	subject: z.string(),
	status: z.string(),
	dateTimeCreated: z.string(),
	dateTimeUpdated: z.string(),
})

// Helper function to calculate time since update
function getTimeSinceUpdate(dateTimeUpdated) {
	const now = new Date()
	const updated = new Date(dateTimeUpdated)
	const diffInMs = now - updated
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
	const diffInWeeks = Math.floor(diffInDays / 7)
	const diffInMonths = Math.floor(diffInDays / 30)
	const diffInYears = Math.floor(diffInDays / 365)

	if (diffInYears > 0) {
		return {
			text: `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`,
			minText: `${diffInYears}y`,
			isYellow: false,
			isRed: true
		}
	} else if (diffInMonths > 0) {
		return {
			text: `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`,
			minText: `${diffInMonths} m`,
			isYellow: false,
			isRed: true
		}
	} else if (diffInWeeks > 0) {
		return {
			text: `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`,
			minText: `${diffInWeeks} w`,
			isYellow: (diffInDays >= 2 && diffInDays < 3),
			isRed: diffInDays >= 3
		}
	} else if (diffInDays > 0) {
		return {
			text: `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`,
			minText: `${diffInDays} d`,
			isYellow: (diffInDays >= 2 && diffInDays < 3),
			isRed: diffInDays >= 3
		}
	} else if (diffInHours > 0) {
		return {
			text: `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`,
			minText: `${diffInHours} h`,
			isYellow: false,
			isRed: false
		}
	} else {
		return {
			text: `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`,
			minText: `${diffInMinutes} m`,
			isYellow: false,
			isRed: false
		}
	}
}

const renderStatusIcon = (status) => {
	switch (status) {

		case "New":
			return <IconCirclePlus2 className="size-3" />;
		
		case "In Progress":
			return <IconLoader className="size-3" />;
		
		case "Part Pending":
			return <IconTruckDelivery className="size-3" />;
		
		case "Reply Pending":
			return <IconMail className="size-3" />;

		case "Pickup Ready":
				return <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 size-3" />;
		
		default:
			return <IconLoader className="size-3" />;
	}
};

// Create a separate component for the drag handle
function DragHandle({
	id
}) {
	const { attributes, listeners } = useSortable({
		id,
	})

	return (
		<Button
			{...attributes}
			{...listeners}
			variant="ghost"
			size="icon"
			className="text-muted-foreground size-7 hover:bg-transparent">
			<IconGripVertical className="text-muted-foreground size-3" />
			<span className="sr-only">Drag to reorder</span>
		</Button>
	);
}


const columns = [
	{
		id: "drag",
		header: () => null,
		cell: ({ row }) => <DragHandle id={row.original.ticketNumber} />,
	},
	{
		accessorKey: "ticketNumber",
		header: ({ column }) => {
			return (
				<>
					<div className="hidden lg:inline-block">#</div>

					<SimpleTooltip content="Ticket Number">
						<div className={`flex items-center w-fit lg:hidden`}>
							<IconHash className="h-4 w-4" />
						</div>
					</SimpleTooltip>
				</>
			)
		},
		cell: ({ row }) => (

			<SimpleTooltip content={`Ticket #${row.original.ticketNumber.toString().padStart(4, '0')}`}>
				<Button 
					variant="link"
					className={'px-0 justify-start max-w-16'}
					asChild
				>
					<Link to={`/tickets/${row.original.ticketNumber}`}>
						<div className="flex gap-1.5 items-center">
							<Ticket/>
							<div className="font-mono translate-y-[1px] text-sm" >
								{row.original.ticketNumber.toString().padStart(4, '0')}
							</div>
						</div>
					</Link>
				</Button>
			</SimpleTooltip>

			
		),
	},
	{
		accessorKey: "customer",
		header: ({ column }) => {
			return (
				<>
					<div className="hidden lg:inline-block">Customer</div>

					<SimpleTooltip content="Customer">
						<div className="flex items-center w-fit lg:hidden">
							<IconUser className="h-4 w-4" />
						</div>
					</SimpleTooltip>
				</>
			)
		},
		cell: ({ row, table }) => {
			//const customerWidth = table.options.meta?.customerWidth || 'max-w-32';
			return (
				<SimpleTooltip content={row.original.customer}>
					<Button 
						variant="link"
						className="px-0 justify-start"
						style={{ width: 'max(var(--customer-width, 200px), 64px)' }}
					>
						<span className={'text-ellipsis truncate'}>{row.original.customer}</span>
					</Button>
				</SimpleTooltip>
			);
		},
	},
	{
		accessorKey: "subject",
		header: ({ column }) => {
			return (
				<>
					<div className="hidden lg:inline-block">Subject</div>

					<SimpleTooltip content="Subject">
						<div className="flex items-center w-fit lg:hidden">
							<IconAlignJustified className="h-4 w-4" />
						</div>
					</SimpleTooltip>
				</>
			)
		},
		cell: ({ row, table }) => {
			//const subjectWidth = table.options.meta?.subjectWidth || 'max-w-32';
			return (
				<SimpleTooltip content={row.original.subject}>
					<Button 
						variant="link"
						className="px-0 justify-start"
						style={{ width: 'max(var(--subject-width, 200px), 64px)' }}
					>
						<span className={'text-ellipsis truncate'}>{row.original.subject}</span>
					</Button>
				</SimpleTooltip>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<>
					<div className="hidden lg:inline-block">Status</div>

					<SimpleTooltip content="Status">
						<div className="flex items-center w-fit lg:hidden">
							<IconProgressHelp className="h-4 w-4" />
						</div>
					</SimpleTooltip>
				</>
			)
		},
		cell: ({ row }) => (
			

			<SimpleTooltip content={row.original.status}>
				<Badge variant="outline" className="text-muted-foreground px-1 lg:px-1.5 flex gap-1.5">

					{renderStatusIcon(row.original.status)}
					<span className="hidden lg:inline-block">{row.original.status}</span>
					
				</Badge>
			</SimpleTooltip>
		),
	},
	{
		accessorKey: "dateTimeCreated",
		header: ({ column }) => {
			return (
				<>
					<Button className="!p-0 hidden lg:inline-flex cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
						<span>Created</span>
						<IconArrowsUpDown className="h-4 w-4" />
					</Button>

					<SimpleTooltip content="Created">
						<Button className="!p-0 inline-flex cursor-pointer lg:hidden" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
							<IconCalendar className="h-4 w-4" />
							<IconArrowsUpDown className="h-4 w-4" />
						</Button>
					</SimpleTooltip>
				</>
			)
		},
		cell: ({ row }) => (
			<div className="text-sm text-muted-foreground">

				<SimpleTooltip content={
					<p>
						{new Date(row.original.dateTimeCreated).toLocaleString(undefined, {
						month: 'numeric',
						day: 'numeric', 
						year: 'numeric',
						hour: 'numeric',
						minute: '2-digit',
						hour12: true
						})}
					</p>
				}>
					<div className="w-fit">
						<span className="hidden lg:inline-block">{new Date(row.original.dateTimeCreated).toLocaleDateString()}</span>
						<span  className="inline-block lg:hidden">
							{(() => {
								const date = new Date(row.original.dateTimeCreated);
								const isCurrentYear = date.getFullYear() === new Date().getFullYear();
								
								return date.toLocaleDateString(undefined, 
									isCurrentYear 
									? { month: 'numeric', day: 'numeric' }
									: undefined
								);
								}
							)()}
						</span>
					</div>
				</SimpleTooltip>
				
			</div>
		),
	},
	{
		accessorKey: "dateTimeUpdated",
		header: ({ column }) => {
			return (
				<>
					<Button className="!p-0 hidden lg:inline-flex cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
						<span>Updated</span>
						<IconArrowsUpDown className="h-4 w-4" />
					</Button>

					<SimpleTooltip content="Updated">
						<Button className="!p-0 inline-flex cursor-pointer lg:hidden" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
							<IconRefresh className="h-4 w-4" />
							<IconArrowsUpDown className="h-4 w-4" />
						</Button>
					</SimpleTooltip>
				</>
			)
		},
		cell: ({ row }) => {
			const timeSince = getTimeSinceUpdate(row.original.dateTimeUpdated)
			return (
				<Badge 
					variant="outline" 
					className={`text-muted-foreground px-1.5 
					${
						timeSince.isYellow
							? "bg-yellow-400 text-yellow-50 border-yellow-400" 
							: ""
					}
					${
						timeSince.isRed 
							? "bg-red-500 text-red-50 border-red-500" 
							: ""
					}`}
				>


					<SimpleTooltip content={
						<p>
							{new Date(row.original.dateTimeUpdated).toLocaleString(undefined, {
							month: 'numeric',
							day: 'numeric', 
							year: 'numeric',
							hour: 'numeric',
							minute: '2-digit',
							hour12: true
							})}
						</p>}
					>
						<div className="w-fit">
							<span  className="inline-block lg:hidden">{timeSince.minText}</span>
							<span className="hidden lg:inline-block">{timeSince.text}</span>
						</div>
					</SimpleTooltip>
				</Badge>
			)
		},
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<SimpleTooltip content="Resolve">
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 opacity-100 sm:group-hover:opacity-100 sm:opacity-0 transition-opacity"
					onClick={() => {
						toast.success(`Ticket ${row.original.ticketNumber} resolved!`)
					}}
				>
					<IconCheck className="h-4 w-4" />
					<span className="sr-only">Resolve ticket</span>
				</Button>
			</SimpleTooltip>
		),
	},
]

function DraggableRow({
	row
}) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.original.ticketNumber,
	})

	return (
		<TableRow
			data-state={row.getIsSelected() && "selected"}
			data-dragging={isDragging}
			ref={setNodeRef}
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 group"
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition,
			}}>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}


export function TicketsDataTable({
	data: initialData
}) {

	const [data, setData] = React.useState(() => initialData)
	const [columnVisibility, setColumnVisibility] =
		React.useState({})
	const [columnFilters, setColumnFilters] = React.useState([])
	const [sorting, setSorting] = React.useState([])
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 50,
	})
	const [grouping, setGrouping] = React.useState([])
	const [globalFilter, setGlobalFilter] = React.useState("")
	
	const sortableId = React.useId()
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	)

	const dataIds = React.useMemo(() => data?.map(({ ticketNumber }) => ticketNumber) || [], [data])

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			columnFilters,
			pagination,
			globalFilter,
		},
		getRowId: (row) => row.ticketNumber.toString(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		enableSorting: true,
	})

	function handleDragEnd(event) {
		const { active, over } = event
		if (active && over && active.id !== over.id) {
			setData((data) => {
				const oldIndex = dataIds.indexOf(active.id)
				const newIndex = dataIds.indexOf(over.id)
				return arrayMove(data, oldIndex, newIndex);
			})
		}
	}

	// Group tickets by status when grouping is enabled
	const groupedData = React.useMemo(() => {
		if (grouping.length === 0) {
			return { "All Tickets": table.getRowModel().rows }
		}
		
		const groupKey = grouping[0]
		const groups = {}
		
		table.getRowModel().rows.forEach(row => {
			const groupValue = row.original[groupKey] || "Unknown"
			if (!groups[groupValue]) {
				groups[groupValue] = []
			}
			groups[groupValue].push(row)
		})
		
		// Sort groups alphabetically and return as sorted object
		const sortedGroups = {}
		Object.keys(groups)
			.sort((a, b) => a.localeCompare(b))
			.forEach(key => {
				sortedGroups[key] = groups[key]
			})
		
		return sortedGroups
	}, [table.getRowModel().rows, grouping])

	
	const tableContainerRef = useRef(null);

	// Update when columns change
	useEffect(() => {
		/* drag, customer and subject padding, resolve button */
		const baseWidth = 44 + 32 + 48;

		const columnWidths = {
			// Full width versions
			full: {
				ticketNumber: 80,
				status: 129,
				dateTimeCreated: 93,
				dateTimeUpdated: 101,
			},
			// Narrow width versions  
			narrow: {
				ticketNumber: 80,
				status: 38,
				dateTimeCreated: 56,
				dateTimeUpdated: 56,
			}
		};


		const allColumns = ['ticketNumber', 'status', 'dateTimeCreated', 'dateTimeUpdated'];

		const visibleColumns = allColumns.filter(
			key => columnVisibility[key] !== false
		);

		const totalFixedFull = baseWidth + visibleColumns.reduce((sum, col) => {
			return sum + (columnWidths.full[col] || 0);
		}, 0);
		
		const totalFixedNarrow = baseWidth + visibleColumns.reduce((sum, col) => {
			return sum + (columnWidths.narrow[col] || 0);
		}, 0);
		
		
		tableContainerRef.current.style.setProperty('--fixed-cols-width-full', `${totalFixedFull}px`);
		tableContainerRef.current.style.setProperty('--fixed-cols-width-narrow', `${totalFixedNarrow}px`);

	}, [columnVisibility]);


	return (
		<div ref={tableContainerRef} className="w-full flex-col justify-start gap-6 tickets-page-table-container">
			<div className="flex items-end flex-col justify-between px-4 lg:px-6 pb-4 gap-4 xs:flex-row">
				<div className="flex items-center gap-4 flex-1 max-w-full w-full">
					<Input
						placeholder="Search tickets..."
						value={globalFilter ?? ""}
						onChange={(event) => setGlobalFilter(String(event.target.value))}
						className="max-w-full w-full xs:max-w-sm"
					/>
				</div>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								{grouping.length > 0 ? `Group by ${grouping[0]}` : "Group by..."}
								<IconChevronDown className="ml-1 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem 
								onClick={() => setGrouping([])}
								className={grouping.length === 0 ? "bg-accent" : ""}
							>
								No grouping
							</DropdownMenuItem>
							<DropdownMenuItem 
								onClick={() => setGrouping(["status"])}
								className={grouping[0] === "status" ? "bg-accent" : ""}
							>
								Group by Status
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<IconLayoutColumns />
								<span className="hidden lg:inline-block">Customize Columns</span>
								<span className="lg:hidden">Columns</span>
								<IconChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							{table
								.getAllColumns()
								.filter((column) =>
								typeof column.accessorFn !== "undefined" &&
								column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
					<Button size="sm">
						<IconPlus />
						<span className="hidden lg:inline-block">Add Ticket</span>
					</Button>
				</div>
			</div>
			<div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 @container">
				
				{Object.entries(groupedData).map(([groupName, groupRows]) => (
					<div key={groupName} className="overflow-hidden rounded-lg border table">
						{grouping.length > 0 && (
							<div className="bg-muted px-4 py-3 border-b">
								<div className="flex gap-3 text-sm text-muted-foreground">
									<div className="text-foreground">{groupName}</div>-<div>{groupRows.length} tickets</div>
								</div>
							</div>
						)}
						<DndContext
							collisionDetection={closestCenter}
							modifiers={[restrictToVerticalAxis]}
							onDragEnd={handleDragEnd}
							sensors={sensors}
							id={sortableId}>
							<Table className="w-full">
								
								<TableHeader className="bg-muted sticky top-0 z-10">
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => {
												return (
													<TableHead key={header.id} colSpan={header.colSpan}>
														{header.isPlaceholder
															? null
															: flexRender(header.column.columnDef.header, header.getContext())}
													</TableHead>
												);
											})}
										</TableRow>
									))}
								</TableHeader>
								<TableBody className="**:data-[slot=table-cell]:first:w-8">
									{groupRows?.length ? (
										<SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
											{groupRows.map((row) => (
												<DraggableRow key={row.id} row={row} />
											))}
										</SortableContext>
									) : (
										<TableRow>
											<TableCell colSpan={columns.length} className="h-24 text-center">
												No results.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</DndContext>
					</div>
				))}
				<div className="flex items-center justify-between px-4">
					<div className="flex w-full items-center gap-8 lg:w-fit">
						<div className="hidden items-center gap-2 lg:flex">
							<Label htmlFor="rows-per-page" className="text-sm font-medium">
								Rows per page
							</Label>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(value) => {
									table.setPageSize(Number(value))
								}}>
								<SelectTrigger size="sm" className="w-20" id="rows-per-page">
									<SelectValue placeholder={table.getState().pagination.pageSize} />
								</SelectTrigger>
								<SelectContent side="top">
									{[50, 100, 150, 200].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex w-fit items-center justify-center text-sm font-medium">
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</div>
						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}>
								<span className="sr-only">Go to first page</span>
								<IconChevronsLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}>
								<span className="sr-only">Go to previous page</span>
								<IconChevronLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}>
								<span className="sr-only">Go to next page</span>
								<IconChevronRight />
							</Button>
							<Button
								variant="outline"
								className="hidden size-8 lg:flex"
								size="icon"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}>
								<span className="sr-only">Go to last page</span>
								<IconChevronsRight />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}