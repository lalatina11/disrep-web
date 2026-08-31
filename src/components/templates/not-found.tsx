import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import { Button } from "#/components/ui/button";

interface NotFoundProps {
	title?: string;
	description?: string;
}

const NotFound = ({
	title = "Halaman Tidak Ditemukan",
	description = "Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.",
}: NotFoundProps) => {
	const nav = useNavigate();

	function handleBack() {
		if (typeof window !== "undefined" && window.history.length > 1) {
			window.history.back();
		} else {
			nav({ to: "/" });
		}
	}

	function handleBackToHome() {
		nav({ to: "/" });
	}

	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
			<div className="flex w-full max-w-md flex-col items-center gap-6">
				<div className="flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
					<FileQuestion className="size-10" />
				</div>
				<div className="space-y-2">
					<span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
						Error 404
					</span>
					<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						{title}
					</h1>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{description}
					</p>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-3">
					<Button variant="outline" onClick={handleBack}>
						<ArrowLeft className="size-4" />
						Kembali
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

export default NotFound;
