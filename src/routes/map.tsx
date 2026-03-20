import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Map, Navigation } from "lucide-react";
import { FakeMapCanvas } from "@/components/map/FakeMapCanvas";
import { MapSidebar } from "@/components/map/MapSidebar";
import { DirectionPanel } from "@/components/map/DirectionPanel";
import type { RestaurantPin } from "@/data/fakeMapData";

function MapPage() {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantPin | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSelect = (restaurant: RestaurantPin) => {
    setSelectedRestaurant(restaurant);
    setShowDirections(false);
  };

  const handleDirections = (restaurant: RestaurantPin) => {
    setSelectedRestaurant(restaurant);
    setShowDirections(true);
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
            <Map className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-heading font-bold text-foreground leading-none">
              Bản đồ Foodtour
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Khu vực Hải Phòng · 15 địa điểm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Demo badge */}
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
            🎭 Dữ liệu demo
          </span>

          {/* Toggle sidebar on mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden px-3 py-1.5 rounded-lg border border-border text-sm text-foreground/80 hover:bg-accent transition-colors"
          >
            {sidebarOpen ? "🗺️ Map" : "📋 Danh sách"}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`flex-shrink-0 border-r border-border overflow-hidden transition-all duration-300 ${
            sidebarOpen ? "w-full md:w-80" : "w-0"
          } ${sidebarOpen ? "block" : "hidden md:block"}`}
        >
          {showDirections ? (
            <DirectionPanel
              from={null}
              to={selectedRestaurant}
              onClose={() => setShowDirections(false)}
            />
          ) : (
            <MapSidebar
              selectedId={selectedRestaurant?.id}
              onSelect={handleSelect}
              onDirections={handleDirections}
            />
          )}
        </div>

        {/* Map */}
        <div
          className={`flex-1 relative ${sidebarOpen ? "hidden md:flex" : "flex"} flex-col`}
        >
          <FakeMapCanvas
            selectedId={selectedRestaurant?.id}
            onSelect={handleSelect}
            showCategoryFilter={true}
            height="100%"
          />

          {/* Directions overlay trigger - shown when restaurant selected */}
          {selectedRestaurant && !showDirections && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={() => handleDirections(selectedRestaurant)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full gradient-primary text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-fade-in-up"
              >
                <Navigation className="h-4 w-4" />
                Chỉ đường đến {selectedRestaurant.name}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/map")({
  component: MapPage,
});
