#!/bin/bash

# Check if textarea.tsx exists and copy it to ensure it's in the right location
if [ -f components/ui/textarea.tsx ]; then
  echo "Found textarea.tsx in components/ui directory"
  echo "Creating backup at components/ui/textarea.backup.tsx"
  cp components/ui/textarea.tsx components/ui/textarea.backup.tsx
else
  echo "Textarea component missing, creating it"
  mkdir -p components/ui
  
  # Create the textarea component
  cat > components/ui/textarea.tsx << 'EOF'
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
EOF
fi

# Rebuild the app
echo "Clearing Next.js cache"
rm -rf .next

echo "Rebuilding the app"
npm run build

echo "Starting the dev server"
npm run dev 