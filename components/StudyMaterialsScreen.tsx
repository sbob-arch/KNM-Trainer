import React, { useState } from 'react';
import { ArrowLeft, Play, PlayCircle, Trophy, Medal, CheckCircle } from 'lucide-react';
import { STUDY_MATERIALS } from '../constants';

const StudyMaterialsScreen: React.FC<{ 
  onHome: () => void;
  onStartVideoQuiz: (video: typeof STUDY_MATERIALS[0]) => void;
  videoMastery: Record<string, boolean>;
}> = ({ onHome, onStartVideoQuiz, videoMastery }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const activeVideoData = STUDY_MATERIALS.find(v => v.id === activeVideo);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onHome}
          className="flex items-center gap-2 text-slate-600 mb-6 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Video Quests</h1>
            <p className="text-slate-600">Watch the videos and complete the challenges to earn Mastery Badges.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
             <div className="text-sm font-medium text-slate-500">Your Mastery:</div>
             <div className="flex items-center gap-1.5">
               <Trophy className="w-5 h-5 text-yellow-500" />
               <span className="font-bold text-slate-900 text-lg">
                 {Object.keys(videoMastery).length} / {STUDY_MATERIALS.length}
               </span>
             </div>
          </div>
        </div>

        {activeVideo && (
          <div className="mb-8 bg-black rounded-xl overflow-hidden shadow-lg border-4 border-slate-900">
            <div className="aspect-video relative">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="bg-slate-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-white">
                 <h3 className="font-bold text-lg">{activeVideoData?.title}</h3>
                 <p className="text-slate-400 text-sm">Ready to prove your knowledge?</p>
              </div>
              <button
                onClick={() => activeVideoData && onStartVideoQuiz(activeVideoData)}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Challenge
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDY_MATERIALS.map((video) => {
            const isMastered = videoMastery[video.id];
            const isActive = activeVideo === video.id;

            return (
              <button
                key={video.id}
                onClick={() => setActiveVideo(video.id)}
                className={`text-left group relative bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col
                  ${isActive ? 'ring-2 ring-orange-500 border-transparent shadow-md' : 'border-slate-200 hover:shadow-md'}
                `}
              >
                <div className="relative aspect-video bg-slate-200">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className={`w-full h-full object-cover transition-opacity ${isMastered ? 'opacity-90' : ''}`}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                  {isMastered && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-md shadow-sm flex items-center gap-1 font-bold text-xs border border-yellow-500">
                      <Medal className="w-3 h-3 fill-current" />
                      MASTERED
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">{video.description}</p>
                  
                  <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-400">
                    <span>Video Quest</span>
                    {!isMastered && <span className="text-orange-500">Incomplete</span>}
                    {isMastered && <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Complete</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialsScreen;