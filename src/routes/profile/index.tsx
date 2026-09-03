import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	Check,
	Clock,
	Copy,
	Fingerprint,
	Mail,
	Plus,
	Shield,
	ShieldCheck,
	User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SignOutForm from "#/components/forms/auth-form/sign-out-form";
import MainLayout from "#/components/layouts/main-layout";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { formatDate } from "#/lib/common";
import { ADMIN_ROLES } from "#/lib/constatns/user-role";
import { getUserAction } from "#/lib/server-actions/auth";
import useUserStore from "#/lib/stores/use-user-store";
import type { User } from "#/lib/types";

export const Route = createFileRoute("/profile/")({
	beforeLoad: async () => {
		const res = await getUserAction();
		if (!res.success || !res.data) {
			throw redirect({ to: "/auth/sign-in" });
		}
		return { serverUser: res.data };
	},
	loader: ({ context }) => context.serverUser,
	component: ProfilePage,
});

function ProfilePage() {
	const serverUser = Route.useLoaderData();
	const { user: storeUser, setUser } = useUserStore();
	const [hasCopiedId, setHasCopiedId] = useState(false);

	// Sync server user with zustand store
	useEffect(() => {
		if (serverUser) {
			setUser(serverUser);
		}
	}, [serverUser, setUser]);

	const user: User = serverUser || storeUser;

	if (!user) {
		return null;
	}

	const isUserAdmin = (ADMIN_ROLES as readonly string[]).includes(user.role);

	const handleCopyId = () => {
		if (navigator?.clipboard) {
			navigator.clipboard.writeText(user.id);
			setHasCopiedId(true);
			toast.success("ID Pengguna berhasil disalin ke clipboard");
			setTimeout(() => setHasCopiedId(false), 2000);
		}
	};

	const getRoleBadge = (role: string) => {
		switch (role.toLowerCase()) {
			case "superadmin":
				return {
					label: "Super Admin",
					variant: "default" as const,
					icon: ShieldCheck,
				};
			case "admin":
				return {
					label: "Administrator",
					variant: "secondary" as const,
					icon: Shield,
				};
			default:
				return {
					label: "Masyarakat / Pengguna",
					variant: "outline" as const,
					icon: UserIcon,
				};
		}
	};

	const roleInfo = getRoleBadge(user.role);
	const RoleIcon = roleInfo.icon;

	return (
		<MainLayout>
			<div className="container mx-auto max-w-4xl px-4 py-8">
				{/* Top Navigation */}
				<div className="mb-6 flex items-center justify-between">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/">
							<ArrowLeft className="size-4" />
							Kembali ke Beranda
						</Link>
					</Button>
					<Badge variant={roleInfo.variant} className="gap-1.5 py-1">
						<RoleIcon className="size-3.5" />
						{roleInfo.label}
					</Badge>
				</div>

				<div className="space-y-6">
					{/* Header Profile Card */}
					<Card className="overflow-hidden border-border bg-card">
						<div className="h-28 w-full bg-linear-to-r from-primary/20 via-primary/10 to-muted sm:h-36" />
						<CardContent className="relative px-6 pb-6 pt-0">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
								<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
									<Avatar className="-mt-14 size-24 ring-4 ring-background shadow-md sm:-mt-16 sm:size-28">
										<AvatarImage src={user.avatar} alt={user.display_name} />
										<AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">
											{user.display_name?.slice(0, 2).toUpperCase() || "US"}
										</AvatarFallback>
									</Avatar>

									<div className="space-y-1 text-center sm:text-left">
										<div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
											<h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
												{user.display_name}
											</h1>
											{isUserAdmin && (
												<Badge
													variant="secondary"
													className="gap-1 text-[11px] font-medium"
												>
													<Shield className="size-3 text-primary" />
													Admin
												</Badge>
											)}
										</div>
										<p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 sm:justify-start">
											<Mail className="size-3.5" />
											{user.email}
										</p>
									</div>
								</div>

								<div className="flex items-center justify-center gap-2 pt-2 sm:pt-0">
									<Button
										variant="secondary"
										size="sm"
										asChild
										className="gap-1.5"
									>
										<Link to="/disaster/create">
											<Plus className="size-4" />
											Lapor Bencana
										</Link>
									</Button>
									<SignOutForm />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Detailed User Information Grid */}
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* Account Credentials Card */}
						<Card className="border-border bg-card">
							<CardHeader className="pb-3">
								<CardTitle className="flex items-center gap-2 text-base font-semibold">
									<UserIcon className="size-4 text-primary" />
									Informasi Identitas
								</CardTitle>
								<CardDescription>
									Data identitas dan akun yang terdaftar pada sistem Disrep
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Nama Tampilan */}
								<div className="space-y-1">
									<span className="text-xs font-medium text-muted-foreground">
										Nama Lengkap / Tampilan
									</span>
									<p className="text-sm font-semibold text-foreground">
										{user.display_name || "-"}
									</p>
								</div>

								<Separator />

								{/* Email */}
								<div className="space-y-1">
									<span className="text-xs font-medium text-muted-foreground">
										Alamat Email
									</span>
									<div className="flex items-center gap-2">
										<Mail className="size-4 text-muted-foreground" />
										<p className="text-sm font-semibold text-foreground">
											{user.email || "-"}
										</p>
									</div>
								</div>

								<Separator />

								{/* User ID */}
								<div className="space-y-1">
									<span className="text-xs font-medium text-muted-foreground">
										ID Pengguna (UUID)
									</span>
									<div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
										<div className="flex items-center gap-2 overflow-hidden">
											<Fingerprint className="size-4 shrink-0 text-muted-foreground" />
											<span className="truncate font-mono text-xs text-foreground">
												{user.id}
											</span>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon-xs"
											onClick={handleCopyId}
											className="shrink-0 text-muted-foreground hover:text-foreground"
											title="Salin ID"
										>
											{hasCopiedId ? (
												<Check className="size-3.5 text-primary" />
											) : (
												<Copy className="size-3.5" />
											)}
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Role & System Status Card */}
						<Card className="border-border bg-card">
							<CardHeader className="pb-3">
								<CardTitle className="flex items-center gap-2 text-base font-semibold">
									<ShieldCheck className="size-4 text-primary" />
									Hak Akses & Riwayat Akun
								</CardTitle>
								<CardDescription>
									Peran otorisasi akun dan catatan waktu pendaftaran
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Hak Akses / Role */}
								<div className="space-y-1.5">
									<span className="text-xs font-medium text-muted-foreground">
										Peran Otorisasi
									</span>
									<div className="flex items-center gap-2">
										<Badge
											variant={roleInfo.variant}
											className="gap-1.5 py-0.5"
										>
											<RoleIcon className="size-3.5" />
											{roleInfo.label}
										</Badge>
										<span className="text-xs font-mono text-muted-foreground">
											({user.role})
										</span>
									</div>
								</div>

								<Separator />

								{/* Tanggal Terdaftar */}
								<div className="space-y-1">
									<span className="text-xs font-medium text-muted-foreground">
										Waktu Terdaftar
									</span>
									<div className="flex items-center gap-2 text-sm text-foreground">
										<Calendar className="size-4 text-muted-foreground" />
										<span>{formatDate(user.created_at)}</span>
									</div>
								</div>

								<Separator />

								{/* Pembaruan Terakhir */}
								<div className="space-y-1">
									<span className="text-xs font-medium text-muted-foreground">
										Pembaruan Profil Terakhir
									</span>
									<div className="flex items-center gap-2 text-sm text-foreground">
										<Clock className="size-4 text-muted-foreground" />
										<span>{formatDate(user.updated_at)}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Security & Info Notice */}
					<div className="flex items-start gap-3 rounded-xl border border-border/80 bg-muted/20 p-4 text-xs text-muted-foreground">
						<AlertCircle className="size-4 shrink-0 text-primary mt-0.5" />
						<div className="space-y-1">
							<p className="font-semibold text-foreground">
								Keamanan & Privasi Akun
							</p>
							<p className="leading-relaxed">
								Akun Anda terlindungi oleh otentikasi token aman. Saat membuat
								laporan bencana baru, Anda juga dapat memilih opsi{" "}
								<strong>Laporan Anonim</strong> jika tidak ingin nama dan
								identitas Anda ditampilkan kepada masyarakat umum.
							</p>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
