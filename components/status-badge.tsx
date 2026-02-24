import { Badge } from "@/components/ui/badge"

const statusConfig: Record<string, { className: string }> = {
  Open: { className: "border-chart-3 bg-chart-3/10 text-chart-3 font-semibold" },
  "Under Review": { className: "border-accent bg-accent/10 text-accent font-semibold" },
  Escalated: { className: "border-destructive bg-destructive/10 text-destructive font-semibold" },
  Closed: { className: "border-muted-foreground bg-muted text-muted-foreground font-semibold" },
  pending: { className: "border-accent bg-accent/10 text-accent font-semibold" },
  approved: { className: "border-chart-3 bg-chart-3/10 text-chart-3 font-semibold" },
  denied: { className: "border-destructive bg-destructive/10 text-destructive font-semibold" },
  received: { className: "border-primary bg-primary/10 text-primary font-semibold" },
  reviewing: { className: "border-accent bg-accent/10 text-accent font-semibold" },
  resolved: { className: "border-chart-3 bg-chart-3/10 text-chart-3 font-semibold" },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || {
    className: "border-muted-foreground bg-muted text-muted-foreground font-semibold",
  }
  return (
    <Badge variant="outline" className={`uppercase tracking-wide text-[10px] ${config.className}`}>
      {status}
    </Badge>
  )
}
