import { useState } from 'react';
import { STAR_MEANINGS, PALACE_MEANINGS, MUTAGEN_MEANINGS, BRIGHTNESS_MEANINGS, ADJECTIVE_STAR_MEANINGS } from './data/astrologyText';
import { Clock, User, Grid3X3, Sparkles } from 'lucide-react';

// Generates a cohesive paragraph explaining a palace
function generateReading(palace: any, isDecadal: boolean = false, contextOverride: string = '') {
  const majorNames = palace.majorStars.map((s: any) => `${s.name}${s.brightness ? `(${s.brightness})` : ''}`).join('、');
  const isEmpty = palace.majorStars.length === 0;

  let reading = '';

  if (isDecadal) {
    reading += `【這十年的大限階段（${palace.decadal.range[0]}~${palace.decadal.range[1]}歲）】您總體的心境、環境與行事作風，將不侷限於先天的個性，而是會被以下這些能量強烈主導：\n\n`;
  } else {
    // 1. 宮位意義 (Only show for non-decadal)
    if (contextOverride) {
      reading += `【${palace.name} - ${contextOverride}】\n\n`;
    } else {
      reading += `${PALACE_MEANINGS[palace.name] || '此宮位代表特定的生命領域。'}\n\n`;
    }
  }

  // 2. 主星意象
  if (isEmpty) {
    reading += `此階段目前為「空宮」（無主星坐守）。這代表您在這個領域具有極大的可塑性與彈性，但也容易受到外界與環境的影響。\n`;
  } else {
    reading += `主導的星曜是：【${majorNames}】。\n`;
    palace.majorStars.forEach((star: any) => {
      reading += `${STAR_MEANINGS[star.name] || ''} `;
      if (star.brightness && BRIGHTNESS_MEANINGS[star.brightness]) {
        reading += `${BRIGHTNESS_MEANINGS[star.brightness]}。`;
      }
      reading += '\n';

      if (star.mutagen) {
        reading += `➤ 特別注意：此星發生了【${MUTAGEN_MEANINGS[star.mutagen]}】\n`;
      }
    });
  }

  // 3. 輔星與雜曜意象
  const goodStars = (palace.minorStars || []).filter((s: any) => ['文昌','文曲','左輔','右弼','天魁','天鉞','祿存','天馬'].includes(s.name));
  const badStars = (palace.minorStars || []).filter((s: any) => ['擎羊','陀羅','火星','鈴星','地空','地劫'].includes(s.name));
  const allAdjectiveStars = palace.adjectiveStars || [];
  
  if (goodStars.length > 0 || badStars.length > 0 || allAdjectiveStars.length > 0) {
    reading += `\n【輔助與干擾因素】\n`;
    
    goodStars.forEach((star: any) => {
      if (STAR_MEANINGS[star.name]) {
        reading += `✨ ${STAR_MEANINGS[star.name]}\n`;
      } else {
        reading += `✨ 【${star.name}】帶來額外的助力。\n`;
      }
    });

    badStars.forEach((star: any) => {
      if (STAR_MEANINGS[star.name]) {
        reading += `⚠️ ${STAR_MEANINGS[star.name]}\n`;
      } else {
        reading += `⚠️ 【${star.name}】帶來額外的干擾。\n`;
      }
    });
    
    allAdjectiveStars.forEach((star: any) => {
      if (ADJECTIVE_STAR_MEANINGS[star.name]) {
        reading += `✧ ${ADJECTIVE_STAR_MEANINGS[star.name]}\n`;
      }
    });
  }

  return reading;
}

function PalaceDetail({ palace, isDecadal = false, contextOverride = '' }: { palace: any, isDecadal?: boolean, contextOverride?: string }) {
  const readingText = generateReading(palace, isDecadal, contextOverride);

  return (
    <div className="interpretation-card" style={isDecadal ? { border: 'none', boxShadow: 'none', background: 'transparent', padding: 0 } : {}}>
      {isDecadal ? (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '1.1rem', color: '#a78bfa', fontWeight: 'bold' }}>人生階段：{palace.decadal.range[0]}~{palace.decadal.range[1]}歲</div>
          <div style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '1rem' }}>十年大限運勢</div>
        </div>
      ) : (
        <div className="card-header">
          <h3>{palace.name}</h3>
        </div>
      )}
      <div className="card-content">
        {readingText.split('\n').map((paragraph, idx) => (
          paragraph.trim() ? <p key={idx} style={{marginBottom: '0.8rem'}}>{paragraph}</p> : null
        ))}
      </div>
    </div>
  );
}

export default function Interpretation({ astrolabe }: { astrolabe: any }) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'personality' | 'palaces'>('timeline');

  if (!astrolabe || !astrolabe.palaces) return null;

  // Calculate current decadal
  const birthYear = parseInt(astrolabe.solarDate.split('-')[0]);
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear + 1; // 虛歲

  const presentPalace = astrolabe.palaces.find((p: any) => 
    currentAge >= p.decadal.range[0] && currentAge <= p.decadal.range[1]
  );
  
  const pastPalace = presentPalace ? astrolabe.palaces.find((p: any) => 
    p.decadal.range[1] === (presentPalace.decadal.range[0] - 1)
  ) : null;

  const futurePalace = presentPalace ? astrolabe.palaces.find((p: any) => 
    p.decadal.range[0] === (presentPalace.decadal.range[1] + 1)
  ) : null;

  const lifePalace = astrolabe.palaces.find((p: any) => p.name === '命宮');
  const careerPalace = astrolabe.palaces.find((p: any) => p.name === '官祿');
  const wealthPalace = astrolabe.palaces.find((p: any) => p.name === '財帛');

  return (
    <div className="interpretation-container">
      <div className="interpretation-tabs">
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

      <div className="interpretation-content">
        {activeTab === 'timeline' && presentPalace && (
          <div className="interpretation-section fade-in">
            <h3 className="section-title">
              <Sparkles className="inline-icon" /> 時光軌跡 (大限流年運勢)
            </h3>
            <p style={{marginBottom: '1rem', color: '#94a3b8'}}>您目前虛歲 <strong>{currentAge}</strong> 歲。每十年為一個「大限」，這決定了您這十年間的環境變化與心境主軸。</p>
            
            <div className="timeline-grid" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
              
              <div className="timeline-card present-card" style={{ padding: '1.5rem', background: 'rgba(56, 189, 248, 0.05)', borderLeft: '4px solid #38bdf8', borderRadius: '0.5rem' }}>
                <h4 style={{ color: '#38bdf8', fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} /> 現在 (當前大限)
                </h4>
                <PalaceDetail palace={presentPalace} isDecadal={true} />
              </div>
              
              {futurePalace && (
                <div className="timeline-card future-card" style={{ padding: '1.5rem', background: 'rgba(167, 139, 250, 0.05)', borderLeft: '4px solid #a78bfa', borderRadius: '0.5rem' }}>
                  <h4 style={{ color: '#a78bfa', fontSize: '1.3rem', marginBottom: '1rem' }}>
                    👉 未來 (下一階段)
                  </h4>
                  <PalaceDetail palace={futurePalace} isDecadal={true} />
                </div>
              )}
              
              {pastPalace && (
                <div className="timeline-card past-card" style={{ padding: '1.5rem', background: 'rgba(148, 163, 184, 0.05)', borderLeft: '4px solid #94a3b8', borderRadius: '0.5rem' }}>
                  <h4 style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1rem' }}>
                    ⏳ 過去 (前一階段)
                  </h4>
                  <PalaceDetail palace={pastPalace} isDecadal={true} />
                </div>
              )}
              
            </div>
            
            <div className="disclaimer-text mt-4">
              <p>💡 提示：大限代表您這十年的運勢大環境。請注意本命盤的【命宮、官祿、財帛】作為您不變的基底，而大限則是這十年的考驗與機會。</p>
            </div>
          </div>
        )}

        {activeTab === 'personality' && (
          <div className="interpretation-section fade-in">
            <h3 className="section-title">先天命盤核心 (命、官、財)</h3>
            <PalaceDetail palace={lifePalace} contextOverride="核心人格與天賦" />
            <PalaceDetail palace={careerPalace} contextOverride="事業發展與潛能" />
            <PalaceDetail palace={wealthPalace} contextOverride="財富觀念與理財" />
          </div>
        )}

        {activeTab === 'palaces' && (
          <div className="interpretation-section fade-in">
            <h3 className="section-title">全息星盤解碼</h3>
            <div className="palaces-grid-view">
              {astrolabe.palaces.map((palace: any) => (
                <div key={palace.name} className="mini">
                  <PalaceDetail palace={palace} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
