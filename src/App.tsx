import { useState } from 'react';
import type { FormEvent } from 'react';
import { astro } from 'iztro';
import AstrolabeComponent from './Astrolabe';
import Interpretation from './Interpretation';
import Particles from './Particles';
import Tutorial from './Tutorial';
import Masterclass from './Masterclass';
import { ambientSynth } from './utils/audio';
import { Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import './index.css';

const timeOptions = [
  { value: 0, label: '子時 (00:00-01:00)' },
  { value: 1, label: '丑時 (01:00-03:00)' },
  { value: 2, label: '寅時 (03:00-05:00)' },
  { value: 3, label: '卯時 (05:00-07:00)' },
  { value: 4, label: '辰時 (07:00-09:00)' },
  { value: 5, label: '巳時 (09:00-11:00)' },
  { value: 6, label: '午時 (11:00-13:00)' },
  { value: 7, label: '未時 (13:00-15:00)' },
  { value: 8, label: '申時 (15:00-17:00)' },
  { value: 9, label: '酉時 (17:00-19:00)' },
  { value: 10, label: '戌時 (19:00-21:00)' },
  { value: 11, label: '亥時 (21:00-23:00)' },
  { value: 12, label: '夜子時 (23:00-24:00)' },
];

function App() {
  const [date, setDate] = useState('2000-01-01');
  const [timeIndex, setTimeIndex] = useState(6); // Default 午時
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [astrolabe, setAstrolabe] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMasterclass, setShowMasterclass] = useState(false);

  const toggleMusic = () => {
    const state = ambientSynth.toggle();
    setIsPlaying(state);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const genderStr = gender === 'M' ? '男' : '女';
      const result = astro.bySolar(date, timeIndex, genderStr, true, 'zh-TW');
      setAstrolabe(result);
    } catch (err) {
      console.error(err);
      alert('排盤失敗，請檢查輸入的日期與時間。');
    }
  };

  return (
    <div className="app-container">
      <Particles />
      
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      {showMasterclass && <Masterclass onClose={() => setShowMasterclass(false)} />}
      
      <header className="header">
        <h1 className="title">紫微星鑰</h1>
        <p className="subtitle">探索您的生命導航藍圖</p>
        
        <div className="header-actions">
          <button 
            className="tutorial-open-btn"
            onClick={() => setShowTutorial(true)}
          >
            <Sparkles size={16} /> 新手自動導覽
          </button>
          
          <button 
            className="masterclass-open-btn"
            onClick={() => setShowMasterclass(true)}
          >
            <BookOpen size={16} /> 論文級學理指引
          </button>
        </div>
      </header>

      <div className="controls">
        <button 
          className={`audio-btn ${isPlaying ? 'playing' : ''}`}
          onClick={toggleMusic}
          title="播放/暫停環境音"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="input-form glass-panel">
        <div className="input-group">
          <label>西元生日</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label>出生時辰</label>
          <select 
            value={timeIndex}
            onChange={(e) => setTimeIndex(Number(e.target.value))}
          >
            {timeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>生理性別</label>
          <select 
            value={gender}
            onChange={(e) => setGender(e.target.value as 'M' | 'F')}
          >
            <option value="M">男 (乾造)</option>
            <option value="F">女 (坤造)</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">
          開始排盤
        </button>
      </form>

      {astrolabe && (
        <div className="results-container glass-panel">
          <AstrolabeComponent astrolabe={astrolabe} />
          <Interpretation astrolabe={astrolabe} />
        </div>
      )}

      <footer className="disclaimer">
        <p>本服務基於 MIT 開源套件構建，嚴格遵循公有領域之古籍演算法。</p>
        <p>分析內容為原創之現代心理學詮釋，不代表任何宿命論斷。</p>
      </footer>
    </div>
  );
}

export default App;
