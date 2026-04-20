/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Settings, 
  Home, 
  Library, 
  BookOpen, 
  Medal, 
  HelpCircle, 
  ChevronRight,
  ChevronLeft,
  Play, 
  Plus,
  Quote,
  Edit3,
  Camera,
  Zap,
  Trophy,
  User,
  X,
  ShoppingBag,
  Star,
  CreditCard,
  Wallet,
  Calendar
} from 'lucide-react';

// --- Types ---
type View = 'home' | 'library' | 'journal' | 'leaderboard' | 'quiz' | 'shop';

interface UserProfile {
  nickname: string;
  points: number;
}

interface LeaderboardEntry {
  id: string;
  nickname: string;
  points: number;
  isMe?: boolean;
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  totalPages: number;
  progress: number;
  readingLog?: Record<string, number>; // e.g. '2026-04-14': 15 (pages read)
}

interface Product {
  id: string;
  name: string;
  price: number;
  cashPrice: number;
  image: string;
  category: string;
}

// --- Components ---

const BottomNav = ({ currentView, setView }: { currentView: View, setView: (v: View) => void }) => {
  const navItems: { id: View; label: string; icon: any }[] = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'library', label: '서재', icon: Library },
    { id: 'journal', label: '기록장', icon: BookOpen },
    { id: 'shop', label: '상점', icon: ShoppingBag },
    { id: 'leaderboard', label: '리더보드', icon: Trophy },
    { id: 'quiz', label: '퀴즈', icon: HelpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-white/70 backdrop-blur-xl shadow-[0_-12px_24px_rgba(55,46,0,0.06)] rounded-t-[3.5rem]">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center transition-all bounce-active ${
              isActive 
                ? 'bg-tertiary-container text-on-tertiary-container rounded-full px-6 py-3 scale-110 shadow-lg' 
                : 'text-on-surface opacity-60 p-2'
            }`}
          >
            <Icon size={isActive ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`font-bold tracking-wider mt-1 ${isActive ? 'text-xs' : 'text-[10px]'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

const Header = ({ onSettingsClick, profileImage }: { onSettingsClick: () => void; profileImage: string }) => (
  <header className="bg-surface flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50">
    <div className="flex items-center gap-3">
      <button 
        onClick={onSettingsClick}
        className="w-12 h-12 rounded-full overflow-hidden bg-tertiary-container border-2 border-primary-container shadow-sm hover:border-primary transition-colors bounce-active"
      >
        <img 
          alt="프로필" 
          src={profileImage} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </button>
      <h1 className="font-bold text-2xl tracking-tight text-primary">아이독서기록</h1>
    </div>
    <button 
      onClick={onSettingsClick}
      className="text-primary hover:opacity-80 transition-opacity bounce-active"
    >
      <Settings size={28} />
    </button>
  </header>
);

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  nickname, 
  setNickname,
  profileImage,
  setProfileImage
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  nickname: string; 
  setNickname: (n: string) => void;
  profileImage: string;
  setProfileImage: (url: string) => void;
  onResetData: () => void;
}) => {
  const [tempNickname, setTempNickname] = useState(nickname);
  const [tempImage, setTempImage] = useState(profileImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-8 shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-6">
          {/* Profile image with upload */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary-container shadow-lg">
              <img 
                src={tempImage} 
                alt="프로필" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={28} className="text-white" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full shadow-md cursor-pointer">
              <Camera size={16} />
            </div>
          </div>
          <p className="text-xs text-on-surface-variant font-bold -mt-3">사진을 눌러 변경해요!</p>
          
          <div className="w-full space-y-4">
            <h3 className="text-2xl font-bold text-center text-on-surface">프로필 설정</h3>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant ml-2">나의 별명</label>
              <input 
                type="text" 
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
                className="w-full bg-surface-container-low border-2 border-outline-variant rounded-2xl px-6 py-4 text-lg font-bold focus:border-primary outline-none transition-colors"
                placeholder="별명을 입력해줘!"
              />
            </div>
          </div>

          <button 
            onClick={() => {
              setNickname(tempNickname);
              setProfileImage(tempImage);
              onClose();
            }}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-dim transition-colors bounce-active"
          >
            저장하기
          </button>

          <button 
            onClick={() => {
              if (window.confirm('모든 기록이 사라져요! 정말 초기화할까요?')) {
                onResetData();
                onClose();
              }
            }}
            className="w-full mt-4 text-on-surface-variant hover:text-red-500 font-bold text-sm transition-colors"
          >
            기록 모두 초기화하기
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AddBookModal = ({
  isOpen,
  onClose,
  onAddBook
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Book) => void;
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: title.trim(),
      author: author.trim() || '미입력',
      cover: coverPreview || `https://picsum.photos/seed/${Date.now()}/200/300`,
      totalPages: parseInt(totalPages) || 0,
      progress: 0,
    };
    onAddBook(newBook);
    setTitle('');
    setAuthor('');
    setTotalPages('');
    setCoverPreview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-3xl p-8 shadow-2xl relative border border-white"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <BookOpen size={36} />
          </div>
          <h3 className="text-2xl font-black text-on-surface">새 책 등록하기</h3>

          {/* Cover image upload */}
          <label className="group relative cursor-pointer">
            <div className="w-32 h-44 rounded-2xl overflow-hidden bg-surface-container-low border-2 border-dashed border-outline-variant flex items-center justify-center hover:border-primary transition-colors shadow-sm">
              {coverPreview ? (
                <img src={coverPreview} alt="표지" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                  <Camera size={28} />
                  <span className="text-xs font-bold">표지 사진</span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </label>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant ml-2">책 제목 *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/60 backdrop-blur border-2 border-outline-variant rounded-2xl px-5 py-3.5 text-lg font-bold focus:border-primary outline-none transition-colors"
                placeholder="어떤 책을 읽을 거야?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant ml-2">지은이</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-white/60 backdrop-blur border-2 border-outline-variant rounded-2xl px-5 py-3.5 text-lg font-bold focus:border-primary outline-none transition-colors"
                placeholder="누가 쓴 책이야?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant ml-2">전체 쪽수</label>
              <input
                type="number"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                className="w-full bg-white/60 backdrop-blur border-2 border-outline-variant rounded-2xl px-5 py-3.5 text-lg font-bold focus:border-primary outline-none transition-colors"
                placeholder="몇 쪽짜리 책이야?"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all bounce-active ${
              title.trim()
                ? 'bg-primary text-white hover:bg-primary-dim'
                : 'bg-outline-variant text-on-surface-variant opacity-50 cursor-not-allowed'
            }`}
          >
            독서 시작! 📚
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DashboardView = ({ 
  profile, 
  profileImage, 
  onStartReading,
  todayPages,
  dailyGoal
}: { 
  profile: UserProfile; 
  profileImage: string; 
  onStartReading: () => void;
  todayPages: number;
  dailyGoal: number;
}) => {
  const percentage = dailyGoal > 0 ? Math.min(Math.round((todayPages / dailyGoal) * 100), 100) : 0;
  const isGoalMet = percentage >= 100;

  return (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-10 pb-10"
  >
    {/* Greeting Section */}
    <section className="relative bg-surface-container-low rounded-lg p-7 flex flex-col md:flex-row items-center gap-6 overflow-hidden shadow-sm">
      <div className="z-10 text-center md:text-left flex-1">
        <h2 className="text-3xl font-black text-on-primary-container mb-3 -rotate-1">
          안녕, {profile.nickname} 독서가!
        </h2>
        <p className="text-on-surface-variant text-xl leading-relaxed">
          오늘 지금까지 **{todayPages}쪽**의 책을 읽었어.<br />
          {isGoalMet ? '우와! 오늘의 목표를 달성했어! 정말 대단해! ✨' : '목표를 달성할 때까지 조금만 더 힘내보자!'}
        </p>
        <div className="mt-8 flex items-center gap-4 justify-center md:justify-start">
          <button 
            onClick={onStartReading}
            className="bg-gradient-to-r from-primary to-primary-container text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform bounce-active"
          >
            독서 시작하기
          </button>
          <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-xl border-2 border-primary-container/30 flex items-center gap-2">
            <Trophy size={20} className="text-tertiary" fill="currentColor" />
            <span className="font-black text-primary text-lg">{profile.points.toLocaleString()}P</span>
          </div>
        </div>
      </div>
      <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
          <img 
            alt="프로필 사진" 
            className="w-full h-full object-cover" 
            src={profileImage} 
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>

    {/* Stats Grid */}
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-surface-container-lowest rounded-lg p-8 shadow-[0_12px_24px_rgba(55,46,0,0.04)] flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-end mb-5">
            <h3 className="text-2xl font-bold text-primary">오늘의 목표</h3>
            <span className={`font-black text-4xl transition-colors ${isGoalMet ? 'text-tertiary' : 'text-secondary'}`}>
              {percentage}%
            </span>
          </div>
          <div className="w-full h-7 bg-secondary-container/30 rounded-full overflow-hidden border border-outline-variant/10 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              className={`h-full relative rounded-full ${isGoalMet ? 'bg-gradient-to-r from-tertiary to-tertiary-container' : 'bg-secondary'}`}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </motion.div>
          </div>
          <p className="mt-5 text-on-surface-variant font-bold text-lg">
            {dailyGoal}쪽 중 {todayPages}쪽 완료 {isGoalMet && '🎉'}
          </p>
        </div>
        <div className="mt-8 flex gap-4">
          <div className="bg-tertiary-container/30 px-5 py-2.5 rounded-full flex items-center gap-2">
            <Library size={18} className="text-tertiary" />
            <span className="text-tertiary font-bold text-base">3 챕터</span>
          </div>
          <div className="bg-primary-container/20 px-5 py-2.5 rounded-full flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            <span className="text-primary font-bold text-base">5일 연속</span>
          </div>
        </div>
      </div>

      <div className="bg-tertiary-container rounded-lg p-8 shadow-md flex flex-col items-center text-center justify-center border-b-4 border-tertiary/20">
        <Medal size={64} className="text-tertiary mb-4" fill="currentColor" />
        <h4 className="font-bold text-xl text-on-tertiary-container leading-tight">주말 독서 챌린지</h4>
        <p className="text-on-tertiary-container/80 text-base mt-3 leading-relaxed">
          이번 주말에 60분 읽고<br />배지를 획득해봐!
        </p>
        <button className="mt-6 w-full bg-surface-container-lowest text-tertiary font-bold py-3 rounded-full hover:bg-white transition-colors text-base bounce-active">
          참여하기
        </button>
      </div>
    </section>

    {/* Current Book */}
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-on-surface tracking-tight">읽고 있는 책</h3>
        <button className="text-primary font-bold flex items-center gap-1 text-lg bounce-active">
          전체 보기 <ChevronRight size={20} />
        </button>
      </div>
      <div className="bg-surface-container-lowest rounded-lg p-6 flex flex-col sm:flex-row gap-8 items-center shadow-[0_8px_16px_rgba(55,46,0,0.03)] border border-outline-variant/15">
        <div className="w-40 h-56 shrink-0 rounded-xl overflow-hidden shadow-lg rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
          <img 
            alt="책 표지" 
            className="w-full h-full object-cover" 
            src="https://picsum.photos/seed/book1/300/450" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 space-y-5 text-center sm:text-left">
          <div>
            <h4 className="text-2xl font-black text-on-surface">도서관에 간 용</h4>
            <p className="text-on-surface-variant font-bold text-lg mt-1">루이 스토웰 지음</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-base font-bold text-on-surface-variant">
              <span>진행률</span>
              <span>240쪽 중 112쪽</span>
            </div>
            <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[46%]"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="px-4 py-1.5 bg-surface-container-high rounded-full text-sm font-bold text-on-surface-variant">판타지</span>
            <span className="px-4 py-1.5 bg-surface-container-high rounded-full text-sm font-bold text-on-surface-variant">모험</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto items-center">
          <button className="bg-primary text-white p-5 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md bounce-active">
            <Play size={32} fill="currentColor" />
          </button>
          <span className="text-xs uppercase tracking-widest text-center font-black text-on-surface-variant/60">이어 읽기</span>
        </div>
      </div>
    </section>

    {/* Badges */}
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-on-surface tracking-tight">최근 획득 배지</h3>
        <button className="text-primary/60 font-bold text-sm">모두 보기</button>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-6 no-scrollbar px-2">
        {BADGES.map((badge) => (
          <motion.div 
            key={badge.id} 
            whileHover={{ y: -5 }}
            className="flex flex-col items-center gap-3 shrink-0"
          >
            <div className={`
              relative w-28 h-28 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all
              ${TIER_STYLES[badge.tier]}
              ${badge.isLocked ? 'opacity-40 grayscale scale-95' : 'hover:scale-110 active:scale-95'}
            `}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
              <MedalIcon tier={badge.tier} size={64} />
              
              {badge.isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full">
                  <div className="bg-white/90 p-2 rounded-full shadow-md">
                    <Plus size={20} className="text-on-surface-variant rotate-45" />
                  </div>
                </div>
              )}
            </div>
            <span className={`font-black text-base ${badge.isLocked ? 'text-on-surface-variant/40' : 'text-on-surface'}`}>
              {badge.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>

    {/* FAB */}
    <button 
      onClick={onStartReading}
      className="fixed right-6 bottom-36 bg-gradient-to-br from-tertiary to-tertiary-container text-on-tertiary-container w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center hover:rotate-6 transition-all bounce-active z-40"
    >
      <Plus size={36} />
    </button>
  </motion.div>
  );
};

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "해리포터가 처음으로 받은 빗자루의 이름은 무엇인가요?",
    options: [
      { id: 'A', text: '님부스 2000' },
      { id: 'B', text: '파이어볼트' },
      { id: 'C', text: '클린스윕' },
      { id: 'D', text: '혜성' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 2,
    question: "아기돼지 삼형제 중 셋째 돼지가 지은 집의 재료는 무엇인가요?",
    options: [
      { id: 'A', text: '지푸라기' },
      { id: 'B', text: '나무' },
      { id: 'C', text: '벽돌' },
      { id: 'D', text: '얼음' }
    ],
    correctAnswer: 'C'
  },
  {
    id: 3,
    question: "피노키오의 코는 거짓말을 하면 어떻게 되나요?",
    options: [
      { id: 'A', text: '짧아진다' },
      { id: 'B', text: '길어진다' },
      { id: 'C', text: '색깔이 변한다' },
      { id: 'D', text: '재채기를 한다' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 4,
    question: "이상한 나라의 앨리스가 따라간 동물의 이름은 무엇인가요?",
    options: [
      { id: 'A', text: '시계토끼' },
      { id: 'B', text: '체셔고양이' },
      { id: 'C', text: '하트여왕' },
      { id: 'D', text: '미친 모자장수' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 5,
    question: "신데렐라가 유리구두를 벗겨두고 와야 했던 시간은 언제인가요?",
    options: [
      { id: 'A', text: '밤 10시' },
      { id: 'B', text: '밤 11시' },
      { id: 'C', text: '밤 12시' },
      { id: 'D', text: '새벽 1시' }
    ],
    correctAnswer: 'C'
  }
];

const BADGES = [
  { id: 1, name: '첫 걸음', tier: 'bronze', isLocked: false },
  { id: 2, name: '독서 친구', tier: 'silver', isLocked: false },
  { id: 3, name: '페이지 마스터', tier: 'gold', isLocked: true },
  { id: 4, name: '명예의 전당', tier: 'platinum', isLocked: true },
  { id: 5, name: '독서 왕', tier: 'master', isLocked: true },
];

const TIER_STYLES: Record<string, string> = {
  bronze: "bg-gradient-to-br from-[#A0522D] via-[#CD7F32] to-[#8B4513] text-[#F5DEB3] border-[#743A14]/50 shadow-[#A0522D]/20",
  silver: "bg-gradient-to-br from-[#71706E] via-[#C0C0C0] to-[#E5E4E2] text-[#F5F5F5] border-[#4A4A4A]/30 shadow-[#C0C0C0]/20",
  gold: "bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#FFF8E1] border-[#8C6D1F]/40 shadow-[#BF953F]/20",
  platinum: "bg-gradient-to-br from-[#E5E4E2] via-[#F8F8F8] to-[#D1D1D1] text-[#2C3E50] border-[#A0A0A0]/30 shadow-[#E5E4E2]/20",
  master: "bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] text-white border-[#3F00B5]/40 shadow-[0_4px_15px_rgba(142,45,226,0.4)]"
};

const MedalIcon = ({ tier, size = 52 }: { tier: string, size?: number }) => {
  const ribbonColors: Record<string, string> = {
    bronze: "#E53935", // Red
    silver: "#1E88E5", // Blue
    gold: "#3949AB",   // Indigo
    platinum: "#00ACC1", // Teal
    master: "#FFD700"  // Gold ribbon for Master
  };

  const medalGradients: Record<string, string> = {
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
    platinum: "#E5E4E2",
    master: "#9C27B0"
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="drop-shadow-sm"
    >
      {/* Ribbon */}
      <path 
        d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6.1 2h11.8a2 2 0 0 1 1.7.8l1.61 2.14a2 2 0 0 1 .13 2.2L16.79 15" 
        fill={ribbonColors[tier] || "#ccc"}
        stroke="rgba(0,0,0,0.1)"
      />
      {/* Medal Circle */}
      <circle 
        cx="12" 
        cy="15" 
        r="5" 
        fill={medalGradients[tier] || "#999"}
        stroke="rgba(255,255,255,0.4)"
      />
      {/* Medal Inner Shine */}
      <circle 
        cx="11" 
        cy="14" 
        r="2" 
        fill="rgba(255,255,255,0.3)" 
        stroke="none"
      />
    </svg>
  );
};

const QuizView = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleAnswer = (id: string) => {
    if (selectedId) return;

    setSelectedId(id);
    const isCorrect = id === currentQ.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#6750A4', '#FFD700']
      });
    }

    setTimeout(() => {
      if (currentIdx < QUIZ_QUESTIONS.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedId(null);
        setFeedback(null);
      } else {
        setIsFinished(true);
        onComplete(score + (isCorrect ? 1 : 0));
        
        if (score + (isCorrect ? 1 : 0) === QUIZ_QUESTIONS.length) {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#6750A4', '#FFD700', '#B3261E']
          });
        }
      }
    }, 1500);
  };

  if (isFinished) {
    const totalPoints = score * 100;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 space-y-8"
      >
        <div className="w-64 h-64 bg-primary-container/30 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-4 border-dashed border-primary/20 rounded-full"
          />
          <Medal size={120} className="text-primary" />
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-on-surface">퀴즈 완료!</h2>
          <p className="text-2xl text-on-surface-variant font-bold">
            {QUIZ_QUESTIONS.length}문제 중 {score}개를 맞혔어요!
          </p>
        </div>

        <div className="bg-secondary-container/30 p-8 rounded-[2.5rem] border-2 border-white shadow-xl text-center w-full max-w-sm">
          <p className="text-secondary font-black text-lg mb-2">획득한 포인트</p>
          <p className="text-6xl font-black text-primary">+{totalPoints}</p>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          메인으로 돌아가기
        </button>
      </motion.div>
    );
  }

  return (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-8"
  >
    {/* Progress bar with glass effect */}
    <div className="mb-10">
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(55,46,0,0.06)] border border-white">
        <div className="flex justify-between items-end mb-3 px-2">
          <span className="font-bold text-xl text-primary">질문 {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
          <span className="font-bold text-xl text-secondary">{score * 100} 점수</span>
        </div>
        <div className="h-6 w-full bg-white/40 rounded-full overflow-hidden p-1 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500 relative"
            style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-4 order-2 md:order-1 flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -top-16 -right-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white animate-bounce text-base font-bold text-on-surface-variant before:content-[''] before:absolute before:top-full before:left-1/2 before:-ml-2 before:border-8 before:border-transparent before:border-t-white/80">
            정말 잘하고 있어!
          </div>
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/40 backdrop-blur-xl flex items-center justify-center shadow-xl p-4 overflow-hidden transform group-hover:rotate-3 transition-transform border-2 border-white/60">
            <img 
              alt="독서 중인 마스코트" 
              className="w-full h-full object-contain" 
              src="https://picsum.photos/seed/quiz/400/400" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-8 order-1 md:order-2 space-y-6">
        {/* Question card with glassmorphism */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-3xl blur-xl opacity-60 -z-10"></div>
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_12px_32px_rgba(55,46,0,0.08)] border border-white">
            <h2 className="font-bold text-on-surface leading-snug text-3xl md:text-4xl">
              {currentQ.question}
            </h2>
          </div>
        </div>

        {/* Answer options with glassmorphism */}
        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            const isCorrect = opt.id === currentQ.correctAnswer;
            
            let btnClasses = "bg-white/50 border-white/60 shadow-[0_4px_16px_rgba(55,46,0,0.04)]";
            let circleClasses = "bg-primary/90";

            if (isSelected) {
              if (feedback === 'correct') {
                btnClasses = "bg-green-100 border-green-400 shadow-green-200/50";
                circleClasses = "bg-green-500";
              } else {
                btnClasses = "bg-red-100 border-red-400 shadow-red-200/50";
                circleClasses = "bg-red-500";
              }
            } else if (selectedId && isCorrect) {
              btnClasses = "bg-green-50 border-green-200";
              circleClasses = "bg-green-400";
            }

            return (
              <motion.button 
                key={opt.id} 
                onClick={() => handleAnswer(opt.id)}
                whileHover={!selectedId ? { x: 8, scale: 1.02 } : {}}
                className={`group relative flex items-center gap-4 p-5 backdrop-blur-xl rounded-2xl transition-all text-left bounce-active border shadow-[0_8px_32px_rgba(55,46,0,0.1)] ${btnClasses}`}
              >
                {!selectedId && <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-tertiary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>}
                <div className={`w-12 h-12 flex-shrink-0 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl transition-all shadow-md ${circleClasses}`}>
                  {opt.id}
                </div>
                <span className="font-medium text-on-surface-variant text-xl md:text-2xl group-hover:text-on-surface transition-colors">{opt.text}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  </motion.div>
  );
};

const JournalView = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    className="space-y-8"
  >
    <section className="relative">
      <div className="bg-surface-container-low p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center md:items-end">
        <div className="w-48 h-72 rounded-lg bg-surface-container shadow-xl overflow-hidden -rotate-2 transform hover:rotate-0 transition-transform duration-500 flex-shrink-0">
          <img 
            className="w-full h-full object-cover" 
            src="https://picsum.photos/seed/magicforest/300/450" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-4 text-center md:text-left flex-grow">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start font-bold">
            <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-xs tracking-widest uppercase">진행 중인 모험</span>
            <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs tracking-widest uppercase">판타지</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">마법의 숲</h2>
          <p className="text-on-surface-variant text-lg font-medium">엘라라 문빔 지음</p>
          <div className="pt-4">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-on-surface">독서 진행률</span>
              <span className="font-bold text-primary text-2xl">72%</span>
            </div>
            <div className="h-4 bg-surface-container-highest rounded-full w-full overflow-hidden">
              <div className="h-full bg-secondary w-[72%] rounded-full shadow-[0_0_12px_rgba(12,106,36,0.3)]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-lg shadow-[0_4px_24px_rgba(55,46,0,0.04)] border border-outline-variant/15 space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen size={28} className="text-tertiary" />
          <h3 className="text-2xl font-bold text-on-surface">나의 생각</h3>
        </div>
        <div className="bg-surface-container-low p-6 rounded-lg font-handwriting text-2xl leading-relaxed text-on-surface-variant relative min-h-[160px] flex items-center">
          <span className="absolute -top-4 -left-2 text-6xl text-tertiary-container opacity-50">“</span>
          <p className="relative z-10">
            부엉이 바나비가 숨겨진 지도를 찾았을 때 정말 신났어요! 저도 그곳에 함께 있는 것만 같았거든요. 지도가 크리스탈 호수로 이어지는 것 같아요. 내일은 친구들이 '속삭이는 나무들'을 무사히 통과할 수 있을지 더 읽어볼 거예요!
          </p>
          <span className="absolute -bottom-10 -right-2 text-6xl text-tertiary-container opacity-50 rotate-180">“</span>
        </div>
        <button className="w-full py-4 bg-secondary-container text-on-secondary-container rounded-xl font-bold hover:scale-105 transition-transform bounce-active flex items-center justify-center gap-2">
          <Edit3 size={20} />
          기록 수정하기
        </button>
      </div>

      <div className="md:col-span-5 bg-surface-container-high p-6 rounded-lg flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-outline-variant">
        <div className="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-lg">
          <Camera size={36} className="text-primary" />
        </div>
        <div>
          <p className="font-bold text-on-surface text-lg">나의 그림</p>
          <p className="text-on-surface-variant text-sm font-medium">직접 그린 그림이나 좋아하는 페이지의 사진을 올려봐요!</p>
        </div>
        <div className="w-full h-48 rounded-lg bg-surface-container-lowest overflow-hidden">
          <img 
            className="w-full h-full object-cover opacity-50" 
            src="https://picsum.photos/seed/drawing/400/300" 
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="md:col-span-12 bg-tertiary-container p-8 rounded-lg space-y-6">
        <div className="flex items-center gap-3">
          <Quote size={28} className="text-on-tertiary-container" />
          <h3 className="text-2xl font-bold text-on-tertiary-container">기억하고 싶은 문장</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border-l-8 border-secondary">
            <p className="text-xl font-bold text-on-surface font-handwriting leading-tight">"가장 용감한 마음은 가장 작은 생명체에게서 발견된다."</p>
            <p className="text-sm text-secondary font-bold mt-2 uppercase tracking-wide">— 챕터 4</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border-l-8 border-primary">
            <p className="text-xl font-bold text-on-surface font-handwriting leading-tight">"이 숲의 모든 잎사귀는 들려줄 이야기를 간직하고 있다."</p>
            <p className="text-sm text-primary font-bold mt-2 uppercase tracking-wide">— 챕터 11</p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const LeaderboardView = ({ myPoints, myNickname }: { myPoints: number; myNickname: string }) => {
  const dummyLeaderboard: LeaderboardEntry[] = [
    { id: '1', nickname: '책벌레 민수', points: 2500 },
    { id: '2', nickname: '지혜로운 서연', points: 2100 },
    { id: 'me', nickname: myNickname, points: myPoints, isMe: true },
    { id: '3', nickname: '독서왕 지후', points: 1800 },
    { id: '4', nickname: '꿈꾸는 하은', points: 1550 },
  ].sort((a, b) => b.points - a.points);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-primary">독서 랭킹</h2>
        <p className="text-on-surface-variant font-bold text-lg">친구들과 함께 즐겁게 경쟁해봐요!</p>
      </div>

      {/* Leaderboard list with glassmorphism */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 to-tertiary/15 rounded-3xl blur-2xl -z-10"></div>
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(55,46,0,0.08)] border border-white">
          {dummyLeaderboard.map((entry, index) => (
            <motion.div 
              key={entry.id}
              whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.4)' }}
              className={`flex items-center gap-4 px-6 py-5 border-b border-white/40 last:border-0 transition-all cursor-pointer ${
                entry.isMe ? 'bg-primary-container/20 backdrop-blur-sm' : ''
              }`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg shadow-md ${
                index === 0 ? 'bg-gradient-to-br from-tertiary to-tertiary-container text-white' : 
                index === 1 ? 'bg-gradient-to-br from-outline to-outline-variant text-white' : 
                index === 2 ? 'bg-gradient-to-br from-tertiary-dim to-tertiary-container text-white' : 'bg-white/60 text-on-surface-variant'
              }`}>
                {index + 1}
              </div>
              
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/40 border-2 border-white shadow-sm">
                <img 
                  src={`https://picsum.photos/seed/${entry.id}/100/100`} 
                  alt={entry.nickname}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow">
                <p className={`font-bold text-lg ${entry.isMe ? 'text-primary' : 'text-on-surface'}`}>
                  {entry.nickname} {entry.isMe && <span className="text-xs bg-primary/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-lg ml-1 shadow-sm">나</span>}
                </p>
              </div>

              <div className="text-right">
                <p className="font-black text-xl text-primary">{entry.points.toLocaleString()}P</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tip card with glassmorphism */}
      <div className="bg-white/50 backdrop-blur-xl p-6 rounded-3xl flex items-center gap-4 border border-white/60 shadow-[0_4px_16px_rgba(55,46,0,0.04)]">
        <div className="bg-tertiary-container/60 backdrop-blur-sm p-3 rounded-2xl shadow-sm">
          <Zap size={24} className="text-tertiary" fill="currentColor" />
        </div>
        <p className="text-on-tertiary-container font-bold leading-tight">
          책을 한 권 다 읽을 때마다 <span className="text-tertiary">500P</span>를 얻을 수 있어요!
        </p>
      </div>
    </motion.div>
  );
};

const ReadingLogModal = ({
  isOpen,
  onClose,
  book,
  onSavePages
}: {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onSavePages: (bookId: string, dateStr: string, pages: number) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState('');

  if (!isOpen || !book) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const log = book.readingLog || {};
  const readDays = Object.keys(log).filter(k => log[k] > 0).length;
  const totalPagesRead = Object.values(log).reduce((sum, p) => sum + (p || 0), 0);
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setPageInput(log[dateStr] ? String(log[dateStr]) : '');
  };

  const handleSavePageInput = () => {
    if (!selectedDate) return;
    const pages = parseInt(pageInput) || 0;
    onSavePages(book.id, selectedDate, pages);
    setSelectedDate(null);
    setPageInput('');
  };

  const handleDeleteRecord = () => {
    if (!selectedDate) return;
    onSavePages(book.id, selectedDate, 0);
    setSelectedDate(null);
    setPageInput('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white/85 backdrop-blur-xl w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-white max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Book info header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-black text-on-surface">{book.title}</h3>
            <p className="text-sm text-on-surface-variant font-bold">{book.author}</p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-primary" />
                <span className="text-xs font-bold text-primary">{readDays}일 읽음</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={14} className="text-secondary" />
                <span className="text-xs font-bold text-secondary">{totalPagesRead}쪽 읽음</span>
              </div>
              {book.totalPages > 0 && (
                <span className="text-xs font-bold text-on-surface-variant">/ {book.totalPages}쪽</span>
              )}
            </div>
          </div>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="p-2 rounded-xl hover:bg-surface-container transition-colors bounce-active"
          >
            <ChevronLeft size={20} className="text-on-surface-variant" />
          </button>
          <h4 className="font-black text-lg text-on-surface">
            {year}년 {monthNames[month]}
          </h4>
          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="p-2 rounded-xl hover:bg-surface-container transition-colors bounce-active"
          >
            <ChevronRight size={20} className="text-on-surface-variant" />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-on-surface-variant py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const pagesOnDay = log[dateStr] || 0;
            const isRead = pagesOnDay > 0;
            const isToday = dateStr === todayStr;
            const isFuture = new Date(year, month, day) > today;
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={dateStr}
                disabled={isFuture}
                onClick={() => handleDateClick(dateStr)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all bounce-active relative overflow-hidden ${
                  isSelected
                    ? 'bg-tertiary text-white shadow-lg ring-2 ring-tertiary/50 scale-110 z-10'
                    : isRead
                    ? 'bg-primary text-white shadow-md'
                    : isToday
                    ? 'bg-primary-container/40 text-primary border-2 border-primary'
                    : isFuture
                    ? 'text-outline-variant opacity-30 cursor-not-allowed'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex flex-col items-center justify-center flex-grow py-1">
                  <span className="text-sm">{day}</span>
                  {isRead && (
                    <span className="text-[9px] opacity-80 leading-none">{pagesOnDay}p</span>
                  )}
                </div>
                
                {/* Status Bar for pages read */}
                {isRead && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/30">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((pagesOnDay / 50) * 100, 100)}%` }}
                      className="h-full bg-secondary shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Page input popup */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-5 bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white shadow-lg"
            >
              <p className="text-sm font-black text-on-surface mb-3">
                {selectedDate.replace(/-/g, '. ')} 독서 기록
              </p>
              <div className="flex gap-3">
                <div className="flex-grow relative">
                  <input
                    type="number"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    placeholder="오늘 몇 쪽 읽었어?"
                    className="w-full bg-white/80 border-2 border-outline-variant rounded-xl px-4 py-3 text-base font-bold focus:border-primary outline-none transition-colors"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant">쪽</span>
                </div>
                <button
                  onClick={handleSavePageInput}
                  className="bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md bounce-active hover:bg-primary-dim transition-colors"
                >
                  저장
                </button>
              </div>
              {log[selectedDate] && log[selectedDate] > 0 && (
                <button
                  onClick={handleDeleteRecord}
                  className="mt-2 text-xs font-bold text-on-surface-variant hover:text-red-500 transition-colors"
                >
                  이 날 기록 삭제
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        {!selectedDate && (
          <>
            <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary"></div>
                <span className="text-xs font-bold text-on-surface-variant">읽은 날</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-primary bg-primary-container/40"></div>
                <span className="text-xs font-bold text-on-surface-variant">오늘</span>
              </div>
            </div>
            <p className="text-center text-xs text-on-surface-variant font-bold mt-3">날짜를 눌러서 읽은 쪽수를 기록해보세요! 📖</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

const LibraryView = ({ books, onAddBook, onOpenLog }: { books: Book[]; onAddBook: () => void; onOpenLog: (book: Book) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="space-y-12 pb-10"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-primary">나의 책장</h2>
        <p className="text-on-surface-variant font-bold text-lg">최근에 내가 읽은 빛나는 기록들이에요!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
        {books.map((book) => (
          <motion.div 
            key={book.id}
            whileHover={{ y: -12, scale: 1.03 }}
            className="group relative cursor-pointer"
          >
            {/* Subtle glow effect behind the card */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-tertiary/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            
            {/* Glassmorphism Card */}
            <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-4 shadow-[0_8px_32px_rgba(55,46,0,0.06)] border border-white overflow-hidden z-10 transition-all duration-300 group-hover:shadow-[0_12px_44px_rgba(55,46,0,0.12)]">
              
              <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-sm mb-4 bg-surface-container">
                <img 
                  src={book.cover} 
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay gradient on image hover */}
                <div 
                  onClick={() => book.progress < 100 ? onOpenLog(book) : undefined}
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                >
                  <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30">
                    {book.progress < 100 ? '기록 보기' : '완독!'}
                  </span>
                </div>

                {book.progress === 100 && (
                  <div className="absolute top-3 right-3 bg-secondary text-white p-2 rounded-full shadow-lg border-2 border-white">
                    <Medal size={20} fill="currentColor" />
                  </div>
                )}
              </div>
              
              <div className="space-y-3 px-1">
                <h3 className="font-black text-lg text-on-surface truncate group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                
                {/* Progress rendering directly inside the glass card */}
                {book.progress < 100 ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                      <span>읽는 중</span>
                      <span className="text-primary">{book.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000 relative">
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary-container/50 px-3 py-1.5 rounded-lg inline-flex border border-secondary-container">
                    <Zap size={14} fill="currentColor" />
                    <span>완독 완료</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-surface-container-low p-6 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary-container p-3 rounded-2xl">
            <Library size={24} className="text-on-primary-container" />
          </div>
          <div>
            <p className="font-black text-primary">총 {books.length}권의 책</p>
            <p className="text-xs text-on-surface-variant font-bold">더 많은 모험이 기다리고 있어요!</p>
          </div>
        </div>
        <button 
          onClick={onAddBook}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold bounce-active shadow-md"
        >
          책 추가하기
        </button>
      </div>
    </motion.div>
  );
};

const ShopView = ({ points }: { points: number }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentType, setPaymentType] = useState<'points' | 'cash' | null>(null);

  const products: Product[] = [
    { 
      id: 'p0', 
      name: '자개장 거울만들기 키트', 
      price: 2500, 
      cashPrice: 12000,
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop', // A more craft-focused mirror image
      category: '독후활동' 
    },
    { id: 'p1', name: '알록달록 드로잉 키트', price: 1500, cashPrice: 8000, image: 'https://picsum.photos/seed/drawingkit/300/300', category: '독후활동' },
    { id: 'p2', name: '반짝반짝 스티커 팩', price: 500, cashPrice: 3000, image: 'https://picsum.photos/seed/stickers/300/300', category: '꾸미기' },
    { id: 'p3', name: '포근한 독서 램프', price: 3000, cashPrice: 15000, image: 'https://picsum.photos/seed/lamp/300/300', category: '독서용품' },
    { id: 'p4', name: '튼튼한 원목 독서대', price: 5000, cashPrice: 25000, image: 'https://picsum.photos/seed/bookstand/300/300', category: '독서용품' },
    { id: 'p5', name: '마법의 숲 컬러링북', price: 1200, cashPrice: 6000, image: 'https://picsum.photos/seed/coloring/300/300', category: '독후활동' },
  ];

  const handlePurchase = (product: Product, type: 'points' | 'cash') => {
    setSelectedProduct(product);
    setPaymentType(type);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-10"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-primary">포인트 상점</h2>
          <p className="text-on-surface-variant font-bold text-sm">포인트나 결제로 선물을 사봐요!</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border-2 border-primary-container/30 flex items-center gap-2 shadow-sm">
          <Trophy size={18} className="text-tertiary" fill="currentColor" />
          <span className="font-black text-primary">{points.toLocaleString()}P</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.map((product) => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -5 }}
            className="bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-xl border border-outline-variant/10 flex flex-col"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black text-primary uppercase tracking-wider shadow-md">
                {product.category}
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col gap-4">
              <h4 className="font-bold text-on-surface leading-tight text-lg">
                {product.name}
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-tertiary" fill="currentColor" />
                    <span className="font-black text-primary">{product.price.toLocaleString()}P</span>
                  </div>
                  <button 
                    onClick={() => handlePurchase(product, 'points')}
                    disabled={points < product.price}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all bounce-active ${
                      points >= product.price 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-outline-variant text-on-surface-variant opacity-50 cursor-not-allowed'
                    }`}
                  >
                    포인트 구매
                  </button>
                </div>

                <div className="flex items-center justify-between bg-secondary-container/20 p-3 rounded-2xl border border-secondary-container/30">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-secondary" />
                    <span className="font-black text-secondary">{product.cashPrice.toLocaleString()}원</span>
                  </div>
                  <button 
                    onClick={() => handlePurchase(product, 'cash')}
                    className="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md bounce-active hover:bg-secondary-dim transition-colors"
                  >
                    일반 결제
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Modal Simulation */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/50 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-surface-container-lowest w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center gap-6 text-center">
                <div className="w-20 h-20 bg-primary-container rounded-3xl flex items-center justify-center text-primary shadow-inner">
                  {paymentType === 'points' ? <Wallet size={40} /> : <CreditCard size={40} />}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-on-surface">주문 확인</h3>
                  <p className="text-on-surface-variant font-medium">
                    <span className="text-primary font-bold">{selectedProduct.name}</span>을(를)<br />
                    {paymentType === 'points' 
                      ? `${selectedProduct.price.toLocaleString()} 포인트로 구매할까요?` 
                      : `${selectedProduct.cashPrice.toLocaleString()}원으로 결제할까요?`}
                  </p>
                </div>

                <div className="w-full space-y-3 mt-4">
                  <button 
                    onClick={() => {
                      alert('구매가 완료되었습니다! 곧 배송이 시작됩니다 🚚');
                      setSelectedProduct(null);
                    }}
                    className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all bounce-active ${
                      paymentType === 'points' ? 'bg-primary text-white' : 'bg-secondary text-white'
                    }`}
                  >
                    {paymentType === 'points' ? '포인트로 구매하기' : '지금 결제하기'}
                  </button>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="w-full py-4 rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-tertiary-container/20 p-6 rounded-3xl border-2 border-dashed border-tertiary-container flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 bg-tertiary-container rounded-full flex items-center justify-center">
          <Zap size={24} className="text-tertiary" fill="currentColor" />
        </div>
        <p className="text-on-tertiary-container font-bold">
          포인트가 부족하다면?<br />오늘의 독서 퀴즈를 풀고 포인트를 모아보세요!
        </p>
      </div>
    </motion.div>
  );
};

const initialBooks: Book[] = [
  { id: 'b1', title: '자개장 할머니', author: '미상', cover: 'https://picsum.photos/seed/grandma/200/300', totalPages: 180, progress: 100 },
  { id: 'b2', title: '도서관에 간 용', author: '루이 스토웰', cover: 'https://picsum.photos/seed/book1/200/300', totalPages: 240, progress: 46 },
  { id: 'b3', title: '마법의 숲', author: '엘라라 문빔', cover: 'https://picsum.photos/seed/magicforest/200/300', totalPages: 320, progress: 72 },
  { id: 'b4', title: '우주 여행자', author: '미상', cover: 'https://picsum.photos/seed/space/200/300', totalPages: 200, progress: 100 },
  { id: 'b5', title: '바다 속 탐험', author: '미상', cover: 'https://picsum.photos/seed/ocean/200/300', totalPages: 150, progress: 100 },
  { id: 'b6', title: '용감한 다람쥐', author: '미상', cover: 'https://picsum.photos/seed/squirrel/200/300', totalPages: 160, progress: 100 },
  { id: 'b7', title: '구름 나라 이야기', author: '미상', cover: 'https://picsum.photos/seed/clouds/200/300', totalPages: 190, progress: 100 },
];

export default function App() {
  const [view, setView] = useState<View>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('kidsbook-profile');
    return saved ? JSON.parse(saved) : { nickname: '꼬마', points: 1950 };
  });

  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('kidsbook-profile-image') || 'https://picsum.photos/seed/mascot/200/200';
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('kidsbook-books');
    return saved ? JSON.parse(saved) : initialBooks;
  });

  const [selectedLogBook, setSelectedLogBook] = useState<Book | null>(null);

  const DAILY_GOAL = 50; // Daily pages goal

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const todayPages = books.reduce((total, book) => {
    return total + (book.readingLog?.[todayStr] || 0);
  }, 0);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('kidsbook-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('kidsbook-profile-image', profileImage);
  }, [profileImage]);

  useEffect(() => {
    localStorage.setItem('kidsbook-books', JSON.stringify(books));
  }, [books]);

  const handleAddBook = (book: Book) => {
    setBooks(prev => [book, ...prev]);
    setView('library');
  };

  const handleSavePages = (bookId: string, dateStr: string, pages: number) => {
    // 1. Find the target book to check its current state
    const currentBook = books.find(b => b.id === bookId);
    if (!currentBook) return;

    // 2. Pre-calculate the new progress to decide whether to celebrate
    const newLog = { ...(currentBook.readingLog || {}) };
    if (pages > 0) {
      newLog[dateStr] = pages;
    } else {
      delete newLog[dateStr];
    }
    
    const totalRead = Object.values(newLog).reduce((sum, p) => sum + p, 0);
    const newProgress = currentBook.totalPages > 0 
      ? Math.min(Math.round((totalRead / currentBook.totalPages) * 100), 100) 
      : 0;

    const shouldCelebrate = newProgress === 100 && (currentBook.progress || 0) < 100;

    // 3. Update the state
    setBooks(prev => prev.map(b => b.id === bookId ? { 
      ...b, 
      readingLog: newLog,
      progress: newProgress 
    } : b));

    // 4. Fire confetti if just completed
    if (shouldCelebrate) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#FFFFFF', '#6750A4'],
        scalar: 1.2
      });
    }
  };

  const handleResetData = () => {
    localStorage.clear();
    setProfile({ nickname: '꼬마', points: 0 });
    setProfileImage('https://picsum.photos/seed/mascot/200/200');
    setBooks(initialBooks);
  };

  return (
    <div className="min-h-screen pb-32">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} profileImage={profileImage} />
      
      <main className="pt-24 px-6 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home">
              <DashboardView 
                profile={profile} 
                profileImage={profileImage} 
                onStartReading={() => setIsAddBookOpen(true)}
                todayPages={todayPages}
                dailyGoal={DAILY_GOAL}
              />
            </motion.div>
          )}
          {view === 'quiz' && (
            <motion.div key="quiz">
              <QuizView onComplete={(score) => {
                const earned = score * 100;
                setProfile(prev => ({ ...prev, points: prev.points + earned }));
              }} />
            </motion.div>
          )}
          {view === 'journal' && (
            <motion.div key="journal">
              <JournalView />
            </motion.div>
          )}
          {view === 'leaderboard' && (
            <motion.div key="leaderboard">
              <LeaderboardView myPoints={profile.points} myNickname={profile.nickname} />
            </motion.div>
          )}
          {view === 'library' && (
            <motion.div key="library">
              <LibraryView books={books} onAddBook={() => setIsAddBookOpen(true)} onOpenLog={(book) => setSelectedLogBook(book)} />
            </motion.div>
          )}
          {view === 'shop' && (
            <motion.div key="shop">
              <ShopView points={profile.points} />
            </motion.div>
          )}
          {view === 'library_old' && (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-on-surface-variant"
            >
              <Library size={64} className="opacity-20 mb-4" />
              <p className="text-xl font-bold italic">준비 중인 페이지예요!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav currentView={view} setView={setView} />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        nickname={profile.nickname}
        setNickname={(n) => setProfile(prev => ({ ...prev, nickname: n }))}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        onResetData={handleResetData}
      />

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onAddBook={handleAddBook}
      />

      <ReadingLogModal
        isOpen={!!selectedLogBook}
        onClose={() => setSelectedLogBook(null)}
        book={selectedLogBook}
        onSavePages={handleSavePages}
      />
    </div>
  );
}
