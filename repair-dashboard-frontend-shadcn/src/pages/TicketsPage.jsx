
import { useContext } from "react";
import { TicketsDataTable } from "@/components/tickets-data-table"

import { AppContext } from "@/components/AppContext";

export default function TicketsPage() {

	const { hasRightSidebar, setHasRightSidebar } = useContext(AppContext);
	setHasRightSidebar(false);

	const data = [
		{
			"ticketNumber": 1,
			"customer": "Sarah Elizabeth Martinez",
			"subject": "Test test test",
			"status": "New",
			"dateTimeCreated": "2025-05-15T09:30:00Z",
			"dateTimeUpdated": "2025-06-07T14:22:00Z"
		},
		{
			"ticketNumber": 2,
			"customer": "Sean J. Chen",
			"subject": "Table of contents",
			"status": "In Progress",
			"dateTimeCreated": "2025-05-16T10:15:00Z",
			"dateTimeUpdated": "2025-06-06T16:45:00Z"
		},
		{
			"ticketNumber": 3,
			"customer": "Jessica Marie Thompson",
			"subject": "Executive summary",
			"status": "Part Pending",
			"dateTimeCreated": "2025-05-17T08:45:00Z",
			"dateTimeUpdated": "2025-05-25T11:30:00Z"
		},
		{
			"ticketNumber": 4,
			"customer": "David Rodriguez",
			"subject": "Technical approach",
			"status": "Reply Pending",
			"dateTimeCreated": "2025-05-18T13:20:00Z",
			"dateTimeUpdated": "2025-05-30T09:15:00Z"
		},
		{
			"ticketNumber": 5,
			"customer": "Amanda Rose Foster",
			"subject": "Design",
			"status": "Pickup Ready",
			"dateTimeCreated": "2025-05-19T11:00:00Z",
			"dateTimeUpdated": "2025-06-04T15:30:00Z"
		},
		{
			"ticketNumber": 6,
			"customer": "Robert T. Kim",
			"subject": "Capabilities",
			"status": "Pickup Ready",
			"dateTimeCreated": "2025-05-20T14:30:00Z",
			"dateTimeUpdated": "2025-06-03T10:45:00Z"
		},
		{
			"ticketNumber": 7,
			"customer": "Emily Grace Watson",
			"subject": "Integration with existing systems",
			"status": "In Progress",
			"dateTimeCreated": "2025-05-21T09:15:00Z",
			"dateTimeUpdated": "2025-06-05T13:20:00Z"
		},
		{
			"ticketNumber": 8,
			"customer": "James R. Wilson",
			"subject": "Innovation and Advantages",
			"status": "Pickup Ready",
			"dateTimeCreated": "2025-05-22T16:45:00Z",
			"dateTimeUpdated": "2025-06-01T12:30:00Z"
		},
		{
			"ticketNumber": 9,
			"customer": "Lisa Anderson",
			"subject": "Overview of EMR's Innovative Solutions",
			"status": "Pickup Ready",
			"dateTimeCreated": "2025-05-23T12:00:00Z",
			"dateTimeUpdated": "2025-05-29T14:15:00Z"
		},
		{
			"ticketNumber": 10,
			"customer": "Christopher Paul Lee",
			"subject": "Advanced Algorithms and Machine Learning",
			"status": "Pickup Ready",
			"dateTimeCreated": "2025-05-24T10:30:00Z",
			"dateTimeUpdated": "2025-06-02T16:00:00Z"
		},
		{
			"ticketNumber": 11,
			"customer": "Nicole S. Harris",
			"subject": "Adaptive Communication Protocols",
			"status": "Pickup Ready",
			"dateTimeCreated": "2025-05-25T15:20:00Z",
			"dateTimeUpdated": "2025-05-31T11:45:00Z"
		},
		{
			"ticketNumber": 12,
			"customer": "Daniel Antonio Garcia",
			"subject": "Advantages Over Current Technologies",
			"status": "Pickup Ready",
			"dateTimeCreated": "2025-05-26T08:30:00Z",
			"dateTimeUpdated": "2025-06-01T09:20:00Z"
		}
	]


  return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
			<TicketsDataTable data={data} />
		</div>
  )
}