import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const Header = ({
  trailingButtons,
  children,
  className = undefined,
}: {
  trailingButtons?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex h-16 items-center gap-2 border-b bg-background px-4",
      className,
    )}
  >
    <SidebarTrigger className="-ml-[0.375rem]" />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <span className="text-sm">{children}</span>
    {trailingButtons && <div className="ml-auto">{trailingButtons}</div>}
  </div>
);

export default Header;
