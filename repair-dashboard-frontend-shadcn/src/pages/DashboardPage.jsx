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
import { useRef } from "react";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";



export default function DashboardPage() {

	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<div className="w-full flex-col justify-start gap-6">
				<div className="relative flex flex-col gap-4 overflow-auto">

					<SectionCards />
					<div className="px-4 lg:px-6">
						<ChartAreaInteractive />
					</div>
							
				</div>
			</div>
		</div>
	)
}
