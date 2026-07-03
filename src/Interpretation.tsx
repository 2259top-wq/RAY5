import { useState } from 'react';
import { STAR_MEANINGS, PALACE_MEANINGS, MUTAGEN_MEANINGS, ELEMENT_MEANINGS } from './data/astrologyText';
import { Clock, User, Grid3X3, Sparkles } from 'lucide-react';

// Generates a cohesive paragraph explaining a palace
function generateReading(palace: any, isDecadal: boolean = false, contextOverride: string = '') {
  const majorNames = palace.majorStars.map((s: any) => s.name).join('與');
  const isEmpty = palace.majorStars.length === 0;

  let reading = '';

  if (isDecadal) {
    reading += `在這十年的大限階段（${palace.decadal.range[0]}~${palace.decadal.range[1]}歲），您的總體運勢、環境變化與行事作風，不再侷限於先天的個性，而是會被以下星曜的能量所強烈主導：\n\n`;
  } else {
    // 1. 宮位意義 (Only show for non-decadal)
    if (contextOverride) {
      reading += `【${palace.name} - ${contextOverride}】\n\n`;
    } else {
      reading += `${PALACE_MEANINGS[palace.name]}\n\n`;
    }
  }

  // 2. 主星意象
  if (isEmpty) {
    reading += `此階段目前為「空宮」（無主星駐守）。這意味著您在這個領域的發展具有極大的可塑性與彈性，但也容易受到外界或環境的牽引。`;
  } else {
    reading += `主導核心能量的是【${majorNames}】。\n`;
    palace.majorStars.forEach((star: any) => {
      reading += `${STAR_MEANINGS[star.name] || ''} `;
      if (star.brightness === '庙' || star.brightness === '旺') {
        reading += `由於此星目前處於「廟旺」極佳的亮度，能充分發揮其正面與積極的特質！`;
      } else if (star.brightness === '陷') {
        reading += `不過此星目前處於「落陷」較弱的狀態，需特別留意並克服其潛在的負面特質。`;
      }
      reading += '\n';

      if (star.mutagen) {
        reading += `👉 特別注意：此星發生了${MUTAGEN_MEANINGS[star.mutagen]}\n`;
      }
    });
  }

  // 3. 吉煞星意象
  const goodStars = palace.minorStars.filter((s: any) => ['文昌','文曲','左辅','右弼','天魁','天钺','禄存','天马'].includes(s.name));
  const badStars = palace.minorStars.filter((s: any) => ['擎羊','陀罗','火星','铃星','地空','地劫'].includes(s.name));

  if (goodStars.length > 0 || badStars.length > 0) {
    reading += `\n【輔助與干擾因素】\n`;
    goodStars.forEach((star: any) => {
      reading += `✨ ${STAR_MEANINGS[star.name] || star.name + '帶來加分。'}\n`;
    });
    badStars.forEach((star: any) => {
      reading += `⚠️ ${STAR_MEANINGS[star.name] || star.name + '帶來考驗。'}\n`;
    });
  }

  return reading;
}

function PalaceDetail({ palace, isDecadal = false, contextOverride = '' }: { palace: any, isDecadal?: boolean, contextOverride?: string }) {
  const readingText = generateReading(palace, isDecadal, contextOverride);

  return (
    <div className="interpretation-card">
      <div className="card-header">
        <h3>{isDecadal ? `人生階段：${palace.decadal.range[0]}~${palace.decadal.range[1]}歲` : palace.name}</h3>
        {isDecadal && <span className="card-desc">十年大限運勢</span>}
      </div>
      <div className="card-content">
        {readingText.split('\n').map((paragraph, idx) => (
          paragraph.trim() ? <p key={idx} style={{marginBottom: '0.8rem'}}>{paragraph}</p> : null
        ))}
      </div>
    </div>
  );
}

function PersonalityProfile({ astrolabe }: { astrolabe: any }) {
  const destinyPalace = astrolabe.palaces.find((p: any) => p.name === '命宫');
  const bodyPalace = astrolabe.palaces.find((p: any) => p.isBodyPalace);
  const travelPalace = astrolabe.palaces.find((p: any) => p.name === '迁移');
  
  const elementText = ELEMENT_MEANINGS[astrolabe.fiveElementsClass] || `【${astrolabe.fiveElementsClass}】您的五行屬性為此局。`;

  return (
    <div className="personality-profile">
      <div className="interpretation-card" style={{borderColor: '#fbbf24', boxShadow: '0 0 20px rgba(251, 191, 36, 0.15)'}}>
        <div className="card-header">
          <h3 style={{color: '#fbbf24'}}>🔥 能量基底：{astrolabe.fiveElementsClass}</h3>
        </div>
        <div className="card-content">
          <p>{elementText}</p>
        </div>
      </div>
      
      <h4 style={{marginTop: '2rem', marginBottom: '1rem', color: '#a78bfa'}}>1. 核心真實自我 (內在靈魂)</h4>
      {destinyPalace && <PalaceDetail palace={destinyPalace} contextOverride="代表您天生的性格、天賦潛能與人生核心價值觀。" />}
      
      <h4 style={{marginTop: '2rem', marginBottom: '1rem', color: '#a78bfa'}}>2. 後天發展與隱藏性格 (三十五歲後)</h4>
      {bodyPalace && <PalaceDetail palace={bodyPalace} contextOverride={`您的身宮落在「${bodyPalace.name}」。這代表您中晚年後的人生重心、行為模式與隱藏的性格傾向。`} />}
      
      <h4 style={{marginTop: '2rem', marginBottom: '1rem', color: '#a78bfa'}}>3. 社會面具與外在印象 (人際展現)</h4>
      {travelPalace && <PalaceDetail palace={travelPalace} contextOverride="這代表您在外人眼中的形象、給人的第一印象，以及您處理公眾事務時的面貌。" />}
    </div>
  );
}

export default function Interpretation({ astrolabe }: { astrolabe: any }) {
  const [activeTab, setActiveTab] = useState<'personality' | 'palaces' | 'timeline'>('timeline');

  if (!astrolabe || !astrolabe.palaces) return null;

  // Calculate current decadal
  const birthYear = parseInt(astrolabe.solarDate.split('-')[0]);
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear + 1; // 虛歲

  const currentPalaceIndex = astrolabe.palaces.findIndex((p: any) => 
    currentAge >= p.decadal.range[0] && currentAge <= p.decadal.range[1]
  );
  
  const presentPalace = astrolabe.palaces[currentPalaceIndex];
  const pastPalace = astrolabe.palaces[(currentPalaceIndex - 1 + 12) % 12];
  const futurePalace = astrolabe.palaces[(currentPalaceIndex + 1) % 12];

  return (
    <section className="interpretation-panel">
      <h2>深度命理分析報告</h2>
      <p className="subtitle">依據《紫微斗數全集》演算法產生之白話文詳解</p>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <Clock size={18} /> 時光軌跡 (大限流年)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'personality' ? 'active' : ''}`}
          onClick={() => setActiveTab('personality')}
        >
          <User size={18} /> 先天人格特質
        </button>
        <button 
          className={`tab-btn ${activeTab === 'palaces' ? 'active' : ''}`}
          onClick={() => setActiveTab('palaces')}
        >
          <Grid3X3 size={18} /> 十二宮總覽
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'timeline' && presentPalace && (
          <div className="tab-section timeline-section">
            <img src="/timeline.png" alt="Timeline Banner" className="section-banner" />
            <h3 className="section-title">時光軌跡 (大限流年運勢)</h3>
            <p className="section-intro">您目前虛歲 <strong>{currentAge}</strong> 歲。每十年為一個「大限」，這決定了您這十年間的環境變化與心境主軸。</p>
            
            <div className="timeline-grid">
              <div className="timeline-card present">
                <h4><Sparkles size={20} style={{display:'inline', marginRight: 8, color:'#38bdf8'}}/>現在 (當前大限)</h4>
                <PalaceDetail palace={presentPalace} isDecadal={true} />
              </div>
              <div className="timeline-card future">
                <h4>👉 未來 (下一階段)</h4>
                {futurePalace && <PalaceDetail palace={futurePalace} isDecadal={true} />}
              </div>
              <div className="timeline-card past">
                <h4>⏳ 過去 (前一階段)</h4>
                {pastPalace && <PalaceDetail palace={pastPalace} isDecadal={true} />}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personality' && (
          <div className="tab-section">
            <img src="/destiny.png" alt="Destiny Banner" className="section-banner" />
            <h3 className="section-title">立體化先天人格特質解析</h3>
            <p className="section-intro">不只是命宮，我們透過紫微斗數特有的「五行局」、「身宮」與「遷移宮」三維度交叉分析，為您描繪最真實、完整的內外在性格輪廓。</p>
            <PersonalityProfile astrolabe={astrolabe} />
          </div>
        )}

        {activeTab === 'palaces' && (
          <div className="tab-section">
            <img src="/palaces.png" alt="Palaces Banner" className="section-banner" />
            <h3 className="section-title">十二宮位深度解析</h3>
            <p className="section-intro">以下是您命盤中全部 12 個宮位的詳細白話文解析，建議您挑選最關心的面向閱讀。</p>
            <div className="interpretation-grid">
              {astrolabe.palaces.map((p: any) => (
                <PalaceDetail key={p.name} palace={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
