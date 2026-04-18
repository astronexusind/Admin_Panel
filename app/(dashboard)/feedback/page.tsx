"use client";

import { RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { deleteFeedback, getAllFeedback } from "@/lib/api/feedback";
import { getApiErrorMessage } from "@/lib/response-utils";
import type { Feedback } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setFeedback(await getAllFeedback());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load feedback right now."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFeedback();
  }, []);

  const handleDelete = async (entry: Feedback) => {
    if (!window.confirm("Delete this feedback message?")) {
      return;
    }

    try {
      await deleteFeedback(entry.id);
      toast.success("Feedback deleted successfully.");
      await loadFeedback();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete feedback."));
    }
  };

  const sortedFeedback = useMemo(
    () =>
      [...feedback].sort(
        (left, right) => new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime()
      ),
    [feedback]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Reviews"
        title="Feedback"
        description="Review and moderate customer feedback."
        actions={
          <Button variant="outline" onClick={() => void loadFeedback()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <DataTable
        title="Feedback list"
        description="Sender, message, received date."
        data={sortedFeedback}
        loading={loading}
        searchKeys={["name", "email", "message"]}
        columns={[
          {
            key: "name",
            header: "Sender",
            render: (entry) => (
              <div className="flex items-center gap-3">
                <Avatar name={entry.name} className="h-9 w-9 rounded-xl text-xs" />
                <div className="space-y-1">
                  <p className="font-medium text-white">{entry.name}</p>
                  <p className="text-xs text-slate-500">{entry.email}</p>
                </div>
              </div>
            )
          },
          {
            key: "message",
            header: "Message",
            render: (entry) => <p className="max-w-[480px] text-slate-300">{entry.message || "No message provided."}</p>
          },
          {
            key: "createdAt",
            header: "Received",
            render: (entry) => <span className="text-slate-400">{formatDate(entry.createdAt)}</span>
          }
        ]}
        renderRowActions={(entry) => (
          <Button variant="ghost" size="sm" className="text-rose-300" onClick={() => void handleDelete(entry)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      />
    </div>
  );
}
