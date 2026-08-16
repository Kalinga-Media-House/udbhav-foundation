export function getEventLifecycle(event: {
  event_date?: string | null;
  event_start_time?: string | null;
  event_end_time?: string | null;
}): 'UPCOMING' | 'PAST' {
  if (!event.event_date) return 'PAST';
  
  let endDateStr = event.event_date;
  if (event.event_end_time) {
    endDateStr = `${event.event_date}T${event.event_end_time}`;
  } else if (event.event_start_time) {
    endDateStr = `${event.event_date}T${event.event_start_time}`;
  } else {
    endDateStr = `${event.event_date}T23:59:59`;
  }
  
  const nowInKolkata = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getTime();
  const effectiveEndDate = new Date(new Date(endDateStr).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getTime();
  
  if (effectiveEndDate >= nowInKolkata) {
    return 'UPCOMING';
  }
  return 'PAST';
}
