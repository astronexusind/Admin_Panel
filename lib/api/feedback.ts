import endpoints from "@/config/endpoints.json";
import api from "@/lib/axios";
import { normalizeFeedback } from "@/lib/normalizers";
import { getArrayFromResponse, getMessageFromResponse } from "@/lib/response-utils";
import { replacePathParam } from "@/lib/utils";

export async function getAllFeedback() {
  const response = await api.get(endpoints.feedback.list);

  return getArrayFromResponse<unknown>(response.data, ["feedbacks", "feedback"]).map((item, index) =>
    normalizeFeedback(item, index)
  );
}

export async function deleteFeedback(feedbackId: string) {
  const response = await api.delete(replacePathParam(endpoints.feedback.delete, "feedbackId", feedbackId));

  return getMessageFromResponse(response.data, "Feedback deleted successfully.");
}
