import { useEffect, useState } from "react";

function AddedTime({ dateString }: any) {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    const calculateRelativeTime = () => {
      const storedDate = new Date(dateString);
      const currentDate = new Date();

      const timeDifference = currentDate.getTime() - storedDate.getTime();
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const years = Math.floor(days / 365);

      const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

      if (years > 0) {
        setRelativeTime(rtf.format(-years, "year"));
      } else if (days > 0) {
        setRelativeTime(rtf.format(-days, "day"));
      } else if (hours > 0) {
        setRelativeTime(rtf.format(-hours, "hour"));
      } else if (minutes > 0) {
        setRelativeTime(rtf.format(-minutes, "minute"));
      } else if (seconds > 0) {
        setRelativeTime(rtf.format(-seconds, "second"));
      } else {
        setRelativeTime("Just now");
      }
    };

    calculateRelativeTime();
  }, [dateString]);

  return <span>{relativeTime}</span>;
}

export default AddedTime;
