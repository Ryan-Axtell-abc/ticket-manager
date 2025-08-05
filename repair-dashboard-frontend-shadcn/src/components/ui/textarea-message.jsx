import * as React from "react"

import { cn } from "@/lib/utils"

function TextareaMessage({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      style={{scrollbarWidth: "thin", scrollbarGutter: "stable", scrollbarColor: "rgba(0,0,0,.1) transparent", scroll}}
      className={cn(
        "w-full border-0 field-sizing-content outline-none md:text-sm placeholder:text-muted-foreground",
        className
      )}
      {...props} />
  );
}

export { TextareaMessage }
