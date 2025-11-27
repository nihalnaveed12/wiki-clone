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
  name: string;
  city: string;
  state?: string;
  category: string;
  artistStatus?: string;
  status: "pending" | "approved" | "rejected";
  website?: string;
  socials?: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    soundcloud?: string;
    twitter?: string;
    appleMusic?: string;
  };
  heroBannerImage?: { id?: string; url?: string };
  heroTags?: string[];
  image: { id: string; url: string };
  shortBio: string;
  audio?: string;
  videos?: {
    title?: string;
    type?: string;
    url?: string;
    isFeatured?: boolean;
  }[];
  definingTracks?: {
    title?: string;
    year?: number;
    image?: { id?: string; url?: string };
    externalLink?: string;
  }[];
  deepDiveNarrative?: any;
  alsoKnownAs?: string[];
  born?: string;
  origin?: string;
  primaryAffiliation?: { name?: string; link?: string };
  notableCollaborators?: string[];
  proteges?: string[];
  relatedArtists?: string[];
 
  readMoreLink?: string;
  yearsActive?: { start?: number; end?: number };
  labelCrew?: string;
  labelCrewLink?: string;
  associatedActs?: string[];
  associatedActsLinks?: string[];
  district?: string;
  districtLink?: string;
  frequentProducers?: string[];
  frequentProducersLink?: string[];
  
  breakoutTrack?: { name?: string; url?: string };
  definingProject?: { name?: string; year?: number; link?: string };
  fansOf?: string[];
  fansOfLink?: string[];
  submittedBy?: string;
  createdAt: string;
  _id: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export default function RequestsTab({ baseUrl }: RequestsTabProps) {
  const [requests, setRequests] = useState<MusicianRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await getAllMusicianRequestsAPI();
      if (result.success) {
        setRequests(result.data);
        console.log("Fetched requests:", result.data);
      } else {
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

  // Filter requests based on active tab
  const filteredRequests = requests.filter((req) => req.status === activeTab);

  return (
    <div className="space-y-4">
  {/* Tabs */}
  <div className="flex gap-2 border-b border-border pb-2">
    {["pending", "approved", "rejected"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab as any)}
        className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
          activeTab === tab
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>

  {/* Content */}
  {loading ? (
    <p className="text-center text-muted-foreground">Loading requests...</p>
  ) : filteredRequests.length === 0 ? (
    <p className="text-center text-muted-foreground py-8">No {activeTab} requests found.</p>
  ) : (
    <div className="grid lg:grid-cols-3 grid-cols-2 gap-4">
      {filteredRequests.map((request) => (
        <div
          key={request._id}
          className="bg-card shadow-lg rounded-lg p-6 border border-border"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <Image
                src={request.image.url}
                alt={request.name}
                className="w-16 h-16 rounded-full object-cover border border-border"
                width={64}
                height={64}
              />
              <div>
                <h3 className="text-xl font-bold text-card-foreground">{request.name}</h3>
                <p className="text-muted-foreground">
                  {request.category} • {request.city}, {request.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  Submitted: {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={getStatusBadge(request.status)}>
              {request.status.toUpperCase()}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-card-foreground mb-2">
              <strong>District:</strong> {request.district}
            </p>
            <p className="text-card-foreground mb-2">
              <strong>Bio:</strong> {request.shortBio}
            </p>
            {request.website && (
              <p className="text-card-foreground mb-2">
                <strong>Website:</strong>
                <a
                  href={request.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1 transition-colors"
                >
                  {request.website}
                </a>
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {request.socials?.instagram && (
                <a
                  href={request.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm transition-colors"
                >
                  Instagram
                </a>
              )}
              {request.socials?.youtube && (
                <a
                  href={request.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm transition-colors"
                >
                  YouTube
                </a>
              )}
              {request.socials?.spotify && (
                <a
                  href={request.socials.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm transition-colors"
                >
                  Spotify
                </a>
              )}
              {request.socials?.soundcloud && (
                <a
                  href={request.socials?.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm transition-colors"
                >
                  SoundCloud
                </a>
              )}
            </div>
          </div>

          {activeTab === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(request._id)}
                disabled={processingIds.has(request._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
              >
                {processingIds.has(request._id) ? "Approving..." : "Approve"}
              </button>
              <button
                onClick={() => handleReject(request._id)}
                disabled={processingIds.has(request._id)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 disabled:bg-muted disabled:text-muted-foreground transition-colors"
              >
                {processingIds.has(request._id) ? "Rejecting..." : "Reject"}
              </button>
            </div>
          )}

          {activeTab !== "pending" && (
            <div className="text-sm text-muted-foreground">
              <p>
                Reviewed:{" "}
                {request.reviewedAt
                  ? new Date(request.reviewedAt).toLocaleString()
                  : "N/A"}
              </p>
              {request.rejectionReason && (
                <p className="text-destructive mt-1">
                  <strong>Rejection reason:</strong> {request.rejectionReason}
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
