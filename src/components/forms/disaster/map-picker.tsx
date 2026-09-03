import { MapPin } from "lucide-react";
import type * as MapLibreGL from "maplibre-gl";
import { useEffect, useState } from "react";
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

	// Auto-center map when coordinates change
	useEffect(() => {
		if (mapRef && lat && lng) {
			const center = mapRef.getCenter();
			const diff = Math.abs(center.lat - lat) + Math.abs(center.lng - lng);
			if (diff > 0.0001) {
				mapRef.flyTo({
					center: [lng, lat],
					zoom: 15,
					duration: 1000,
				});
			}
		}
	}, [mapRef, lat, lng]);

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
				<MapPin className="size-3.5 text-primary" />
				<span>
					Klik pada peta atau geser pin untuk menentukan titik koordinat bencana
				</span>
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

					<MapControls position="bottom-right" showZoom showCompass />
				</MapCN>
			</div>

			{/* Coordinates info row */}
			<div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
				<span>Koordinat Terpilih:</span>
				<span className="font-mono font-medium text-foreground">
					{lat || "-"}, {lng || "-"}
				</span>
			</div>
		</div>
	);
}
