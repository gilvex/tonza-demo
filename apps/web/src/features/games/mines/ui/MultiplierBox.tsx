import React from "react";
import { cn } from "@web/lib/utils";

interface MultiplierBoxProps {
  value: string;
  borderColor: string;
  backgroundColor?: string;
}

const MultiplierBox: React.FC<MultiplierBoxProps> = ({
  value,
  borderColor,
  backgroundColor = "transparent",
}) => {
  return (
    <div
      className={cn("font-bold border rounded-lg py-1.5 px-2 w-20 text-center")}
      style={{ borderColor, backgroundColor }}
    >
      {value}
    </div>
  );
};

export default MultiplierBox;
