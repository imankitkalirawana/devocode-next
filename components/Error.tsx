import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  message: string;
}

const NotFound = ({ title, message }: Props) => {
  const [isDisplaying, setIsDisplaying] = React.useState(false);
  // display after 2 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsDisplaying(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    isDisplaying && (
      <div className="error-page">
        <Image
          className="error-page-img"
          src="/error.svg"
          alt="404 not found"
          width={300}
          height={300}
        />
        <h1 className="error-page-title">{title}</h1>
        <p className="error-page-message">{message}</p>
      </div>
    )
  );
};

export default NotFound;
