"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCaseStatus } from "@/app/actions/admin";

export function AdminCaseActions({
  caseId,
  currentStatus,
}: {
  caseId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(status: string) {
    setLoading(true);
    await updateCaseStatus(caseId, status);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-muted-foreground" htmlFor="case-status-select">
        Update Status:
      </label>
      <Select
        defaultValue={currentStatus}
        onValueChange={handleStatusChange}
        disabled={loading}
      >
        <SelectTrigger id="case-status-select" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Open">Open</SelectItem>
          <SelectItem value="Under Review">Under Review</SelectItem>
          <SelectItem value="Escalated">Escalated</SelectItem>
          <SelectItem value="Closed">Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
