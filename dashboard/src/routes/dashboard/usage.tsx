import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { getVerificationHistory, type VerificationRecord } from "@/lib/api";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const getStatusBadge = (status: string | null) => {
  switch (status) {
    case "TRUE":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
    case "FALSE":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">False</Badge>;
    case "NO_CONSENSUS":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">No Consensus</Badge>;
    case "MIXED":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Mixed</Badge>;
    case null:
    case undefined:
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">ERROR: No Status</Badge>;
    default:
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">ERROR: {status}</Badge>;
  }
};

const columns: ColumnDef<VerificationRecord>[] = [
  {
    accessorKey: "postTitle",
    header: "Content",
    cell: ({ row }) => {
      const title = row.original.postTitle;
      const preview = row.original.contentPreview;
      const previewText = preview
        ? preview.length >= 100 ? preview + "..." : preview
        : null;

      if (title && previewText) {
        return (
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-muted-foreground truncate max-w-md">{previewText}</div>
          </div>
        );
      }
      if (title) {
        return <span className="font-medium">{title}</span>;
      }
      if (previewText) {
        return <span className="text-muted-foreground">{previewText}</span>;
      }
      return <span className="text-red-500">No content</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "claimsCount",
    header: "Claims",
    cell: ({ row }) => {
      const count = row.getValue("claimsCount") as number | null;
      return count ?? <span className="text-red-500">ERR</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return format(new Date(date), "MMM d, yyyy");
    },
  },
];

export function UsagePage() {
  const navigate = useNavigate();

  const { data: history, isLoading } = useQuery({
    queryKey: ["history", "full"],
    queryFn: () => getVerificationHistory(100),
  });

  const handleRowClick = (row: VerificationRecord) => {
    navigate({ to: "/dashboard/verification/$id", params: { id: row.id } });
  };

  return (
    <div>
      <title>Verification History - Mira Verify</title>
      <h1 className="text-3xl font-bold">Verification History</h1>
      <p className="mt-2 text-muted-foreground">
        View all your content verifications
      </p>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : history && history.length > 0 ? (
          <DataTable
            columns={columns}
            data={history}
            pageSize={10}
            onRowClick={handleRowClick}
          />
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No verifications yet. Connect a WordPress site to get started.
          </p>
        )}
      </div>
    </div>
  );
}
