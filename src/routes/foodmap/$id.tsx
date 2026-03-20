import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Heart,
  Eye,
  MapPin,
  Clock,
  Navigation,
  Share2,
  Bookmark,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FakeMapCanvas } from "@/components/map/FakeMapCanvas";
import { getFoodMapById, getRestaurantById } from "@/data/fakeMapData";

function FoodMapDetailPage() {
  const { id } = Route.useParams();
  const map = getFoodMapById(id);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedStop, setSelectedStop] = useState<number | null>(null);

  if (!map) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-xl font-heading font-bold mb-2">
          Không tìm thấy bản đồ
        </h2>
        <p className="text-muted-foreground mb-6">
          Bản đồ này không tồn tại hoặc đã bị xóa
        </p>
        <Link to="/foodmap">
          <Button className="gradient-primary text-white border-0">
            Xem bản đồ khác
          </Button>
        </Link>
      </div>
    );
  }

  const highlightedIds = map.stops.map((s) => s.restaurantId);
  const selectedRestaurantId =
    selectedStop !== null ? map.stops[selectedStop]?.restaurantId : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Back */}
      <Link to="/foodmap">
        <Button variant="ghost" size="sm" className="mb-5 -ml-2 gap-1">
          <ArrowLeft className="h-4 w-4" />
          Bản đồ foodtour
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground">
              {map.title}
            </h1>
            <p className="mt-2 text-muted-foreground">{map.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {map.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${
                liked
                  ? "bg-rose-50 border-rose-200 text-rose-500"
                  : "border-border text-muted-foreground hover:border-rose-200 hover:text-rose-400"
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-rose-500" : ""}`} />
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${
                bookmarked
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-border text-muted-foreground hover:text-primary"
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${bookmarked ? "fill-primary" : ""}`}
              />
            </button>
            <button className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="text-lg">{map.authorEmoji}</span>
            <span className="font-medium text-foreground">{map.author}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {map.stops.length} điểm dừng
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {map.estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <Navigation className="h-4 w-4" />
            {map.totalDistance}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4 fill-rose-400 text-rose-400" />
            {(map.likes + (liked ? 1 : 0)).toLocaleString()} thích
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {map.views.toLocaleString()} lượt xem
          </span>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Map */}
        <div
          className="lg:col-span-3 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <FakeMapCanvas
            highlightedIds={highlightedIds}
            selectedId={selectedRestaurantId}
            showCategoryFilter={false}
            height="420px"
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            📍 Click vào marker để xem thông tin quán
          </p>
        </div>

        {/* Stops list */}
        <div className="lg:col-span-2" style={{ animationDelay: "200ms" }}>
          <h2 className="text-lg font-heading font-bold text-foreground mb-4">
            🗺️ Lộ trình ({map.stops.length} điểm)
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-primary/5 pointer-events-none" />

            <div className="space-y-3">
              {map.stops.map((stop, i) => {
                const r = getRestaurantById(stop.restaurantId);
                if (!r) return null;
                const isActive = selectedStop === i;
                return (
                  <div
                    key={stop.restaurantId}
                    onClick={() => setSelectedStop(isActive ? null : i)}
                    className={`relative flex gap-3 p-3 rounded-2xl border transition-all cursor-pointer ml-0 ${
                      isActive
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30 hover:bg-accent/50"
                    }`}
                  >
                    {/* Step dot */}
                    <div
                      className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isActive
                          ? "gradient-primary text-white scale-110"
                          : "bg-card border-2 border-primary/30 text-primary"
                      }`}
                    >
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{r.emoji}</span>
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {r.name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {r.address}
                      </p>

                      {stop.note && (
                        <p className="text-xs text-foreground/70 mt-1.5 italic bg-muted/50 rounded-lg px-2 py-1">
                          💬 "{stop.note}"
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold">
                            {r.realScore}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ~{stop.estimatedMinutes} phút
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {r.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start button */}
          <div className="mt-5">
            <div>
              <Button className="w-full gradient-primary text-white border-0 gap-2 h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                <Navigation className="h-5 w-5" />
                Bắt đầu Food Tour
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Mở bản đồ để xem chỉ đường chi tiết
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/foodmap/$id")({
  component: FoodMapDetailPage,
});
