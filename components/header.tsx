import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const Header = ({
  trailingButtons = undefined,
  className = undefined,
  children = undefined,
}: {
  trailingButtons?: ReactNode;
  className?: string;
  children?: ReactNode;
}) => (
  <div
    className={cn(
      "flex h-16 items-center gap-2 border-b bg-background px-4 flex-shrink-0",
      className,
    )}
  >
    <SidebarTrigger className="-ml-[0.375rem]" />
    {children !== undefined && <span className="text-sm">{children}</span>}
    {trailingButtons !== undefined && (
      <div className="ml-auto">{trailingButtons}</div>
    )}
  </div>
);

export default Header;
