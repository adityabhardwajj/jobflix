"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

interface SuccessStoryVideoProps {
  className?: string;
}

const SuccessStoryVideo = ({ className = "" }: SuccessStoryVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock video data - in a real app, this would be an actual video file
  const videoData = {
    title: "Sarah's Journey: From 200+ Rejections to Dream Job",
    description:
      "Watch how JobFlix transformed Sarah's job search from endless applications to landing her dream role at a top tech company in just 2 weeks.",
    thumbnail: "/api/placeholder/800/450",
    videoUrl: "/api/placeholder/video", // This would be a real video URL
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Video Container */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
        {/* Video Element */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>
          {/* Story Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8 max-w-5xl mx-auto">
              {/* Story Timeline */}
              <div className="mb-12">
                <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12 mb-8">
                  {/* Struggle Phase */}
                  <div className="flex flex-col items-center space-y-3 group">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-400/50 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">😰</span>
                    </div>
                    <span className="text-lg font-semibold text-white">
                      Struggling
                    </span>
                    <div className="text-sm text-gray-300">200+ Rejections</div>
                  </div>

                  {/* Arrow */}
                  <div className="text-3xl text-blue-400 hidden md:block animate-pulse">
                    →
                  </div>
                  <div className="text-3xl text-blue-400 md:hidden animate-pulse">
                    ↓
                  </div>

                  {/* Discovery Phase */}
                  <div className="flex flex-col items-center space-y-3 group">
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center border-2 border-yellow-400/50 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">💡</span>
                    </div>
                    <span className="text-lg font-semibold text-white">
                      Discovery
                    </span>
                    <div className="text-sm text-gray-300">Found JobFlix</div>
                  </div>

                  {/* Arrow */}
                  <div className="text-3xl text-blue-400 hidden md:block animate-pulse">
                    →
                  </div>
                  <div className="text-3xl text-blue-400 md:hidden animate-pulse">
                    ↓
                  </div>

                  {/* Success Phase */}
                  <div className="flex flex-col items-center space-y-3 group">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400/50 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">🎉</span>
                    </div>
                    <span className="text-lg font-semibold text-white">
                      Success!
                    </span>
                    <div className="text-sm text-gray-300">Dream Job</div>
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={handlePlayPause}
                className="mb-8 w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 hover:scale-110 transition-all duration-300"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>

              <h3 className="text-3xl font-bold mb-4 text-white">
                {videoData.title}
              </h3>
              <p className="text-gray-300 mb-8 max-w-3xl mx-auto text-lg">
                {videoData.description}
              </p>

              {/* Success Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {[
                  {
                    label: "Before",
                    value: "200+",
                    color: "text-red-400",
                    bg: "bg-red-500/20",
                  },
                  {
                    label: "Applications",
                    value: "Rejections",
                    color: "text-red-400",
                    bg: "bg-red-500/20",
                  },
                  {
                    label: "After",
                    value: "2",
                    color: "text-green-400",
                    bg: "bg-green-500/20",
                  },
                  {
                    label: "Weeks",
                    value: "Success",
                    color: "text-green-400",
                    bg: "bg-green-500/20",
                  },
                ].map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className={`${metric.bg} rounded-xl p-4 mb-2`}>
                      <div
                        className={`text-3xl font-bold ${metric.color} mb-1`}
                      >
                        {metric.value}
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Description */}
      <div className="mt-8 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-6">
              The JobFlix Difference
            </h4>
            <div className="space-y-4">
              {[
                {
                  title: "Smart Job Matching",
                  description:
                    "AI-powered recommendations based on your skills and preferences",
                  icon: "🎯",
                },
                {
                  title: "Direct Company Access",
                  description:
                    "Connect directly with hiring managers and skip the ATS",
                  icon: "🚀",
                },
                {
                  title: "Career Guidance",
                  description: "Expert advice and interview preparation tools",
                  icon: "💼",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {feature.title}
                    </p>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h5 className="font-bold text-gray-900 mb-6 text-xl">
              Sarah's Results
            </h5>
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  value: "200+",
                  label: "Rejections Before",
                  color: "text-red-600",
                  bg: "bg-red-100",
                },
                {
                  value: "2",
                  label: "Weeks to Success",
                  color: "text-green-600",
                  bg: "bg-green-100",
                },
                {
                  value: "5",
                  label: "Interviews",
                  color: "text-blue-600",
                  bg: "bg-blue-100",
                },
                {
                  value: "1",
                  label: "Dream Job",
                  color: "text-purple-600",
                  bg: "bg-purple-100",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`${stat.bg} rounded-xl p-4 mb-2`}>
                    <div className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStoryVideo;
