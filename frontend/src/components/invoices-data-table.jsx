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
	IconCurrencyDollarSingapore,
	IconListCheck,
	IconTrendingDown,
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


import '@/invoicesPage.css';
import { BadgeDollarSign, CircleDollarSign, DollarSign, ListCheck, LucideDollarSign, ShoppingCart } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";


const columns = [
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex items-center">
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="bg-card"
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="mr-1 md:mr-2 flex items-center">
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "invoiceNumber",
		header: ({ column }) => {
			return (
				<>
					<div className="hidden lg:inline-block">#</div>

					<SimpleTooltip content="Invoice Number">
						<div className={`flex items-center w-fit lg:hidden`}>
							<IconHash className="h-4 w-4" />
						</div>
					</SimpleTooltip>
				</>
			)
		},
		cell: ({ row }) => (

			<SimpleTooltip content={`Invoice #${row.original.invoiceNumber.toString().padStart(4, '0')}`}>
				<Button
					variant="link"
					className={'px-0 justify-start max-w-16'}
					asChild
				>
					<Link to={`/invoices/${row.original.invoiceNumber}`}>
						<div className="flex gap-1.5 font-mono translate-y-[1px] text-sm">

							<ShoppingCart />
							{row.original.invoiceNumber.toString().padStart(4, '0')}
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
						style={{ maxWidth: 'max(var(--customer-width, 20px), 64px)' }}
					>
						<span className={'text-ellipsis truncate'}>{row.original.customer}</span>
					</Button>
				</SimpleTooltip>
			);
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<>
					<div className="hidden lg:inline-block">Name</div>

					<SimpleTooltip content="Name">
						<div className="flex items-center w-fit lg:hidden">
							<IconAlignJustified className="h-4 w-4" />
						</div>
					</SimpleTooltip>
				</>
			)
		},
		cell: ({ row, table }) => {
			return (
				<SimpleTooltip content={row.original.name}>
					<Button
						variant="link"
						className="px-0 justify-start"
						style={{ maxWidth: 'max(var(--name-width, 20px), 64px)' }}
					>
						<span className={'text-ellipsis truncate'}>{row.original.name}</span>
					</Button>
				</SimpleTooltip>
			);
		},
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
			<div className="text-sm">

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
						<span className="inline-block">{new Date(row.original.dateTimeCreated).toLocaleDateString()}</span>
					</div>
				</SimpleTooltip>

			</div>
		),
	},
	{
		accessorKey: "totalAmount",
		header: ({ column }) => {
			return (


				<div className="flex justify-end">

					<Button className="!p-0 hidden lg:inline-flex cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
						<span>Amount</span>
						<IconArrowsUpDown className="h-4 w-4" />
					</Button>

					<SimpleTooltip content="Amount">
						<Button className="!p-0 inline-flex cursor-pointer lg:hidden" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
							<DollarSign className="h-4 w-4" />
							<IconArrowsUpDown className="h-4 w-4" />
						</Button>
					</SimpleTooltip>
				</div>
			)
		},
		cell: ({ row }) => (

			<div className="text-sm flex justify-end">
				<SimpleTooltip content={
					<p>
						${row.original.totalAmount?.toFixed(2)}
					</p>
				}>
					<div className="w-fit">
						<span className="inline-block">${row.original.totalAmount?.toFixed(2)}</span>
					</div>
				</SimpleTooltip>
			</div>
		),
	},
]



export function InvoicesDataTable({
	data: initialData
}) {

	const [data, setData] = React.useState(() => initialData)


	const [sorting, setSorting] = React.useState([])

	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 50,
	})

	// Filters are for search
	const [globalFilter, setGlobalFilter] = React.useState("")
	const [rowSelection, setRowSelection] = React.useState({})

	const sortableId = React.useId()

	//What does useSensors do?
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	)

	const dataIds = React.useMemo(() => data?.map(({ invoiceNumber }) => invoiceNumber) || [], [data])

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			pagination,
			globalFilter,
			rowSelection,
		},
		getRowId: (row) => row.invoiceNumber.toString(),
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		onRowSelectionChange: setRowSelection,
		enableSorting: true,
	})



	return (
		<div className="w-full flex-col justify-start gap-6 invoices-page-table-container">
			<div className="flex items-end flex-row justify-between px-4 lg:px-6 pb-4 gap-4">
				<div className="flex items-center gap-4 flex-1 max-w-full w-full">
					<Input
						placeholder="Search invoices..."
						value={globalFilter ?? ""}
						onChange={(event) => setGlobalFilter(String(event.target.value))}
						className="max-w-full w-full xs:max-w-sm"
					/>
				</div>
				<div className="flex items-center gap-2">

					<DropdownMenu>
						<DropdownMenuTrigger className={`${(Object.keys(rowSelection).length === 0) ? "hidden" : ""}`} asChild>
							<Button variant="outline" size="sm">
								<IconListCheck />
								<span className="hidden lg:inline-block">Bulk Actions</span>
								<IconChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">

							<DropdownMenuItem
								key={1}
								className="capitalize">
								Delete
							</DropdownMenuItem>
							<DropdownMenuItem
								key={2}
								className="capitalize">
								Email
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button size="sm">
						<IconPlus />
						<span className="hidden lg:inline-block">Add Invoice</span>
					</Button>
				</div>
			</div>


			<div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4  mb-4">
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>Open Invoices</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							$1,250.00
						</CardTitle>
						<CardAction>
							<Badge variant="outline">
								<IconTrendingUp />
								+12.5%
							</Badge>
						</CardAction>
					</CardHeader>
				</Card>
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>Overdue Invoices</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							1,234
						</CardTitle>
						<CardAction>
							<Badge variant="outline">
								<IconTrendingDown />
								-20%
							</Badge>
						</CardAction>
					</CardHeader>
				</Card>
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>Paid Last 30 Days</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							45,678
						</CardTitle>
						<CardAction>
							<Badge variant="outline">
								<IconTrendingUp />
								+12.5%
							</Badge>
						</CardAction>
					</CardHeader>
				</Card>
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>Growth Rate</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							4.5%
						</CardTitle>
						<CardAction>
							<Badge variant="outline">
								<IconTrendingUp />
								+4.5%
							</Badge>
						</CardAction>
					</CardHeader>
				</Card>
			</div>


			<div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 @container">


				<div className="overflow-hidden rounded-lg border table">

					<DndContext
						collisionDetection={closestCenter}
						modifiers={[restrictToVerticalAxis]}
						sensors={sensors}
						id={sortableId}>
						<Table className="w-full">

							<TableHeader className="bg-muted sticky top-0 z-10" >
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead key={header.id} colSpan={header.colSpan}
													className="first:max-w-12 first:w-12 first:pl-4 last:pr-4">
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>

							<TableBody>
								{table.getRowModel().rows?.length ? (
									<SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
										{table.getRowModel().rows.map((row) => (
											<TableRow key={row.id}
												data-state={row.getIsSelected() && "selected"}
												className="relative z-0 group"
											>
												{row.getVisibleCells().map((cell) => (
													<TableCell key={cell.id} className="first:pl-4 last:pr-4">
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</TableCell>
												))}
											</TableRow>
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