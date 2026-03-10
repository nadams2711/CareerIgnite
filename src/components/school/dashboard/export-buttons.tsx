"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { exportSchoolDataCSV } from "@/lib/actions/school-admin.actions";

interface ExportButtonsProps {
  schoolCode: string;
}

export function ExportButtons({ schoolCode }: ExportButtonsProps) {
  const [exporting, setExporting] = useState(false);

  const handleCSVExport = async () => {
    setExporting(true);
    const csv = await exportSchoolDataCSV(schoolCode);
    setExporting(false);
    if (!csv) return;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${schoolCode}-analytics.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCSVExport}
        disabled={exporting}
        className="rounded-xl gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
      >
        {exporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export CSV
      </Button>
    </div>
  );
}
