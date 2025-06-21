"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ExtendedSession } from "../api/auth/[...nextauth]/route";

const LEAGUES = [
  { name: "Madhava", icon: "🕉️", minRounds: 16, minReading: 60, description: "Advanced practitioners", color: "text-green-700" },
  { name: "Keshava", icon: "🧘‍♂️", minRounds: 8, minReading: 30, description: "Intermediate practitioners", color: "text-blue-700" },
  { name: "Bhakta", icon: "🌱", minRounds: 1, minReading: 15, description: "Beginning practitioners starting their journey", color: "text-emerald-700" }
];

function getUserLeague(rounds: number, reading: number) {
  if (rounds >= 16 && reading >= 60) return LEAGUES[0];
  if (rounds >= 8 && reading >= 30) return LEAGUES[1];
  if (rounds >= 1 && reading >= 15) return LEAGUES[2];
  return null;
}

const sampleCalendar = [
  // 7x5 grid (weeks x days)
  [0, 1, 2, 2, 3, 0, 0],
  [1, 2, 3, 3, 2, 1, 0],
  [2, 3, 3, 2, 1, 1, 0],
  [3, 3, 2, 1, 1, 0, 0],
  [2, 2, 1, 0, 0, 0, 0],
];
const calendarColors = ["bg-gray-200", "bg-emerald-200", "bg-emerald-400", "bg-emerald-600"];

const analyticsSample = [
  { label: "Mon", rounds: 90 },
  { label: "Tue", rounds: 80 },
  { label: "Wed", rounds: 78 },
  { label: "Thu", rounds: 85 },
  { label: "Fri", rounds: 92 },
  { label: "Sat", rounds: 97 },
  { label: "Sun", rounds: 88 },
];
const monthlySample = [90, 95, 80, 98];

const leaderboardSample = [
  { name: "Rama N.", icon: "🥇", league: "🌱", streak: 22, score: 1890, avg: 78 },
  { name: "Sita L.", icon: "🥈", league: "🌿", streak: 19, score: 1650, avg: 75 },
  { name: "Laxman B.", icon: "🥉", league: "🧘‍♂️", streak: 15, score: 1420, avg: 72 },
  { name: "Bharata M.", icon: "4", league: "🌾", streak: 12, score: 1280, avg: 69 },
  { name: "You", icon: "🧘", league: "🌱", streak: 0, score: 0, avg: 0, you: true },
];

// Add type for realisation
interface Realisation {
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  bookName?: string;
  readingTime?: string;
  chantingTime?: string;
  notes?: string;
}

const realisationsSample: Realisation[] = [
  { user: "Amit", avatar: "🧘", text: "Chanting today brought me so much peace!", time: "2h ago", likes: 3 },
  { user: "Priya", avatar: "📖", text: "Reading for 30 minutes helped me focus my mind.", time: "4h ago", likes: 5 },
  { user: "Rahul", avatar: "🙏", text: "Devotional service made my day meaningful.", time: "1d ago", likes: 2 },
  { user: "Sita", avatar: "🌱", text: "I felt connected to the community!", time: "2d ago", likes: 4 },
];

const TABS = [
  { key: "home", icon: "🏠", label: "Home" },
  { key: "leaderboard", icon: "🏆", label: "Leaderboard" },
  { key: "analytics", icon: "📊", label: "Analytics" },
  { key: "realisations", icon: "💬", label: "Realisations" },
];

const MOTIVATIONS = [
  "Every day is a new chance to grow spiritually.",
  "Consistency is the key to transformation.",
  "Your habits shape your destiny.",
  "Together, we rise higher!",
  "Small steps, big changes."
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState<Array<{ date: string; rounds: number; reading_time: number }>>([]);
  const [form, setForm] = useState({
    realisation: '',
    readingTime: '',
    bookName: '',
    chantingTime: '',
    notes: ''
  });
  const [realisations, setRealisations] = useState<Realisation[]>(realisationsSample);
  // Streak gamification state
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [challengeDoneToday, setChallengeDoneToday] = useState(false);
  const user = { name: "You", avatar: "🧘", streak: 0, xp: 0 };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session) return;

      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as ExtendedSession)?.accessToken}`
        };

        const response = await fetch('http://127.0.0.1:8000/auth/post-sadhana/', {
          method: 'GET',
          headers: headers
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.stats || []);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [session]);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRealisations([
      { user: user.name, avatar: user.avatar, text: form.realisation, time: 'just now', likes: 0, readingTime: form.readingTime, bookName: form.bookName, chantingTime: form.chantingTime, notes: form.notes },
      ...realisations
    ]);
    setForm({ realisation: '', readingTime: '', bookName: '', chantingTime: '', notes: '' });
  }

  function handleLike(idx: number) {
    setRealisations(realisations.map((r, i) => i === idx ? { ...r, likes: (r.likes || 0) + 1 } : r));
  }

  // Handle daily challenge done
  function handleChallengeDone() {
    if (!challengeDoneToday) {
      setChallengeDoneToday(true);
      setStreak(s => {
        const newStreak = s + 1;
        setBestStreak(b => Math.max(b, newStreak));
        return newStreak;
      });
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center">
        <div className="text-2xl text-green-700">Loading...</div>
      </div>
    );
  }

  // Today's stats
  const today = new Date().toISOString().slice(0, 10);
  const todayStats = stats.find(s => s.date === today) || { rounds: 0, reading_time: 0 };
  const league = getUserLeague(todayStats.rounds, todayStats.reading_time) || LEAGUES[2];
  const nextLeague = league && LEAGUES[LEAGUES.indexOf(league) - 1];
  const progressToNext = league && nextLeague ?
    Math.min(100, ((todayStats.rounds / nextLeague.minRounds + todayStats.reading_time / nextLeague.minReading) / 2) * 100)
    : 100;

  // Analytics stats summary (static for now)
  const avgRounds = 13;
  const avgReading = 48;

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans flex">
      {/* Left Sidebar Nav */}
      <aside className="sticky top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 flex flex-col items-center py-8 gap-4 shadow-sm z-40">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl w-16 transition-all ${activeTab === tab.key ? 'bg-green-100 text-green-800 shadow font-bold scale-110' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top User Info Bar */}
        <header className="sticky top-0 z-30 bg-[#f7f6f2] flex items-center justify-end px-6 py-2"></header>
        <main className="max-w-5xl mx-auto px-2 py-6 w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.section key="home" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} transition={{duration:0.3}} className="flex flex-col items-center justify-center">
                {/* Streak Display */}
                <div className="w-full max-w-xl flex flex-col items-center mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl">🔥</span>
                    <span className="font-bold text-lg text-green-700">Streak: {streak} days</span>
                    <span className="text-gray-500 text-sm">(Best: {bestStreak})</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className="bg-green-400 h-3 rounded-full" style={{ width: `${Math.min(100, (streak % 7) * 100 / 7)}%` }}></div>
                  </div>
                </div>
                {/* Daily Challenge Card */}
                <DailyChallengeCard challengeDoneToday={challengeDoneToday} onMarkDone={handleChallengeDone} />
                {/* Realisation + Sadhana Form */}
                <form onSubmit={handleFormSubmit} className="w-full max-w-xl bg-white rounded-2xl shadow p-8 flex flex-col gap-4 mt-8">
                  <div className="text-xl font-bold text-green-700 mb-2 flex items-center gap-2"><span>📝</span> Share Your Realisation</div>
                  <label className="block">
                    <span className="text-gray-700 font-semibold flex items-center gap-2"><span>💬</span> Realisation</span>
                    <input name="realisation" value={form.realisation} onChange={handleFormChange} required maxLength={120} className="mt-1 block w-full rounded-lg border-2 border-green-100 focus:border-green-400 px-4 py-2 text-lg" placeholder="What did you realise today?" />
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1">
                      <span className="text-gray-700 font-semibold flex items-center gap-2"><span>📖</span> Book Read</span>
                      <input name="bookName" value={form.bookName} onChange={handleFormChange} className="mt-1 block w-full rounded-lg border-2 border-blue-100 focus:border-blue-400 px-4 py-2 text-lg" placeholder="Book name" />
                    </label>
                    <label className="flex-1">
                      <span className="text-gray-700 font-semibold flex items-center gap-2"><span>⏰</span> Reading Time (min)</span>
                      <input name="readingTime" type="number" value={form.readingTime} onChange={handleFormChange} className="mt-1 block w-full rounded-lg border-2 border-blue-100 focus:border-blue-400 px-4 py-2 text-lg" placeholder="e.g. 30" />
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex-1">
                      <span className="text-gray-700 font-semibold flex items-center gap-2"><span>📿</span> Chanting Time (min)</span>
                      <input name="chantingTime" type="number" value={form.chantingTime} onChange={handleFormChange} className="mt-1 block w-full rounded-lg border-2 border-emerald-100 focus:border-emerald-400 px-4 py-2 text-lg" placeholder="e.g. 60" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-gray-700 font-semibold flex items-center gap-2"><span>🗒️</span> Personal Notes</span>
                    <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={2} className="mt-1 block w-full rounded-lg border-2 border-gray-100 focus:border-gray-400 px-4 py-2 text-lg" placeholder="Any personal notes..." />
                  </label>
                  <button type="submit" className="mt-2 w-full py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-xl shadow-lg text-lg hover:scale-105 transition">Post Realisation</button>
                </form>
              </motion.section>
            )}
            {activeTab === 'analytics' && (
              <motion.section key="analytics" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} transition={{duration:0.3}} className="flex flex-col gap-6">
                {/* League Card */}
                <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col items-center mb-2">
                  <span className="text-3xl mb-2">{league.icon}</span>
                  <span className="text-2xl font-bold text-green-700 mb-1">{league.name} League</span>
                  <span className="text-gray-600 text-base mb-2">Beginning practitioners starting their journey</span>
                </div>
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  <StatCard label="Day Streak" value={0} icon="👍" />
                  <StatCard label="Avg Score" value={0} icon="🟢" />
                  <StatCard label="Total Score" value={0} icon="📈" />
                  <StatCard label="Days Active" value={47} icon="📅" />
                </div>
                {/* Weekly Score Progress (Line Chart) */}
                <div className="bg-blue-50 rounded-xl shadow p-6 mb-2">
                  <div className="text-green-900 font-bold mb-2">Weekly Score Progress</div>
                  {/* Replace with real chart library for production */}
                  <svg width="100%" height="180" viewBox="0 0 350 180" className="w-full">
                    <polyline
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="3"
                      points="20,40 70,50 120,60 170,55 220,45 270,35 320,50"
                    />
                    {analyticsSample.map((d, i) => (
                      <circle key={i} cx={20 + i * 50} cy={180 - d.rounds} r="5" fill="#34d399" />
                    ))}
                    {/* X labels */}
                    {analyticsSample.map((d, i) => (
                      <text key={i} x={20 + i * 50} y={170} fontSize="14" fill="#4b5563" textAnchor="middle">{d.label}</text>
                    ))}
                  </svg>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Daily Targets & League Requirements */}
                  <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col gap-2">
                    <div className="text-green-900 font-bold mb-2">Daily Targets</div>
                    <div className="flex justify-between text-gray-700 mb-1">
                      <span>Chanting Target:</span>
                      <span className="font-bold">4 rounds</span>
                    </div>
                    <div className="flex justify-between text-gray-700 mb-1">
                      <span>Reading Target:</span>
                      <span className="font-bold">15 minutes</span>
                    </div>
                    <div className="text-gray-500 text-sm mt-2">League Requirements:<br />Minimum 1 rounds chanting and 15 minutes reading daily</div>
                  </div>
                  {/* Monthly Average Score (Bar Chart) */}
                  <div className="bg-blue-50 rounded-xl shadow p-6 flex flex-col gap-2">
                    <div className="text-green-900 font-bold mb-2">Monthly Average Score</div>
                    {/* Replace with real chart library for production */}
                    <svg width="100%" height="120" viewBox="0 0 220 120" className="w-full">
                      {monthlySample.map((val, i) => (
                        <rect key={i} x={20 + i * 50} y={120 - val} width="30" height={val} rx="6" fill="#34d399" />
                      ))}
                      {monthlySample.map((_, i) => (
                        <text key={i} x={35 + i * 50} y={115} fontSize="14" fill="#4b5563" textAnchor="middle">Week {i + 1}</text>
                      ))}
                    </svg>
                  </div>
                </div>
              </motion.section>
            )}
            {activeTab === 'leaderboard' && (
              <motion.section key="leaderboard" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} transition={{duration:0.3}} className="flex flex-col gap-6">
                {/* League Card */}
                <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col items-center mb-2">
                  <span className="text-3xl mb-2">{league.icon}</span>
                  <span className="text-2xl font-bold text-green-700 mb-1">{league.name} League</span>
                  <span className="text-gray-600 text-base mb-2">Beginning practitioners starting their journey</span>
                </div>
                {/* Leaderboard List */}
                <div className="bg-blue-50 rounded-xl shadow p-6">
                  {leaderboardSample.map((entry, idx) => (
                    <div key={entry.name} className={`flex items-center justify-between px-4 py-3 rounded-lg mb-2 ${entry.you ? 'bg-green-200 border-2 border-green-400' : 'bg-white'} ${idx === 0 ? 'mt-0' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{entry.icon}</span>
                        <span className="text-xl">{entry.league}</span>
                        <span className="font-bold text-green-900">{entry.name}</span>
                        <span className="text-gray-600 text-sm">{entry.streak} day streak • {entry.score} total score</span>
                      </div>
                      <span className="text-lg font-bold text-green-700">{entry.avg}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
            {activeTab === 'realisations' && (
              <motion.section key="realisations" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} transition={{duration:0.3}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {realisations.map((r, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 items-start relative">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{r.avatar}</span>
                      <span className="font-bold text-green-700">{r.user}</span>
                      <span className="text-xs text-gray-400 ml-2">{r.time}</span>
                    </div>
                    <div className="text-gray-700 text-base mb-1">{r.text}</div>
                    {r.bookName && <div className="text-xs text-blue-700">📖 {r.bookName} <span className="text-gray-400">({r.readingTime} min)</span></div>}
                    {r.chantingTime && <div className="text-xs text-emerald-700">📿 Chanting: {r.chantingTime} min</div>}
                    {r.notes && <div className="text-xs text-gray-500 italic">🗒️ {r.notes}</div>}
                    <button onClick={() => handleLike(idx)} className="absolute top-4 right-4 flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-bold text-sm px-2 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 transition"><span>💚</span> {r.likes}</button>
                  </div>
                ))}
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-blue-50 rounded-xl shadow flex flex-col items-center justify-center p-4 min-w-[90px]">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-green-900 text-xl font-bold">{value}</span>
      <span className="text-gray-600 text-xs mt-1">{label}</span>
    </div>
  );
}

function HabitCard({ title, value, target, icon, streak, onQuickLog }: { title: string; value: number; target: number; icon: string; streak: number; onQuickLog: () => void }) {
  const percent = Math.min(100, (value / target) * 100);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center relative group transition hover:scale-105">
      <div className="absolute top-2 right-2 text-xs bg-violet-100 dark:bg-violet-700 text-violet-700 dark:text-violet-100 rounded px-2 py-0.5">🔥 {streak}d</div>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-lg font-bold mb-1">{title}</div>
      <div className="text-2xl font-bold mb-2">{value} / {target}</div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-2 mb-2">
        <div
          className="bg-gradient-to-r from-violet-400 to-sky-400 h-2 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
      <button
        className="mt-2 px-3 py-1 bg-gradient-to-r from-emerald-400 to-violet-500 text-white rounded hover:scale-110 text-sm font-bold shadow transition"
        onClick={onQuickLog}
      >
        Log
      </button>
    </div>
  );
}

function SetTargetsModal({ targets, onSave, onClose }: { targets: { rounds: number; reading: number }; onSave: (t: any) => void; onClose: () => void }) {
  const [rounds, setRounds] = useState(targets.rounds);
  const [reading, setReading] = useState(targets.reading);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg min-w-[300px]">
        <h3 className="text-lg font-bold mb-4">Set Your Daily Targets</h3>
        <label className="block mb-2">Rounds:
          <input type="number" className="ml-2 border rounded px-2 py-1" value={rounds} onChange={e => setRounds(+e.target.value)} />
        </label>
        <label className="block mb-4">Reading (min):
          <input type="number" className="ml-2 border rounded px-2 py-1" value={reading} onChange={e => setReading(+e.target.value)} />
        </label>
        <button className="bg-violet-500 text-white px-4 py-1 rounded mr-2" onClick={() => { onSave({ rounds, reading }); onClose(); }}>Save</button>
        <button className="px-4 py-1 rounded border" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function DailyChallengeCard({ challengeDoneToday, onMarkDone }: { challengeDoneToday: boolean, onMarkDone: () => void }) {
  const challenge = 'Read 10 extra minutes.';
  return (
    <div className="w-full max-w-xl bg-green-50 border border-green-200 rounded-xl shadow flex flex-col items-center gap-2 p-4 mb-6">
      <div className="flex items-center w-full">
        <span className="text-3xl">🎯</span>
        <div className="flex-1 ml-3">
          <div className="font-bold text-green-700 text-lg mb-1">Daily Challenge</div>
          <div className="text-green-800 text-base">{challenge}</div>
        </div>
        <button
          className={`ml-4 px-4 py-2 rounded-lg font-bold text-white ${challengeDoneToday ? 'bg-emerald-400' : 'bg-green-500 hover:bg-green-600'} transition`}
          onClick={onMarkDone}
          disabled={challengeDoneToday}
        >
          {challengeDoneToday ? 'Done!' : 'Mark as Done'}
        </button>
      </div>
      {challengeDoneToday && (
        <div className="mt-2 text-2xl animate-bounce">🎉</div>
      )}
    </div>
  );
}
