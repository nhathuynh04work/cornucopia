import * as Popover from "@radix-ui/react-popover";

export default function ErrorPopover({ error, children }) {
	return (
		<Popover.Root open={!!error}>
			<Popover.Anchor asChild>{children}</Popover.Anchor>
			{error && (
				<Popover.Portal>
					<Popover.Content
						side="right"
						align="center"
						sideOffset={10}
						className="z-10 w-48 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 shadow-lg animate-in fade-in-50"
						onOpenAutoFocus={(e) => e.preventDefault()}>
						<Popover.Arrow className="fill-red-100" />
						{error.message}
					</Popover.Content>
				</Popover.Portal>
			)}
		</Popover.Root>
	);
}
