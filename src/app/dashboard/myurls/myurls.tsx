// app/dashboard/myurls.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart2, ExternalLink, Copy, QrCode, Share2, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/authContext";
import {handleCopy} from "@/app/utilityFunctions"
import {Spinner2} from "@/app/component/ui"
export default function MyURLs() {
  const [userUrls, setUserUrls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
   const [showQrCode, setShowQrCode] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(
    () => {
      const fetchUserUrls = async () => {
        try {
          const response = await fetch("/api/urls/user", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUserUrls(data.urls || []);
          } else {
            setError("Failed to fetch your URLs");
          }
        } catch (error) {
          setError("Error loading URLs. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      if (user) {
        fetchUserUrls();
      } else if (!localStorage.getItem("token")) {
        router.push("/login");
      }
    },
    [user, router]
  );

  // const handleCopy = async (url: string) => {
  //   try {
  //     await navigator.clipboard.writeText(url);
  //     setCopySuccess(url);
  //     setTimeout(() => setCopySuccess(null), 2000);
  //   } catch (err) {
  //     console.error("Copy failed:", err);
  //     setError("Copy failed. Please select and copy the URL manually.");
  //   }
  // };

 const truncateUrl = (url, maxLength = 40) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
  };
   const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) {
      // Less than a day ago
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      } else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
      }
    } else if (diffInDays < 7) {
      // Less than a week ago
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      // More than a week ago
      return date.toLocaleDateString();
    }
  };

  return (

        <div className="p-4 monserrat">
          <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your recent ShortUrls</h2>
        <button 
          onClick={() => setShowQrCode(false)} 
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

          {loading
            ?< <div className="flex justify-center items-center h-64">
               <Spinner color="black" />
              </div>>
            : error
              ? <div className="bg-red-100 text-red-700 p-4 rounded-md">
                  {error}
                </div>
              : userUrls.length === 0
                ? <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">
                      You haven't created any URLs yet
                    </p>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                    >
                      Create Your First URL
                    </button>
                  </div>
                : <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Your shortened URLs
                      </h3>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                        Total: {userUrls.length}
                      </span>
                    </div>

                    {userUrls.map((url, index) =>
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                          <div>
                            <h4
                              className="font-medium text-black mb-1 truncate"
                              title={url.originalUrl}
                            >
                              {url.originalUrl}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <a
                                href={url.shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm flex items-center"
                              >
                                {url.shortUrl}{" "}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                              <button
                                onClick={() => handleCopy(url.shortUrl)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                                title="Copy to clipboard"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              {copySuccess === url.shortUrl &&
                                <span className="text-green-600 text-xs">
                                  Copied!
                                </span>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="bg-gray-100 px-2 py-1 rounded-md flex items-center">
                              <BarChart2 className="h-3 w-3 mr-1" />
                              {url.clicks || 0} clicks
                            </span>
                            <span className="text-gray-500">
                              {url.createdAt &&
                                new Date(url.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleCopy(url.shortUrl)}
                            className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                          <button className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200">
                            <QrCode className="h-3 w-3" /> QR Code
                          </button>
                          <button className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200">
                            <Share2 className="h-3 w-3" /> Share
                          </button>
                          <Link
                            href={`/stats/${url.shortUrl?.split("/").pop()}`}
                            className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200"
                          >
                            <BarChart2 className="h-3 w-3" /> Stats
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>}
        </div>
  
  );
}
