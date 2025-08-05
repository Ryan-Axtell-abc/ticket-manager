import { useState } from "react";
import { RightSidebarTrigger, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { IconBrandGithub, IconBrandGithubFilled } from "@tabler/icons-react";
import { SimpleTooltip } from "@/components/ui/tooltip";

export function Header() {

	const isMobile = useIsMobile();

	const getPageInfo = (pathname) => {
		const segments = pathname.split('/').filter(Boolean);

		if (segments.length === 0) return ['Dashboard', null];
	
		switch (segments[0]) {
			case 'tickets':
				return segments[1] ? [`Ticket #${segments[1]}`, "asd", true] : ['Tickets', null, false];
			case 'invoices':
				return segments[1] ? [`Invoice #${segments[1]}`, "asd", false] : ['Invoices', null, false];
			case 'customers':
				return segments[1] ? ['Customer Details', "asd", false] : ['Customers', null, false];
			default:
				return [segments[0].charAt(0).toUpperCase() + segments[0].slice(1), null, false];
		}
	};

	const location = useLocation();
	const [pageTitle, pageSubtitle, hasRightSidebar] = getPageInfo(location.pathname);

	return (

		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 mx-2 data-[orientation=vertical]:h-4"
				/>
				{pageSubtitle ?
					<div className="flex gap-4" ><div className="text-base font-medium">{pageTitle}</div> </div>
					:
					<div className="text-base font-medium">{pageTitle}</div>
				}

				<div className="ml-auto flex items-center gap-2">

					<SimpleTooltip content="See my Github">
						<Button variant="ghost" asChild size="icon" className="size-7 hidden sm:flex">
							<a
								href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
								rel="noopener noreferrer"
								target="_blank"
								className="dark:text-foreground">
								<IconBrandGithubFilled />
							</a>
						</Button>
					</SimpleTooltip>

					{hasRightSidebar && isMobile && 
					<div className="flex items-center gap-1 lg:gap-2">
					<Separator
					orientation="vertical"
					className="mr-2 mx-2 data-[orientation=vertical]:h-4 hidden sm:flex md:hidden"
				/>
					<RightSidebarTrigger />
					</div>
					}
				</div>
			</div>
		</header>
	)
}