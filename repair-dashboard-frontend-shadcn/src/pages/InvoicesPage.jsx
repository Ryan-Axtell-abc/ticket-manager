
import { useContext } from "react";
import { TicketsDataTable } from "@/components/tickets-data-table"

import { AppContext } from "@/components/AppContext";
import { InvoicesDataTable } from "@/components/invoices-data-table";

export default function InvoicesPage() {

	const { hasRightSidebar, setHasRightSidebar } = useContext(AppContext);
	setHasRightSidebar(false);

	const data = [
		{
			//Martinez Martingale Rapist Esquire The Third Lupin Fiasco Sarah Elizabeth Martinez Martingale Rapist Esquire The Third Lupin Fiasco
			//"Cover page loren ipsum asadsfjnadsf jadsfkjasdfkjasdf jkasdf jklasdf jklasdf kjlasdf jkasdf jklasdf jklasdf kjlasdf jkasdf jklasdf jklasdf kjlasdf",
			
			"invoiceNumber": 1,
			//"customer": "Sarah Elizabeth Martinez Martingale Rapist Esquire The Third Lupin Fiasco Sarah Elizabeth Martinez Martingale Rapist Esquire The Third Lupin Fiasco",
			"customer": "Sarah Elizabeth",
			"name": "Cover page loren ipsum asadsfjnadsf jadsfkjasdfkjasdf jkasdf jklasdf jklasdf kjlasdf jkasdf jklasdf jklasdf kjlasdf jkasdf jklasdf jklasdf kjlasdf",
			//"name": "Cover page",
			"dateTimeCreated": "2025-05-15T09:30:00Z",
			"totalAmount": 129.99
		},
		{
			"invoiceNumber": 2,
			"customer": "Michael J. Chen",
			"name": "Table of contents",
			"dateTimeCreated": "2025-05-16T10:15:00Z",
			"totalAmount": 49.50
		},
		{
			"invoiceNumber": 3,
			"customer": "Michael J. Chen",
			"name": "Table of contents",
			"dateTimeCreated": "2025-05-16T10:15:00Z",
			"totalAmount": 99999.50
		},
		{
			"invoiceNumber": 4,
			"customer": "Michael J. Chen",
			"name": "Table of contents",
			"dateTimeCreated": "2025-05-16T10:15:00Z",
			"totalAmount": 99999.50
		},
		{
			"invoiceNumber": 5,
			"customer": "Michael J. Chen",
			"name": "Table of contents",
			"dateTimeCreated": "2025-05-16T10:15:00Z",
			"totalAmount": 99999.50
		},
		{
			"invoiceNumber": 6,
			"customer": "Michael J. Chen",
			"name": "Table of contents",
			"dateTimeCreated": "2025-05-16T10:15:00Z",
			"totalAmount": 99999.50
		},
		{
			"invoiceNumber": 7,
			"customer": "Michael J. Chen",
			"name": "Table of contents",
			"dateTimeCreated": "2025-05-16T10:15:00Z",
			"totalAmount": 99999.50
		},
		{
			"invoiceNumber": 8,
			"customer": "Michael J. Chen",
			"name": "Table of contents",
			"dateTimeCreated": "2025-05-16T10:15:00Z",
			"totalAmount": 99999.50
		},
		{
			"invoiceNumber": 9,
			"customer": "Michael J. Chen",
			"name": "Table of contents",
			"dateTimeCreated": "2025-05-16T10:15:00Z",
			"totalAmount": 99999.50
		}
	]


  return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
			<InvoicesDataTable data={data} />
		</div>
  )
}