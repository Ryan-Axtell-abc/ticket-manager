export const formatDate = (dateString, hasWeekday) => {
	const date = new Date(dateString);
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const dayName = days[date.getDay()];
	
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear().toString().slice(-2);
	
	let hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	
	return `${hasWeekday ? dayName+' ' : ''}${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};