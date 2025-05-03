function TimestampDisplay({ ts }) {
  // Convert Firestore Timestamp or raw object into JS Date
  let date;
  if (typeof ts.toDate === "function") {
    date = ts.toDate();
  } else {
    const ms = ts.seconds * 1000 + Math.round(ts.nanoseconds / 1e6);
    date = new Date(ms);
  }

  // Format: Month Day, Year
  const formatted = date.toLocaleDateString('en-US', {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <time dateTime={date.toISOString()} >
      {formatted}
    </time>
  );
}

export default TimestampDisplay;