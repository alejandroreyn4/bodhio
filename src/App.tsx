import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion, AnimatePresence } from 'motion/react';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Heart, Award, Zap, Waves, Moon, Star, Trophy, User, LogIn, LogOut, UserPlus, Mail, Lock, Chrome, X, Loader2, HelpCircle, Globe, PlayCircle, BarChart3, Sliders, Layers, Phone, Instagram, ChevronRight, ChevronDown, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, Music, VolumeX, Bell, BellRing, Disc, Clock, Activity, TrendingUp, Check, Search, AlertCircle, ChevronLeft, ExternalLink, Pencil, Trash2, BookOpen, Edit3, Plus, Edit2, Upload, Calendar, Download, ArrowUpRight, Frown, Annoyed, Meh, Smile, SmilePlus, Laugh, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Underline as UnderlineIcon, Type } from 'lucide-react';
import { translations, Language } from './i18n';
import { LazyImage } from './components/LazyImage';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, db, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, getDocs, query, orderBy, addDoc, where, OperationType, handleFirestoreError, sendEmailVerification, storage, ref, uploadBytes, getDownloadURL, deleteObject, writeBatch, serverTimestamp } from './firebase';

export const ACHIEVEMENTS = [
  { id: 'seme', title: 'Seme del Bodhi', icon: Award, desc: 'Completa la tua 1ª sessione', check: (data: any) => data.sessions >= 1 },
  { id: 'costanza', title: 'Costanza Zen', icon: Zap, desc: '7 giorni consecutivi', check: (data: any) => data.streak >= 7 },
  { id: 'oceano', title: 'Oceano di Calma', icon: Waves, desc: '500 minuti totali', check: (data: any) => data.totalMinutes >= 500 },
  { id: 'silenzio', title: 'Silenzio Profondo', icon: Moon, desc: 'Sessione da 30+ minuti', check: (data: any) => data.maxSessionDuration >= 30 },
  { id: 'lunare', title: 'Meditazione Lunare', icon: Star, desc: 'Sessione dopo le 22:00', check: (data: any) => data.lateNightSessions >= 1 },
  { id: 'maestro', title: 'Maestro del Risveglio', icon: Trophy, desc: '50 sessioni totali', check: (data: any) => data.sessions >= 50 },
];
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, ReferenceDot } from 'recharts';
import { MusicEditor } from './components/MusicEditor';
import { MoodHeatmap } from './components/MoodHeatmap';

interface Mood {
  id: string;
  userId: string;
  mood: number;
  note?: string;
  minutes?: number;
  createdAt: any;
}

function MoodSelector({ onSelect, isLight, t }: { onSelect: (level: number, note: string) => void, isLight: boolean, t: any }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { level: 1, icon: Frown, label: t.veryStressed || 'Molto stressato' },
    { level: 2, icon: Annoyed, label: t.slightlyStressed || 'Un po\' stressato' },
    { level: 3, icon: Meh, label: t.neutral || 'Neutrale' },
    { level: 4, icon: Smile, label: t.relaxed || 'Rilassato' },
    { level: 5, icon: Laugh, label: t.veryCalm || 'Molto calmo' },
  ];

  const handleSelect = (level: number) => {
    setSelected(level);
  };

  const handleConfirm = () => {
    if (selected !== null) {
      setIsSubmitting(true);
      onSelect(selected, note);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 mt-4 w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className={`font-serif text-[20px] ${isLight ? 'text-gray-700' : 'text-[#888]'}`}>{t.howDoYouFeel || 'Come ti senti?'}</h3>
      
      <div className="flex justify-between items-start w-full max-w-[380px] px-2 mx-auto">
        {moods.map((mood) => (
          <button
            key={mood.level}
            onClick={() => handleSelect(mood.level)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 group flex-1 px-1`}
          >
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
              ${selected === mood.level 
                ? 'accent-bg accent-shadow scale-110' 
                : isLight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/5 hover:bg-white/10'}
            `}>
              <mood.icon 
                size={22} 
                strokeWidth={1.5}
                className={`transition-colors duration-300 ${
                  selected === mood.level 
                    ? 'text-white' 
                    : isLight ? 'text-gray-400 group-hover:text-gray-600' : 'text-[#555] group-hover:text-[#888]'
                }`}
              />
            </div>
            <span className={`text-[10px] uppercase tracking-wider text-center leading-tight transition-opacity duration-300 mt-1 ${
              selected === mood.level ? 'opacity-100 accent-text font-bold' : 'opacity-0 group-hover:opacity-100 text-[#555]'
            }`}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full flex flex-col items-center gap-4 overflow-hidden"
          >
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className={`
                mt-2 px-8 py-2 rounded-full text-[12px] uppercase tracking-widest transition-all
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'accent-bg text-white accent-shadow hover:scale-105 active:scale-95'}
              `}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (t.save || 'Salva')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AchievementsSection({ unlockedBadges, userData, theme, language, className = "" }: { unlockedBadges: string[], userData: any, theme: string, language: 'it' | 'en' | 'es', className?: string }) {
  const isLight = theme === 'light';
  const t = translations[language];
  
  return (
    <div className={`p-5 rounded-2xl backdrop-blur-lg border ${isLight ? 'bg-white/80 border-gray-200' : 'bg-white/5 border-white/10'} ${className}`}>
      <h2 className={`text-[18px] font-semibold mb-4 ${isLight ? 'text-gray-900' : 'text-[#e8e4dc]'}`}>{t.achievementsTitle}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedBadges.includes(achievement.id);
          const localizedAchievement = t.achievements[achievement.id as keyof typeof t.achievements];
          const achievementTitle = localizedAchievement?.title || achievement.title;
          const achievementDesc = localizedAchievement?.desc || achievement.desc;
          
          // Calculate progress
          let progress = 0;
          let total = 1;
          if (!isUnlocked) {
            if (achievement.id === 'seme') { total = 1; progress = Math.min(userData.sessions, total); }
            else if (achievement.id === 'costanza') { total = 7; progress = Math.min(userData.streak, total); }
            else if (achievement.id === 'oceano') { total = 500; progress = Math.min(userData.totalMinutes, total); }
            else if (achievement.id === 'silenzio') { total = 30; progress = Math.min(userData.maxSessionDuration, total); }
            else if (achievement.id === 'lunare') { total = 1; progress = Math.min(userData.lateNightSessions, total); }
            else if (achievement.id === 'maestro') { total = 50; progress = Math.min(userData.sessions, total); }
          }
          
          return (
            <motion.div
              key={achievement.id}
              whileHover={isUnlocked ? { scale: 1.05, boxShadow: "0 0 10px rgba(168, 85, 247, 0.4)" } : {}}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border ${
                isUnlocked 
                  ? 'accent-bg-alpha accent-border-alpha' 
                  : isLight ? 'bg-gray-100 border-gray-200' : 'bg-gray-900/50 border-gray-800'
              }`}
              title={`${achievementTitle}: ${isUnlocked ? (language === 'it' ? 'Sbloccato!' : language === 'es' ? '¡Desbloqueado!' : 'Unlocked!') : achievementDesc}`}
            >
              <div className={`transition-colors duration-300 ${isUnlocked ? 'accent-text' : isLight ? 'text-gray-400' : 'text-gray-700 opacity-50'}`}>
                <achievement.icon size={24} />
              </div>
              <span className={`mt-2 text-[9px] font-medium text-center leading-tight ${isUnlocked ? 'accent-text' : (isLight ? 'text-gray-600' : 'text-gray-600')}`}>
                {achievementTitle}
              </span>
              {!isUnlocked && (
                <span className={`mt-1 text-[8px] ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                  {progress}/{total}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const Hourglass = ({ elapsed, flipped, sessionActive, duration, theme }: { elapsed: number, flipped: boolean, sessionActive: boolean, duration: number, theme: string }) => {
  const color = theme === 'light' ? '#1a1a1a' : '#e8e4dc';
  const progress = Math.max(0, Math.min(elapsed / duration, 1));
  const maxSandHeight = 28;
  const topTriangleY = 4;
  const bottomTriangleY = 32;

  // Top half: starts full (28), drains down (shrinks)
  const topSandHeight = (1 - progress) * maxSandHeight;
  const topSandY = (topTriangleY + maxSandHeight) - topSandHeight;

  // Bottom half: starts empty (0), fills up (grows)
  const bottomSandHeight = progress * maxSandHeight;
  const bottomSandY = (bottomTriangleY + maxSandHeight) - bottomSandHeight;

  return (
    <svg 
      width="48" 
      height="64" 
      viewBox="0 0 48 64" 
      className={`transition-transform duration-1000 ease-in-out ${flipped ? 'rotate-180' : ''} ${!sessionActive ? 'pulse' : ''} transition-opacity hover:opacity-100 hover:drop-shadow-[0_0_6px_rgba(232,228,220,0.3)]`}
    >
      <defs>
        <clipPath id="topTriangle">
          <path d="M4 4 L44 4 L24 32 Z" />
        </clipPath>
        <clipPath id="bottomTriangle">
          <path d="M24 32 L44 60 L4 60 Z" />
        </clipPath>
      </defs>
      {/* Hourglass outline */}
      <path d="M4 4 L44 4 L24 32 L44 60 L4 60 L24 32 Z" fill="none" stroke={color} strokeWidth="1" />
      
      {/* Sand */}
      <rect x="4" y={topSandY} width="40" height={topSandHeight} fill={color} clipPath="url(#topTriangle)" />
      <rect x="4" y={bottomSandY} width="40" height={bottomSandHeight} fill={color} clipPath="url(#bottomTriangle)" />
      
      {/* Falling sand particles */}
      {sessionActive && elapsed < 300 && (
        <g>
          <circle cx="24" cy="32" r="1.5" fill={color}>
            <animateTransform attributeName="transform" type="translate" from="0 0" to="0 28" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="24" cy="32" r="1.5" fill={color}>
            <animateTransform attributeName="transform" type="translate" from="0 -10" to="0 18" dur="0.8s" begin="0.4s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  );
};

const data = {
  week: [
    { name: 'Lun', min: 10 },
    { name: 'Mar', min: 15 },
    { name: 'Mer', min: 5 },
    { name: 'Gio', min: 20 },
    { name: 'Ven', min: 10 },
    { name: 'Sab', min: 25 },
    { name: 'Dom', min: 30 },
  ],
  month: [
    { name: 'W1', min: 50 },
    { name: 'W2', min: 70 },
    { name: 'W3', min: 40 },
    { name: 'W4', min: 90 },
  ],
  year: [
    { name: 'Gen', min: 200 },
    { name: 'Feb', min: 250 },
    { name: 'Mar', min: 180 },
    { name: 'Apr', min: 300 },
    { name: 'Mag', min: 220 },
    { name: 'Giu', min: 350 },
    { name: 'Lug', min: 400 },
    { name: 'Ago', min: 380 },
    { name: 'Set', min: 320 },
    { name: 'Ott', min: 280 },
    { name: 'Nov', min: 250 },
    { name: 'Dic', min: 450 },
  ],
};

const THEMES = {
  Rainbow: 'conic-gradient(#ff6b6b, #ff9f43, #ffd32a, #0be881, #48dbfb, #ff9ff3, #ff6b6b)',
  Gold: 'conic-gradient(#bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
  Aurora: 'conic-gradient(#00c6ff, #0072ff, #00c6ff)',
  Crimson: 'conic-gradient(#8b0000, #ff4500, #8b0000)',
  Monochrome: 'conic-gradient(#ffffff, #000000, #ffffff)',
};

// ── UNIFIED AUDIO SYSTEM ──
let masterCtx: AudioContext | null = null;
const bellBufferCache: Map<string, AudioBuffer> = new Map();

// Get or create the master AudioContext
function getMasterCtx() {
  if (!masterCtx || masterCtx.state === 'closed') {
    masterCtx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
  }
  return masterCtx;
}

// Unlock on first user gesture
const unlockAudio = async () => {
  const ctx = getMasterCtx();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
};
document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
document.addEventListener('click', unlockAudio, { once: true });

// Preload bell sound into buffer cache
async function preloadBellBuffer(url: string) {
  if (!url || url === 'synthesized' || bellBufferCache.has(url)) return;
  try {
    const ctx = getMasterCtx();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await ctx.decodeAudioData(arrayBuffer);
    bellBufferCache.set(url, buffer);
    console.log(`Bell preloaded OK: ${url}`);
  } catch(e) {
    console.warn(`Bell preload failed for ${url}:`, e);
  }
}

// On page load — preload saved sounds
window.addEventListener('load', () => {
  const ambientUrl = localStorage.getItem('zenly_ambientSoundUrl') || '';
  if (ambientUrl) preloadBellBuffer(ambientUrl);
  
  const startSound = localStorage.getItem('zenly_startSound') || localStorage.getItem('zenly_selectedSound') || '';
  if (startSound && startSound !== 'synthesized') preloadBellBuffer(startSound);
  
  const endSound = localStorage.getItem('zenly_endSound') || localStorage.getItem('zenly_selectedSound') || '';
  if (endSound && endSound !== 'synthesized') preloadBellBuffer(endSound);
});

// Play a synthetically generated metronome tick using Web Audio API
function playMetronomeTick(soundEnabled: boolean) {
  if (!soundEnabled) return;
  try {
    const ctx = getMasterCtx();
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 12);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.9, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + 0.1);
  } catch(e) {
    console.warn('Metronome tick error:', e);
  }
}

// Helper to get local YYYY-MM-DD date string for database keys
const formatDayKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const heatmapData = (() => {
  const data = [];
  const today = new Date();
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    let minutes = 0;
    const isRecent = i < 60;
    const rand = Math.random();
    
    if (isRecent) {
      if (rand > 0.4) minutes = [5, 10, 15, 20, 25, 30][Math.floor(Math.random() * 6)];
    } else {
      if (rand > 0.8) minutes = [5, 10, 15][Math.floor(Math.random() * 3)];
    }
    
    data.push({
      date: d,
      minutes,
      sessions: Math.floor(minutes / 10) + (Math.random() > 0.5 ? 1 : 0),
      isToday: i === 0
    });
  }
  return data;
})();

const formatDate = (d: Date) => d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });

const SOUND_OPTIONS = [
  { label: 'Campana Tibetana (Sintetica)', value: 'synthesized' },
  { label: 'Bell Meditation 1', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FBell%20Meditation%201.mp3?alt=media' },
  { label: 'Bell Meditation 2', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FBell%20Meditation%202.mp3?alt=media' },
  { label: 'Bell Meditation 3', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FBell%20Meditation%203.mp3?alt=media' },
  { label: 'Bell Meditation 4', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FBell%20Meditation%204.mp3?alt=media' },
  { label: 'Bell Meditation 5', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FBell%20Meditation%205.mp3?alt=media' },
  { label: 'Bell Meditation 6', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FBell%20Meditation%206.mp3?alt=media' },
  { label: 'Bell Meditation 7', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FBell%20Meditation%207.mp3?alt=media' },
  { label: 'Black Gong 1', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FBlack%20gong%201.mp3?alt=media' },
  { label: 'Bowl Low and Loud 1', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FBowl%20low%20and%20loud%201.mp3?alt=media' },
  { label: 'Buddha Thailand Sound Therapy', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FBuddha%20Thailand%20sound%20therapy.mp3?alt=media' },
  { label: 'Singing Bowl 1', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FSinging%20bowl%201.mp3?alt=media' },
  { label: 'Temple Chanting Interior 1', value: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Suoni%20Meditazione%2FTemple%20chanting%20interior%201.mp3?alt=media' },
];

const AMBIENT_SOUNDS = [
  {
    id: 'none',
    label: 'Silenzio',
    url: '',
    icon: <VolumeX size={26} strokeWidth={1} />
  },
  {
    id: 'bell1',
    label: 'Bell 1',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Campane%20Meditazione%2FBell%201.mp3?alt=media',
    icon: <Bell size={26} strokeWidth={1} />
  },
  {
    id: 'bell2',
    label: 'Bell 2',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Campane%20Meditazione%2FBell%202.mp3?alt=media',
    icon: <Bell size={26} strokeWidth={1} />
  },
  {
    id: 'bell3',
    label: 'Bell 3',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Campane%20Meditazione%2FBell%203.mp3?alt=media',
    icon: <BellRing size={26} strokeWidth={1} />
  },
  {
    id: 'bell4',
    label: 'Bell 4',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Campane%20Meditazione%2FBell%204.mp3?alt=media',
    icon: <Bell size={26} strokeWidth={1} />
  },
  {
    id: 'bells',
    label: 'Bells',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Campane%20Meditazione%2FBells.mp3?alt=media',
    icon: <BellRing size={26} strokeWidth={1} />
  },
  {
    id: 'blackgong',
    label: 'Black Gong',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Campane%20Meditazione%2FBlack%20Gong.mp3?alt=media',
    icon: <Disc size={26} strokeWidth={1} />
  },
  {
    id: 'bowllow',
    label: 'Bowl Low',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Campane%20Meditazione%2FBowl%20Low.mp3?alt=media',
    icon: <Music size={26} strokeWidth={1} />
  }
];

const playerTracks = [
  {
    id: 'temple',
    name: 'Temple Chanting Interior',
    category: 'Tempio',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Player%20Musicale%2FTemple%20chanting%20interior.mp3?alt=media',
    image: 'https://i.postimg.cc/j5gYjH3X/Golden-Serenity-Buddha-Statues-in-Meditative-Repose.png'
  },
  {
    id: 'calmrain',
    name: 'Calm Rain',
    category: 'Natura',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Player%20Musicale%2FCalm%20Rain.mp3?alt=media',
    image: 'https://i.postimg.cc/y8sKv8RB/Rainy-Silhouette-Scene.png'
  },
  {
    id: 'monks',
    name: 'Community Tibetan Monks',
    category: 'Meditazione',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Player%20Musicale%2FCommunity%20tibetan%20monks.mp3?alt=media',
    image: 'https://i.postimg.cc/HkBqz4Hv/Meditative-Serenity.png'
  },
  {
    id: 'birds',
    name: 'Morning with Birds',
    category: 'Natura',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Player%20Musicale%2FMorning%20with%20birds.mp3?alt=media',
    image: 'https://i.postimg.cc/prf7FKqS/Silhouetted-Bird-at-Sunrise.png'
  },
  {
    id: 'river',
    name: 'River',
    category: 'Natura',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Player%20Musicale%2FRiver.mp3?alt=media',
    image: 'https://i.postimg.cc/nLNwS3WN/Mystical-Morning-in-a-Riverside-Village.png'
  },
  {
    id: 'windchimes',
    name: 'Wind Chimes Tibetan Bells',
    category: 'Meditazione',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Player%20Musicale%2FWind%20Chimes%20Fengshui%20Tibetan%20Bells%20Meditation.mp3?alt=media',
    image: 'https://i.postimg.cc/wTF4YqPT/Meditating-Monk-in-Mystic-Environment.png'
  },
  {
    id: 'bowls',
    name: 'Community meditation bowls',
    category: 'Meditazione',
    url: 'https://firebasestorage.googleapis.com/v0/b/progetto-web-zen.firebasestorage.app/o/Player%20Musicale%2FCommunity%20meditation%20bowls.mp3?alt=media',
    image: 'https://i.postimg.cc/j2R6mnr0/Meditative_Silhouette.png'
  }
];

const AnimatedNumber = ({ value, duration = 1000 }: { value: number, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startValue = prevValueRef.current;
    const endValue = value;
    const difference = endValue - startValue;

    if (difference === 0) {
      setDisplayValue(endValue);
      return;
    }

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(Math.floor(startValue + (easeProgress * difference)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(Math.floor(endValue));
        prevValueRef.current = endValue;
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{displayValue}</>;
};

interface Article {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  authorImageUrl?: string;
  readingTime: string;
  imageUrl: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
}

// ── TIME HELPERS ──
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs}s`;
};

const toMinutes = (seconds: number) => Math.floor(seconds / 60);

export default function App() {
  const [lastSessionDuration, setLastSessionDuration] = useState(0);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [isDelaying, setIsDelaying] = useState(false);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('zenly_sessions');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [todayMin, setTodayMin] = useState(() => {
    const savedDate = localStorage.getItem('zenly_lastSessionDate');
    const today = formatDayKey(new Date());
    if (savedDate !== today) return 0;
    const saved = localStorage.getItem('zenly_todayMin');
    return saved ? Math.floor(parseFloat(saved)) : 0;
  });
  const [todaySeconds, setTodaySeconds] = useState(() => {
    const savedDate = localStorage.getItem('zenly_lastSessionDate');
    const today = formatDayKey(new Date());
    if (savedDate !== today) return 0;
    const saved = localStorage.getItem('zenly_todaySeconds');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [soundMeditationMinutes, setSoundMeditationMinutes] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('zenly_soundMeditationMinutes');
    return saved ? JSON.parse(saved) : {};
  });
  const [totalMin, setTotalMin] = useState<number>(() => {
    const savedDaily = localStorage.getItem('zenly_dailyMinutes');
    if (savedDaily) {
      try {
        const daily = JSON.parse(savedDaily) as Record<string, number>;
        return Math.floor(Object.values(daily).reduce((acc: number, val: number) => acc + Number(val), 0));
      } catch (e) { 
        // fallback to totalMin
      }
    }
    const saved = localStorage.getItem('zenly_totalMin');
    return saved ? Math.floor(parseFloat(saved)) : 0;
  });
  const [totalSeconds, setTotalSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('zenly_totalSeconds');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('zenly_streak');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [maxSessionDuration, setMaxSessionDuration] = useState(() => {
    const saved = localStorage.getItem('zenly_maxSessionDuration');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lateNightSessions, setLateNightSessions] = useState(() => {
    const saved = localStorage.getItem('zenly_lateNightSessions');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lastSessionDate, setLastSessionDate] = useState<string | null>(() => {
    return localStorage.getItem('zenly_lastSessionDate');
  });
  const [dailyMinutes, setDailyMinutes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('zenly_dailyMinutes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const cleaned: Record<string, number> = {};
        Object.keys(parsed).forEach(k => cleaned[k] = Math.floor(Number(parsed[k])));
        return cleaned;
      } catch (e) { return {}; }
    }
    return {};
  });
  const [dailySeconds, setDailySeconds] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('zenly_dailySeconds');
    return saved ? JSON.parse(saved) : {};
  });
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [showOverview, setShowOverview] = useState(false);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState<any>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [pendingPage, setPendingPage] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const currentTrackIndexRef = useRef(-1);
  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);
  const [cardNavOpen, setCardNavOpen] = useState(false);
  const [contattiOpen, setContattiOpen] = useState(false);
  const [playerPlaying, setPlayerPlaying] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  const [playerVolume, setPlayerVolume] = useState(70);
  const playerVolumeRef = useRef(70);
  useEffect(() => {
    playerVolumeRef.current = playerVolume;
  }, [playerVolume]);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('Tutti');
  const [statusFilter, setStatusFilter] = useState('Tutti');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const articlesPerPage = 6;
  
  const publishedArticles = useMemo(() => articles.filter(a => a.status === 'published'), [articles]);
  const availableCategories = useMemo(() => {
    const cats = new Set(publishedArticles.map(a => a.category).filter(Boolean));
    return ['Tutto', ...Array.from(cats)];
  }, [publishedArticles]);

  const filteredArticles = articles.filter(article => 
    (categoryFilter === 'Tutti' || categoryFilter === 'Tutto' || article.category === categoryFilter) &&
    (statusFilter === 'Tutti' || article.status === statusFilter)
  );

  const publicFilteredArticles = useMemo(() => {
    const filtered = publishedArticles.filter(article => 
      (categoryFilter === 'Tutto' || categoryFilter === 'Tutti' || article.category === categoryFilter)
    );
    
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });
  }, [publishedArticles, categoryFilter, sortOrder]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const [customTracks, setCustomTracks] = useState<any[]>([]);
  const allTracks = useMemo(() => {
    return [...playerTracks, ...customTracks];
  }, [customTracks]);
  const allTracksRef = useRef<any[]>([]);
  useEffect(() => {
    allTracksRef.current = allTracks;
  }, [allTracks]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminTab, setAdminTab] = useState<'users' | 'editor' | 'music'>('users');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<Article | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('unlockedBadges');
    return saved ? JSON.parse(saved) : [];
  });
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);

  const updateAchievements = (userData: any) => {
    const newUnlocked = [...unlockedBadges];
    let changed = false;

    ACHIEVEMENTS.forEach(achievement => {
      if (!newUnlocked.includes(achievement.id) && achievement.check(userData)) {
        newUnlocked.push(achievement.id);
        changed = true;
        // Trigger confetti/notification here
        console.log(`Badge sbloccato: ${achievement.title}`);
        triggerFeedback(null, true, `Traguardo: ${achievement.title}`);
      }
    });

    if (changed) {
      setUnlockedBadges(newUnlocked);
      localStorage.setItem('unlockedBadges', JSON.stringify(newUnlocked));
    }
  };
  const [playerDuration, setPlayerDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('zenly_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('zenly_notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [reminderTime, setReminderTime] = useState(() => {
    return localStorage.getItem('zenly_reminderTime') || '08:00';
  });
  const showOnlyFavoritesRef = useRef(showOnlyFavorites);
  const favoritesRef = useRef(favorites);
  const isLoopingRef = useRef(isLooping);
  const isShuffleRef = useRef(isShuffle);

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    showOnlyFavoritesRef.current = showOnlyFavorites;
  }, [showOnlyFavorites]);

  useEffect(() => {
    favoritesRef.current = favorites;
    localStorage.setItem('zenly_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const sum = Math.round(Object.values(dailyMinutes).reduce((acc: number, val: any) => acc + Number(val), 0));
    if (sum !== totalMin) {
      setTotalMin(sum);
    }
  }, [dailyMinutes]);

  useEffect(() => {
    const checkDate = () => {
      const today = formatDayKey(new Date());
      if (lastSessionDate && lastSessionDate !== today) {
        setTodayMin(0);
      }
    };
    checkDate();
    const interval = setInterval(checkDate, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastSessionDate]);

  const toggleFavorite = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId) 
        : [...prev, trackId]
    );
  };

  const playerAudioRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('zenly_soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [vibrationEnabled, setVibrationEnabled] = useState(() => {
    const saved = localStorage.getItem('zenly_vibrationEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [startSound, setStartSound] = useState(() => {
    return localStorage.getItem('zenly_startSound') || localStorage.getItem('zenly_selectedSound') || 'synthesized';
  });
  const [endSound, setEndSound] = useState(() => {
    return localStorage.getItem('zenly_endSound') || localStorage.getItem('zenly_selectedSound') || 'synthesized';
  });
  const [ambientSound, setAmbientSound] = useState(() => {
    return localStorage.getItem('zenly_ambientSound') || 'none';
  });
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('zenly_dailyGoal');
    const parsed = saved !== null ? parseInt(saved, 10) : 15;
    return parsed < 5 ? 15 : parsed;
  });

  useEffect(() => {
    localStorage.setItem('zenly_dailyGoal', String(dailyGoal));
  }, [dailyGoal]);

  useEffect(() => {
    if (startSound && startSound !== 'synthesized') preloadBellBuffer(startSound);
    if (endSound && endSound !== 'synthesized') preloadBellBuffer(endSound);
  }, [startSound, endSound]);

  const stopPlayer = () => {
    if (playerAudioRef.current) {
      playerAudioRef.current.pause();
      playerAudioRef.current.currentTime = 0;
      setPlayerPlaying(false);
    }
  };


  const togglePlayerPlayPause = () => {
    if (!playerAudioRef.current) {
      const currentTracks = showOnlyFavorites 
        ? allTracks.filter(t => favorites.includes(t.id))
        : allTracks;
      
      if (currentTracks.length > 0) {
        const firstTrackId = currentTracks[0].id;
        const globalIndex = allTracks.findIndex(t => t.id === firstTrackId);
        loadAndPlayTrack(globalIndex);
      }
      return;
    }
    if (playerPlaying) {
      playerAudioRef.current.pause();
      setPlayerPlaying(false);
    } else {
      playerAudioRef.current.play().catch((err) => {
        if (err.name === 'AbortError') return;
        handleAudioError(err);
      });
      setPlayerPlaying(true);
    }
  };

  const nextTrack = () => {
    const currentTracks = showOnlyFavorites 
      ? allTracks.filter(t => favorites.includes(t.id))
      : allTracks;
    
    if (currentTracks.length === 0) return;

    const currentTrackId = allTracks[currentTrackIndex]?.id;
    const currentIndexInFiltered = currentTracks.findIndex(t => t.id === currentTrackId);
    
    let nextIndexInFiltered = (currentIndexInFiltered + 1) % currentTracks.length;
    if (isShuffle && currentTracks.length > 1) {
      do {
        nextIndexInFiltered = Math.floor(Math.random() * currentTracks.length);
      } while (nextIndexInFiltered === currentIndexInFiltered);
    }
    
    const nextTrack = currentTracks[nextIndexInFiltered];
    const nextGlobalIndex = allTracks.findIndex(t => t.id === nextTrack.id);
    loadAndPlayTrack(nextGlobalIndex);
  };

  const prevTrack = () => {
    if (playerAudioRef.current && playerAudioRef.current.currentTime > 3) {
      playerAudioRef.current.currentTime = 0;
      return;
    }

    const currentTracks = showOnlyFavorites 
      ? allTracks.filter(t => favorites.includes(t.id))
      : allTracks;
    
    if (currentTracks.length === 0) return;

    const currentTrackId = allTracks[currentTrackIndex]?.id;
    const currentIndexInFiltered = currentTracks.findIndex(t => t.id === currentTrackId);
    
    let prevIndexInFiltered = (currentIndexInFiltered - 1 + currentTracks.length) % currentTracks.length;
    
    if (isShuffle && currentTracks.length > 1) {
      do {
        prevIndexInFiltered = Math.floor(Math.random() * currentTracks.length);
      } while (prevIndexInFiltered === currentIndexInFiltered);
    }

    const prevTrack = currentTracks[prevIndexInFiltered];
    const prevGlobalIndex = allTracks.findIndex(t => t.id === prevTrack.id);
    loadAndPlayTrack(prevGlobalIndex);
  };

  const handlePlayerVolumeChange = (val: number) => {
    setPlayerVolume(val);
    if (playerAudioRef.current) playerAudioRef.current.volume = val / 100;
  };

  const seekPlayer = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerAudioRef.current || !playerAudioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    playerAudioRef.current.currentTime = pct * playerAudioRef.current.duration;
  };

  const formatPlayerTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m + ':' + String(s).padStart(2, '0');
  };

  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, []);

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    if ((window as any)._currentPreviewSource) {
      try { (window as any)._currentPreviewSource.stop(); } catch(e) {}
      try { (window as any)._currentPreviewSource.disconnect(); } catch(e) {}
      (window as any)._currentPreviewSource = null;
    }
    if ((window as any)._currentPreviewGain) {
      try { (window as any)._currentPreviewGain.disconnect(); } catch(e) {}
      (window as any)._currentPreviewGain = null;
    }
  };

  const resetRingAnimation = () => {
    const ring = document.querySelector('.ring-container');
    if (!ring) return;
    ring.classList.remove('ring-off','ring-beat-1','ring-beat-2','ring-beat-3','ring-beat-4','ring-beat-5','active','ring-complete');
    ring.classList.add('idle');
  };

  const stopBowlSound = () => {
    if (bowlAudioRef.current) {
      bowlAudioRef.current.pause();
      bowlAudioRef.current.currentTime = 0;
      bowlAudioRef.current = null;
    }
    if (bowlSourceRef.current) {
      try { bowlSourceRef.current.stop(); } catch(e) {}
      try { bowlSourceRef.current.disconnect(); } catch(e) {}
      bowlSourceRef.current = null;
    }
  };

  const resetAllAudio = () => {
    stopPreview();
    stopBowlSound();
    stopPlayer();
    resetRingAnimation();
    if (metronomeTimeoutRef.current) {
      clearTimeout(metronomeTimeoutRef.current);
      metronomeTimeoutRef.current = null;
    }
  };

  const toggleBell = () => {
    setSoundEnabled(!soundEnabled);
    triggerFeedback('bell');
  };

  const [showCompletion, setShowCompletion] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [startDelayEnabled, setStartDelayEnabled] = useState(() => {
    const saved = localStorage.getItem('startDelayEnabled');
    return saved !== 'false'; // default ON
  });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem('zenly_duration');
    return saved ? parseInt(saved) : 300;
  }); // in seconds
  const [isCustomDurationMode, setIsCustomDurationMode] = useState(false);
  const [isDurationPickerOpen, setIsDurationPickerOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(5);
  const [customSeconds, setCustomSeconds] = useState(0);
  const durationPickerRef = useRef<HTMLDivElement>(null);
  const [ringGradient, setRingGradient] = useState(THEMES.Rainbow);
  const [chartColor, setChartColor] = useState(() => {
    return localStorage.getItem('zenly_chartColor') || '#6dd9a0';
  });
  const [endBellEnabled, setEndBellEnabled] = useState(() => {
    const saved = localStorage.getItem('zenly_endBellEnabled');
    return saved !== 'false'; // default ON
  });

  const toggleEndBell = () => {
    const nextState = !endBellEnabled;
    setEndBellEnabled(nextState);
    localStorage.setItem('zenly_endBellEnabled', nextState.toString());
    triggerFeedback('endBell');
  };

  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      triggerFeedback(null, false, 'Browser does not support notifications');
      return;
    }

    if (!notificationsEnabled) {
      if (Notification.permission === 'denied') {
        triggerFeedback(null, false, t.notificationPermissionDenied + '. Sblocca le notifiche nelle impostazioni del browser.');
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          localStorage.setItem('zenly_notificationsEnabled', 'true');
          triggerFeedback('notifications');
        } else {
          triggerFeedback(null, false, t.notificationPermissionDenied);
        }
      } catch (error) {
        console.error("Notification permission error:", error);
        triggerFeedback(null, false, 'Errore richiesta permesso. Prova ad aprire l\'app in una nuova scheda.');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('zenly_notificationsEnabled', 'false');
      triggerFeedback('notifications');
    }
  };
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };
  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const bowlAudioRef = useRef<HTMLAudioElement | null>(null);
  const bowlSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const metronomeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const leftBtnRef = useRef<HTMLButtonElement>(null);
  const rightBtnRef = useRef<HTMLButtonElement>(null);

  const [activeInfoPage, setActiveInfoPage] = useState<string | null>(null);
  const [lastChangedSetting, setLastChangedSetting] = useState<string | null>(null);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('Modifiche salvate');
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isRingTouching, setIsRingTouching] = useState(false);
  const ringFeedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const triggerRingFeedback = () => {
    if (ringFeedbackTimeoutRef.current) clearTimeout(ringFeedbackTimeoutRef.current);
    setIsRingTouching(true);
    ringFeedbackTimeoutRef.current = setTimeout(() => setIsRingTouching(false), 500);
  };

  const playTickSound = async () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = getMasterCtx();
      if (audioCtx.state === 'suspended') await audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      console.warn('Could not play tick sound', e);
    }
  };

  const triggerFeedback = (settingId: string | null = null, playSound = false, message = 'Modifiche salvate') => {
    if (settingId) setLastChangedSetting(settingId);
    setFeedbackMessage(message);
    setShowSavedFeedback(true);
    
    if (playSound && soundEnabled) {
      // Play a subtle synthetic tick sound instead of a bell for UI feedback
      playTickSound();
    }

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    
    feedbackTimeoutRef.current = setTimeout(() => {
      setLastChangedSetting(null);
      setShowSavedFeedback(false);
    }, 2000);
  };

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const isLight = theme === 'light';
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('zenly_language') as Language) || 'it');
  const t = translations[language];

  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkNotification = () => {
      const now = new Date();
      const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (currentHourMin === reminderTime) {
        // Check if goal met
        const todayStr = formatDayKey(now);
        const todayMinutes = dailyMinutes[todayStr] || 0;
        
        if (todayMinutes < dailyGoal) {
          if (Notification.permission === 'granted') {
            // Check if we already notified today at this time to avoid multiple notifications in the same minute
            const lastNotified = localStorage.getItem('zenly_lastNotifiedDate');
            if (lastNotified !== todayStr) {
              new Notification(t.notificationTitle, {
                body: t.notificationBody,
                icon: '/favicon.ico'
              });
              localStorage.setItem('zenly_lastNotifiedDate', todayStr);
            }
          }
        }
      }
    };

    const interval = setInterval(checkNotification, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [notificationsEnabled, reminderTime, dailyGoal, dailyMinutes, t]);

  const handleAudioError = (err: any) => {
    console.warn("Audio play blocked or failed:", err);
    // If it's an autoplay policy error, we don't want to show a scary error to the user
    // but rather a helpful hint.
    if (err.name === 'NotAllowedError' || err.message?.includes('not allowed')) {
      setAudioError(t.tapToEnableAudio);
    } else {
      setAudioError(t.browserAudioError);
    }
  };

  const loadAndPlayTrack = useCallback((index: number) => {
    const audio = playerAudioRef.current;
    if (!audio) return;

    const track = allTracksRef.current[index];
    if (!track) {
      console.warn("Track not found at index:", index);
      return;
    }

    // If clicking the same track, toggle play/pause instead of reloading
    if (currentTrackIndexRef.current === index && audio.src.includes(track.url)) {
      if (audio.paused) {
        audio.play().catch(handleAudioError);
        setPlayerPlaying(true);
      } else {
        audio.pause();
        setPlayerPlaying(false);
      }
      return;
    }

    setCurrentTrackIndex(index);
    setIsPlayerLoading(true);
    setAudioError(null); // Clear any previous errors
    
    // Update track category in UI
    const catEl = document.getElementById('playerTrackCat');
    if (catEl) catEl.textContent = track.category;

    try {
      audio.pause();
      audio.src = track.url;
      audio.load();
      audio.volume = playerVolumeRef.current / 100;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setPlayerPlaying(true);
          setIsPlayerLoading(false);
        }).catch((err) => {
          setIsPlayerLoading(false);
          if (err.name === 'AbortError') {
             console.log("Audio play aborted (likely new track selected)");
             return;
          }
          handleAudioError(err);
        });
      }
    } catch (err) {
      setIsPlayerLoading(false);
      handleAudioError(err);
    }
  }, []);

  // Initialize player audio once
  useEffect(() => {
    const audio = new Audio();
    playerAudioRef.current = audio;

    const onPlaying = () => setIsPlayerLoading(false);
    const onWaiting = () => setIsPlayerLoading(true);
    const onCanPlay = () => setIsPlayerLoading(false);
    const onTimeUpdate = () => setPlayerCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setPlayerDuration(audio.duration);
    const onEnded = () => {
      console.log('Track ended, playing next track');
      if (isLoopingRef.current) {
        audio.currentTime = 0;
        audio.play().catch((err) => {
          if (err.name === 'AbortError') return;
          handleAudioError(err);
        });
      } else {
        const currentTracks = showOnlyFavoritesRef.current 
          ? allTracksRef.current.filter(t => favoritesRef.current.includes(t.id))
          : allTracksRef.current;
        
        if (currentTracks.length === 0) {
          setPlayerPlaying(false);
          return;
        }

        const currentTrackId = allTracksRef.current[currentTrackIndexRef.current]?.id;
        const currentIndexInFiltered = currentTracks.findIndex(t => t.id === currentTrackId);
        
        let nextIndexInFiltered = (currentIndexInFiltered + 1) % currentTracks.length;
        
        if (isShuffleRef.current && currentTracks.length > 1) {
          do {
            nextIndexInFiltered = Math.floor(Math.random() * currentTracks.length);
          } while (nextIndexInFiltered === currentIndexInFiltered);
        }
        
        const nextTrack = currentTracks[nextIndexInFiltered];
        const nextGlobalIndex = allTracksRef.current.findIndex(t => t.id === nextTrack.id);
        
        if (nextGlobalIndex !== -1) {
          loadAndPlayTrack(nextGlobalIndex);
        } else {
          setPlayerPlaying(false);
        }
      }
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      playerAudioRef.current = null;
    };
  }, [loadAndPlayTrack]);

  // Auth State
  const [user, setUser] = useState<any>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showVerificationScreen, setShowVerificationScreen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const savedUserRef = useRef<any>(null);
  const lastUidRef = useRef<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [selectedAdminUser, setSelectedAdminUser] = useState<any>(null);
  const [adminUserSessions, setAdminUserSessions] = useState<any[]>([]);
  const [adminUserSessionsLoading, setAdminUserSessionsLoading] = useState(false);
  const [moodsLoading, setMoodsLoading] = useState(false);

  useEffect(() => {
    const articlesRef = collection(db, 'articles');
    let q;
    if (isAdmin) {
      q = query(articlesRef);
    } else {
      q = query(articlesRef, where('status', '==', 'published'));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      articlesList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setArticles(articlesList);
    }, (error) => {
      console.error("Firestore articles error:", error);
    });

    const tracksRef = collection(db, 'tracks');
    const unsubscribeTracks = onSnapshot(tracksRef, (snapshot) => {
      const tracksList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      tracksList.sort((a, b) => (a.order || 0) - (b.order || 0));
      setCustomTracks(tracksList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tracks');
    });

    let unsubscribeMoods = () => {};
    if (user) {
      setMoodsLoading(true);
      const sessionsRef = collection(db, 'sessions');
      // Query sessions for the user and filter for those with mood in memory
      const qMoods = query(
        sessionsRef, 
        where('userId', '==', user.uid), 
        orderBy('createdAt', 'desc')
      );
      unsubscribeMoods = onSnapshot(qMoods, (snapshot) => {
        const moodsList = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as any))
          .filter(doc => doc.mood !== undefined) as Mood[];
        setMoods(moodsList);
        setMoodsLoading(false);
      }, (error) => {
        console.error("Firestore sessions mood error:", error);
        setMoodsLoading(false);
      });
    }

    return () => {
      unsubscribe();
      unsubscribeTracks();
      unsubscribeMoods();
    };
  }, [isAdmin, user]);


  const formatDateIT = (dateInput: any) => {
    if (!dateInput) return '—';
    let date;
    if (dateInput.seconds) {
      date = new Date(dateInput.seconds * 1000);
    } else {
      date = new Date(dateInput);
    }
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleUserClick = async (u: any) => {
    setSelectedAdminUser(u);
    setAdminUserSessionsLoading(true);
    try {
      const sessionsRef = collection(db, 'sessions');
      const q = query(sessionsRef, where('userId', '==', u.uid), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const sessionsList = querySnapshot.docs.map(doc => doc.data()).slice(0, 10);
      setAdminUserSessions(sessionsList);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
    } finally {
      setAdminUserSessionsLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Data registrazione', 'Ultimo accesso', 'Sessioni totali', 'Minuti totali'];
    const rows = adminUsers.map(u => [
      `"${u.displayName || 'Utente'}"`,
      `"${u.email || ''}"`,
      `"${formatDateIT(u.createdAt)}"`,
      `"${formatDateIT(u.lastLogin)}"`,
      u.sessions || 0,
      u.totalMinutes || 0
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'utenti-bodhio.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchAdminData = async () => {
    setAdminLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      setAdminUsers(usersList);

      const articlesRef = collection(db, 'articles');
      const articlesSnapshot = await getDocs(articlesRef);
      const articlesList = articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      articlesList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setArticles(articlesList);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setAdminLoading(false);
    }
  };

  const syncUserDataToCloud = async (newData: any = {}) => {
    if (!user || !isDataLoaded) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        sessions,
        totalMinutes: totalMin,
        totalSeconds,
        todayMin,
        todaySeconds,
        streak,
        unlockedBadges,
        maxSessionDuration,
        lateNightSessions,
        lastSessionDate,
        dailyMinutes,
        dailySeconds,
        soundMeditationMinutes,
        theme,
        soundEnabled,
        vibrationEnabled,
        startSound,
        endSound,
        ambientSound,
        dailyGoal,
        startDelayEnabled,
        duration,
        isCustomDurationMode,
        customMinutes,
        customSeconds,
        ringGradient,
        chartColor,
        endBellEnabled,
        notificationsEnabled,
        reminderTime,
        ...newData
      });
    } catch (error) {
      console.error('Error syncing data to cloud:', error);
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setSessions(0);
        setTotalMin(0);
        setTotalSeconds(0);
        setTodayMin(0);
        setTodaySeconds(0);
        setStreak(0);
        setUnlockedBadges([]);
        setSoundMeditationMinutes({});
        setDailyMinutes({});
        setDailySeconds({});
        setFavorites([]);
        setLastSessionDate(null);
        setMaxSessionDuration(0);
        setLateNightSessions(0);
        lastUidRef.current = null;
        setUser(null);
        setIsDataLoaded(false);
        return;
      }
      
      // Only reset if UID changed to avoid race conditions during token refreshes
      if (currentUser.uid !== lastUidRef.current) {
        setIsDataLoaded(false);

        setDailyMinutes({});
        setDailySeconds({});

        setSessions(0);
        setTotalMin(0);
        setTotalSeconds(0);
        setTodayMin(0);
        setTodaySeconds(0);
        setStreak(0);
        setUnlockedBadges([]);
        setSoundMeditationMinutes({});
        setFavorites([]);
        setLastSessionDate(null);
        setMaxSessionDuration(0);
        setLateNightSessions(0);

        lastUidRef.current = currentUser.uid;
      }

      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          // Set admin status to false initially
          setIsAdmin(false);
          
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            try {
              await setDoc(userRef, {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                sessions: 0,
                totalMinutes: 0,
                totalSeconds: 0,
                todayMin: 0,
                todaySeconds: 0,
                streak: 0,
                unlockedBadges: [],
                maxSessionDuration: 0,
                lateNightSessions: 0,
                lastSessionDate: null,
                dailyMinutes: {},
                dailySeconds: {},
                soundMeditationMinutes: {},
                theme: 'light',
                soundEnabled: true,
                vibrationEnabled: true,
                startSound: 'synthesized',
                endSound: 'synthesized',
                ambientSound: 'none',
                dailyGoal: 5,
                startDelayEnabled: true,
                duration: 300,
                isCustomDurationMode: false,
                customMinutes: 0,
                customSeconds: 0,
                ringGradient: 'Rainbow',
                chartColor: '#a855f7',
                endBellEnabled: true,
                notificationsEnabled: false,
                reminderTime: '08:00',
                createdAt: new Date(),
                lastLogin: new Date().toISOString()
              });
            } catch (error) {
              handleFirestoreError(error, OperationType.CREATE, `users/${currentUser.uid}`);
            }
            setIsAdmin(currentUser.email === 'torrespost@gmail.com' && currentUser.emailVerified);
            setIsDataLoaded(true);
          } else {
            const data = userSnap.data();
            // Re-evaluate admin status based on role or default admin email
            setIsAdmin(data.role === 'admin' || (currentUser.email === 'torrespost@gmail.com' && currentUser.emailVerified));
            const today = formatDayKey(new Date());
            if (data.sessions !== undefined) setSessions(data.sessions);
            
            // Load seconds-based stats if available, otherwise fallback and convert
            if (data.totalSeconds !== undefined) {
              setTotalSeconds(data.totalSeconds);
              setTotalMin(Math.floor(data.totalSeconds / 60));
            } else if (data.totalMinutes !== undefined) {
              const mins = Math.floor(Number(data.totalMinutes));
              setTotalMin(mins);
              setTotalSeconds(mins * 60);
            }

            if (data.todaySeconds !== undefined) {
              if (data.lastSessionDate === today) {
                setTodaySeconds(data.todaySeconds);
                setTodayMin(Math.floor(data.todaySeconds / 60));
              } else {
                setTodaySeconds(0);
                setTodayMin(0);
              }
            } else if (data.todayMin !== undefined) {
              if (data.lastSessionDate === today) {
                const mins = Math.floor(Number(data.todayMin));
                setTodayMin(mins);
                setTodaySeconds(mins * 60);
              } else {
                setTodayMin(0);
                setTodaySeconds(0);
              }
            }

            if (data.dailySeconds !== undefined) {
              setDailySeconds(data.dailySeconds);
              // Update dailyMinutes from dailySeconds for consistency
              const mins: Record<string, number> = {};
              Object.keys(data.dailySeconds).forEach(k => {
                mins[k] = Math.floor(data.dailySeconds[k] / 60);
              });
              setDailyMinutes(mins);
            } else if (data.dailyMinutes !== undefined) {
              const mins: Record<string, number> = {};
              const secs: Record<string, number> = {};
              Object.keys(data.dailyMinutes).forEach(k => {
                const m = Math.floor(Number(data.dailyMinutes[k]));
                mins[k] = m;
                secs[k] = m * 60;
              });
              setDailyMinutes(mins);
              setDailySeconds(secs);
            }

            if (data.streak !== undefined) setStreak(data.streak);
            if (data.unlockedBadges !== undefined) setUnlockedBadges(data.unlockedBadges);
            if (data.maxSessionDuration !== undefined) setMaxSessionDuration(data.maxSessionDuration);
            if (data.lateNightSessions !== undefined) setLateNightSessions(data.lateNightSessions);
            if (data.lastSessionDate !== undefined) setLastSessionDate(data.lastSessionDate);
            if (data.dailyMinutes !== undefined) setDailyMinutes(data.dailyMinutes);
            if (data.soundMeditationMinutes !== undefined) setSoundMeditationMinutes(data.soundMeditationMinutes);
            if (data.theme !== undefined) { setTheme(data.theme); localStorage.setItem('theme', data.theme); }
            if (data.soundEnabled !== undefined) setSoundEnabled(data.soundEnabled);
            if (data.vibrationEnabled !== undefined) setVibrationEnabled(data.vibrationEnabled);
            if (data.startSound !== undefined) setStartSound(data.startSound);
            if (data.endSound !== undefined) setEndSound(data.endSound);
            if (data.ambientSound !== undefined) setAmbientSound(data.ambientSound);
            if (data.dailyGoal !== undefined) setDailyGoal(data.dailyGoal);
            if (data.startDelayEnabled !== undefined) setStartDelayEnabled(data.startDelayEnabled);
            if (data.duration !== undefined) setDuration(data.duration);
            if (data.isCustomDurationMode !== undefined) setIsCustomDurationMode(data.isCustomDurationMode);
            if (data.customMinutes !== undefined) setCustomMinutes(data.customMinutes);
            if (data.customSeconds !== undefined) setCustomSeconds(data.customSeconds);
            if (data.ringGradient !== undefined) {
              setRingGradient(data.ringGradient);
            }
            if (data.chartColor !== undefined) setChartColor(data.chartColor);
            if (data.endBellEnabled !== undefined) setEndBellEnabled(data.endBellEnabled);
            if (data.notificationsEnabled !== undefined) setNotificationsEnabled(data.notificationsEnabled);
            if (data.reminderTime !== undefined) setReminderTime(data.reminderTime);
            
            // Update last login
            try {
              await updateDoc(userRef, { lastLogin: new Date().toISOString() });
            } catch (error) {
              console.error("Error updating last login:", error);
            }
            
            setIsDataLoaded(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
          setIsDataLoaded(true); // Proceed anyway to allow local usage
        }
      } else {
        setIsAdmin(false);
        setIsDataLoaded(false);
        // Reset state variables to initial values
        setSessions(0);
        setTotalMin(0);
        setTodayMin(0);
        setStreak(1);
        setUnlockedBadges([]);
        setSoundMeditationMinutes({});
        setDailyMinutes({});
        setFavorites([]);
        setLastSessionDate(null);
      }
    });
    return () => unsubscribe();
  }, []); // Run only once on mount

  useEffect(() => {
    if (!user || !isDataLoaded) return;
    
    const timeoutId = setTimeout(() => {
      syncUserDataToCloud();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [
    sessions, totalMin, todayMin, streak, unlockedBadges, maxSessionDuration, lateNightSessions, lastSessionDate, dailyMinutes,
    theme, soundEnabled, vibrationEnabled, startSound, endSound, ambientSound, dailyGoal,
    startDelayEnabled, duration, isCustomDurationMode, customMinutes, customSeconds,
    ringGradient, chartColor, endBellEnabled
  ]);

  // Sync today's stats for consistency between different views (Objective vs Heatmap)
  useEffect(() => {
    if (!isDataLoaded) return;
    const todayStr = formatDayKey(new Date());
    
    // Sync todaySeconds and dailySeconds[today]
    const currentDailySecs = dailySeconds[todayStr] || 0;
    if (currentDailySecs !== todaySeconds) {
      const maxSecs = Math.max(todaySeconds, currentDailySecs);
      setTodaySeconds(maxSecs);
      setDailySeconds(prev => ({ ...prev, [todayStr]: maxSecs }));
    }

    // Sync todayMin and dailyMinutes[today] with todaySeconds
    const expectedTodayMin = Math.floor(todaySeconds / 60);
    if (todayMin !== expectedTodayMin) {
      setTodayMin(expectedTodayMin);
    }
    if (dailyMinutes[todayStr] !== expectedTodayMin) {
      setDailyMinutes(prev => ({
        ...prev,
        [todayStr]: expectedTodayMin
      }));
    }
  }, [todaySeconds, dailySeconds, todayMin, dailyMinutes, isDataLoaded]);

  // Local storage persistence for user data
  useEffect(() => {
    localStorage.setItem('zenly_sessions', sessions.toString());
    localStorage.setItem('zenly_totalMin', totalMin.toString());
    localStorage.setItem('zenly_totalSeconds', totalSeconds.toString());
    localStorage.setItem('zenly_todayMin', todayMin.toString());
    localStorage.setItem('zenly_todaySeconds', todaySeconds.toString());
    localStorage.setItem('zenly_streak', streak.toString());
    localStorage.setItem('zenly_maxSessionDuration', maxSessionDuration.toString());
    localStorage.setItem('zenly_lateNightSessions', lateNightSessions.toString());
    if (lastSessionDate) localStorage.setItem('zenly_lastSessionDate', lastSessionDate);
    localStorage.setItem('zenly_dailyMinutes', JSON.stringify(dailyMinutes));
    localStorage.setItem('zenly_dailySeconds', JSON.stringify(dailySeconds));
  }, [sessions, totalMin, totalSeconds, todayMin, todaySeconds, streak, maxSessionDuration, lateNightSessions, lastSessionDate, dailyMinutes, dailySeconds]);

  const handleResetData = async () => {
    // Reset local state
    setTotalMin(0);
    setTotalSeconds(0);
    setSessions(0);
    setStreak(0);
    setTodayMin(0);
    setTodaySeconds(0);
    setMaxSessionDuration(0);
    setLateNightSessions(0);
    setLastSessionDate(null);
    setDailyMinutes({});
    setDailySeconds({});
    setUnlockedBadges([]);
    setSoundMeditationMinutes({});

    // Reset localStorage
    localStorage.removeItem('zenly_totalMin');
    localStorage.removeItem('zenly_totalSeconds');
    localStorage.removeItem('zenly_sessions');
    localStorage.removeItem('zenly_streak');
    localStorage.removeItem('zenly_todayMin');
    localStorage.removeItem('zenly_todaySeconds');
    localStorage.removeItem('zenly_maxSessionDuration');
    localStorage.removeItem('zenly_lateNightSessions');
    localStorage.removeItem('zenly_lastSessionDate');
    localStorage.removeItem('zenly_dailyMinutes');
    localStorage.removeItem('zenly_dailySeconds');
    localStorage.removeItem('zenly_unlockedBadges');
    localStorage.removeItem('zenly_soundMeditationMinutes');
    localStorage.removeItem('zenly_maxSessionDuration');
    localStorage.removeItem('zenly_lateNightSessions');
    localStorage.removeItem('zenly_lastSessionDate');
    localStorage.removeItem('zenly_dailyMinutes');
    localStorage.removeItem('zenly_unlockedBadges');
    localStorage.removeItem('zenly_soundMeditationMinutes');

    // Sync to cloud if logged in
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          totalMinutes: 0,
          sessions: 0,
          streak: 0,
          todayMin: 0,
          maxSessionDuration: 0,
          lateNightSessions: 0,
          lastSessionDate: null,
          dailyMinutes: {},
          unlockedBadges: [],
          soundMeditationMinutes: {}
        }, { merge: true });
      } catch (error) {
        console.error("Error resetting data in cloud:", error);
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    }

    setShowResetConfirmModal(false);
    triggerFeedback('resetData', true, 'Dati azzerati');
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setLoginOpen(false);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // Ignore or show a friendly message
        setAuthError(null);
      } else {
        setAuthError(error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: authDisplayName });
        const user = userCredential.user;
        savedUserRef.current = user;
        await sendEmailVerification(user);
        await signOut(auth);
        setVerificationEmail(email);
        setShowVerificationScreen(true);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          await signOut(auth);
          setAuthError("Devi verificare la tua email prima di accedere. Controlla la tua casella.");
        } else {
          setLoginOpen(false);
        }
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear user-specific localStorage
      const keysToClear = [
        'unlockedBadges', 'zenly_favorites', 'zenly_dailyGoal', 'zenly_endBellEnabled',
        'theme', 'zenly_language', 'zenly_duration', 'zenly_chartColor',
        'zenly_soundEnabled', 'zenly_vibrationEnabled', 'zenly_startSound',
        'zenly_endSound', 'zenly_ambientSound', 'startDelayEnabled',
        'zenly_soundMeditationMinutes', 'zenly_ambientSoundUrl', 'zenly_selectedSound',
        'zenly_sessions', 'zenly_totalMin', 'zenly_totalSeconds', 'zenly_todayMin', 
        'zenly_todaySeconds', 'zenly_streak', 'zenly_maxSessionDuration', 
        'zenly_lateNightSessions', 'zenly_lastSessionDate', 'zenly_dailyMinutes',
        'zenly_dailySeconds'
      ];
      keysToClear.forEach(key => localStorage.removeItem(key));
      
      await signOut(auth);
      setLoginOpen(false);
      lastUidRef.current = null;
      // Reset state variables to initial values
      setSessions(0);
      setTotalMin(0);
      setTotalSeconds(0);
      setTodayMin(0);
      setTodaySeconds(0);
      setStreak(0);
      setUnlockedBadges([]);
      setSoundMeditationMinutes({});
      setDailyMinutes({});
      setDailySeconds({});
      setFavorites([]);
      setLastSessionDate(null);
      setMaxSessionDuration(0);
      setLateNightSessions(0);
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  };

  const THEME_COLORS = {
    dark: {
      '--bg-primary': '#0a0a0a',
      '--bg-secondary': '#111',
      '--bg-card': '#181818',
      '--bg-card-hover': '#1e1e1e',
      '--border-color': '#222',
      '--border-subtle': '#1a1a1a',
      '--text-primary': '#e8e4dc',
      '--text-secondary': '#888',
      '--text-muted': '#444',
      '--text-hint': '#333',
      '--accent': 'var(--accent-base)',
      '--accent-dark': 'color-mix(in srgb, var(--accent-base) 56%, black)',
      '--dock-bg': 'rgba(20,20,20,0.75)',
      '--dock-border': 'rgba(255,255,255,0.06)',
      '--menu-bg': 'rgba(16,16,16,0.95)',
      '--menu-border': 'rgba(255,255,255,0.07)',
      '--menu-hover': 'rgba(255,255,255,0.04)',
      '--player-left-bg': '#080808',
      '--section-label': '#444',
      '--close-btn-bg': '#e8e4dc',
      '--close-btn-text': '#0a0a0a',
      '--topbar-bg': '#0a0a0a',
      '--progress-track': '#1e1e1e',
      '--modal-bg': '#1a1a1a',
      '--input-bg': 'rgba(255,255,255,0.05)',
    },
    light: {
      '--bg-primary': '#f5f4f0',
      '--bg-secondary': '#eeede8',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#f8f7f3',
      '--border-color': '#d0ceca',
      '--border-subtle': '#e0ded8',
      '--text-primary': '#000000',
      '--text-secondary': '#333333',
      '--text-muted': '#555555',
      '--text-hint': '#777777',
      '--accent': 'color-mix(in srgb, var(--accent-base) 40%, black)',
      '--accent-dark': 'color-mix(in srgb, var(--accent-base) 60%, black)',
      '--dock-bg': 'rgba(240,238,234,0.9)',
      '--dock-border': 'rgba(0,0,0,0.15)',
      '--menu-bg': 'rgba(250,249,246,0.98)',
      '--menu-border': 'rgba(0,0,0,0.12)',
      '--menu-hover': 'rgba(0,0,0,0.06)',
      '--player-left-bg': '#eeede8',
      '--section-label': '#666666',
      '--close-btn-bg': '#1a1a1a',
      '--close-btn-text': '#f5f4f0',
      '--topbar-bg': '#f5f4f0',
      '--progress-track': '#cccccc',
      '--modal-bg': '#ffffff',
      '--input-bg': 'rgba(0,0,0,0.08)',
    }
  };

  const applyTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    const vars = THEME_COLORS[newTheme as keyof typeof THEME_COLORS];
    const root = document.documentElement;

    // Apply all CSS variables to :root
    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    // Force body background and color immediately
    document.body.style.background = vars['--bg-primary'];
    document.body.style.color = vars['--text-primary'];

    // Force all pages background
    document.querySelectorAll('.page, #main-page, #panoramica-page, #settings-page, #player-page, .info-page, #page-admin, #page-insegnamenti, #page-aiuto, #page-missione, #page-contatti, #page-donazione').forEach(el => {
      (el as HTMLElement).style.background = vars['--bg-primary'];
      (el as HTMLElement).style.color = vars['--text-primary'];
    });

    // Info page headers
    document.querySelectorAll('.info-page-header, .sticky.top-0').forEach(el => {
      (el as HTMLElement).style.background = newTheme === 'light' 
        ? 'rgba(245,244,240,0.9)' 
        : 'rgba(10,10,10,0.9)';
      (el as HTMLElement).style.borderColor = vars['--border-color'];
    });

    // Hourglass SVG — dark in light mode
    document.querySelectorAll('svg [stroke="#e8e4dc"], svg [fill="#e8e4dc"]').forEach(el => {
      el.setAttribute(el.hasAttribute('stroke') ? 'stroke' : 'fill',
        newTheme === 'light' ? '#1a1a1a' : '#e8e4dc');
    });

    // Hourglass container
    const hourglass = document.querySelector('.hourglass-svg, #hourglassSvg, [class*="hourglass"]');
    if (hourglass) {
      (hourglass as HTMLElement).style.filter = newTheme === 'light'
        ? 'invert(1) brightness(0.15)'
        : 'none';
    }

    // Ring background fill (the dark interior of the ring)
    document.querySelectorAll('.ring-sharp, .ring-glow, .ring-bloom').forEach(el => {
      // Ring layers keep their colors but the mask background changes
      (el as HTMLElement).style.setProperty('--ring-bg', vars['--bg-primary']);
    });

    // Override the ring inner mask color
    const ringStyle = document.getElementById('ringMaskStyle') || (() => {
      const s = document.createElement('style');
      s.id = 'ringMaskStyle';
      document.head.appendChild(s);
      return s;
    })();
    ringStyle.textContent = theme === 'light' ? `
      .ring-container::before {
        content: '';
        position: absolute;
        inset: 3px;
        border-radius: 50%;
        background: ${vars['--bg-primary']};
        z-index: 0;
      }
      .ring-container > * { z-index: 1; }
    ` : `
      .ring-container::before { display: none; }
    `;

    // Timer display
    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) timerEl.style.color = vars['--text-primary'];

    // Phase label
    const phaseEl = document.getElementById('phaseLabel');
    if (phaseEl) phaseEl.style.color = vars['--text-muted'];

    // ZENLY header
    document.querySelectorAll('.zenly-header, [class*="zenly"]').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-primary'];
    });

    // Dock icons
    document.querySelectorAll('.dock-icon').forEach(el => {
      (el as HTMLElement).style.background = theme === 'light'
        ? 'rgba(0,0,0,0.06)'
        : 'rgba(255,255,255,0.06)';
      (el as HTMLElement).style.color = vars['--text-muted'];
    });
    document.querySelectorAll('.dock-icon svg').forEach(el => {
      (el as HTMLElement).style.stroke = vars['--text-muted'];
    });

    // Dock active item
    document.querySelectorAll('.dock-item.dock-active .dock-icon').forEach(el => {
      (el as HTMLElement).style.background = theme === 'light'
        ? 'rgba(0,0,0,0.1)'
        : 'rgba(255,255,255,0.1)';
      (el as HTMLElement).style.color = vars['--text-primary'];
    });

    // Dock label tooltips
    document.querySelectorAll('.dock-label').forEach(el => {
      (el as HTMLElement).style.background = theme === 'light' ? 'rgba(240,238,234,0.95)' : 'rgba(20,20,20,0.9)';
      (el as HTMLElement).style.color = vars['--text-primary'];
      (el as HTMLElement).style.borderColor = vars['--border-color'];
    });

    // Card nav items
    document.querySelectorAll('.card-nav-icon').forEach(el => {
      (el as HTMLElement).style.background = theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
      (el as HTMLElement).style.color = vars['--text-muted'];
    });
    document.querySelectorAll('.card-nav-sub').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
    });
    document.querySelectorAll('.card-nav-arrow').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
    });
    document.querySelectorAll('.card-nav-divider').forEach(el => {
      (el as HTMLElement).style.background = vars['--border-subtle'];
    });
    document.querySelectorAll('.card-nav-contact-link').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
      (el as HTMLElement).style.borderColor = vars['--border-subtle'];
    });

    // Sound carousel cards
    document.querySelectorAll('.sound-card').forEach(el => {
      (el as HTMLElement).style.background = vars['--bg-card'];
      (el as HTMLElement).style.borderColor = vars['--border-color'];
    });
    document.querySelectorAll('.sound-card.active').forEach(el => {
      (el as HTMLElement).style.background = vars['--accent-darkest'];
      (el as HTMLElement).style.borderColor = vars['--accent-dark'];
    });

    // Wave bars
    document.querySelectorAll('.wave-bar').forEach(el => {
      (el as HTMLElement).style.background = vars['--accent-dark'];
    });

    // Progress bars
    document.querySelectorAll('.player-progress-track, .heatmap-grid').forEach(el => {
      (el as HTMLElement).style.background = vars['--progress-track'];
    });

    // Chart bars
    document.querySelectorAll('.bar:not(.today)').forEach(el => {
      (el as HTMLElement).style.background = theme === 'light' ? '#ddd' : '#2a2a2a';
    });
    document.querySelectorAll('.bar.today').forEach(el => {
      (el as HTMLElement).style.background = vars['--text-primary'];
    });

    // Previsione card
    document.querySelectorAll('.previsione-card').forEach(el => {
      (el as HTMLElement).style.background = vars['--accent-darkest'];
      (el as HTMLElement).style.borderColor = vars['--accent-darker'];
    });
    document.querySelectorAll('.previsione-label').forEach(el => {
      (el as HTMLElement).style.color = vars['--accent-dark'];
    });
    document.querySelectorAll('.previsione-word').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-secondary'];
    });
    document.querySelectorAll('.previsione-number').forEach(el => {
      (el as HTMLElement).style.color = vars['--accent'];
    });

    // Completion overlay
    document.querySelectorAll('.completion-overlay, [id*="completion"], [id*="overlay"]').forEach(el => {
      (el as HTMLElement).style.background = vars['--bg-primary'];
    });

    // Info pages
    document.querySelectorAll('.info-page').forEach(el => {
      (el as HTMLElement).style.background = vars['--bg-primary'];
    });
    document.querySelectorAll('.info-body').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-secondary'];
    });

    // Player right panel
    const playerRight = document.querySelector('.player-right');
    if (playerRight) {
      (playerRight as HTMLElement).style.background = vars['--bg-primary'];
      (playerRight as HTMLElement).style.borderColor = vars['--border-subtle'];
    }
    const playlistHeader = document.querySelector('.player-playlist-header');
    if (playlistHeader) {
      (playlistHeader as HTMLElement).style.color = vars['--text-muted'];
      (playlistHeader as HTMLElement).style.borderColor = vars['--border-subtle'];
    }

    // Quick stat rows
    document.querySelectorAll('.quick-stat-row').forEach(el => {
      (el as HTMLElement).style.borderColor = vars['--border-subtle'];
    });
    document.querySelectorAll('.quick-stat-value').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-primary'];
    });

    // Month stat line
    document.querySelectorAll('.month-stat-line').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
      (el as HTMLElement).style.borderColor = vars['--border-subtle'];
    });

    // Calendario card title
    document.querySelectorAll('.calendario-card .card-title, .side-header').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-primary'];
    });

    // Section labels (TEMA, SESSIONE, SUONO etc)
    document.querySelectorAll('.section-label').forEach(el => {
      (el as HTMLElement).style.color = vars['--section-label'];
    });

    // Menu hamburger lines
    document.querySelectorAll('.menu-line').forEach(el => {
      (el as HTMLElement).style.background = vars['--text-muted'];
    });

    // Force all cards
    document.querySelectorAll('.setting-row, .stat-card, .stat-header-card, .chart-card, .calendario-card, .quick-stats-card, .progressione-card, .previsione-card, .sound-card, .track-row, .player-artwork').forEach(el => {
      (el as HTMLElement).style.background = vars['--bg-card'];
      (el as HTMLElement).style.borderColor = vars['--border-color'];
    });

    // Force text colors
    document.querySelectorAll('.setting-name, .track-row-name, .stat-label, .section-label, .track-category-label, .phase-label, .card-nav-contact-detail').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-secondary'];
    });

    document.querySelectorAll('.page-topbar-title, .stat-big-number, .timer-display, .zenly-header, .info-content h1, .player-now-name, .card-nav-title, .side-header').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-primary'];
    });

    document.querySelectorAll('.stat-sublabel, .text-muted, .quick-stat-label, .player-now-cat, .card-nav-sub, .month-day-label, .chart-dates span').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
    });

    // Force topbar backgrounds
    document.querySelectorAll('.page-topbar').forEach(el => {
      (el as HTMLElement).style.background = vars['--topbar-bg'];
    });

    // Dock
    const dock = document.getElementById('mainDock');
    if (dock) dock.style.background = vars['--dock-bg'];

    // Card nav
    const cardNav = document.getElementById('cardNav');
    if (cardNav) cardNav.style.background = vars['--menu-bg'];

    // ── MAIN PAGE ──

    // Main page background (sometimes not caught)
    const mainPage = document.getElementById('main-page');
    if (mainPage) mainPage.style.background = vars['--bg-primary'];

    // Hourglass SVG strokes and fills — force dark in light mode
    document.querySelectorAll('.hourglass-svg *, #hourglassSvg *, [class*="hourglass"] *').forEach(el => {
      if (el.hasAttribute('stroke') && el.getAttribute('stroke') !== 'none') {
        el.setAttribute('stroke', theme === 'light' ? '#1a1a1a' : '#e8e4dc');
      }
      if (el.hasAttribute('fill') && el.getAttribute('fill') !== 'none') {
        el.setAttribute('fill', theme === 'light' ? '#1a1a1a' : '#e8e4dc');
      }
    });

    // Sand inside hourglass (rect elements used for sand animation)
    document.querySelectorAll('.hourglass-svg rect, #hourglassSvg rect, [class*="hourglass"] rect').forEach(el => {
      el.setAttribute('fill', theme === 'light' ? '#2a2a2a' : '#e8e4dc');
    });

    // ── DOCK ──
    const dockEl = document.getElementById('mainDock');
    if (dockEl) {
      dockEl.style.background = vars['--dock-bg'];
      dockEl.style.borderColor = vars['--dock-border'];
    }
    document.querySelectorAll('.dock-item svg *').forEach(el => {
      if (el.hasAttribute('stroke')) el.setAttribute('stroke', vars['--text-muted']);
      if (el.hasAttribute('fill') && el.getAttribute('fill') !== 'none') {
        el.setAttribute('fill', vars['--text-muted']);
      }
    });
    document.querySelectorAll('.dock-item.dock-active svg *').forEach(el => {
      if (el.hasAttribute('stroke')) el.setAttribute('stroke', vars['--text-primary']);
      if (el.hasAttribute('fill') && el.getAttribute('fill') !== 'none') {
        el.setAttribute('fill', vars['--text-primary']);
      }
    });

    // ── SETTINGS PAGE ──
    const settingsPage = document.getElementById('settings-page');
    if (settingsPage) settingsPage.style.background = vars['--bg-primary'];

    // Setting rows border between them
    document.querySelectorAll('.settings-group .setting-row + .setting-row').forEach(el => {
      (el as HTMLElement).style.borderTopColor = vars['--border-subtle'];
    });

    // Color swatch borders
    document.querySelectorAll('.color-swatch').forEach(el => {
      (el as HTMLElement).style.outlineColor = vars['--border-color'];
    });

    // Sound card icons SVG
    document.querySelectorAll('.sound-card-icon svg *').forEach(el => {
      if (el.hasAttribute('stroke')) el.setAttribute('stroke', vars['--text-muted']);
    });
    document.querySelectorAll('.sound-card.active .sound-card-icon svg *').forEach(el => {
      if (el.hasAttribute('stroke')) el.setAttribute('stroke', vars['--accent']);
    });

    // Drum picker (duration selector)
    document.querySelectorAll('.drum-picker, .drum-track').forEach(el => {
      (el as HTMLElement).style.background = theme === 'light' ? '#eeede8' : '#222';
      (el as HTMLElement).style.borderColor = vars['--border-color'];
    });
    document.querySelectorAll('.drum-item').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
    });
    document.querySelectorAll('.drum-item.selected').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-primary'];
    });
    document.querySelectorAll('.drum-picker::before, .drum-picker::after').forEach(el => {
      (el as HTMLElement).style.background = vars['--border-color'];
    });

    // ── PANORAMICA PAGE ──
    const panoramicaPage = document.getElementById('panoramica-page');
    if (panoramicaPage) panoramicaPage.style.background = vars['--bg-primary'];

    // Chart tabs (Week Month Year)
    document.querySelectorAll('.chart-tab').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
      (el as HTMLElement).style.background = 'transparent';
    });
    document.querySelectorAll('.chart-tab.active').forEach(el => {
      (el as HTMLElement).style.background = theme === 'light' ? '#e0ded8' : '#2a2a2a';
      (el as HTMLElement).style.color = vars['--text-primary'];
      (el as HTMLElement).style.borderColor = vars['--border-color'];
    });

    // SVG text in progressione chart
    document.querySelectorAll('.progressione-svg text, #progressioneSvg text').forEach(el => {
      el.setAttribute('fill', vars['--text-muted']);
    });

    // SVG guide lines in progressione chart
    document.querySelectorAll('.progressione-svg line.guide, #progressioneSvg line').forEach(el => {
      el.setAttribute('stroke', vars['--border-subtle']);
    });

    // Stat card icons
    document.querySelectorAll('.stat-icon').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
    });

    // Quick stat icons
    document.querySelectorAll('.quick-stat-icon').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
    });

    // Calendar day circles with session data (colored ones — keep green, just adjust empty ones)
    document.querySelectorAll('.month-day.empty').forEach(el => {
      (el as HTMLElement).style.background = 'transparent';
      (el as HTMLElement).style.color = 'transparent';
    });
    document.querySelectorAll('.month-day:not([style*="background: #"])').forEach(el => {
      if (!el.classList.contains('empty')) {
        (el as HTMLElement).style.background = theme === 'light' ? '#e8e6e0' : '#1a1a1a';
        (el as HTMLElement).style.color = vars['--text-muted'];
      }
    });
    document.querySelectorAll('.month-day.today').forEach(el => {
      (el as HTMLElement).style.outlineColor = vars['--text-primary'];
      (el as HTMLElement).style.color = vars['--text-primary'];
    });

    // Month nav arrows
    document.querySelectorAll('.month-nav').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
      (el as HTMLElement).style.background = 'transparent';
      (el as HTMLElement).style.border = 'none';
    });
    const monthTitle = document.querySelector('#monthTitle') as HTMLElement;
    if (monthTitle) monthTitle.style.color = vars['--text-muted'];

    // ── PLAYER PAGE ──
    const playerPage = document.getElementById('player-page');
    if (playerPage) playerPage.style.background = vars['--bg-primary'];

    document.querySelectorAll('.track-category-label').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-hint'];
    });
    document.querySelectorAll('.track-row-number').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-hint'];
    });
    document.querySelectorAll('.track-row-duration').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
    });
    document.querySelectorAll('.player-artwork-icon svg *').forEach(el => {
      if (el.hasAttribute('stroke')) el.setAttribute('stroke', theme === 'light' ? '#bbb' : '#555');
    });
    document.querySelectorAll('.player-ctrl-btn svg *').forEach(el => {
      if (el.hasAttribute('stroke')) el.setAttribute('stroke', vars['--text-muted']);
    });
    const playBtn = document.getElementById('playPauseBtn');
    if (playBtn) {
      playBtn.style.background = vars['--close-btn-bg'];
      playBtn.style.color = vars['--close-btn-text'];
    }
    const volumeIcon = document.querySelector('.player-volume-icon') as HTMLElement;
    if (volumeIcon) volumeIcon.style.color = vars['--text-muted'];
    document.querySelectorAll('.player-time-row span').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
    });
    document.querySelectorAll('.player-volume-row svg *').forEach(el => {
      if (el.hasAttribute('stroke')) el.setAttribute('stroke', vars['--text-muted']);
    });

    // ── INFO PAGES (Missione, Contatti, Donazione) ──
    document.querySelectorAll('.info-page').forEach(el => {
      (el as HTMLElement).style.background = vars['--bg-primary'];
    });
    document.querySelectorAll('.info-page-header').forEach(el => {
      (el as HTMLElement).style.background = vars['--bg-primary'];
      (el as HTMLElement).style.borderColor = vars['--border-subtle'];
    });
    document.querySelectorAll('.info-back-btn').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
    });

    // ── COMPLETION OVERLAY ──
    document.querySelectorAll('[class*="overlay"], [id*="overlay"], [id*="completion"]').forEach(el => {
      if ((el as HTMLElement).style.display !== 'none') {
        (el as HTMLElement).style.background = vars['--bg-primary'];
      }
    });
    document.querySelectorAll('[class*="completion"] h1, [id*="completion"] h1').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-primary'];
    });
    document.querySelectorAll('[class*="stat-line"], [class*="completion"] p').forEach(el => {
      (el as HTMLElement).style.color = vars['--text-muted'];
    });

    // ── CARD NAV ──
    document.querySelectorAll('.card-nav').forEach(el => {
      (el as HTMLElement).style.background = vars['--menu-bg'];
      (el as HTMLElement).style.borderColor = vars['--menu-border'];
    });
    document.querySelectorAll('.card-nav-item:hover').forEach(el => {
      (el as HTMLElement).style.background = vars['--menu-hover'];
    });

    // ── INCREASE CONTRAST for low-visibility text ──
    // Make secondary text darker in light mode for better readability
    if (theme === 'light') {
      document.querySelectorAll('.setting-name').forEach(el => { (el as HTMLElement).style.color = '#000000'; });
      document.querySelectorAll('.stat-label').forEach(el => { (el as HTMLElement).style.color = '#444444'; });
      document.querySelectorAll('.phase-label').forEach(el => { (el as HTMLElement).style.color = '#444444'; });
      document.querySelectorAll('.track-row-name').forEach(el => { (el as HTMLElement).style.color = '#111111'; });
      document.querySelectorAll('.quick-stat-label').forEach(el => { (el as HTMLElement).style.color = '#333333'; });
      document.querySelectorAll('.card-nav-sub').forEach(el => { (el as HTMLElement).style.color = '#444444'; });
      document.querySelectorAll('.player-now-cat').forEach(el => { (el as HTMLElement).style.color = '#444444'; });
      document.querySelectorAll('.section-label').forEach(el => { (el as HTMLElement).style.color = '#555555'; });
      document.querySelectorAll('.month-day-label').forEach(el => { (el as HTMLElement).style.color = '#555555'; });
      document.querySelectorAll('.chart-dates span').forEach(el => { (el as HTMLElement).style.color = '#555555'; });
      
      // Dock icons
      document.querySelectorAll('.dock-icon').forEach(el => {
        (el as HTMLElement).style.background = 'rgba(0,0,0,0.08)';
        (el as HTMLElement).style.color = '#555555';
      });
      document.querySelectorAll('.dock-item.dock-active .dock-icon').forEach(el => {
        (el as HTMLElement).style.background = 'rgba(0,0,0,0.15)';
        (el as HTMLElement).style.color = '#000000';
      });
    } else {
      // Restore dark mode values
      document.querySelectorAll('.setting-name').forEach(el => { (el as HTMLElement).style.color = '#aaa'; });
      document.querySelectorAll('.stat-label').forEach(el => { (el as HTMLElement).style.color = '#555'; });
      document.querySelectorAll('.phase-label').forEach(el => { (el as HTMLElement).style.color = '#555'; });
      document.querySelectorAll('.track-row-name').forEach(el => { (el as HTMLElement).style.color = '#888'; });
      document.querySelectorAll('.quick-stat-label').forEach(el => { (el as HTMLElement).style.color = '#888'; });
      document.querySelectorAll('.card-nav-sub').forEach(el => { (el as HTMLElement).style.color = '#3a3a3a'; });
      document.querySelectorAll('.player-now-cat').forEach(el => { (el as HTMLElement).style.color = '#444'; });
      document.querySelectorAll('.section-label').forEach(el => { (el as HTMLElement).style.color = '#444'; });
      document.querySelectorAll('.month-day-label').forEach(el => { (el as HTMLElement).style.color = '#444'; });
      document.querySelectorAll('.chart-dates span').forEach(el => { (el as HTMLElement).style.color = '#444'; });
      
      // Dock icons
      document.querySelectorAll('.dock-icon').forEach(el => {
        (el as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
        (el as HTMLElement).style.color = '#666';
      });
      document.querySelectorAll('.dock-item.dock-active .dock-icon').forEach(el => {
        (el as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
        (el as HTMLElement).style.color = '#e8e4dc';
      });
    }

    // Menu button
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) menuBtn.style.background = vars['--dock-bg'];

    // Player left panel
    const playerLeft = document.querySelector('.player-left');
    if (playerLeft) (playerLeft as HTMLElement).style.background = vars['--player-left-bg'];

    // Close / Chiudi buttons
    document.querySelectorAll('.close-btn').forEach(el => {
      (el as HTMLElement).style.background = vars['--close-btn-bg'];
      (el as HTMLElement).style.color = vars['--close-btn-text'];
    });

    // Month days
    document.querySelectorAll('.month-day:not([style*="background: #"])').forEach(el => {
      (el as HTMLElement).style.background = vars['--bg-card'];
      (el as HTMLElement).style.color = vars['--text-hint'];
    });

    // Update toggle label
    const dot = document.getElementById('themeDot');
    const label = document.getElementById('themeLabel');
    if (dot) dot.style.background = vars['--accent-dark'];
    if (label) label.textContent = theme === 'light' ? t.light : t.dark;

    // Store theme on data attribute too (for CSS selectors)
    document.documentElement.setAttribute('data-theme', theme);
  };

  const toggleTheme = () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('zenly_language', language);
  }, [language]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (ringFeedbackTimeoutRef.current) clearTimeout(ringFeedbackTimeoutRef.current);
    };
  }, []);
  useEffect(() => {
    if (showSettings && initialSettings) {
      const changed = 
        theme !== initialSettings.theme ||
        ringGradient !== initialSettings.ringGradient ||
        chartColor !== initialSettings.chartColor ||
        endBellEnabled !== initialSettings.endBellEnabled ||
        startDelayEnabled !== initialSettings.startDelayEnabled ||
        soundEnabled !== initialSettings.soundEnabled ||
        vibrationEnabled !== initialSettings.vibrationEnabled ||
        startSound !== initialSettings.startSound ||
        endSound !== initialSettings.endSound ||
        ambientSound !== initialSettings.ambientSound;
      setHasUnsavedChanges(changed);
    }
  }, [theme, ringGradient, chartColor, endBellEnabled, startDelayEnabled, soundEnabled, vibrationEnabled, startSound, endSound, ambientSound, showSettings, initialSettings]);

  const [chartPeriod, setChartPeriod] = useState<'settimana' | 'mese' | 'anno'>('settimana');


  useEffect(() => {
    localStorage.setItem('zenly_duration', duration.toString());
  }, [duration]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    
    // Ensure menu is closed on load
    closeMenu();
    
    // Set ring to idle on load
    const ring = document.querySelector('.ring-container');
    if (ring) ring.classList.add('idle');

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateCarouselArrows = useCallback(() => {
    const carousel = carouselRef.current;
    const leftBtn = leftBtnRef.current;
    const rightBtn = rightBtnRef.current;
    if (!carousel || !leftBtn || !rightBtn) return;
    leftBtn.style.opacity = carousel.scrollLeft > 10 ? '1' : '0.3';
    leftBtn.style.pointerEvents = carousel.scrollLeft > 10 ? 'all' : 'none';
    const atEnd = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10;
    rightBtn.style.opacity = atEnd ? '0.3' : '1';
    rightBtn.style.pointerEvents = atEnd ? 'none' : 'all';
  }, []);

  useEffect(() => {
    if (showOverview) {
      // JS fix for mobile Panoramica page
      const grid = document.querySelector('.month-days-grid') as HTMLElement;
      if (grid) {
        grid.style.width = '100%';
      }
      // renderCalendar is handled by React state
      updateCarouselArrows();
    }
  }, [showOverview, updateCarouselArrows]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    let isDragging = false;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      isDragging = false;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      e.preventDefault();
    };

    const handleMouseLeave = () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      isDragging = true;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      carousel.scrollLeft += e.deltaY * 0.8;
    };

    const handleClick = (e: MouseEvent) => {
      if (isDragging) {
        e.stopPropagation();
        e.preventDefault();
        isDragging = false;
      }
    };

    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mousemove', handleMouseMove);
    carousel.addEventListener('wheel', handleWheel, { passive: false });
    carousel.addEventListener('click', handleClick, true);
    carousel.addEventListener('scroll', updateCarouselArrows);

    carousel.style.cursor = 'grab';
    updateCarouselArrows();

    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateCarouselArrows);
      resizeObserver.observe(carousel);
    }

    return () => {
      carousel.removeEventListener('mousedown', handleMouseDown);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('mouseup', handleMouseUp);
      carousel.removeEventListener('mousemove', handleMouseMove);
      carousel.removeEventListener('wheel', handleWheel);
      carousel.removeEventListener('click', handleClick, true);
      carousel.removeEventListener('scroll', updateCarouselArrows);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [showSettings, updateCarouselArrows]); // Re-run when settings page opens

  const scrollCarousel = (direction: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cardWidth = 110 + 10; // card width + gap
    carousel.scrollBy({
      left: direction * cardWidth * 2,
      behavior: 'smooth'
    });
  };

  const closeMenu = () => {
    setCardNavOpen(false);
    setContattiOpen(false);
  };

  const toggleCardNav = () => {
    if (cardNavOpen) {
      setContattiOpen(false);
    }
    setCardNavOpen(!cardNavOpen);
  };

  const toggleContattiExpand = () => {
    setContattiOpen(!contattiOpen);
  };

  const closeCardNavOutside = (e: MouseEvent) => {
    const wrapper = document.getElementById('navWrapper');
    if (wrapper && !wrapper.contains(e.target as Node)) {
      closeMenu();
    }
  };

  useEffect(() => {
    window.addEventListener('click', closeCardNavOutside as any);
    return () => window.removeEventListener('click', closeCardNavOutside as any);
  }, []);

  const navigateTo = (page: string) => {
    closeMenu();
    
    // Trigger page transition
    showPage(page);
  };

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const dockItems = dock.querySelectorAll('.dock-item');
    const BASE_SIZE = window.innerWidth < 768 ? 42 : 48;
    const MAX_SIZE = window.innerWidth < 768 ? 64 : 80;

    const resetDockSizes = () => {
      dockItems.forEach(item => {
        const icon = item.querySelector('.dock-icon') as HTMLElement;
        const svg = item.querySelector('svg') as any;
        (item as HTMLElement).style.width = BASE_SIZE + 'px';
        if (icon) {
          icon.style.width = BASE_SIZE + 'px';
          icon.style.height = BASE_SIZE + 'px';
          icon.style.borderRadius = Math.round(BASE_SIZE * 0.28) + 'px';
        }
        if (svg) {
          svg.style.width = '22px';
          svg.style.height = '22px';
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dockRect = dock.getBoundingClientRect();
      const mouseX = e.clientX - dockRect.left;

      dockItems.forEach((item) => {
        const icon = item.querySelector('.dock-icon') as HTMLElement;
        const svg = item.querySelector('svg') as any;
        if (!icon || !svg) return;

        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2 - dockRect.left;
        const distance = Math.abs(mouseX - itemCenter);
        const maxDist = 100; // px influence radius

        let scale;
        if (distance < maxDist) {
          scale = 1 + (1 - distance / maxDist) * ((MAX_SIZE - BASE_SIZE) / BASE_SIZE);
        } else {
          scale = 1;
        }

        const size = Math.round(BASE_SIZE * scale);
        (item as HTMLElement).style.width = size + 'px';
        icon.style.width = size + 'px';
        icon.style.height = size + 'px';
        icon.style.borderRadius = Math.round(size * 0.28) + 'px';

        const svgSize = Math.round(size * 0.45);
        svg.style.width = svgSize + 'px';
        svg.style.height = svgSize + 'px';
      });
    };

    const handleMouseLeave = () => {
      resetDockSizes();
    };

    dock.addEventListener('mousemove', handleMouseMove);
    dock.addEventListener('mouseleave', handleMouseLeave);

    // Touch support for mobile
    dockItems.forEach(item => {
      const handleTouchStart = () => {
        const icon = item.querySelector('.dock-icon') as HTMLElement;
        if (icon) {
          icon.style.background = 'rgba(255,255,255,0.12)';
          setTimeout(() => {
            icon.style.background = '';
          }, 200);
        }
      };
      item.addEventListener('touchstart', handleTouchStart);
    });

    resetDockSizes();
    updateDockActive('main');

    return () => {
      dock.removeEventListener('mousemove', handleMouseMove);
      dock.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showPlayer, showOverview, showSettings, activeInfoPage]);

  const updateDockActive = (pageId: string) => {
    const dock = dockRef.current;
    if (!dock) return;
    const dockItems = dock.querySelectorAll('.dock-item');
    dockItems.forEach(item => item.classList.remove('dock-active'));
    const map: Record<string, string> = {
      'main': 'dockTimer',
      'overview': 'dockPanoramica',
      'settings': 'dockImpostazioni',
      'player': 'dockPlayer'
    };
    const activeId = map[pageId];
    if (activeId) {
      const activeItem = dock.querySelector(`#${activeId}`);
      if (activeItem) activeItem.classList.add('dock-active');
    }
  };

  const showPage = (page: string) => {
    if (showSettings && hasUnsavedChanges && page !== 'settings') {
      setPendingPage(page);
      setShowUnsavedModal(true);
      return;
    }
    executeShowPage(page);
  };

  const executeShowPage = (page: string) => {
    setHasUnsavedChanges(false);

    if (page === 'insegnamenti') {
      setCategoryFilter('Tutto');
    }

    if (showPlayer && page !== 'player') {
      stopPlayer();
    }
    
    // Close menu if open
    closeMenu();

    // Reset all pages
    setShowPlayer(false);
    setShowOverview(false);
    setShowSettings(false);
    setActiveInfoPage(null);

    if (page === 'player') {
      setShowPlayer(true);
    }

    if (page === 'overview') setShowOverview(true);
    else if (page === 'settings') {
      setInitialSettings({
        theme,
        ringGradient,
        chartColor,
        endBellEnabled,
        startDelayEnabled,
        soundEnabled,
        vibrationEnabled,
        startSound,
        endSound,
        ambientSound
      });
      setShowSettings(true);
    }
    else if (page === 'main') { /* main is default when all are false */ }
    else if (page !== 'player') {
      // Info pages from menu
      setActiveInfoPage(page);
    }

    // Update dock active state
    setTimeout(() => updateDockActive(page), 0);
    setTimeout(() => applyTheme(theme), 50);
  };


  // Dynamic progression data
  const generateChartData = () => {
    const today = new Date();
    const todayStr = formatDayKey(today);
    
    // Weekly
    const weekly = [];
    const daysOfWeek = t.days;
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = formatDayKey(d);
      const realTimeSeconds = (dateStr === todayStr && sessionActive) ? elapsed : 0;
      const totalSecondsForDay = (dailySeconds[dateStr] || 0) + realTimeSeconds;
      weekly.push({ name: daysOfWeek[d.getDay()], min: Math.floor(totalSecondsForDay / 60) });
    }

    // Monthly (last 4 weeks)
    const monthly = [];
    const weekLabels = t.weeks;
    for (let i = 3; i >= 0; i--) {
      let weekTotalSeconds = 0;
      for (let j = 0; j < 7; j++) {
        const d = new Date(today);
        d.setDate(today.getDate() - (i * 7 + j));
        const dateStr = formatDayKey(d);
        const realTimeSeconds = (dateStr === todayStr && sessionActive) ? elapsed : 0;
        weekTotalSeconds += (dailySeconds[dateStr] || 0) + realTimeSeconds;
      }
      monthly.push({ name: weekLabels[3 - i], min: Math.floor(weekTotalSeconds / 60) });
    }

    // Yearly (last 12 months)
    const yearly = [];
    const monthsOfYear = t.months;
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthIndex = d.getMonth();
      const year = d.getFullYear();
      
      let monthTotalSeconds = 0;
      Object.entries(dailySeconds).forEach(([dateStr, seconds]) => {
        const date = new Date(dateStr);
        if (date.getMonth() === monthIndex && date.getFullYear() === year) {
          monthTotalSeconds += Number(seconds);
        }
      });
      
      // Add real-time seconds if session is active today and today is in this month
      if (sessionActive && today.getMonth() === monthIndex && today.getFullYear() === year) {
        monthTotalSeconds += elapsed;
      }
      
      yearly.push({ name: monthsOfYear[monthIndex], min: Math.floor(monthTotalSeconds / 60) });
    }

    return { weekly, monthly, yearly };
  };

  const { weekly: chartDataWeekly, monthly: chartDataMonthly, yearly: chartDataYearly } = useMemo(generateChartData, [dailySeconds, sessionActive, elapsed]);

  const weeklyAverage = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return formatDayKey(d);
    });
    const sumSeconds = last7Days.reduce((acc, date) => acc + (dailySeconds[date] || 0), 0);
    const realTimeSeconds = sessionActive ? elapsed : 0;
    return Math.round((sumSeconds + realTimeSeconds) / (7 * 60));
  }, [dailySeconds, sessionActive, elapsed]);

  const yearlyPrediction = useMemo(() => {
    const dates = Object.keys(dailySeconds);
    if (dates.length === 0) return 0;
    const currentTotalSeconds = totalSeconds + (sessionActive ? elapsed : 0);
    const avgSecondsPerDay = currentTotalSeconds / dates.length;
    return Math.round((avgSecondsPerDay * 365) / 3600);
  }, [totalSeconds, dailySeconds, sessionActive, elapsed]);

  const currentChartData = chartPeriod === 'settimana' ? chartDataWeekly : chartPeriod === 'mese' ? chartDataMonthly : chartDataYearly;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-[#333] px-3 py-2 rounded-lg shadow-xl">
          <p className="text-[#888] text-[10px] uppercase tracking-wider mb-1">{label}</p>
          <p className="font-medium text-[14px]" style={{ color: chartColor }}>{`${payload[0].value} ${t.min}`}</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    localStorage.setItem('zenly_chartColor', chartColor);
    document.documentElement.style.setProperty('--accent-base', chartColor);
  }, [chartColor]);

  useEffect(() => {
    localStorage.setItem('zenly_soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('zenly_vibrationEnabled', JSON.stringify(vibrationEnabled));
  }, [vibrationEnabled]);

  useEffect(() => {
    localStorage.setItem('zenly_startSound', startSound);
  }, [startSound]);

  useEffect(() => {
    localStorage.setItem('zenly_endSound', endSound);
  }, [endSound]);

  useEffect(() => {
    localStorage.setItem('zenly_ambientSound', ambientSound);
  }, [ambientSound]);

  useEffect(() => {
    if (showSettings) {
      AMBIENT_SOUNDS.forEach(sound => {
        if (sound.url) preloadBellBuffer(sound.url);
      });
    }
  }, [showSettings]);

  useEffect(() => {
    if (!showSettings) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current.currentTime = 0;
      }
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    }
  }, [showSettings]);

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current.currentTime = 0;
      }
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleLoadError = () => {
      setAudioError(t.audioLoadError);
    };

    return () => {
    };
  }, []);

  useEffect(() => {
    if (audioError) {
      const timer = setTimeout(() => setAudioError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [audioError]);


  const previewSound = async (soundUrl: string) => {
    stopPreview();
    if (!soundUrl) return;

    const audioCtx = getMasterCtx();
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    if (soundUrl !== 'synthesized') {
      const buffer = bellBufferCache.get(soundUrl);
      if (buffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        const gain = audioCtx.createGain();
        gain.gain.value = 0.6;
        source.connect(gain);
        gain.connect(audioCtx.destination);
        source.start(0);
        
        (window as any)._currentPreviewSource = source;
        (window as any)._currentPreviewGain = gain;

        previewTimeoutRef.current = setTimeout(() => stopPreview(), 6000);
      } else {
        const audio = new Audio(soundUrl);
        previewAudioRef.current = audio;
        audio.volume = 0.6;
        audio.play().catch((err) => {
          if (err.name === 'AbortError') return;
          handleAudioError(err);
        });
        
        previewTimeoutRef.current = setTimeout(() => stopPreview(), 6000);
        preloadBellBuffer(soundUrl);
      }
    } else {
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(428, audioCtx.currentTime + 4);
      gain1.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 4);
      
      (window as any)._currentPreviewSource = osc1;
      (window as any)._currentPreviewGain = gain1;
    }
  };

  const toggleDurationPicker = () => {
    const currentScrollY = window.scrollY;
    setIsDurationPickerOpen(!isDurationPickerOpen);
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY);
    });
  };

  const toggleStartDelay = () => {
    const newVal = !startDelayEnabled;
    setStartDelayEnabled(newVal);
    localStorage.setItem('startDelayEnabled', String(newVal));
    triggerFeedback('startDelay');
  };

  const beginSession = async () => {
    // Ensure AudioContext is resumed for mobile
    const ctx = getMasterCtx();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Start timer
    setElapsed(0);
    setSessionActive(true);
    setIsDelaying(false);
    setCountdown(null);

    // Speed up ring
    const ringContainer = document.querySelector('.ring-container');
    if (ringContainer) {
      ringContainer.classList.remove('idle');
      ringContainer.classList.add('active');
    }

    // Play starting bell strike
    await playBowlSound(startSound);
  };

  const handleMoodSelect = async (level: number, note: string) => {
    if (!user || !lastSessionId) {
      // If no user or session ID, we can't save to Firestore, but we must still close the completion screen
      setTimeout(() => {
        setShowCompletion(false);
        setElapsed(0);
        setLastSessionId(null);
      }, 800);
      return;
    }
    try {
      await updateDoc(doc(db, 'sessions', lastSessionId), {
        mood: level,
        note: note || null
      });
      triggerFeedback(null, true, t.moodSaved);
      // Wait a bit then close completion screen
      setTimeout(() => {
        setShowCompletion(false);
        setElapsed(0);
        setLastSessionId(null);
      }, 1500);
    } catch (error) {
      console.error("Error saving mood:", error);
      handleFirestoreError(error, OperationType.UPDATE, 'sessions');
      // Still close the screen on error so the user isn't stuck
      setTimeout(() => {
        setShowCompletion(false);
        setElapsed(0);
        setLastSessionId(null);
      }, 1500);
    }
  };

  const endSession = async (actualDuration: number, playEndSound: boolean = true) => {
    // 1. Reset timer state immediately to prevent double counting in UI
    setSessionActive(false);
    setIsDelaying(false);
    setElapsed(0);
    setCountdown(null);

    // Ensure AudioContext is resumed for mobile
    const ctx = getMasterCtx();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Use integer minutes for display and stats
    const minutes = Math.floor(actualDuration / 60);
    const completedSeconds = minutes * 60;

    setLastSessionDuration(actualDuration);
    setSessions(prev => prev + 1);
    
    const todayStr = formatDayKey(new Date());
    
    setTotalSeconds(prev => {
      const newVal = prev + completedSeconds;
      setTotalMin(Math.floor(newVal / 60));
      return newVal;
    });
    
    setTodaySeconds(prev => {
      const newVal = prev + completedSeconds;
      setTodayMin(Math.floor(newVal / 60));
      return newVal;
    });
    
    // Update max session duration (in minutes)
    setMaxSessionDuration(prev => Math.max(prev, minutes));
    
    // Update late night sessions (after 10 PM)
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour < 4) {
      setLateNightSessions(prev => prev + 1);
    }
 
    // Update streak logic
    setLastSessionDate(prevDate => {
      if (!prevDate) {
        setStreak(1);
      } else if (prevDate !== todayStr) {
        const prev = new Date(prevDate);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today.getTime() - prev.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays === 1) {
          setStreak(s => s + 1);
        } else if (diffDays > 1) {
          setStreak(1);
        }
      }
      return todayStr;
    });

    // Update daily seconds and minutes (integer)
    setDailySeconds(prev => {
      const newVal = (prev[todayStr] || 0) + completedSeconds;
      const newDailySeconds = { ...prev, [todayStr]: newVal };
      localStorage.setItem('zenly_dailySeconds', JSON.stringify(newDailySeconds));
      
      // Also update dailyMinutes for consistency
      setDailyMinutes(prevMin => ({
        ...prevMin,
        [todayStr]: Math.floor(newVal / 60)
      }));
      
      return newDailySeconds;
    });

    setSoundMeditationMinutes(prev => {
      const newMinutes = { ...prev, [ambientSound]: Math.floor((prev[ambientSound] || 0) + minutes) };
      localStorage.setItem('zenly_soundMeditationMinutes', JSON.stringify(newMinutes));
      return newMinutes;
    });

    // Reset ring animation with a completion burst
    const ring = document.querySelector('.ring-container');
    if (ring) {
      ring.classList.remove('active');
      ring.classList.add('ring-complete');
      setTimeout(() => {
        ring.classList.remove('ring-complete');
        ring.classList.add('idle');
      }, 1000);
    }

    if (user) {
      try {
        const docRef = await addDoc(collection(db, 'sessions'), {
          userId: user.uid,
          date: new Date().toISOString(),
          duration: actualDuration,
          type: isCustomDurationMode ? 'custom' : 'preset',
          minutes: minutes,
          createdAt: serverTimestamp()
        });
        setLastSessionId(docRef.id);
      } catch (error) {
        console.error("Error saving session:", error);
      }
    }

    if (playEndSound && endBellEnabled) {
      // Single bell strike at the end
      await playBowlSound(endSound);
      setTimeout(() => {
        setShowCompletion(true);
        triggerFeedback(null, true, t.sessionCompleted);
      }, 1200);
    } else {
      // No bell — go straight to overlay
      setShowCompletion(true);
      triggerFeedback(null, true, t.sessionCompleted);
    }
  };

  const startSessionWithDelay = async () => {
    const ring = document.querySelector('.ring-container');

    if (!startDelayEnabled) {
      if (ring) {
        ring.classList.remove('ring-off','ring-beat-1','ring-beat-2','ring-beat-3','ring-beat-4','ring-beat-5','idle','ring-complete');
        ring.classList.add('ring-beat-5');
        delayTimerRef.current = setTimeout(() => {
          ring.classList.remove('ring-beat-5');
          ring.classList.add('active');
          beginSession();
        }, 600) as any;
      } else {
        beginSession();
      }
      return;
    }

    // Resume AudioContext on user interaction and wait for it
    const ctx = getMasterCtx();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    setIsDelaying(true);
    
    if (ring) {
      ring.classList.remove('idle','active','ring-beat-1','ring-beat-2','ring-beat-3','ring-beat-4','ring-beat-5','ring-complete');
      ring.classList.add('ring-off');
    }

    const beatClasses = ['ring-beat-1','ring-beat-2','ring-beat-3','ring-beat-4','ring-beat-5'];
    let beatsPlayed = 0;
    let countdown = 5;
    setCountdown(countdown);

    metronomeTimeoutRef.current = setTimeout(() => {
      function playOneBeat() {
        if (ring) {
          ring.classList.remove('ring-off','ring-beat-1','ring-beat-2','ring-beat-3','ring-beat-4','ring-beat-5');
        }

        if (beatsPlayed >= 5) {
          if (ring) {
            delayTimerRef.current = setTimeout(() => {
              ring.classList.remove('ring-beat-5');
              ring.classList.add('active');
              setCountdown(null);
              beginSession();
            }, 500) as any;
          } else {
            setCountdown(null);
            beginSession();
          }
          return;
        }

        if (ring) {
          ring.classList.add(beatClasses[beatsPlayed]);
        }

        const hg = document.querySelector('.hourglass-svg, #hourglassSvg, [class*="hourglass"]');
        if (hg) {
          hg.classList.remove('hourglass-pulse');
          void (hg as HTMLElement).offsetWidth; // force reflow
          hg.classList.add('hourglass-pulse');
          setTimeout(() => hg.classList.remove('hourglass-pulse'), 300);
        }

        playMetronomeTick(soundEnabled);
        beatsPlayed++;
        countdown--;
        setCountdown(countdown > 0 ? countdown : null);

        metronomeTimeoutRef.current = setTimeout(playOneBeat, 1000) as any;
      }

      playOneBeat();
    }, 150);
  };

  const toggleSession = () => {
    // Ensure AudioContext is resumed on user gesture (crucial for mobile)
    const ctx = getMasterCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (sessionActive || isDelaying) {
      if (sessionActive && elapsed > 0) {
        endSession(elapsed, false);
      } else {
        setSessionActive(false);
        setIsDelaying(false);
        setElapsed(0);
        setCountdown(null);
      }
      
      resetAllAudio();

      if (countdownIntervalRef.current) {
        clearTimeout(countdownIntervalRef.current as any);
        countdownIntervalRef.current = null;
      }
      
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    } else {
      resetAllAudio();
      startSessionWithDelay();
    }
  };

  async function playBowlSound(soundUrl: string) {
    if (!soundEnabled || !soundUrl) return;

    const audioCtx = getMasterCtx();
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    console.log(`Playing bowl sound: ${soundUrl}`);

    // If it's a URL and we have it in cache, use Web Audio (reliable on mobile)
    if (soundUrl !== 'synthesized') {
      const cachedBuffer = bellBufferCache.get(soundUrl);
      if (cachedBuffer === undefined) {
        console.warn(`Sound not in cache: ${soundUrl}, falling back to HTML Audio`);
        // Fallback to HTML Audio if not in cache (less reliable on mobile)
        const audio = new Audio(soundUrl);
        bowlAudioRef.current = audio;
        audio.play().catch((err) => {
          if (err.name === 'AbortError') return;
          handleAudioError(err);
        });
        // Also try to preload for next time
        preloadBellBuffer(soundUrl);
        return;
      } else {
        const source = audioCtx.createBufferSource();
        source.buffer = cachedBuffer;
        source.connect(audioCtx.destination);
        source.start(0);
        bowlSourceRef.current = source;
        return;
      }
    }
    
    // Main fundamental tone
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(428, audioCtx.currentTime + 4);
    gain1.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    // Harmonic overtone
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(864, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(856, audioCtx.currentTime + 3);
    gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    // Second harmonic
    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1296, audioCtx.currentTime);
    gain3.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain3.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
    osc3.connect(gain3);
    gain3.connect(audioCtx.destination);

    // Attack click softener
    const osc4 = audioCtx.createOscillator();
    const gain4 = audioCtx.createGain();
    osc4.type = 'sine';
    osc4.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc4.frequency.exponentialRampToValueAtTime(432, audioCtx.currentTime + 0.05);
    gain4.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain4.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc4.connect(gain4);
    gain4.connect(audioCtx.destination);

    [osc1, osc2, osc3, osc4].forEach(o => o.start(audioCtx.currentTime));
    osc1.stop(audioCtx.currentTime + 4);
    osc2.stop(audioCtx.currentTime + 3);
    osc3.stop(audioCtx.currentTime + 2);
    osc4.stop(audioCtx.currentTime + 0.15);
  }

  const rem = duration - elapsed;
  const m = Math.floor(rem / 60);
  const s = rem % 60;
  const timer = `${m}:${String(s).padStart(2, '0')}`;
  const chartData = useMemo(() => data[period], [period]);

  useEffect(() => {
    if (!sessionActive) return;

    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev >= duration) {
          clearInterval(interval);
          endSession(prev, true);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive]);

  const getDaysInMonth = (date: Date, dailyMinutesData: Record<string, number>) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push({ empty: true, id: `empty-${i}` });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(year, month, i);
      // Use local date string YYYY-MM-DD to avoid timezone shifts with toISOString()
      const dateStr = formatDayKey(currentDay);
      let minutes = dailyMinutesData[dateStr] || 0;
      
      const today = new Date();
      const isToday = currentDay.getDate() === today.getDate() && currentDay.getMonth() === today.getMonth() && currentDay.getFullYear() === today.getFullYear();

      // Add real-time minutes if session is active today
      if (isToday && sessionActive) {
        minutes += elapsed / 60;
      }

      days.push({
        empty: false,
        id: `day-${i}`,
        date: currentDay,
        dayNumber: i,
        minutes: minutes,
        sessions: 0, // We might need to track sessions too if needed, but for now minutes is enough
        isToday: isToday
      });
    }
    return days;
  };

  const calendarDays = getDaysInMonth(calendarMonth, dailyMinutes);
  const meditatedDaysInMonth = calendarDays.filter(d => !d.empty && d.minutes > 0).length;
  const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

  const VerificationScreen = ({ email, onResend, onBack }: { email: string, onResend: () => void, onBack: () => void }) => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] p-8 rounded-lg max-w-md w-full border border-[#222]">
        <h2 className="text-2xl font-bold text-[#e8e4dc] mb-4">Verifica Email</h2>
        <p className="text-[#888] mb-6">
          Abbiamo inviato un'email di conferma a {email}. Controlla la tua casella e clicca il link per accedere.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onResend}
            className="w-full bg-[#222] text-[#e8e4dc] py-2 rounded hover:bg-[#333] transition-colors"
          >
            Reinvia email
          </button>
          <button
            onClick={onBack}
            className="w-full bg-[#ff4444] text-white py-2 rounded hover:bg-[#ff6666] transition-colors"
          >
            Torna al login
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      {showVerificationScreen && (
        <VerificationScreen 
          email={verificationEmail} 
          onResend={() => {
            if (savedUserRef.current) {
              sendEmailVerification(savedUserRef.current);
              alert("Email di verifica reinviata!");
            }
          }} 
          onBack={() => {
            setShowVerificationScreen(false);
            setLoginOpen(false);
          }} 
        />
      )}
      {/* Navigation Wrapper */}
      <div className="nav-wrapper" id="navWrapper" style={{ 
        opacity: (activeInfoPage || showOverview || showSettings || showPlayer) ? 0 : 1, 
        pointerEvents: (activeInfoPage || showOverview || showSettings || showPlayer) ? 'none' : 'all',
        display: (activeInfoPage || showOverview || showSettings || showPlayer) ? 'none' : 'block'
      }}>
        <button className={`menu-btn ${cardNavOpen ? 'open' : ''}`} id="menuBtn" onClick={toggleCardNav}>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>

        {/* Card nav dropdown */}
        <div className={`card-nav ${cardNavOpen ? 'open' : ''}`} id="cardNav">
          {/* Aiuto */}
          <div className="card-nav-item" onClick={() => navigateTo('aiuto')}>
            <div className="card-nav-item-header">
              <div className="card-nav-icon">
                <HelpCircle size={14} strokeWidth={1.2} />
              </div>
              <div className="card-nav-text">
                <span className="card-nav-title">{t.help}</span>
                <span className="card-nav-sub">{t.helpSub}</span>
              </div>
              <div className="card-nav-arrow">
                <ChevronRight size={12} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="card-nav-divider"></div>

          {/* Missione */}
          <div className="card-nav-item" onClick={() => navigateTo('missione')}>
            <div className="card-nav-item-header">
              <div className="card-nav-icon">
                <Layers size={14} strokeWidth={1.2} />
              </div>
              <div className="card-nav-text">
                <span className="card-nav-title">{t.mission}</span>
                <span className="card-nav-sub">{t.missionSub}</span>
              </div>
              <div className="card-nav-arrow">
                <ChevronRight size={12} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="card-nav-divider"></div>

          {/* Insegnamenti */}
          <div className="card-nav-item" onClick={() => navigateTo('insegnamenti')}>
            <div className="card-nav-item-header">
              <div className="card-nav-icon">
                <Star size={14} strokeWidth={1.2} />
              </div>
              <div className="card-nav-text">
                <span className="card-nav-title">{t.insegnamenti}</span>
                <span className="card-nav-sub">{t.insegnamentiSub}</span>
              </div>
              <div className="card-nav-arrow">
                <ChevronRight size={12} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="card-nav-divider"></div>

          {/* Contatti */}
          <div className="card-nav-item">
            <div className="card-nav-item-header" onClick={toggleContattiExpand}>
              <div className="card-nav-icon">
                <Phone size={14} strokeWidth={1.2} />
              </div>
              <div className="card-nav-text">
                <span className="card-nav-title">{t.contacts}</span>
                <span className="card-nav-sub">{t.contactsSub}</span>
              </div>
              <div className="card-nav-arrow" id="contattiArrow" style={{ 
                transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                transform: contattiOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                <ChevronDown size={12} strokeWidth={1.5} />
              </div>
            </div>
            
            <div className={`card-nav-expand ${contattiOpen ? 'open' : ''}`} id="contattiExpand">
              <a href="mailto:bodhio@gmx.ie" className="card-nav-contact-link">
                <Mail size={12} strokeWidth={1.2} />
                <div className="card-nav-contact-info">
                  <span className="card-nav-contact-label">Email</span>
                  <span className="card-nav-contact-detail">bodhio@gmx.ie</span>
                </div>
              </a>
              <a href="https://instagram.com/bodhio.app" target="_blank" rel="noopener noreferrer" className="card-nav-contact-link">
                <Instagram size={12} strokeWidth={1.2} />
                <div className="card-nav-contact-info">
                  <span className="card-nav-contact-label">Instagram</span>
                  <span className="card-nav-contact-detail">@bodhio.app</span>
                </div>
              </a>
            </div>
          </div>

          <div className="card-nav-divider"></div>

          {/* Login / Profilo */}
          <div className="card-nav-item">
            <div className="card-nav-item-header" onClick={() => setLoginOpen(!loginOpen)}>
              <div className="card-nav-icon">
                {user ? (
                  user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={14} strokeWidth={1.2} />
                  )
                ) : (
                  <LogIn size={14} strokeWidth={1.2} />
                )}
              </div>
              <div className="card-nav-text">
                <span className="card-nav-title">{user ? (user.displayName || t.profile) : t.login}</span>
                <span className="card-nav-sub">{user ? t.profileSub : t.loginSub}</span>
              </div>
              <div className="card-nav-arrow" style={{ 
                transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                transform: loginOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                <ChevronDown size={12} strokeWidth={1.5} />
              </div>
            </div>

            <AnimatePresence>
              {loginOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="w-10 h-10 rounded-full accent-bg-alpha flex items-center justify-center overflow-hidden">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <User className="accent-text" size={20} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black truncate">{user.displayName || t.user}</p>
                            <p className="text-xs text-gray-600 truncate">{user.email}</p>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex flex-col gap-2">
                            <button 
                              onClick={() => {
                                setActiveInfoPage('admin');
                                setAdminTab('users');
                                fetchAdminData();
                                setLoginOpen(false);
                              }}
                              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl accent-bg-alpha accent-border-alpha accent-text hover:opacity-80 transition-colors text-sm font-medium"
                            >
                              <Star size={16} />
                              {t.adminPanel}
                            </button>
                            <button 
                              onClick={() => {
                                setActiveInfoPage('admin');
                                setAdminTab('editor');
                                fetchAdminData();
                                setLoginOpen(false);
                              }}
                              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl accent-bg-alpha accent-border-alpha accent-text hover:opacity-80 transition-colors text-sm font-medium"
                            >
                              <Edit3 size={16} />
                              Editor
                            </button>
                            <button 
                              onClick={() => {
                                setActiveInfoPage('admin');
                                setAdminTab('music');
                                fetchAdminData();
                                setLoginOpen(false);
                              }}
                              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm font-medium mt-2"
                            >
                              <Music size={16} />
                              Music
                            </button>
                          </div>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                        >
                          <LogOut size={16} />
                          {t.logout}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <form onSubmit={handleEmailAuth} className="space-y-3">
                          {isRegistering && (
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                              <input 
                                type="text" 
                                placeholder={t.fullName}
                                value={authDisplayName}
                                onChange={(e) => setAuthDisplayName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none accent-ring transition-colors"
                                required
                              />
                            </div>
                          )}
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input 
                              type="email" 
                              placeholder={t.email}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none accent-ring transition-colors"
                              required
                            />
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input 
                              type="password" 
                              placeholder={t.password}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none accent-ring transition-colors"
                              required
                            />
                          </div>
                          
                          {authError && (
                            <p className="text-[10px] text-red-400 px-1">{authError}</p>
                          )}

                          <button 
                            type="submit"
                            disabled={authLoading}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl accent-bg-solid hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-white accent-shadow"
                          >
                            {authLoading ? <Loader2 className="animate-spin" size={16} /> : (isRegistering ? <UserPlus size={16} /> : <LogIn size={16} />)}
                            {isRegistering ? t.register : t.login}
                          </button>
                        </form>

                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                          <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-gray-600"><span className="bg-[#1a1a1a] px-2">{t.or}</span></div>
                        </div>

                        <button 
                          onClick={handleGoogleLogin}
                          disabled={authLoading}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium text-white"
                        >
                          <Chrome size={16} />
                          {t.continueWithGoogle}
                        </button>

                        <p className="text-center text-xs text-gray-500">
                          {isRegistering ? t.alreadyHaveAccount : t.dontHaveAccount}
                          <button 
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="ml-1 accent-text hover:accent-text font-medium"
                          >
                            {isRegistering ? t.loginHere : t.registerHere}
                          </button>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="card-nav-divider"></div>

          {/* Lingua */}
          <div className="card-nav-item">
            <div className="card-nav-item-header">
              <div className="card-nav-icon">
                <Globe size={14} strokeWidth={1.2} />
              </div>
              <div className="card-nav-text">
                <span className="card-nav-title">{t.language}</span>
                <div className="flex gap-2 mt-1">
                  {(['it', 'en', 'es'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguage(lang);
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold transition-all ${
                        language === lang 
                          ? 'bg-[var(--accent)] text-white' 
                          : 'bg-white/5 text-[var(--text-muted)] hover:bg-white/10'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Pages */}
      <AnimatePresence mode="wait">
        {activeInfoPage === 'admin' && isAdmin && (
          <motion.div 
            key="admin"
            id="page-admin" 
            className="info-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="info-page-header">
              <button className="info-back-btn" onClick={() => showPage('main')}>←</button>
            </div>
            <div className="info-content max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <h1 className={`m-0 text-2xl sm:text-3xl ${isLight ? 'text-gray-900' : 'text-white'}`}>{t.adminPanel}</h1>
                  <div className={`flex rounded-xl p-1 border w-fit ${isLight ? 'bg-gray-200 border-gray-300' : 'bg-white/5 border-white/10'}`}>
                    <button 
                      onClick={() => setAdminTab('users')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${adminTab === 'users' ? 'accent-bg-solid accent-shadow' : isLight ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
                    >
                      Utenti
                    </button>
                    <button 
                      onClick={() => setAdminTab('editor')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${adminTab === 'editor' ? 'accent-bg-solid accent-shadow' : isLight ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
                    >
                      Editor
                    </button>
                    <button 
                      onClick={() => setAdminTab('music')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${adminTab === 'music' ? 'accent-bg-solid accent-shadow' : isLight ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
                    >
                      Music
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl accent-bg-alpha accent-text hover:opacity-80 transition-colors text-xs sm:text-sm font-medium accent-border-alpha"
                  >
                    <Download size={16} />
                    <span>Esporta <span className="hidden sm:inline">CSV</span></span>
                  </button>
                  <button 
                    onClick={fetchAdminData}
                    disabled={adminLoading}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    <Loader2 className={adminLoading ? 'animate-spin' : ''} size={18} />
                  </button>
                </div>
              </div>
              
              {adminTab === 'users' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.totalUsers}</p>
                      <p className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{adminUsers.length}</p>
                    </div>
                    <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.totalMinutes}</p>
                      <p className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {Math.floor(adminUsers.reduce((acc, u) => acc + (u.totalMinutes || 0), 0))}
                      </p>
                    </div>
                    <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.totalSessions}</p>
                      <p className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {adminUsers.reduce((acc, u) => acc + (u.sessions || 0), 0)}
                      </p>
                    </div>
                  </div>

                  <div className={`overflow-x-auto rounded-2xl border ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
                          <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{t.user}</th>
                          <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{t.email}</th>
                          <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">{t.sessions}</th>
                          <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">{t.minutes}</th>
                          <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Data Registrazione</th>
                          <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ultimo Accesso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.map((u, i) => (
                          <tr 
                            key={u.uid || i} 
                            onClick={() => handleUserClick(u)}
                            className={`border-b transition-colors cursor-pointer ${isLight ? 'border-gray-50 hover:bg-gray-50' : 'border-white/5 hover:bg-white/10'}`}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full accent-bg-alpha flex items-center justify-center overflow-hidden">
                                  {u.photoURL ? (
                                    <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <User size={14} className="accent-text" />
                                  )}
                                </div>
                                <span className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>{u.displayName || 'Utente'}</span>
                              </div>
                            </td>
                            <td className={`p-4 text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{u.email}</td>
                            <td className={`p-4 text-sm text-center font-mono ${isLight ? 'text-gray-900' : 'text-white'}`}>{u.sessions || 0}</td>
                            <td className={`p-4 text-sm text-center font-mono ${isLight ? 'text-gray-900' : 'text-white'}`}>{Math.floor(u.totalMinutes || 0)}</td>
                            <td className="p-4 text-sm text-gray-500 text-right">
                              {formatDateIT(u.createdAt)}
                            </td>
                            <td className="p-4 text-sm text-gray-500 text-right">
                              {formatDateIT(u.lastLogin)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              
              {adminTab === 'editor' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                       <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={`px-3 py-2 rounded-xl border text-sm ${isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-white/5 border-white/10 text-white'}`}
                      >
                        <option value="Tutti">{t.articleCategories.all}</option>
                        <option value="Consapevolezza">{t.articleCategories.consapevolezza}</option>
                        <option value="Respirazione">{t.articleCategories.respirazione}</option>
                        <option value="Mindfulness">{t.articleCategories.mindfulness}</option>
                        <option value="Abitudini">{t.articleCategories.abitudini}</option>
                        <option value="Meditazione Guidata">{t.articleCategories.meditazioneGuidata}</option>
                      </select>
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-3 py-2 rounded-xl border text-sm ${isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-white/5 border-white/10 text-white'}`}
                      >
                        <option value="Tutti">Tutti gli stati</option>
                        <option value="published">Pubblicato</option>
                        <option value="draft">Bozza</option>
                      </select>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingArticle({
                          id: '',
                          title: '',
                          excerpt: '',
                          body: '',
                          category: 'Consapevolezza',
                          author: '',
                          readingTime: '',
                          imageUrl: '',
                          status: 'draft',
                          createdAt: new Date().toISOString()
                        } as Article);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl accent-bg-solid hover:opacity-90 active:scale-95 transition-all text-sm font-medium accent-shadow"
                    >
                      <Plus size={18} />
                      Nuovo Articolo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentArticles.map((article) => (
                      <div key={article.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-4 group ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                        <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <LazyImage src={article.imageUrl || 'https://picsum.photos/200'} alt="" className="w-full h-full group-hover:scale-105 transition-all" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] uppercase tracking-wider accent-text font-bold truncate">{article.category}</span>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setEditingArticle(article); }} 
                                className={`p-2 rounded-lg transition-all active:scale-95 ${isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'}`}
                                title="Modifica"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setDeleteConfirmation(article); }} 
                                className={`p-2 rounded-lg transition-all active:scale-95 ${isLight ? 'bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600' : 'bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400'}`}
                                title="Elimina"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <h3 className={`text-sm font-medium mt-1 line-clamp-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>{article.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${article.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                              {article.status === 'published' ? 'Pubblicato' : 'Bozza'}
                            </span>
                            <span className="text-[10px] text-gray-600 font-mono">{formatDateIT(article.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {currentArticles.length === 0 && (
                      <div className={`col-span-2 py-12 text-center rounded-2xl border ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/5'}`}>
                        <p className="text-gray-500">Nessun articolo trovato. Crea il tuo primo articolo!</p>
                      </div>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/5 text-gray-400'} disabled:opacity-50`}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        Pagina {currentPage} di {totalPages}
                      </span>
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/5 text-gray-400'} disabled:opacity-50`}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {adminTab === 'music' && (
                <MusicEditor customTracks={customTracks} isLight={isLight} />
              )}

            </div>

            {/* User Details Modal */}
            <AnimatePresence>
              {selectedAdminUser && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                  onClick={() => setSelectedAdminUser(null)}
                >
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full max-w-2xl border rounded-3xl overflow-hidden flex flex-col max-h-[85vh] ${isLight ? 'bg-white border-gray-200 shadow-2xl' : 'bg-[#1a1a1a] border-white/10'}`}
                  >
                    <div className={`p-6 border-b flex justify-between items-start ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full accent-bg-alpha flex items-center justify-center overflow-hidden accent-border-alpha">
                          {selectedAdminUser.photoURL ? (
                            <img src={selectedAdminUser.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User size={24} className="accent-text" />
                          )}
                        </div>
                        <div>
                          <h2 className={`text-xl font-semibold m-0 ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedAdminUser.displayName || 'Utente'}</h2>
                          <p className="text-gray-400 text-sm mt-1">{selectedAdminUser.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedAdminUser(null)}
                        className={`p-2 rounded-full transition-colors ${isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Registrazione</p>
                          <p className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>{formatDateIT(selectedAdminUser.createdAt)}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ultimo Accesso</p>
                          <p className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>{formatDateIT(selectedAdminUser.lastLogin)}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sessioni Totali</p>
                          <p className={`text-2xl font-bold font-mono ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedAdminUser.sessions || 0}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Minuti Totali</p>
                          <p className={`text-2xl font-bold font-mono ${isLight ? 'text-gray-900' : 'text-white'}`}>{Math.floor(selectedAdminUser.totalMinutes || 0)}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border col-span-2 ${isLight ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Streak Attuale</p>
                          <div className="flex items-center gap-2">
                            <Zap size={18} className="text-yellow-500" />
                            <p className={`text-lg font-bold font-mono ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedAdminUser.streak || 0} giorni</p>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Ultime 10 Sessioni</h3>
                      
                      {adminUserSessionsLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="animate-spin accent-text" size={24} />
                        </div>
                      ) : adminUserSessions.length > 0 ? (
                        <div className="space-y-2">
                          {adminUserSessions.map((session, idx) => (
                            <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${isLight ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full accent-bg-alpha flex items-center justify-center">
                                  <Clock size={14} className="accent-text" />
                                </div>
                                <div>
                                  <p className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>{formatDateIT(session.date)}</p>
                                  <p className="text-xs text-gray-500 capitalize">{session.type || 'Preset'}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-mono ${isLight ? 'text-gray-900' : 'text-white'}`}>{session.minutes} min</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-center py-8 rounded-2xl border ${isLight ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                          <p className="text-sm text-gray-500">Nessuna sessione registrata</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeInfoPage === 'aiuto' && (
          <motion.div 
            key="aiuto"
            id="page-aiuto" 
            className="info-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="info-page-header">
              <button className="info-back-btn" onClick={() => showPage('main')}>←</button>
            </div>
            <div className="info-content">
              <h1>{t.help}</h1>
              
              <div className="info-body space-y-8">
                <section>
                  <h2 className="accent-text text-xs tracking-[0.2em] uppercase mb-4">{t.howToUse}</h2>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full accent-bg-alpha accent-border-alpha flex items-center justify-center text-[10px] accent-text shrink-0">1</div>
                      <p className="text-sm text-[var(--text-secondary)]">{t.step1}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full accent-bg-alpha accent-border-alpha flex items-center justify-center text-[10px] accent-text shrink-0">2</div>
                      <p className="text-sm text-[var(--text-secondary)]">{t.step2}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full accent-bg-alpha accent-border-alpha flex items-center justify-center text-[10px] accent-text shrink-0">3</div>
                      <p className="text-sm text-[var(--text-secondary)]">{t.step3}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full accent-bg-alpha accent-border-alpha flex items-center justify-center text-[10px] accent-text shrink-0">4</div>
                      <p className="text-sm text-[var(--text-secondary)]">{t.step4}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="accent-text text-xs tracking-[0.2em] uppercase mb-4">{t.benefits}</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-[var(--text-primary)] text-sm font-medium mb-1">{t.benefit1Title}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{t.benefit1Desc}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-[var(--text-primary)] text-sm font-medium mb-1">{t.benefit2Title}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{t.benefit2Desc}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-[var(--text-primary)] text-sm font-medium mb-1">{t.benefit3Title}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{t.benefit3Desc}</p>
                    </div>
                  </div>
                </section>

                <p className="text-xs text-[var(--text-muted)] italic text-center pt-4">
                  {t.quote}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeInfoPage === 'insegnamenti' && (
          <motion.div 
            key="insegnamenti"
            id="page-insegnamenti" 
            className="info-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'block', overflowY: 'auto' }}
          >
            {/* Header */}
            <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#141414]">
              <button className="info-back-btn !static !m-0" onClick={() => showPage('main')}>←</button>
              <motion.h1 
                className="font-logo text-xl font-light tracking-[0.3em] text-[var(--text-primary)] uppercase absolute left-1/2 -translate-x-1/2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                BODHIO
              </motion.h1>
              <div className="w-8"></div>
            </div>

            <div className="pb-24 pt-12 px-6 md:px-12 max-w-7xl mx-auto">
              {/* Hero Section */}
              {publicFilteredArticles.length > 0 ? (
                <>
                  {publicFilteredArticles.slice(0, 1).map(hero => (
                    <div key={hero.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 cursor-pointer group" onClick={() => setSelectedArticle(hero)}>
                      <div className="space-y-6">
                        <span className="accent-text text-sm font-medium tracking-widest uppercase">{hero.category}</span>
                        <h2 className="text-5xl md:text-6xl font-light text-[var(--text-primary)] leading-tight group-hover:accent-text transition-colors">{hero.title}</h2>
                        <p className="text-[var(--text-secondary)] line-clamp-3">{hero.excerpt || "Esplora le profondità della saggezza e della pratica meditativa con questo articolo approfondito."}</p>
                        <div className="flex items-center gap-4">
                          <img src="https://i.pravatar.cc/150?u=bodhio" alt="Author" className="w-10 h-10 rounded-full transition-all duration-500" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-[var(--text-primary)] font-medium">{hero.author}</p>
                            <p className="text-[var(--text-secondary)] text-sm">{formatDateIT(hero.publishedAt || hero.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="h-[400px] rounded-3xl overflow-hidden border border-white/10">
                        <img 
                          src={hero.imageUrl || "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=1000&auto=format&fit=crop"} 
                          alt={hero.title} 
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Filters */}
                  <div className={`flex items-center justify-between mb-12 border-b pb-6 ${isLight ? 'border-gray-100' : 'border-[#1a1a1a]'}`}>
                    <div className={`flex gap-8 text-sm overflow-x-auto no-scrollbar pb-2 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                      {availableCategories.map(cat => {
                        let displayCat = cat;
                        if (cat === 'Tutto' || cat === 'Tutti') displayCat = t.articleCategories.all;
                        else if (cat === 'Consapevolezza') displayCat = t.articleCategories.consapevolezza;
                        else if (cat === 'Respirazione') displayCat = t.articleCategories.respirazione;
                        else if (cat === 'Mindfulness') displayCat = t.articleCategories.mindfulness;
                        else if (cat === 'Abitudini') displayCat = t.articleCategories.abitudini;
                        else if (cat === 'Meditazione Guidata') displayCat = t.articleCategories.meditazioneGuidata;

                        return (
                          <button 
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`pb-1 transition-all whitespace-nowrap ${
                              (categoryFilter === cat || (cat === 'Tutto' && categoryFilter === 'Tutti'))
                                ? (isLight ? 'text-gray-900 border-b border-gray-900 font-medium' : 'text-white border-b border-white font-medium') 
                                : (isLight ? 'hover:text-gray-900' : 'hover:text-white')
                            }`}
                          >
                            {displayCat}
                          </button>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => setSortOrder(sortOrder === 'recent' ? 'oldest' : 'recent')}
                      className="text-sm text-gray-400 hidden md:block hover:text-white transition-colors"
                    >
                      {sortOrder === 'recent' ? `${t.mostRecent} ↓` : `${t.oldest} ↑`}
                    </button>
                  </div>

                  {/* Articles Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {publicFilteredArticles.length > 1 ? (
                      publicFilteredArticles.slice(1).map((article) => (
                        <article 
                          key={article.id} 
                          onClick={() => setSelectedArticle(article)}
                          className="relative aspect-[4/3] rounded-[16px] overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                        >
                          {/* Full Bleed Image */}
                          <img 
                            src={article.imageUrl || `https://picsum.photos/seed/${article.id}/800/600`} 
                            alt={article.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Top Right Arrow Icon */}
                          <div className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ArrowUpRight size={20} className="text-white" />
                          </div>

                          {/* Frosted Glass Overlay */}
                          <div className={`absolute bottom-0 left-0 right-0 p-6 backdrop-blur-[12px] border-t flex flex-col gap-3 ${isLight ? 'bg-white/70 border-gray-200/30' : 'bg-[#141414]/55 border-white/8'}`}>
                            <div>
                              <h3 className={`text-xl font-bold leading-tight mb-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>{article.title}</h3>
                              <p className={`text-sm line-clamp-2 leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-300/80'}`}>
                                {article.excerpt}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center overflow-hidden border ${isLight ? 'bg-gray-100 border-gray-200' : 'bg-white/10 border-white/5'}`}>
                <LazyImage src={article.authorImageUrl || `https://i.pravatar.cc/150?u=${article.author}`} alt={article.author} className="w-full h-full" referrerPolicy="no-referrer" />
                                </div>
                                <span className={`text-[11px] font-medium truncate max-w-[80px] ${isLight ? 'text-gray-700' : 'text-white/90'}`}>{article.author}</span>
                              </div>
                              
                              <div className={`flex items-center gap-1.5 text-[10px] ${isLight ? 'text-gray-500' : 'text-white/60'}`}>
                                <Calendar size={12} />
                                <span>{formatDateIT(article.publishedAt || article.createdAt)}</span>
                              </div>
                              
                              <div className={`px-2 py-0.5 rounded-full backdrop-blur-sm border ${isLight ? 'bg-gray-100 border-gray-200' : 'bg-white/12 border-white/15'}`}>
                                <span className={`text-[9px] font-medium uppercase tracking-wider ${isLight ? 'text-gray-700' : 'text-white'}`}>{article.category}</span>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      publicFilteredArticles.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                          <p className="text-gray-500">Nessun articolo trovato in questa categoria.</p>
                        </div>
                      )
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
                    <BookOpen size={32} className={isLight ? 'text-gray-400' : 'text-gray-600'} />
                  </div>
                  <h3 className={`text-xl font-medium mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>Nessun articolo pubblicato</h3>
                  <p className="text-gray-500">Torna presto per nuovi insegnamenti.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeInfoPage === 'missione' && (
          <motion.div 
            key="missione"
            id="page-missione" 
            className="info-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="info-page-header">
              <button className="info-back-btn" onClick={() => showPage('main')}>←</button>
            </div>
            <div className="info-content">
              <h1 className="text-2xl md:text-3xl">{t.missionTitle}</h1>
              <div className="info-body space-y-2 md:space-y-3">
                <p>{t.missionP1}</p>
                <p>{t.missionP2}</p>
                <p>{t.missionP3}</p>
                <p>{t.missionP4}</p>
                <p>{t.missionP5}</p>
                <p>{t.missionP6}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
                <button 
                  className="w-full py-4 rounded-2xl accent-bg-solid text-white font-bold text-lg shadow-lg hover:scale-[1.02] hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 accent-shadow"
                  onClick={() => window.open('https://www.paypal.me/alejandr0Rey', '_blank')}
                >
                  <Heart size={20} fill="currentColor" />
                  {t.donations}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeInfoPage === 'contatti' && (
          <motion.div 
            key="contatti"
            id="page-contatti" 
            className="info-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="info-page-header">
              <button className="info-back-btn" onClick={() => showPage('main')}>←</button>
            </div>
            <div className="info-content">
              <h1>{t.contactsTitle}</h1>
              <p className="info-body">{t.contactsDesc}</p>
            </div>
          </motion.div>
        )}

        {activeInfoPage === 'donazione' && (
          <motion.div 
            key="donazione"
            id="page-donazione" 
            className="info-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="info-page-header">
              <button className="info-back-btn" onClick={() => showPage('main')}>←</button>
            </div>
            <div className="info-content">
              <h1>{t.supportTitle}</h1>
              <div className="info-body space-y-6">
                <p>{t.supportP1}</p>
                <p>{t.supportP2}</p>
                
                <button 
                  className="w-full py-4 rounded-2xl accent-bg-solid text-white font-bold text-lg hover:scale-[1.02] hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 accent-shadow"
                  onClick={() => window.open('https://www.paypal.me/alejandr0Rey', '_blank')}
                >
                  <span>{t.supportButton}</span>
                  <ExternalLink size={20} strokeWidth={2} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {audioError && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] border border-[#ff4444]/30 px-6 py-3 rounded-full flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 shadow-2xl ${isLight ? 'bg-white' : 'bg-[#181818]'}`}>
          <AlertCircle size={16} stroke="#ff4444" strokeWidth={2} />
          <span className="text-[13px] text-[#ff4444] font-sans font-medium">{audioError}</span>
          <button onClick={() => setAudioError(null)} className={`ml-2 transition-colors ${isLight ? 'text-gray-400 hover:text-[#ff4444]' : 'text-[#555] hover:text-[#ff4444]'}`}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {showUnsavedModal && (
          <motion.div
            key="unsaved-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl shadow-2xl max-w-[320px] w-full mx-4"
            >
              <h3 className="text-[16px] font-medium text-[var(--text-primary)] mb-2">{t.unsavedChanges}</h3>
              <p className="text-[13px] text-[var(--text-secondary)] mb-6">{t.unsavedChangesDesc}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    stopPreview();
                    setShowUnsavedModal(false);
                  }}
                  className="px-4 py-2 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    stopPreview();
                    setShowUnsavedModal(false);
                    if (initialSettings) {
                      applyTheme(initialSettings.theme);
                      setRingGradient(initialSettings.ringGradient);
                      setChartColor(initialSettings.chartColor);
                      setEndBellEnabled(initialSettings.endBellEnabled);
                      setStartDelayEnabled(initialSettings.startDelayEnabled);
                      setSoundEnabled(initialSettings.soundEnabled);
                      setVibrationEnabled(initialSettings.vibrationEnabled);
                      setStartSound(initialSettings.startSound);
                      setEndSound(initialSettings.endSound);
                      setAmbientSound(initialSettings.ambientSound);
                    }
                    if (pendingPage) {
                      executeShowPage(pendingPage);
                    }
                  }}
                  className="px-4 py-2 text-[13px] font-medium bg-[var(--accent-dark)] text-[#e8e4dc] rounded-lg hover:bg-[var(--accent)] transition-colors"
                >
                  {t.exit}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResetConfirmModal && (
          <motion.div
            key="reset-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl shadow-2xl max-w-[320px] w-full mx-4"
            >
              <h3 className="text-[16px] font-medium text-[var(--text-primary)] mb-2">{t.resetOverview}</h3>
              <p className="text-[13px] text-[var(--text-secondary)] mb-6">{t.resetConfirm}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowResetConfirmModal(false)}
                  className="px-4 py-2 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2 text-[13px] font-medium bg-[#ff6b6b] text-white rounded-lg hover:bg-[#ff5252] transition-colors"
                >
                  {t.resetYes}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompletion && (
          <motion.div 
            key="completion"
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 ${isLight ? 'bg-[#f5f4f0]' : 'bg-[#0a0a0a]'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => { setShowCompletion(false); setElapsed(0); }}
          >
            <div className={`text-[28px] pulse ${isLight ? 'text-gray-900' : 'text-[#e8e4dc]'}`}>✦</div>
            <h2 className={`font-serif text-[36px] font-normal ${isLight ? 'text-gray-900' : 'text-[#e8e4dc]'}`}>{t.sessionCompleted}</h2>
            <div className="flex flex-col items-center gap-2">
              <p className={`font-sans text-[14px] tracking-[0.15em] uppercase ${isLight ? 'text-gray-500' : 'text-[#555]'}`}>{t.meditatedFor} {Math.floor(lastSessionDuration / 60)} {t.minutes.toUpperCase()}</p>
              <p className={`font-sans text-[14px] tracking-[0.15em] uppercase ${isLight ? 'text-gray-500' : 'text-[#555]'}`}>{t.totalSessions.toUpperCase()}: {sessions}</p>
            </div>
            <div className={`w-[40px] h-[0.5px] ${isLight ? 'bg-gray-200' : 'bg-[#2a2a2a]'}`}></div>
            
            <MoodSelector onSelect={handleMoodSelect} isLight={isLight} t={t} />

            <div className="flex gap-3 mt-4">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowCompletion(false); setElapsed(0); }}
                className={`rounded-[50px] px-7 py-3 text-[13px] uppercase tracking-[0.12em] ${isLight ? 'bg-gray-900 text-white' : 'bg-[#e8e4dc] text-[#0a0a0a]'}`}
              >
                {t.again}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowCompletion(false); showPage('overview'); }}
                className={`rounded-[50px] border-[0.5px] bg-transparent px-7 py-3 text-[13px] uppercase tracking-[0.12em] ${isLight ? 'border-gray-200 text-gray-500' : 'border-[#2a2a2a] text-[#888]'}`}
              >
                {t.overview}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        id="main-page" 
        className="main-panel" 
        initial={false}
        animate={{ 
          opacity: (activeInfoPage || showPlayer || showOverview || showSettings) ? 0 : 1,
          scale: (activeInfoPage || showPlayer || showOverview || showSettings) ? 0.95 : 1,
          pointerEvents: (activeInfoPage || showPlayer || showOverview || showSettings) ? 'none' : 'auto',
          display: (activeInfoPage || showPlayer || showOverview || showSettings) ? 'none' : 'flex'
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="zenly-header">
          <motion.h1 
            className="font-logo text-xl font-light tracking-[0.3em] text-[var(--text-primary)] uppercase"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            BODHIO
          </motion.h1>
        </div>
        <div className="ring-wrapper">
          <div className={`ring-container ${isRingTouching ? 'touch-feedback' : ''}`}>
            <div className="ring-bloom" style={{ backgroundImage: ringGradient }}></div>
            <div className="ring-glow" style={{ backgroundImage: ringGradient }}></div>
            <div className="ring-sharp" style={{ backgroundImage: ringGradient }}></div>
            <button 
              className="start-btn absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center" 
              onClick={toggleSession}
              onMouseDown={triggerRingFeedback}
              onTouchStart={triggerRingFeedback}
            >
              <Hourglass elapsed={elapsed} flipped={flipped} sessionActive={sessionActive} duration={duration} theme={theme} />
            </button>
          </div>
        </div>
        <div className="timer-display">{timer}</div>
        <div 
          className="phase-label" 
          id="phaseLabel"
          style={{ opacity: (countdown !== null) ? 1 : 0 }}
        >
          {countdown}
        </div>
        
        <div 
          className="dock" 
          id="mainDock" 
          ref={dockRef}
          style={{
            opacity: (!showPlayer && !showOverview && !showSettings && !activeInfoPage) ? '1' : '0',
            pointerEvents: (!showPlayer && !showOverview && !showSettings && !activeInfoPage) ? 'all' : 'none'
          }}
        >
          <div className="dock-item" id="dockPlayer" onClick={() => showPage('player')} data-label="Player">
            <div className="dock-icon">
              <PlayCircle size={22} strokeWidth={1.2} color={!isLight ? '#DEDEDE' : undefined} />
            </div>
            <span className="dock-label">Player</span>
          </div>

          <div className="dock-item" id="dockPanoramica" onClick={() => showPage('overview')} data-label="Panoramica">
            <div className="dock-icon">
              <BarChart3 size={22} strokeWidth={1.2} color={!isLight ? '#DEDEDE' : undefined} />
            </div>
            <span className="dock-label">{t.overview}</span>
          </div>

          <div className="dock-item" id="dockImpostazioni" onClick={() => showPage('settings')} data-label={t.settings}>
            <div className="dock-icon">
              <Sliders size={22} strokeWidth={1.2} color={!isLight ? '#DEDEDE' : undefined} />
            </div>
            <span className="dock-label">{t.settings}</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {showPlayer && (
          <motion.div 
            key="player"
            id="player-page"
            className="page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="page-topbar">
              <button className="page-topbar-back" onClick={() => showPage('main')}>←</button>
              <h1 className="page-topbar-title">{t.listening}</h1>
            </div>

          <div className="player-content">
              <div className="player-left">
                <div className="player-artwork" id="playerArt">
                  {currentTrackIndex !== -1 && allTracks[currentTrackIndex].image ? (
                    <img 
                      src={allTracks[currentTrackIndex].image} 
                      alt={allTracks[currentTrackIndex].name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Disc className="player-artwork-icon" size={48} stroke="#888" strokeWidth={0.75} />
                  )}
                </div>
                <div className="player-left-right">
                  <div className="player-now-playing">
                    <p className="player-now-name" id="playerTrackName">
                      {currentTrackIndex !== -1 
                        ? (t.tracks[allTracks[currentTrackIndex].id as keyof typeof t.tracks] || allTracks[currentTrackIndex].name) 
                        : t.noTrack}
                    </p>
                    <p className="player-now-cat" id="playerTrackCat">
                      {currentTrackIndex !== -1 
                        ? (t.categories[allTracks[currentTrackIndex].category.toLowerCase() as keyof typeof t.categories] || allTracks[currentTrackIndex].category) 
                        : '—'}
                    </p>
                  </div>
                  <div className="player-controls-row">
                    <button className={`player-ctrl-btn ${isShuffle ? 'active' : ''}`} onClick={() => setIsShuffle(!isShuffle)} style={{ color: isShuffle ? 'var(--accent)' : '' }}>
                      <Shuffle size={18} strokeWidth={1.5} />
                    </button>
                    <button className="player-ctrl-btn" onClick={prevTrack}>
                      <SkipBack size={18} strokeWidth={1.5} />
                    </button>
                    <button className="player-play-btn" id="playPauseBtn" onClick={togglePlayerPlayPause}>
                      {isPlayerLoading ? (
                        <Loader2 className="animate-spin" size={18} strokeWidth={2} />
                      ) : !playerPlaying ? (
                        <Play size={18} fill="currentColor" />
                      ) : (
                        <Pause size={18} fill="currentColor" />
                      )}
                    </button>
                    <button className="player-ctrl-btn" onClick={nextTrack}>
                      <SkipForward size={18} strokeWidth={1.5} />
                    </button>
                    <button className={`player-ctrl-btn ${isLooping ? 'active' : ''}`} onClick={() => setIsLooping(!isLooping)} style={{ color: isLooping ? 'var(--accent)' : '' }}>
                      <Repeat size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="player-progress-area">
                    <div className="player-progress-track" id="playerProgressWrap" onClick={seekPlayer}>
                      <div className="player-progress-fill" id="playerProgressFill" style={{width: `${(playerCurrentTime / (playerDuration || 1)) * 100}%`}}></div>
                    </div>
                    <div className="player-time-row">
                      <span id="playerCurrentTime">{formatPlayerTime(playerCurrentTime)}</span>
                      <span id="playerTotalTime">{formatPlayerTime(playerDuration)}</span>
                    </div>
                  </div>
                  <div className="player-volume-row md:flex items-center gap-2" style={{ marginTop: '1rem', marginBottom: 0 }}>
                    <button onClick={() => setShowVolumeSlider(!showVolumeSlider)} className="md:hidden">
                      <Volume2 className="player-volume-icon" size={14} strokeWidth={1.5} />
                    </button>
                    <div className="hidden md:block">
                      <Volume2 className="player-volume-icon" size={14} strokeWidth={1.5} />
                    </div>
                    <div className={`${showVolumeSlider ? 'block' : 'hidden'} md:block flex-1`}>
                      <input type="range" id="volumeSlider" min="0" max="100" value={playerVolume} onChange={(e) => handlePlayerVolumeChange(Number(e.target.value))} style={{width: '100%'}} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="player-right">
                <div className="player-playlist-header flex items-center justify-between">
                  <span>{t.myPlaylist}</span>
                  <button 
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className={`flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full transition-colors ${showOnlyFavorites ? 'bg-[#e8e4dc] text-[#0a0a0a]' : 'bg-[#1a1a1a] text-[#555] hover:text-[#888]'}`}
                  >
                    <Heart size={10} fill={showOnlyFavorites ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} />
                    {t.favorites}
                  </button>
                </div>
                <div className="track-list" id="trackList">
                  {(() => {
                    let globalIndex = 0;
                    const tracksToDisplay = showOnlyFavorites 
                      ? allTracks.filter(t => favorites.includes(t.id))
                      : allTracks;

                    if (tracksToDisplay.length === 0 && showOnlyFavorites) {
                      return (
                        <div className="flex flex-col items-center justify-center h-full opacity-30 py-10">
                          <Heart size={32} strokeWidth={1} className="mb-2" />
                          <span className="text-[11px] uppercase tracking-widest">{t.noFavorites}</span>
                        </div>
                      );
                    }

                    return Object.entries(
                      tracksToDisplay.reduce((acc, track) => {
                        const originalIndex = allTracks.findIndex(t => t.id === track.id);
                        if (!acc[track.category]) acc[track.category] = [];
                        acc[track.category].push({ ...track, index: originalIndex });
                        return acc;
                      }, {} as Record<string, any[]>)
                    ).map(([category, tracks]: [string, any]) => (
                      <div key={category}>
                        <div className="track-category-label">
                          {(t.categories[category.toLowerCase() as keyof typeof t.categories] || category).toUpperCase()}
                        </div>
                        {tracks.map((track: any) => {
                          globalIndex++;
                          const isFav = favorites.includes(track.id);
                          const trackName = t.tracks[track.id as keyof typeof t.tracks] || track.name;
                          const trackCategory = t.categories[track.category.toLowerCase() as keyof typeof t.categories] || track.category;
                          
                          return (
                            <div 
                              key={track.id} 
                              className={`track-row ${track.index === currentTrackIndex ? 'active' : ''}`}
                              onClick={() => loadAndPlayTrack(track.index)}
                            >
                              <span className="track-row-number">{String(globalIndex).padStart(2, '0')}</span>
                              <span className="track-row-play-icon">
                                <Play size={10} fill="currentColor" />
                              </span>
                              <div className="track-row-thumb" style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: '#181818',
                                border: '0.5px solid #222'
                              }}>
                                {track.image ? (
                                  <img 
                                    src={track.image} 
                                    alt="" 
                                    style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} 
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                  />
                                ) : (
                                  <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Disc size={14} stroke="#444" strokeWidth={1} />
                                  </div>
                                )}
                              </div>
                              <span className="track-row-info">
                                <span className="track-row-name flex items-center gap-2">
                                  {trackName}
                                  {track.index === currentTrackIndex && isPlayerLoading && (
                                    <span className="flex h-2 w-2 relative">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--accent)' }}></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent)' }}></span>
                                    </span>
                                  )}
                                </span>
                                <span style={{fontSize: '10px', color: '#333', display: 'block', marginTop: '2px'}}>{trackCategory}</span>
                              </span>
                              <div className="flex items-center gap-3 ml-auto">
                                <button 
                                  onClick={(e) => {
                                    const btn = e.currentTarget;
                                    btn.classList.add('favorite-bounce');
                                    setTimeout(() => btn.classList.remove('favorite-bounce'), 300);
                                    toggleFavorite(e, track.id);
                                  }}
                                  className={`favorite-btn transition-colors ${isFav ? 'text-[#ff4b4b]' : 'text-[#222] hover:text-[#444]'}`}
                                >
                                  <Heart size={14} fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} />
                                </button>
                                <span className="track-row-duration" id={`dur-${track.index}`}>—</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
        </motion.div>
      )}

        {showOverview && (
          <motion.div 
            key="overview"
            id="panoramica-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="panoramica-scroll-content">
            
            {/* Header with Back Arrow */}
            <div className="page-topbar">
              <button className="page-topbar-back" onClick={() => showPage('main')}>←</button>
              <h1 className="page-topbar-title">{t.overview}</h1>
            </div>

            {/* SECTION 1 — Header stat row */}
            <div className="stat-header-row">
              {[
                { 
                  label: t.totalTime, 
                  value: Math.floor((totalSeconds + (sessionActive ? elapsed : 0)) / 60), 
                  sub: (
                    <div className="flex items-center justify-center gap-0.5">
                      <AnimatedNumber value={Math.floor((totalSeconds + (sessionActive ? elapsed : 0)) / 3600)} />
                      <span>h</span>
                      <AnimatedNumber value={Math.floor(((totalSeconds + (sessionActive ? elapsed : 0)) % 3600) / 60)} />
                      <span>m</span>
                    </div>
                  )
                },
                { 
                  label: t.goal, 
                  value: Math.floor((todaySeconds + (sessionActive ? elapsed : 0)) / 60), 
                  suffix: (
                    <>
                      <span>/</span>
                      <AnimatedNumber value={dailyGoal} />
                    </>
                  ), 
                  sub: t.minutesToday 
                },
                { label: t.avgSession, value: sessions > 0 ? Math.round(totalMin / sessions) : 0, sub: t.minPerSession },
                { label: t.streak, value: streak, sub: t.consecutiveDays, icon: true },
              ].map((stat, i) => (
                <div key={i} className={`stat-header-card ${sessionActive && (stat.label === t.totalTime || stat.label === t.goal) ? 'active-session' : ''}`}>
                  <span className="stat-label text-[9px] tracking-[0.15em] text-[#444] uppercase font-sans font-medium mb-2">{stat.label}</span>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="flex items-center gap-2 w-full justify-center">
                      <span className="stat-big-number text-[#e8e4dc]">
                        <AnimatedNumber value={stat.value} />{stat.suffix || ''}
                      </span>
                    </div>
                    {stat.sub && <span className="stat-sublabel text-[10px] text-[#555] font-sans mt-1 text-center">{stat.sub}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Grid — Mood Heatmap & Quick Stats */}
            <div className="panoramica-main-grid mb-6">
              {/* Mood Heatmap */}
              <div className="calendario-card">
                <MoodHeatmap 
                  moods={moods} 
                  isLight={isLight} 
                  t={t} 
                  formatDayKey={formatDayKey} 
                  calendarMonth={calendarMonth}
                />
              </div>

              {/* Statistiche Rapide */}
              <div className="quick-stats-card flex flex-col p-6 h-full">
                <h2 style={{ marginBottom: '1rem' }} className="card-title text-[18px] text-[#e8e4dc]">{t.quickStats}</h2>
                <div className="flex-1">
                  {[
                    { label: t.longestSession, value: maxSessionDuration, suffix: ` ${t.min}`, icon: Clock },
                    { 
                      label: t.totalTime, 
                      value: Math.floor((totalSeconds + (sessionActive ? elapsed : 0)) / 3600), 
                      suffix: 'h ',
                      extraValue: Math.floor(((totalSeconds + (sessionActive ? elapsed : 0)) % 3600) / 60),
                      extraSuffix: 'm',
                      icon: Activity 
                    },
                    { label: t.weeklyAverage, value: weeklyAverage, suffix: ` ${t.min}`, icon: TrendingUp },
                  ].map((item: any, i, arr) => (
                    <div key={i} className={`quick-stat-row flex items-center justify-between py-3 ${i !== arr.length - 1 ? 'border-b-[0.5px] border-[#1e1e1e]' : ''}`}>
                      <div className="flex items-center gap-3">
                        <item.icon size={14} stroke="#555" strokeWidth={2} />
                        <span className="quick-stat-label text-[12px] text-[#888] font-sans flex-1">{item.label}</span>
                      </div>
                      <span className="quick-stat-value text-[16px] font-medium text-[#e8e4dc] text-right ml-2">
                        <AnimatedNumber value={item.value} />{item.suffix}
                        {item.extraValue !== undefined && (
                          <>
                            <AnimatedNumber value={item.extraValue} />{item.extraSuffix}
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-[#1e1e1e]">
                  <span className="previsione-label text-[9px] tracking-[0.2em] uppercase font-sans font-bold mb-2 block accent-text opacity-70">{t.ifYouContinue}</span>
                  <div className="previsione-text flex items-baseline justify-start gap-[0.4rem] leading-[1.2] whitespace-nowrap">
                    <span className="previsione-word text-[clamp(14px,2vw,18px)] text-[#888]">{t.youWillMeditate}</span>
                    <span className="previsione-number leading-none text-[clamp(18px,4vw,24px)] font-bold accent-text">
                      <AnimatedNumber value={yearlyPrediction} />
                    </span>
                    <span className="previsione-word text-[clamp(14px,2vw,18px)] text-[#888]">{t.hoursThisYear}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Grid — Calendario & Progressione */}
            <div className="panoramica-secondary-grid">
              {/* Calendario */}
              <div className="calendario-card">
                <div className="month-nav-row flex items-center justify-between mb-4 px-1">
                  <h2 className={`card-title text-[18px] m-0 ${isLight ? 'text-gray-900' : 'text-[#e8e4dc]'}`}>{t.calendar}</h2>
                  <div className={`flex items-center gap-4 text-[13px] ${isLight ? 'text-gray-500' : 'text-[#888]'}`}>
                    <button onClick={prevMonth} className={`hover:accent-text p-1 transition-colors ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>‹</button>
                    <span className="font-sans uppercase tracking-wider min-w-[120px] text-center">
                      {t.months[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                    </span>
                    <button onClick={nextMonth} className={`hover:accent-text p-1 transition-colors ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>›</button>
                  </div>
                </div>
                
                <div className="month-days-grid grid grid-cols-7 gap-1.5 mb-4 px-[0.1rem] max-w-[320px] md:max-w-none mx-auto">
                  {t.days.map((d, i) => (
                    <div key={`${d}-${i}`} className={`text-center text-[10px] font-bold uppercase tracking-tighter mb-1 ${isLight ? 'text-gray-400' : 'text-[#555]'}`}>{d}</div>
                  ))}
                  {calendarDays.map((day, i) => {
                    const hasMeditation = day.minutes && day.minutes > 0;
                    
                    // GitHub style color scale
                    const getHeatmapColor = (minutes: number) => {
                      if (!minutes || minutes === 0) return isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)'; 
                      if (minutes < 10) return `color-mix(in srgb, var(--accent) 20%, ${isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)'})`; 
                      if (minutes < 20) return `color-mix(in srgb, var(--accent) 45%, ${isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)'})`; 
                      if (minutes < 30) return `color-mix(in srgb, var(--accent) 75%, ${isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)'})`; 
                      return 'var(--accent)'; 
                    };

                    const bgColor = getHeatmapColor(day.minutes);

                    return (
                      <div key={i} className="w-full relative pt-[100%]">
                        {!day.empty ? (
                          <div className="absolute inset-0 group p-[1px] outline-none" tabIndex={0}>
                            <div 
                              className={`
                                w-full h-full rounded-[4px] transition-all duration-300 cursor-pointer
                                hover:scale-110 hover:ring-1 ${isLight ? 'hover:ring-black/10' : 'hover:ring-white/30'}
                                group-focus:scale-110 group-focus:ring-1 ${isLight ? 'group-focus:ring-black/10' : 'group-focus:ring-white/30'}
                                ${day.isToday ? `ring-1 ring-[var(--accent)] ring-offset-1 ${isLight ? 'ring-offset-white' : 'ring-offset-[#111]'}` : ''}
                              `}
                              style={{ 
                                backgroundColor: bgColor,
                                boxShadow: (day.isToday && hasMeditation) ? `0 0 10px color-mix(in srgb, var(--accent) 40%, transparent)` : 'none'
                              }}
                            />
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity duration-200 z-50 pointer-events-none whitespace-nowrap">
                              <div className={`${isLight ? 'bg-white border-gray-200 text-gray-900 shadow-xl' : 'bg-[#222] border-[#333] text-[#eee] shadow-xl'} text-[11px] px-2.5 py-1.5 rounded border font-sans flex flex-col items-center`}>
                                <span><span className="font-bold text-[var(--accent)]">{Math.floor(day.minutes)}</span> {t.min}</span>
                                <span className={`${isLight ? 'text-gray-500' : 'text-[#888]'} text-[9px] mt-0.5 capitalize`}>
                                  {new Intl.DateTimeFormat(language, { weekday: 'long' }).format(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day.dayNumber))} {day.dayNumber} {t.months[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                                </span>
                              </div>
                              {/* Arrow */}
                              <div className={`absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent ${isLight ? 'border-t-gray-200' : 'border-t-[#333]'}`}></div>
                              <div className={`absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent ${isLight ? 'border-t-white' : 'border-t-[#222]'} -mt-[1px]`}></div>
                            </div>
                          </div>
                        ) : <div className="absolute inset-0" />}
                      </div>
                    );
                  })}
                </div>
                <div className={`month-stat-line text-[12px] font-sans mt-4 pt-3 border-t ${isLight ? 'text-gray-500 border-gray-100' : 'text-[#555] border-[#1e1e1e]'}`}>
                  • {meditatedDaysInMonth} {t.meditatedDays}
                </div>
              </div>

              {/* Progressione */}
              <div className="progressione-card">
                <div className="flex flex-col mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="card-title text-[18px] text-[#e8e4dc]">{t.progression}</h2>
                    <div className="flex bg-[#1a1a1a] rounded-full p-1">
                      {(['week', 'month', 'year'] as const).map(period => (
                        <button
                          key={period}
                          onClick={() => setChartPeriod(period === 'week' ? 'settimana' : period === 'month' ? 'mese' : 'anno')}
                          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium transition-colors ${
                            (chartPeriod === 'settimana' && period === 'week') || (chartPeriod === 'mese' && period === 'month') || (chartPeriod === 'anno' && period === 'year') ? 'accent-bg-alpha accent-text' : 'text-[#666] hover:text-[#888]'
                          }`}
                        >
                          {t[period]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="card-subtitle text-[12px] text-[#555] font-sans">{t.meditatedMinutes}</span>
                </div>
                
                <div className="h-[160px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#666', fontSize: 10, fontFamily: 'sans-serif' }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#666', fontSize: 10, fontFamily: 'sans-serif' }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      {chartPeriod === 'settimana' && currentChartData[6] && (
                        <ReferenceDot 
                          x={currentChartData[6].name} 
                          y={currentChartData[6].min} 
                          r={0} 
                          stroke="none" 
                          fill="none" 
                          label={(props: any) => {
                            const { x, y } = props;
                            if (x === undefined || y === undefined) return null;
                            const val = currentChartData[6].min;
                            return (
                              <g>
                                <rect 
                                  x={x - 22} 
                                  y={y - 28} 
                                  width={44} 
                                  height={20} 
                                  rx={6} 
                                  fill={isLight ? '#fff' : '#1a1a1a'} 
                                  stroke={isLight ? '#ddd' : '#333'} 
                                  strokeWidth={1} 
                                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                                />
                                <text 
                                  x={x} 
                                  y={y - 15} 
                                  textAnchor="middle" 
                                  fill={chartColor} 
                                  fontSize={10} 
                                  fontWeight="bold"
                                  fontFamily="sans-serif"
                                >
                                  {`${val}m`}
                                </text>
                              </g>
                            );
                          }} 
                        />
                      )}
                      <Area 
                        type="monotone" 
                        dataKey="min" 
                        stroke={chartColor} 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorMin)" 
                        activeDot={{ r: 6, fill: chartColor, stroke: isLight ? '#fff' : '#1a1a1a', strokeWidth: 2 }}
                        dot={(props: any) => {
                          const { cx, cy, payload, index } = props;
                          const isToday = chartPeriod === 'settimana' && index === 6;
                          if (isToday) {
                            return (
                              <circle 
                                key="today-dot"
                                cx={cx} 
                                cy={cy} 
                                r={5} 
                                fill={chartColor} 
                                stroke={isLight ? '#fff' : '#1a1a1a'} 
                                strokeWidth={2}
                                style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}
                              />
                            );
                          }
                          return <></>;
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-8">
              <AchievementsSection 
                className="w-full"
                unlockedBadges={unlockedBadges} 
                userData={{ 
                  sessions, 
                  streak, 
                  totalMinutes: totalMin, 
                  maxSessionDuration: 30, 
                  lateNightSessions: 0 
                }} 
                theme={theme} 
                language={language}
              />
            </div>

          </div>
        </motion.div>
      )}

      {showSettings && (
        <motion.div 
          key="settings"
          id="settings-page"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="settings-content">
            <div className="page-topbar">
              <button className="page-topbar-back" onClick={() => showPage('main')}>←</button>
              <h1 className="page-topbar-title">{t.settings}</h1>
              {hasUnsavedChanges && (
                <button 
                  className="text-[12px] uppercase tracking-wider font-medium text-[var(--accent)] ml-auto px-3 py-1 rounded-full bg-[var(--accent-darkest)] border border-[var(--accent-dark)]"
                  onClick={() => {
                    stopPreview();
                    setInitialSettings({
                      theme, ringGradient, chartColor, endBellEnabled, startDelayEnabled, soundEnabled, vibrationEnabled, startSound, endSound, ambientSound
                    });
                    setHasUnsavedChanges(false);
                    triggerFeedback(null, true);
                    executeShowPage('main');
                  }}
                >
                  {t.save}
                </button>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <div className="section-label text-[10px] tracking-[0.15em] text-[var(--section-label)] uppercase mb-2 pl-1">{t.theme}</div>
                <div className="settings-group">
                  <div className="setting-row" onClick={toggleTheme}>
                    <span className="setting-name">{t.theme}</span>
                    <span className="setting-val" id="themeToggleVal">
                      <span id="themeDot" style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--accent-dark)',display:'inline-block',marginRight:'6px',transition:'background 0.3s'}}></span>
                      <span id="themeLabel">{theme === 'dark' ? t.dark : t.light}</span>
                    </span>
                  </div>
                  <div className={`setting-row ${lastChangedSetting === 'theme' ? 'highlighted' : ''}`}>
                    <span className="setting-name text-[14px] text-[var(--text-secondary)]">{t.ringColor}</span>
                    <div className="flex gap-2">
                      {Object.entries(THEMES).map(([name, gradient]) => (
                        <button
                          key={name}
                          onClick={() => {
                            setRingGradient(gradient);
                            triggerFeedback('theme');
                          }}
                          className={`color-swatch w-6 h-6 rounded-full ${ringGradient === gradient ? 'border-[0.5px] border-[#e8e4dc]' : ''}`}
                          style={{ background: gradient }}
                          title={name}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={`setting-row ${lastChangedSetting === 'chartColor' ? 'highlighted' : ''}`}>
                    <span className="setting-name text-[14px] text-[var(--text-secondary)]">{t.chartColor}</span>
                    <div className="flex gap-2">
                      {[
                        { name: 'Verde', color: '#6dd9a0' },
                        { name: 'Azzurro', color: '#6db4d9' },
                        { name: 'Viola', color: '#b46dd9' },
                        { name: 'Arancione', color: '#d9926d' },
                        { name: 'Bianco', color: '#e8e4dc' }
                      ].map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setChartColor(c.color);
                            triggerFeedback('chartColor');
                          }}
                          className={`color-swatch w-6 h-6 rounded-full ${chartColor === c.color ? 'border-[1px] border-[#e8e4dc]' : 'border-[0.5px] border-[#333]'}`}
                          style={{ background: c.color }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="section-label text-[10px] tracking-[0.15em] text-[#444] uppercase mb-2 pl-1">{t.session}</div>
                <div className="settings-group">
                  <div className={`setting-row ${lastChangedSetting === 'dailyGoal' ? 'highlighted' : ''}`}>
                    <span className="setting-name text-[14px] text-[#aaa]">{t.goal} (min)</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setDailyGoal(Math.max(5, dailyGoal - 5)); triggerFeedback('dailyGoal'); }}
                        className="w-8 h-8 rounded-full bg-[#222] text-[#e8e4dc] flex items-center justify-center hover:bg-[#333]"
                      >-</button>
                      <span className="text-[14px] font-medium text-[#e8e4dc] w-8 text-center">{dailyGoal}</span>
                      <button 
                        onClick={() => { setDailyGoal(Math.min(120, dailyGoal + 5)); triggerFeedback('dailyGoal'); }}
                        className="w-8 h-8 rounded-full bg-[#222] text-[#e8e4dc] flex items-center justify-center hover:bg-[#333]"
                      >+</button>
                    </div>
                  </div>
                  <div className={`bg-[#181818] border border-[#222] rounded-[12px] overflow-hidden ${lastChangedSetting === 'duration' ? 'highlighted' : ''}`}>
                    <div 
                      className="setting-row cursor-pointer"
                      onClick={toggleDurationPicker}
                    >
                      <span className="setting-name text-[14px] text-[#aaa]">{t.sessionDuration}</span>
                      <span className="setting-val flex items-center gap-2 text-[14px] font-medium text-[#e8e4dc]">
                        {isCustomDurationMode ? `${Math.floor(duration / 60)} ${t.minutes}` : (
                          duration === 180 ? `3 ${t.minutes}` :
                          duration === 300 ? `5 ${t.minutes}` :
                          duration === 600 ? `10 ${t.minutes}` :
                          duration === 1800 ? `30 ${t.minutes}` :
                          duration === 3600 ? `60 ${t.minutes}` : `${Math.floor(duration / 60)} ${t.minutes}`
                        )}
                        <span className="arrow text-[#444] text-[12px]">{isDurationPickerOpen ? 'v' : '›'}</span>
                      </span>
                    </div>
                    <div 
                      ref={durationPickerRef}
                      className={`duration-picker ${isDurationPickerOpen ? 'open' : ''} bg-[#141414] px-4`}
                    >
                      <div className="picker-pills flex flex-wrap gap-2 md:gap-4 py-3">
                        {[
                          { label: '3 min', val: 180 },
                          { label: '5 min', val: 300 },
                          { label: '10 min', val: 600 },
                          { label: '30 min', val: 1800 },
                          { label: '60 min', val: 3600 }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => {
                              setDuration(opt.val);
                              setIsCustomDurationMode(false);
                              setIsDurationPickerOpen(false);
                              triggerFeedback('duration');
                            }}
                            className={`picker-pill rounded-[50px] border-[0.5px] md:border-0 md:text-[14px] md:px-5 md:py-2 ${duration === opt.val && !isCustomDurationMode ? 'border-[#888] text-[#e8e4dc] bg-[#222] md:bg-[#444]' : 'border-[#333] text-[#888] bg-[#1a1a1a] md:bg-[#222]'} hover:border-[#555] md:hover:bg-[#333] transition-colors`}
                          >
                            {opt.label}
                          </button>
                        ))}
                        <button
                          onClick={() => setIsCustomDurationMode(true)}
                          className={`picker-pill rounded-[50px] border-[0.5px] md:border-0 md:text-[14px] md:px-5 md:py-2 ${isCustomDurationMode ? 'border-[#888] text-[#e8e4dc] bg-[#222] md:bg-[#444]' : 'border-[#333] text-[#888] bg-[#1a1a1a] md:bg-[#222]'} hover:border-[#555] md:hover:bg-[#333] transition-colors`}
                        >
                          Personalizzato
                        </button>
                      </div>
                      
                      {isCustomDurationMode && (
                        <div className="pb-4 pt-2">
                          <div className="drum-picker">
                            <div 
                              className="drum-track" 
                              id="minutesDrum"
                              onScroll={(e) => {
                                const drum = e.currentTarget;
                                const index = Math.round(drum.scrollTop / 40);
                                setDuration((index + 1) * 60);
                              }}
                            >
                              <div className="drum-item"></div>
                              {Array.from({ length: 120 }, (_, i) => i + 1).map(i => (
                                <div 
                                  key={i} 
                                  className={`drum-item ${Math.floor(duration / 60) === i ? 'selected' : ''}`}
                                >
                                  {i} {t.min}
                                </div>
                              ))}
                              <div className="drum-item"></div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setIsDurationPickerOpen(false);
                              triggerFeedback('duration');
                            }}
                            className="text-[#e8e4dc] bg-[#333] px-4 py-3 mt-3 rounded-lg text-[14px] font-medium w-full"
                          >
                            OK
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`setting-row cursor-pointer ${lastChangedSetting === 'startDelay' ? 'highlighted' : ''}`} id="delayToggleRow" onClick={toggleStartDelay}>
                    <span className="setting-name text-[14px] text-[#aaa]">{t.startDelay}</span>
                    <span className="setting-val flex items-center" id="delayStatus">
                      <span 
                        id="delayDot" 
                        style={{
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          background: startDelayEnabled ? 'var(--accent-dark)' : '#333', 
                          display: 'inline-block', 
                          marginRight: '6px', 
                          transition: 'background 0.3s'
                        }}
                      ></span>
                      <span id="delayLabel" className="text-[14px] font-medium text-[#e8e4dc]">
                        {startDelayEnabled ? t.active : t.inactive}
                      </span>
                    </span>
                  </div>

                  <div className={`setting-row cursor-pointer ${lastChangedSetting === 'endBell' ? 'highlighted' : ''}`} id="endBellRow" onClick={toggleEndBell}>
                    <span className="setting-name text-[14px] text-[#aaa]">{t.endBell}</span>
                    <span className="setting-val flex items-center">
                      <span
                        id="endBellDot"
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: endBellEnabled ? 'var(--accent-dark)' : '#333',
                          display: 'inline-block',
                          marginRight: '6px',
                          transition: 'background 0.3s'
                        }}
                      ></span>
                      <span id="endBellLabel" className="text-[14px] font-medium text-[#e8e4dc]">
                        {endBellEnabled ? t.active : t.inactive}
                      </span>
                    </span>
                  </div>

                  <div className={`setting-row cursor-pointer ${lastChangedSetting === 'bell' ? 'highlighted' : ''}`} onClick={() => toggleBell()}>
                    <span className="setting-name text-[14px] text-[#aaa]">{t.soundFeedback}</span>
                    <span className="setting-val flex items-center">
                      <span
                        id="bellDot"
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: soundEnabled ? 'var(--accent-dark)' : '#333',
                          display: 'inline-block',
                          marginRight: '6px',
                          transition: 'background 0.3s'
                        }}
                      ></span>
                      <span id="bellText" className="text-[14px] font-medium text-[#e8e4dc]">
                        {soundEnabled ? t.active : t.inactive}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="section-label text-[10px] tracking-[0.15em] text-[#444] uppercase mb-2 pl-1">{t.notifications}</div>
                <div className="settings-group">
                  <div className={`setting-row cursor-pointer ${lastChangedSetting === 'notifications' ? 'highlighted' : ''}`} onClick={toggleNotifications}>
                    <span className="setting-name text-[14px] text-[#aaa]">{t.enableNotifications}</span>
                    <span className="setting-val flex items-center">
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: notificationsEnabled ? 'var(--accent-dark)' : '#333',
                          display: 'inline-block',
                          marginRight: '6px',
                          transition: 'background 0.3s'
                        }}
                      ></span>
                      <span className="text-[14px] font-medium text-[#e8e4dc]">
                        {notificationsEnabled ? t.active : t.inactive}
                      </span>
                    </span>
                  </div>
                  {notificationsEnabled && (
                    <div className={`setting-row ${lastChangedSetting === 'reminderTime' ? 'highlighted' : ''}`}>
                      <span className="setting-name text-[14px] text-[#aaa]">{t.reminderTime}</span>
                      <input 
                        type="time" 
                        value={reminderTime} 
                        onChange={(e) => {
                          setReminderTime(e.target.value);
                          localStorage.setItem('zenly_reminderTime', e.target.value);
                          triggerFeedback('reminderTime');
                        }}
                        className="bg-[#1a1a1a] text-[#e8e4dc] border border-[#333] rounded px-2 py-1 text-[14px] outline-none focus:border-[#555]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="sound-section">
                <div className="section-label text-[10px] tracking-[0.15em] text-[#444] uppercase mb-2 pl-1">{t.ambientSound}</div>
                <div className="carousel-wrapper">
                  <button className="carousel-arrow carousel-arrow-left" ref={leftBtnRef} onClick={() => scrollCarousel(-1)}>
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </button>

                  <div className={`sound-carousel ${lastChangedSetting === 'ambient' ? 'highlighted' : ''}`} id="soundCarousel" ref={carouselRef}>
                    {AMBIENT_SOUNDS.map((sound) => (
                      <div 
                        key={sound.id}
                        className={`sound-card ${ambientSound === sound.id ? 'active' : ''}`} 
                        onClick={() => {
                          setAmbientSound(sound.id);
                          stopPreview();
                          localStorage.setItem('zenly_ambientSound', sound.id);
                          localStorage.setItem('zenly_ambientSoundUrl', sound.url || '');
                          
                          // Also update start/end sounds to match selected sound
                          setStartSound(sound.url || '');
                          setEndSound(sound.url || '');
                          localStorage.setItem('zenly_startSound', sound.url || '');
                          localStorage.setItem('zenly_endSound', sound.url || '');

                          if (sound.url) {
                            preloadBellBuffer(sound.url);
                            // Use the new previewSound logic
                            previewSound(sound.url);
                          }

                          triggerFeedback('ambient');
                        }}
                        data-sound={sound.id}
                        data-url={sound.url}
                      >
                        <div className="sound-card-icon">
                          {sound.icon}
                        </div>
                        <span className="sound-card-label">
                          {t.sounds[sound.id as keyof typeof t.sounds] || sound.label}
                        </span>
                        <div className="sound-card-wave">
                          <div className="wave-bar" style={{ animationDelay: '0s' }}></div>
                          <div className="wave-bar" style={{ animationDelay: '0.2s' }}></div>
                          <div className="wave-bar" style={{ animationDelay: '0.4s' }}></div>
                          <div className="wave-bar" style={{ animationDelay: '0.1s' }}></div>
                          <div className="wave-bar" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="carousel-arrow carousel-arrow-right" ref={rightBtnRef} onClick={() => scrollCarousel(1)}>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h2 className="settings-section-title">{t.resetOverview}</h2>
              <div className="settings-group">
                <div className="setting-row">
                  <div className="flex flex-col">
                    <span className="setting-name text-[14px] text-[#aaa]">{t.resetOverview}</span>
                    <span className="text-[12px] text-[#666] mt-1">{t.resetConfirm}</span>
                  </div>
                  <button 
                    onClick={() => setShowResetConfirmModal(true)}
                    className="ml-4 px-4 py-2 bg-[#3a1510] text-[#ff6b6b] border border-[#ff6b6b]/30 rounded-[8px] text-[13px] font-medium whitespace-nowrap hover:bg-[#4a1a15] transition-colors"
                  >
                    {t.stop}
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                stopPreview();
                showPage('main');
              }}
              className="w-full bg-[#e8e4dc] text-[#0a0a0a] border-none rounded-[12px] p-4 font-sans text-[14px] font-medium tracking-[0.05em] uppercase cursor-pointer transition-opacity hover:opacity-90 mt-auto mb-4"
            >
              {t.stop}
            </button>
            <div className="text-center pb-6">
              <span className="text-[10px] text-[#444] tracking-widest uppercase opacity-50">versione 1.0</span>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      {showSavedFeedback && (
        <motion.div 
          className="saved-toast"
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
        >
          <Check size={14} strokeWidth={2.5} />
          <span>{feedbackMessage}</span>
        </motion.div>
      )}
      {selectedArticle && (
        <ArticleView 
          article={selectedArticle} 
          language={language}
          onClose={() => {
            setSelectedArticle(null);
            showPage('insegnamenti');
          }} 
        />
      )}
      <AnimatePresence>
        {editingArticle && (
          <ArticleEditor 
            article={editingArticle} 
            articles={articles}
            onClose={() => setEditingArticle(null)} 
            onSave={async (article) => {
              try {
                await setDoc(doc(db, 'articles', article.id), article);
                setEditingArticle(null);
              } catch (error) {
                console.error("Error saving article:", error);
              }
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteConfirmation && (
          <DeleteConfirmationModal 
            article={deleteConfirmation} 
            onClose={() => setDeleteConfirmation(null)} 
            onConfirm={async () => {
              try {
                const article = deleteConfirmation;
                
                // 1. Delete cover image if it's stored in Firebase Storage
                if (article.imageUrl && article.imageUrl.includes('firebasestorage.googleapis.com')) {
                  try {
                    const imageRef = ref(storage, article.imageUrl);
                    await deleteObject(imageRef);
                  } catch (e) {
                    console.error("Failed to delete cover image:", e);
                  }
                }

                // 2. Delete inline images from the article body
                if (article.body) {
                  const imgRegex = /<img[^>]+src="([^">]+)"/g;
                  let match;
                  while ((match = imgRegex.exec(article.body)) !== null) {
                    const src = match[1];
                    if (src.includes('firebasestorage.googleapis.com')) {
                      try {
                        const inlineImageRef = ref(storage, src);
                        await deleteObject(inlineImageRef);
                      } catch (e) {
                        console.error("Failed to delete inline image:", e);
                      }
                    }
                  }
                }

                // 3. Delete the article document from Firestore
                await deleteDoc(doc(db, 'articles', article.id));
                setDeleteConfirmation(null);
              } catch (error) {
                console.error("Error deleting article:", error);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const ArticleView = ({ article, onClose, language }: { article: Article, onClose: () => void, language: Language }) => {
  const theme = localStorage.getItem('theme') || 'dark';
  const isLight = theme === 'light';
  const t = translations[language];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[250] overflow-y-auto custom-scrollbar ${isLight ? 'bg-white' : 'bg-[#0a0a0a]'}`}
    >
      <div className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b ${isLight ? 'bg-white/90 border-gray-100' : 'bg-[#0a0a0a]/90 border-[#141414]'}`}>
        <button className={`info-back-btn !static !m-0 ${isLight ? 'text-gray-900 hover:bg-gray-100' : ''}`} onClick={onClose}>←</button>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-widest">{article.category}</h2>
        <div className="w-8"></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12 text-center">
          <h1 className={`text-4xl md:text-6xl font-light mb-8 leading-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>{article.title}</h1>
          <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              {article.authorImageUrl ? (
                <img src={article.authorImageUrl} alt={article.author} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User size={14} />
              )}
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{article.readingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('it-IT')}</span>
            </div>
          </div>
        </header>

        <div className={`aspect-video rounded-3xl overflow-hidden mb-12 border ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
          <img 
            src={article.imageUrl || "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=1000&auto=format&fit=crop"} 
            alt={article.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div 
          className={`prose prose-lg max-w-none article-content ${isLight ? '' : 'prose-invert'}`}
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        <footer className="mt-20 pt-12 border-t border-white/10 text-center">
          <button 
            onClick={onClose}
            className={`px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform ${isLight ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
          >
            {t.backToTeachings}
          </button>
        </footer>
      </div>
    </motion.div>
  );
};

const ArticleEditor = ({ article, articles, onClose, onSave }: { article: Article | null, articles: Article[], onClose: () => void, onSave: (article: Article) => void }) => {
  const theme = localStorage.getItem('theme') || 'dark';
  const isLight = theme === 'light';
  const language = (localStorage.getItem('language') as Language) || 'it';
  const t = translations[language];
  const [title, setTitle] = useState(article?.title || '');
  const [category, setCategory] = useState(article?.category || 'Consapevolezza');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [imageUrl, setImageUrl] = useState(article?.imageUrl || '');
  const [author, setAuthor] = useState(article?.author || '');
  const [authorImageUrl, setAuthorImageUrl] = useState(article?.authorImageUrl || '');
  const [readingTime, setReadingTime] = useState(article?.readingTime || '');
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status || 'draft');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingAuthorImage, setIsUploadingAuthorImage] = useState(false);
  const [isNewAuthor, setIsNewAuthor] = useState(!article?.author);
  const [authorToDelete, setAuthorToDelete] = useState<string | null>(null);

  const uniqueAuthors = useMemo(() => {
    const authorsMap = new Map<string, { name: string, imageUrl: string }>();
    articles.forEach(a => {
      if (a.author && !authorsMap.has(a.author)) {
        authorsMap.set(a.author, { name: a.author, imageUrl: a.authorImageUrl || '' });
      }
    });
    return Array.from(authorsMap.values());
  }, [articles]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-4',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: article?.body || '',
    editorProps: {
      attributes: {
        class: `prose ${theme === 'light' ? '' : 'prose-invert'} prose-sm max-w-none focus:outline-none min-h-[200px]`,
      },
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `Insegnamenti immagini/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setImageUrl(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Errore durante il caricamento dell'immagine.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAuthorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAuthorImage(true);
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `author_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `Autori immagini/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setAuthorImageUrl(downloadURL);
    } catch (error) {
      console.error("Error uploading author image:", error);
      alert("Errore durante il caricamento dell'immagine autore.");
    } finally {
      setIsUploadingAuthorImage(false);
    }
  };

  const handleUpdateExistingAuthorImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !author) return;

    setIsUploadingAuthorImage(true);
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `author_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `Autori immagini/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setAuthorImageUrl(downloadURL);
      
      const batch = writeBatch(db);
      articles.filter(a => a.author === author).forEach(a => {
        const articleRef = doc(db, 'articles', a.id);
        batch.update(articleRef, { authorImageUrl: downloadURL });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error updating author image:", error);
      alert("Errore durante l'aggiornamento della foto autore.");
    } finally {
      setIsUploadingAuthorImage(false);
    }
  };

  const handleDeleteAuthor = async () => {
    if (!author) return;
    
    try {
      const batch = writeBatch(db);
      articles.filter(a => a.author === author).forEach(a => {
        const articleRef = doc(db, 'articles', a.id);
        batch.update(articleRef, { author: '', authorImageUrl: '' });
      });
      await batch.commit();
      setAuthor('');
      setAuthorImageUrl('');
      setAuthorToDelete(null);
    } catch (error) {
      console.error("Error deleting author:", error);
      alert("Errore durante l'eliminazione dell'autore.");
    }
  };

  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `editor_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `Insegnamenti immagini/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      editor.chain().focus().setImage({ src: downloadURL }).run();
    } catch (error) {
      console.error("Error uploading editor image:", error);
      alert("Errore durante il caricamento dell'immagine.");
    }
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const newArticle: Article = {
      id: article?.id || Date.now().toString(),
      title,
      category,
      excerpt,
      body: editor?.getHTML() || '',
      imageUrl,
      author,
      authorImageUrl,
      readingTime,
      status,
      createdAt: article?.createdAt || now,
      publishedAt: status === 'published' ? (article?.publishedAt || now) : (article?.publishedAt || null as any)
    };
    
    const cleanArticle = JSON.parse(JSON.stringify(newArticle));
    onSave(cleanArticle);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`border rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar ${theme === 'light' ? 'bg-white border-gray-200 shadow-2xl' : 'bg-[#1a1a1a] border-white/10'}`}
      >
        <h2 className={`text-xl font-semibold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{article ? 'Modifica Articolo' : 'Nuovo Articolo'}</h2>
        <div className="grid grid-cols-2 gap-6">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Titolo" className={`w-full p-3 border rounded-xl ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-white/5 border-white/10 text-white'}`} />
          <select value={category} onChange={e => setCategory(e.target.value)} className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 accent-ring ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#252525] border-white/10 text-white'}`}>
            <option value="Consapevolezza" className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#1a1a1a] text-white'}>{t.articleCategories?.consapevolezza || 'Consapevolezza'}</option>
            <option value="Respirazione" className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#1a1a1a] text-white'}>{t.articleCategories?.respirazione || 'Respirazione'}</option>
            <option value="Mindfulness" className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#1a1a1a] text-white'}>{t.articleCategories?.mindfulness || 'Mindfulness'}</option>
            <option value="Abitudini" className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#1a1a1a] text-white'}>{t.articleCategories?.abitudini || 'Abitudini'}</option>
            <option value="Meditazione Guidata" className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#1a1a1a] text-white'}>{t.articleCategories?.meditazioneGuidata || 'Meditazione Guidata'}</option>
          </select>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Descrizione breve" className={`w-full p-3 border rounded-xl col-span-2 ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-white/5 border-white/10 text-white'}`} />
          <div className="col-span-2 space-y-2">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Immagine Copertina</label>
            <div className="flex gap-4 items-start">
              <div className="flex-grow">
                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="URL Immagine" className={`w-full p-3 border rounded-xl mb-2 ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-white/5 border-white/10 text-white'}`} />
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                    id="article-image-upload"
                    disabled={isUploading}
                  />
                  <label 
                    htmlFor="article-image-upload"
                    className={`flex items-center justify-center gap-2 w-full p-3 border rounded-xl transition-colors cursor-pointer text-sm font-medium ${isUploading ? 'accent-bg-alpha accent-border-alpha accent-text opacity-50 cursor-not-allowed' : 'accent-bg-alpha accent-border-alpha accent-text hover:opacity-80'}`}
                  >
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {isUploading ? 'Caricamento...' : 'Carica Immagine'}
                  </label>
                </div>
              </div>
              {imageUrl && (
                <div className="w-32 h-32 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                  <img src={imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Autore</label>
            <div className={`p-4 border rounded-xl ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4">
                  <label className={`flex items-center gap-2 cursor-pointer ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    <input type="radio" checked={!isNewAuthor} onChange={() => setIsNewAuthor(false)} />
                    Seleziona esistente
                  </label>
                  <label className={`flex items-center gap-2 cursor-pointer ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    <input type="radio" checked={isNewAuthor} onChange={() => { setIsNewAuthor(true); setAuthor(''); setAuthorImageUrl(''); }} />
                    Nuovo autore
                  </label>
                </div>
              </div>

              {!isNewAuthor ? (
                <div className="space-y-4">
                  <select 
                    value={author} 
                    onChange={e => {
                      const selected = uniqueAuthors.find(a => a.name === e.target.value);
                      setAuthor(e.target.value);
                      if (selected) setAuthorImageUrl(selected.imageUrl);
                    }} 
                    className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 accent-ring ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#252525] border-white/10 text-white'}`}
                  >
                    <option value="" disabled>Seleziona un autore...</option>
                    {uniqueAuthors.map((a, i) => (
                      <option key={i} value={a.name} className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#1a1a1a] text-white'}>{a.name}</option>
                    ))}
                  </select>
                  {author && (
                    <div className="flex items-center gap-4 mt-2">
                      {authorImageUrl ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                          <img src={authorImageUrl} alt="Author" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-white/10 border-white/5'}`}>
                          <User size={24} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {authorImageUrl ? "Foto attuale dell'autore" : "Nessuna foto impostata"}
                        </span>
                        <div className="flex gap-3 items-center">
                          <label className="text-xs accent-text cursor-pointer hover:underline flex items-center gap-1">
                            {isUploadingAuthorImage ? <Loader2 size={12} className="animate-spin" /> : <Edit2 size={12} />}
                            {isUploadingAuthorImage ? 'Caricamento...' : 'Cambia foto'}
                            <input type="file" accept="image/*" className="hidden" onChange={handleUpdateExistingAuthorImage} disabled={isUploadingAuthorImage} />
                          </label>
                          
                          {authorToDelete === author ? (
                            <div className={`flex items-center gap-2 px-2 py-1 rounded-md border ${theme === 'light' ? 'bg-red-50 border-red-200' : 'bg-red-500/10 border-red-500/20'}`}>
                              <span className="text-xs text-red-500 font-medium">Confermi?</span>
                              <button type="button" onClick={handleDeleteAuthor} className="text-xs bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 transition-colors">Sì</button>
                              <button type="button" onClick={() => setAuthorToDelete(null)} className={`text-xs px-2 py-0.5 rounded transition-colors ${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-white/10 text-white hover:bg-white/20'}`}>No</button>
                            </div>
                          ) : (
                            <button type="button" onClick={() => setAuthorToDelete(author)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                              <Trash2 size={12} />
                              Elimina autore
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Nome autore" className={`w-full p-3 border rounded-xl ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#252525] border-white/10 text-white'}`} />
                  <div className="flex gap-4 items-start">
                    <div className="flex-grow">
                      <input type="text" value={authorImageUrl} onChange={e => setAuthorImageUrl(e.target.value)} placeholder="URL Foto Autore" className={`w-full p-3 border rounded-xl mb-2 ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#252525] border-white/10 text-white'}`} />
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAuthorImageUpload}
                          className="hidden" 
                          id="author-image-upload"
                          disabled={isUploadingAuthorImage}
                        />
                        <label 
                          htmlFor="author-image-upload"
                          className={`flex items-center justify-center gap-2 w-full p-3 border rounded-xl transition-colors cursor-pointer text-sm font-medium ${isUploadingAuthorImage ? 'accent-bg-alpha accent-border-alpha accent-text opacity-50 cursor-not-allowed' : 'accent-bg-alpha accent-border-alpha accent-text hover:opacity-80'}`}
                        >
                          {isUploadingAuthorImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                          {isUploadingAuthorImage ? 'Caricamento...' : 'Carica Foto Autore'}
                        </label>
                      </div>
                    </div>
                    {authorImageUrl && (
                      <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                        <img src={authorImageUrl} alt="Author" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <input type="text" value={readingTime} onChange={e => setReadingTime(e.target.value)} placeholder="Tempo di lettura (es. 5 minuti)" className={`w-full p-3 border rounded-xl col-span-2 ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-white/5 border-white/10 text-white'}`} />
          <div className="col-span-2 space-y-2">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Contenuto Articolo</label>
            <div className={`border rounded-xl overflow-hidden ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
              <div className={`flex flex-wrap items-center gap-1 p-2 border-b ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-white/5 border-white/10'}`}>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('bold') ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Grassetto"
                >
                  <span className="font-bold">B</span>
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('italic') ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Corsivo"
                >
                  <span className="italic font-serif">I</span>
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('underline') ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Sottolineato"
                >
                  <UnderlineIcon size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('strike') ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Barrato"
                >
                  <span className="line-through">S</span>
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('heading', { level: 1 }) ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Titolo 1"
                >
                  <span className="font-bold">H1</span>
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Titolo 2"
                >
                  <span className="font-bold">H2</span>
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('heading', { level: 3 }) ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Titolo 3"
                >
                  <span className="font-bold">H3</span>
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().setParagraph().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('paragraph') ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Testo Normale"
                >
                  <Type size={16} />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>

                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive({ textAlign: 'left' }) ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Allinea a sinistra"
                >
                  <AlignLeft size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive({ textAlign: 'center' }) ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Allinea al centro"
                >
                  <AlignCenter size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive({ textAlign: 'right' }) ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Allinea a destra"
                >
                  <AlignRight size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive({ textAlign: 'justify' }) ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Giustifica"
                >
                  <AlignJustify size={16} />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>

                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('bulletList') ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Elenco puntato"
                >
                  <span className="font-bold">• Elenco</span>
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('orderedList') ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Elenco numerato"
                >
                  <span className="font-bold">1. Elenco</span>
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive('blockquote') ? 'accent-bg-solid' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Citazione"
                >
                  <span className="font-serif">" Cit."</span>
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleEditorImageUpload}
                    className="hidden" 
                    id="editor-image-upload"
                  />
                  <label 
                    htmlFor="editor-image-upload"
                    className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10'}`}
                    title="Inserisci Immagine"
                  >
                    <ImageIcon size={16} />
                  </label>
                </div>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>

                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  className={`p-2 rounded-lg transition-colors ${!editor?.can().undo() ? 'opacity-50 cursor-not-allowed' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Annulla"
                >
                  <span>↩</span>
                </button>
                <button 
                  type="button"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  className={`p-2 rounded-lg transition-colors ${!editor?.can().redo() ? 'opacity-50 cursor-not-allowed' : (theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-white/10')}`}
                  title="Ripeti"
                >
                  <span>↪</span>
                </button>
              </div>
              <EditorContent editor={editor} className={`w-full p-3 min-h-[200px] ${theme === 'light' ? 'text-gray-900' : 'text-white'}`} />
            </div>
          </div>
          <div className="col-span-2 flex items-center gap-4">
            <label className={`flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <input type="checkbox" checked={status === 'published'} onChange={e => setStatus(e.target.checked ? 'published' : 'draft')} />
              Pubblicato
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className={`px-4 py-2 rounded-xl transition-colors ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-white/5 hover:bg-white/10 text-white'}`}>Annulla</button>
          <button onClick={handleSave} disabled={isUploading} className={`px-4 py-2 rounded-xl transition-colors ${isUploading ? 'bg-[#c9a87c]/50 cursor-not-allowed' : 'bg-[#c9a87c] text-black hover:bg-[#c9a87c]/90'}`}>Salva</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DeleteConfirmationModal = ({ article, onClose, onConfirm }: { article: Article, onClose: () => void, onConfirm: () => void }) => {
  const theme = localStorage.getItem('theme') || 'dark';
  const isLight = theme === 'light';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`border rounded-3xl p-8 max-w-sm w-full ${isLight ? 'bg-white border-gray-200 shadow-2xl' : 'bg-[#1a1a1a] border-white/10'}`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>Conferma eliminazione</h2>
        <p className={`mb-8 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>Sei sicuro di voler eliminare l'articolo "{article.title}"? Questa azione non può essere annullata.</p>
        <div className="flex gap-4">
          <button onClick={onClose} className={`flex-1 px-4 py-2 rounded-xl transition-colors ${isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-white/5 hover:bg-white/10 text-white'}`}>Annulla</button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2 rounded-xl transition-colors ${isLight ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>Elimina</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
