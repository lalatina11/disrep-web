import type { ErrorComponentProps } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "#/components/ui/button";

interface UnexpectedErrorProps extends Partial<ErrorComponentProps> {
	title?: string;
	description?: string;
}

const UnexpectedError = ({
	error,
	reset,
	title = "Terjadi Kesalahan Tidak Terduga",
	description = "Maaf, terjadi masalah saat memproses permintaan Anda. Silakan coba beberapa saat lagi.",
}: UnexpectedErrorProps) => {
	const nav = useNavigate();

	function handleRetry() {
		if (reset) {
			reset();
		} else {
			window.location.reload();
		}
	}

	function handleBackToHome() {
		nav({ to: "/" });
	}

	const errorMessage =
		error instanceof Error
			? error.message
			: typeof error === "string"
				? error
				: null;

	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
			<div className="flex w-full max-w-md flex-col items-center gap-6">
				<div className="flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
					<AlertTriangle className="size-10" />
				</div>
				<div className="space-y-2">
					<span className="text-xs font-semibold uppercase tracking-widest text-destructive">
						Kesalahan Sistem
					</span>
					<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						{title}
					</h1>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{description}
					</p>
					{errorMessage && process.env.NODE_ENV === "development" && (
						<pre className="mt-3 max-h-32 overflow-auto rounded-md border border-border bg-muted p-3 text-left font-mono text-xs text-muted-foreground">
							{errorMessage}
						</pre>
					)}
				</div>
				<div className="flex flex-wrap items-center justify-center gap-3">
					<Button variant="outline" onClick={handleRetry}>
						<RotateCcw className="size-4" />
						Coba Lagi
					</Button>
					<Button variant="default" onClick={handleBackToHome}>
						<Home className="size-4" />
						Beranda
					</Button>
				</div>
			</div>
		</div>
	);
};

export default UnexpectedError;
