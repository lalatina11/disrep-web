import { Locate, MapPin } from "lucide-react";
import type * as MapLibreGL from "maplibre-gl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
	Map as MapCN,
	MapControls,
	MapMarker,
	type MapRef,
	MarkerContent,
} from "#/components/ui/map";

interface MapPickerProps {
	lat: number;
	lng: number;
	onChange: (coords: { lat: number; lng: number }) => void;
	disabled?: boolean;
}

export function MapPicker({
	lat,
	lng,
	onChange,
	disabled = false,
}: MapPickerProps) {
	const [mapRef, setMapRef] = useState<MapRef | null>(null);
	const [isLocating, setIsLocating] = useState(false);

	useEffect(() => {
		if (!mapRef) return;
		const handleClick = (e: MapLibreGL.MapMouseEvent) => {
			if (disabled) return;
			if (e?.lngLat) {
				onChange({
					lat: Number(e.lngLat.lat.toFixed(7)),
					lng: Number(e.lngLat.lng.toFixed(7)),
				});
			}
		};

		mapRef.on("click", handleClick);
		return () => {
			mapRef.off("click", handleClick);
		};
	}, [mapRef, disabled, onChange]);

	const handleCurrentLocation = () => {
		if (!("geolocation" in navigator)) {
			toast.error("Geolokasi tidak didukung oleh browser Anda");
			return;
		}

		setIsLocating(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const newLat = Number(pos.coords.latitude.toFixed(7));
				const newLng = Number(pos.coords.longitude.toFixed(7));
				onChange({ lat: newLat, lng: newLng });
				mapRef?.flyTo({
					center: [newLng, newLat],
					zoom: 15,
					duration: 1200,
				});
				setIsLocating(false);
				toast.success("Berhasil menemukan lokasi Anda");
			},
			(err) => {
				console.error("Geolocation error:", err);
				setIsLocating(false);
				toast.error("Gagal mendapatkan lokasi saat ini");
			},
			{ timeout: 10000, enableHighAccuracy: true },
		);
	};

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<MapPin className="size-3.5 text-primary" />
					<span>
						Klik pada peta atau geser pin untuk menentukan titik bencana
					</span>
				</div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleCurrentLocation}
					disabled={disabled || isLocating}
					className="h-7 text-xs"
				>
					<Locate className="size-3.5" />
					{isLocating ? "Mencari lokasi..." : "Lokasi Saya"}
				</Button>
			</div>

			{/* Map Container */}
			<div className="relative h-64 w-full overflow-hidden rounded-xl border border-border bg-muted/40 sm:h-72">
				<MapCN
					ref={setMapRef}
					viewport={{
						center: [lng || 109.2301616, lat || -7.4243772],
						zoom: 13,
					}}
					className="h-full w-full cursor-crosshair"
				>
					<MapMarker
						longitude={lng || 109.2301616}
						latitude={lat || -7.4243772}
						draggable={!disabled}
						onDragEnd={(lngLat) => {
							onChange({
								lat: Number(lngLat.lat.toFixed(7)),
								lng: Number(lngLat.lng.toFixed(7)),
							});
						}}
					>
						<MarkerContent>
							<div className="relative flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background transition-transform hover:scale-110">
								<MapPin className="size-4" />
								<span className="absolute -top-1 -right-1 flex size-2.5">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
									<span className="relative inline-flex size-2.5 rounded-full bg-primary" />
								</span>
							</div>
						</MarkerContent>
					</MapMarker>

					<MapControls
						position="bottom-right"
						showZoom
						showLocate
						showCompass
						onLocate={(coords) => {
							onChange({
								lat: Number(coords.latitude.toFixed(7)),
								lng: Number(coords.longitude.toFixed(7)),
							});
						}}
					/>
				</MapCN>
			</div>

			{/* Coordinates info row */}
			<div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
				<span>Koordinat Terpilih:</span>
				<span className="font-mono text-foreground font-medium">
					{lat || "-"}, {lng || "-"}
				</span>
			</div>
		</div>
	);
}
