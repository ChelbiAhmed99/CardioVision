import React from 'react';
import { Play, ChevronRight } from 'lucide-react';

interface DemoVideoProps {
  title: string;
  id: number;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  onSelect: (url: string) => void;
  handleSubmit: any;
}

function DemoVideo({ title, description, videoUrl, thumbnailUrl, onSelect, handleSubmit }: DemoVideoProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(videoUrl);
    handleSubmit();
  };

  return (
    <div
      className="group relative cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden glass-card border-white/5 group-hover:border-blue-500/30 transition-all duration-500 shadow-xl group-hover:shadow-blue-600/20">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-cardio-dark/40 group-hover:bg-blue-900/40 transition-colors duration-500"></div>

        <div className="absolute inset-0 flex items-center justify-center transition-all opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <div className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-[8px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Load Case
          </div>
        </div>
      </div>

      <div className="mt-4 px-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
        </div>
        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-500 uppercase tracking-widest">{description}</p>
      </div>
    </div>
  );
}

interface DemoVideosProps {
  onVideoSelect: (url: string) => void;
  handleSubmit: any;
}

export function DemoVideos({ onVideoSelect, handleSubmit }: DemoVideosProps) {
  const demos = [
    {
      id: 1,
      title: "Normal Control",
      description: "Hyperdynamic Wall Motion",
      videoUrl: "demos/video1.mp4",
      thumbnailUrl: "demos/thumbnail-1.png",
    },
    {
      id: 2,
      title: "Mild Akinesis",
      description: "Regional Wall Abnormalities",
      videoUrl: "demos/video2.mp4",
      thumbnailUrl: "demos/thumbnail-2.png",
    },
    {
      id: 3,
      title: "Global Dysfunction",
      description: "LVEF < 35% Sequence",
      videoUrl: "demos/video3.mp4",
      thumbnailUrl: "demos/thumbnail-3.png",
    },
    {
      id: 4,
      title: "Ischemic Pattern",
      description: "Multi-Segment Reduced Strain",
      videoUrl: "demos/video4.mp4",
      thumbnailUrl: "demos/thumbnail-4.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {demos.map((demo, index) => (
        <DemoVideo
          key={index}
          {...demo}
          onSelect={onVideoSelect}
          handleSubmit={handleSubmit}
        />
      ))}
    </div>
  );
}