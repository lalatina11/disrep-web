import type { VariantProps } from "class-variance-authority";
import type { badgeVariants } from "#/components/ui/badge";
import { DisasterStatus, type DisasterStatusType } from "#/lib/types/enums";

export type BadgeVariant = NonNullable<
	VariantProps<typeof badgeVariants>["variant"]
>;

export interface StatusBadgeConfig {
	label: string;
	variant: BadgeVariant;
}

export const getStatusBadge = (
	status?: DisasterStatusType | string,
): StatusBadgeConfig => {
	switch (status?.toLowerCase()) {
		case DisasterStatus.NEW:
		case "new":
			return { label: "Laporan Baru", variant: "destructive" };
		case DisasterStatus.PENDING:
		case "pending":
			return { label: "Menunggu", variant: "outline" };
		case DisasterStatus.AID_DISPATCHED:
		case "aid_dispatched":
			return { label: "Bantuan Dikirim", variant: "secondary" };
		case DisasterStatus.AID_ARRIVED:
		case "aid_arrived":
			return { label: "Bantuan Tiba", variant: "default" };
		case DisasterStatus.RESOLVED:
		case "resolved":
			return { label: "Selesai", variant: "outline" };
		default:
			return { label: status || "Menunggu", variant: "outline" };
	}
};

export const formatRupiah = (amount: number): string => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(amount);
};

export const formatDate = (
	dateString: string,
	options: Intl.DateTimeFormatOptions = {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	},
): string => {
	return new Date(dateString).toLocaleDateString("id-ID", options);
};

export const formatShortDate = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};
