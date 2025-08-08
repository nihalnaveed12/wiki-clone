"use client";
import { useEffect, useState } from "react";
import {
  getAllMusicianRequestsAPI,
  approveMusicianRequestAPI,
  rejectMusicianRequestAPI,
} from "@/lib/api/requestMusicians";
import Image from "next/image";

interface RequestsTabProps {
  baseUrl: string;
}

interface MusicianRequest {
  socials: {
    instagram: string;
    youtube: string;
    spotify: string;
    soundcloud: string;
  };
  image: {
    id: string;
    url: string;
  };
  _id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  category: string;
  website: string;
  shortBio: string;
  status: "pending" | "approved" | "rejected";
  submittedBy?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export default function RequestsTab({ baseUrl }: RequestsTabProps) {
  const [requests, setRequests] = useState<MusicianRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  console.log(baseUrl);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await getAllMusicianRequestsAPI();
      if (result.success) {
        setRequests(result.data);
      } else {
        console.error(result.error);
        alert("Failed to fetch requests: " + result.error);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      alert("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      const result = await approveMusicianRequestAPI(requestId);
      if (result.success) {
        alert("Request approved successfully!");
        await fetchRequests();
      } else {
        alert("Failed to approve request: " + result.error);
      }
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt("Enter rejection reason (optional):");

    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      const result = await rejectMusicianRequestAPI(requestId, reason || "");
      if (result.success) {
        alert("Request rejected successfully!");
        await fetchRequests();
      } else {
        alert("Failed to reject request: " + result.error);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading requests...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Musician Requests</h2>
        <button
          onClick={fetchRequests}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600 py-8">No requests found.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={request.image.url}
                    alt={request.name}
                    className="w-16 h-16 rounded-full object-cover"
                    width={64}
                    height={64}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {request.name}
                    </h3>
                    <p className="text-gray-600">
                      {request.category} • {request.city}, {request.country}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted:{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={getStatusBadge(request.status)}>
                  {request.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> {request.address}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Bio:</strong> {request.shortBio}
                </p>
                {request.website && (
                  <p className="text-gray-700 mb-2">
                    <strong>Website:</strong>
                    <a
                      href={request.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      {request.website}
                    </a>
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  {request.socials.instagram && (
                    <a
                      href={request.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline text-sm"
                    >
                      Instagram
                    </a>
                  )}
                  {request.socials.youtube && (
                    <a
                      href={request.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline text-sm"
                    >
                      YouTube
                    </a>
                  )}
                  {request.socials.spotify && (
                    <a
                      href={request.socials.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-sm"
                    >
                      Spotify
                    </a>
                  )}
                  {request.socials.soundcloud && (
                    <a
                      href={request.socials.soundcloud}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:underline text-sm"
                    >
                      SoundCloud
                    </a>
                  )}
                </div>
              </div>

              {request.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(request._id)}
                    disabled={processingIds.has(request._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {processingIds.has(request._id)
                      ? "Approving..."
                      : "Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    disabled={processingIds.has(request._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {processingIds.has(request._id) ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              )}

              {request.status !== "pending" && (
                <div className="text-sm text-gray-500">
                  <p>
                    Reviewed:{" "}
                    {request.reviewedAt
                      ? new Date(request.reviewedAt).toLocaleString()
                      : "N/A"}
                  </p>
                  {request.rejectionReason && (
                    <p className="text-red-600 mt-1">
                      <strong>Rejection reason:</strong>{" "}
                      {request.rejectionReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
