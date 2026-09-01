import { Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	Check,
	ChevronDown,
	ChevronUp,
	Copy,
	Home,
	RotateCcw,
	ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";

export interface UnexpectedErrorProps {
	error?: unknown;
	reset?: () => void;
	title?: string;
	description?: string;
	showRetryButton?: boolean;
	showHomeButton?: boolean;
}

export const UnexpectedError = ({
	error,
	reset,
	title = "Terjadi Kesalahan pada Sistem",
	description = "Maaf, terjadi kendala teknis saat memproses permintaan Anda. Silakan coba muat ulang halaman atau kembali ke beranda.",
	showRetryButton = true,
	showHomeButton = true,
}: UnexpectedErrorProps = {}) => {
	const [showDetails, setShowDetails] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleRetry = () => {
		if (reset) {
			reset();
		} else if (typeof window !== "undefined") {
			window.location.reload();
		}
	};

	const errorMessage =
		error instanceof Error
			? error.stack || error.message
			: typeof error === "string"
				? error
				: error
					? JSON.stringify(error, null, 2)
					: null;

	const handleCopyError = () => {
		if (!errorMessage) return;
		navigator.clipboard.writeText(errorMessage);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex min-h-[75vh] w-full flex-col items-center justify-center px-4 py-12 text-center">
			<div className="relative mx-auto flex w-full max-w-lg flex-col items-center">
				{/* Background decorative watermark */}
				<span className="pointer-events-none absolute -top-8 select-none font-mono text-8xl font-black text-destructive/10 sm:text-9xl">
					500
				</span>

				{/* Icon Badge */}
				<div className="relative mb-6 flex size-20 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive shadow-sm ring-8 ring-destructive/5 transition-transform duration-300 hover:scale-105">
					<AlertTriangle className="size-10" />
				</div>

				{/* Status & Headings */}
				<div className="relative z-10 space-y-3">
					<div className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
						<ShieldAlert className="size-3.5" />
						<span>Error 500 • Internal Error</span>
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
					{showRetryButton && (
						<Button variant="outline" onClick={handleRetry} className="gap-2">
							<RotateCcw className="size-4" />
							Coba Lagi
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

				{/* Developer Error Details (Collapsible) */}
				{errorMessage && (
					<div className="relative z-10 mt-8 w-full text-left">
						<div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted/60 px-4 py-2 text-xs font-medium text-muted-foreground">
							<button
								type="button"
								onClick={() => setShowDetails(!showDetails)}
								className="flex cursor-pointer items-center gap-1.5 hover:text-foreground"
							>
								{showDetails ? (
									<ChevronUp className="size-3.5" />
								) : (
									<ChevronDown className="size-3.5" />
								)}
								<span>Detail Teknis Kesalahan</span>
							</button>
							<button
								type="button"
								onClick={handleCopyError}
								className="flex cursor-pointer items-center gap-1 hover:text-foreground"
							>
								{copied ? (
									<>
										<Check className="size-3 text-primary" />
										<span className="text-primary">Disalin</span>
									</>
								) : (
									<>
										<Copy className="size-3" />
										<span>Salin Trace</span>
									</>
								)}
							</button>
						</div>
						{showDetails && (
							<pre className="max-h-48 overflow-auto rounded-b-lg border border-border bg-muted/30 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
								{errorMessage}
							</pre>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default UnexpectedError;
