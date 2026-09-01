import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Compass, Home, SearchX } from "lucide-react";
import { Button } from "#/components/ui/button";

export interface NotFoundProps {
	data?: unknown;
	title?: string;
	description?: string;
	showBackButton?: boolean;
	showHomeButton?: boolean;
}

export const NotFound = ({
	title = "Halaman Tidak Ditemukan",
	description = "Maaf, halaman atau sumber daya yang Anda cari tidak dapat ditemukan, telah dipindahkan, atau tautan yang Anda tuju sudah tidak aktif.",
	showBackButton = true,
	showHomeButton = true,
}: NotFoundProps = {}) => {
	const navigate = useNavigate();

	const handleBack = () => {
		if (typeof window !== "undefined" && window.history.length > 1) {
			window.history.back();
		} else {
			navigate({ to: "/" });
		}
	};

	return (
		<div className="flex min-h-[75vh] w-full flex-col items-center justify-center px-4 py-12 text-center">
			<div className="relative mx-auto flex w-full max-w-lg flex-col items-center">
				{/* Background decorative watermark */}
				<span className="pointer-events-none absolute -top-8 select-none font-mono text-8xl font-black text-muted/30 sm:text-9xl">
					404
				</span>

				{/* Icon Badge */}
				<div className="relative mb-6 flex size-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm ring-8 ring-muted/50 transition-transform duration-300 hover:scale-105">
					<SearchX className="size-10 text-muted-foreground" />
				</div>

				{/* Status & Headings */}
				<div className="relative z-10 space-y-3">
					<div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
						<Compass className="size-3.5" />
						<span>Error 404 • Not Found</span>
					</div>

					<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
						{title}
					</h1>

					<p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
						{description}
					</p>
				</div>

				{/* Action Buttons */}
				<div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3">
					{showBackButton && (
						<Button variant="outline" onClick={handleBack} className="gap-2">
							<ArrowLeft className="size-4" />
							Kembali
						</Button>
					)}
					{showHomeButton && (
						<Button variant="default" asChild className="gap-2">
							<Link to="/">
								<Home className="size-4" />
								Kembali ke Beranda
							</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default NotFound;
