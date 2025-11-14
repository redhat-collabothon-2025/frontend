import React from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";

type HeatmapPoint = {
  department: string;
  week: string;
  risk_score: number;
  incident_count: number;
};

interface HeatmapOverviewProps {
  /**
   * Either provide `data` directly (preferred for SSR) OR provide an `apiUrl`
   * to fetch the Swagger endpoint that returns the array of HeatmapPoint.
   */
  data?: HeatmapPoint[];
  apiUrl?: string;
  /**
   * Optional title
   */
  title?: string;
}

/**
 * Utility: clamp number between 0 and 1
 */
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Utility: Interpolate between two hex colors (no alpha)
 * t = 0 => c1, t = 1 => c2
 */
const lerpHex = (c1: string, c2: string, t: number) => {
  const p1 = c1.replace("#", "");
  const p2 = c2.replace("#", "");
  const r = Math.round(parseInt(p1.substring(0, 2), 16) * (1 - t) + parseInt(p2.substring(0, 2), 16) * t)
    .toString(16)
    .padStart(2, "0");
  const g = Math.round(parseInt(p1.substring(2, 4), 16) * (1 - t) + parseInt(p2.substring(2, 4), 16) * t)
    .toString(16)
    .padStart(2, "0");
  const b = Math.round(parseInt(p1.substring(4, 6), 16) * (1 - t) + parseInt(p2.substring(4, 6), 16) * t)
    .toString(16)
    .padStart(2, "0");
  return `#${r}${g}${b}`;
};

/**
 * Map risk (0..max) to a gradient: green -> yellow -> red
 */
const riskToColor = (value: number, min: number, max: number) => {
  // if all equal, return middle color
  if (max <= min) return "#FDB913";
  const norm = clamp01((value - min) / (max - min));
  if (norm <= 0.5) {
    // green -> yellow
    const t = norm / 0.5;
    return lerpHex("#4ADE80", "#FDB913", t);
  } else {
    // yellow -> red
    const t = (norm - 0.5) / 0.5;
    return lerpHex("#FDB913", "#EF4444", t);
  }
};

export const HeatmapOverview: React.FC<HeatmapOverviewProps> = ({ data: initialData, apiUrl, title = "Risk Heatmap" }) => {
  const [data, setData] = React.useState<HeatmapPoint[] | null>(initialData ?? null);
  const [loading, setLoading] = React.useState<boolean>(!initialData && !!apiUrl);
  const [error, setError] = React.useState<string | null>(null);

  const [selected, setSelected] = React.useState<HeatmapPoint | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    if (!apiUrl || initialData) {
      setLoading(false);
      return;
    }
    const fetchData = async (attempt = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<HeatmapPoint[]>(apiUrl);
        if (!mounted) return;
        setData(res.data ?? []);
        setLoading(false);
      } catch (err: any) {
        if (!mounted) return;
        if (attempt < 2) {
          // a single retry
          setTimeout(() => fetchData(attempt + 1), 500);
        } else {
          setError(err?.message ?? "Failed to load heatmap data");
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [apiUrl, initialData]);

  // prepare grid axes
  const departments = React.useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((d) => d.department))).sort();
  }, [data]);

  const weeks = React.useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((d) => d.week))).sort();
  }, [data]);

  // create map [dept][week] -> point
  const gridMap = React.useMemo(() => {
    const m = new Map<string, Map<string, HeatmapPoint>>();
    if (!data) return m;
    for (const p of data) {
      if (!m.has(p.department)) m.set(p.department, new Map());
      m.get(p.department)!.set(p.week, p);
    }
    return m;
  }, [data]);

  // find min/max risk_score for color scaling
  const [minRisk, maxRisk] = React.useMemo(() => {
    if (!data || data.length === 0) return [0, 100];
    let min = Infinity,
      max = -Infinity;
    for (const p of data) {
      if (p.risk_score < min) min = p.risk_score;
      if (p.risk_score > max) max = p.risk_score;
    }
    // if all equal, expand a bit so color gradient isn't flat
    if (min === max) {
      min = Math.max(0, min - 1);
      max = max + 1;
    }
    return [min, max];
  }, [data]);

  const onCellClick = (point?: HeatmapPoint) => {
    if (!point) return;
    setSelected(point);
    setDialogOpen(true);
  };

  // layout sizes
  const cellSize = 56; // px, responsive handled by CSS wrapping

  return (
    <Paper
      elevation={3}
      sx={{
        background:
          "linear-gradient(135deg, rgba(26, 41, 66, 0.6) 0%, rgba(26, 41, 66, 0.9) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(253, 185, 19, 0.15)",
        borderRadius: 3,
        overflow: "hidden",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mt: 0.5 }}>
            Risk by department and week
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
            Updated: {format(new Date(), "PPp")}
          </Typography>
        </Box>
      </Box>

      {/* Body */}
      <Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>Failed to load data</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", mb: 2 }}>{error}</Typography>
            <Button
              variant="contained"
              onClick={() => {
                setError(null);
                setData(null);
                // trigger refetch by toggling apiUrl (simple approach: re-run effect by setting data null and leaving apiUrl same)
                // The effect watches apiUrl & initialData; reassigning data will cause no fetch; so instead call axios directly here:
                if (apiUrl) {
                  setData(null);
                  setTimeout(() => {
                    // call the effect again by setting data null and letting effect run (we rely on it running once)
                    // simpler: fetch directly here
                    (async () => {
                      try {
                        const res = await axios.get<HeatmapPoint[]>(apiUrl);
                        setData(res.data);
                      } catch (e: any) {
                        setError(e?.message ?? "Retry failed");
                      }
                    })();
                  }, 200);
                }
              }}
            >
              Retry
            </Button>
          </Box>
        ) : !data || data.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>No heatmap data available</Typography>
          </Box>
        ) : (
          <Box>
            {/* header row: weeks */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
              <Box sx={{ width: 160, color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>Department →</Box>
              <Box sx={{ overflowX: "auto", flex: 1 }}>
                <Box sx={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: `${cellSize}px`, gap: 8 }}>
                  {weeks.map((w) => (
                    <Box key={w} sx={{ textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>
                      {w}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* grid */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 420, overflow: "auto" }}>
              {departments.map((dept) => (
                <Box key={dept} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {/* department label */}
                  <Box
                    sx={{
                      width: 160,
                      minWidth: 140,
                      pr: 1,
                      color: "rgba(255,255,255,0.95)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    {dept}
                  </Box>

                  {/* row cells */}
                  <Box sx={{ overflowX: "auto", flex: 1 }}>
                    <Box
                      sx={{
                        display: "grid",
                        gridAutoFlow: "column",
                        gridAutoColumns: `${cellSize}px`,
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      {weeks.map((w) => {
                        const point = gridMap.get(dept)?.get(w);
                        const risk = point?.risk_score ?? 0;
                        const color = riskToColor(risk, minRisk, maxRisk);
                        const lowOpacityBg = `${color}20`; // hex + alpha approximation (works in modern browsers only if hex+alpha supported)
                        const accessibleLabel = `${dept} — ${w}: risk ${risk}, incidents ${point?.incident_count ?? 0}`;

                        return (
                          <Tooltip
                            key={`${dept}-${w}`}
                            title={
                              <Box>
                                <Typography sx={{ fontWeight: 700 }}>{dept}</Typography>
                                <Typography sx={{ fontSize: "0.85rem" }}>{w}</Typography>
                                <Typography sx={{ fontSize: "0.85rem" }}>
                                  Risk: <strong>{risk}</strong>
                                </Typography>
                                <Typography sx={{ fontSize: "0.85rem" }}>
                                  Incidents: <strong>{point?.incident_count ?? 0}</strong>
                                </Typography>
                              </Box>
                            }
                            arrow
                            placement="top"
                          >
                            <Box
                              onClick={() => onCellClick(point)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") onCellClick(point);
                              }}
                              aria-label={accessibleLabel}
                              sx={{
                                height: cellSize,
                                width: cellSize,
                                borderRadius: 1.5,
                                background: point ? `linear-gradient(180deg, ${color}22 0%, ${color}14 100%)` : "rgba(255,255,255,0.03)",
                                border: `1px solid rgba(255,255,255,0.04)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: point ? "pointer" : "default",
                                transition: "transform 150ms, box-shadow 150ms",
                                "&:hover": point ? { transform: "translateY(-3px)", boxShadow: "0 6px 18px rgba(0,0,0,0.6)" } : {},
                              }}
                            >
                              <Box sx={{ textAlign: "center" }}>
                                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>
                                  {point ? Math.round(point.risk_score) : "-"}
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.65rem" }}>
                                  {point ? point.incident_count : ""}
                                </Typography>
                              </Box>
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* legend */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 160,
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.85rem",
                  }}
                >
                  Legend
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 160 }}>
                    <Box
                      sx={{
                        height: 12,
                        borderRadius: 2,
                        background:
                          "linear-gradient(90deg, #4ADE80 0%, #FDB913 50%, #EF4444 100%)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5, color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* details dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.5,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <DialogTitle sx={{ m: 0, p: 0, color: "#FFFFFF", fontSize: "1rem" }}>
            {selected ? `${selected.department} — ${selected.week}` : "Details"}
          </DialogTitle>
          <IconButton onClick={() => setDialogOpen(false)} aria-label="close" sx={{ color: "rgba(255,255,255,0.9)" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ background: "transparent", color: "rgba(255,255,255,0.95)" }}>
          {selected ? (
            <>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>{selected.department}</Typography>
              <Typography sx={{ mb: 1 }}>Week: {selected.week}</Typography>
              <Typography sx={{ mb: 1 }}>Risk score: {selected.risk_score}</Typography>
              <Typography sx={{ mb: 1 }}>Incident count: {selected.incident_count}</Typography>

              {/* Example: Here you could fetch more details for the selected item if needed */}
              <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                Click the cell to fetch more details for this department/week (if your API provides them).
              </Typography>
            </>
          ) : (
            <Typography>No selection</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default HeatmapOverview;
