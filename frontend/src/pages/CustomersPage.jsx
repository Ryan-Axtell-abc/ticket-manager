
import { CustomersDataTable } from "@/components/customers-data-table"

export default function CustomersPage() {

	const customerData = [
		{
			name: 'John Smith',
			email: 'john.smith@email.com',
			mobile: '+1 (555) 123-4567',
			landline: '+1 (555) 987-6543',
			company: 'Smith Industries',
			smsEnabled: true
		}
	];


  return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
			<CustomersDataTable data={data} />
		</div>
  )
}