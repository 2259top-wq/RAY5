import { useState } from 'react';
import type { FormEvent } from 'react';
import { astro } from 'iztro';
import AstrolabeComponent from './Astrolabe';
import Interpretation from './Interpretation';
import Particles from './Particles';
import { ambientSynth } from './utils/audio';
import { Volume2, VolumeX } from 'lucide-react';
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
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [astrolabe, setAstrolabe] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    const state = ambientSynth.toggle();
    setIsPlaying(state);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = astro.bySolar(date, timeIndex, gender, true);
      setAstrolabe(result);
    } catch (err) {
      console.error(err);
      alert('排盤失敗，請檢查輸入的日期與時間！');
    }
  };

  return (
    <>
      <Particles />
      <button 
        className={`audio-btn ${isPlaying ? 'playing' : ''}`} 
        onClick={toggleMusic}
        title="播放/暫停環境音"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <div className="app-container">
        <header className="header">
          <h1>紫微斗數論命</h1>
          <p>基於《紫微斗數全集》與《紫微斗數全書》之古法排盤系統</p>
        </header>

        <main>
          <section className="form-panel">
            <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>國曆出生日期</label>
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
                  {timeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>性別</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value as '男' | '女')}
                >
                  <option value="男">男 (乾造)</option>
                  <option value="女">女 (坤造)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-submit">
              開始排盤
            </button>
          </form>
        </section>

        {astrolabe && (
          <div className="results-container">
            <AstrolabeComponent astrolabe={astrolabe} />
            <Interpretation astrolabe={astrolabe} />
          </div>
        )}
      </main>

      <footer className="disclaimer">
        <p>本服務基於 MIT 開源套件構建，嚴格遵循公有領域之古籍演算法。</p>
        <p>免責聲明：命理結果僅供娛樂與文化研究參考，請勿過度迷信或作為重大決策依據。</p>
      </footer>
    </div>
    </>
  );
}

export default App;
