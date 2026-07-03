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
            <p style={{marginBottom: '1rem', color: '#94a3b8'}}>您目前虛歲 <strong>{currentAge}</strong> 歲。以下為您人生三個重要大限十年期的能量流轉：</p>
            
            <div className="timeline-grid" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div className="interpretation-card present-card" style={{borderColor: '#38bdf8', boxShadow: '0 0 15px rgba(56, 189, 248, 0.15)'}}>
                <div className="card-header"><h3 style={{color: '#38bdf8'}}>現在 (當前大限 {presentPalace.decadal.range[0]}~{presentPalace.decadal.range[1]}歲)</h3></div>
                <div className="card-content">
                  {generateReading(presentPalace, true).split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
              
              {futurePalace && (
                <div className="interpretation-card future-card" style={{opacity: 0.9}}>
                  <div className="card-header"><h3 style={{color: '#a78bfa'}}>未來 (下個大限 {futurePalace.decadal.range[0]}~{futurePalace.decadal.range[1]}歲)</h3></div>
                  <div className="card-content">
                    {generateReading(futurePalace, true).split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
              )}
              
              {pastPalace && (
                <div className="interpretation-card past-card" style={{opacity: 0.7}}>
                  <div className="card-header"><h3 style={{color: '#94a3b8'}}>過去 (前個大限 {pastPalace.decadal.range[0]}~{pastPalace.decadal.range[1]}歲)</h3></div>
                  <div className="card-content">
                    {generateReading(pastPalace, true).split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
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
            
            <div className="interpretation-card">
              <div className="card-content">
                {generateReading(lifePalace, false, '核心人格與天賦').split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            <div className="interpretation-card">
              <div className="card-content">
                {generateReading(careerPalace, false, '事業發展與潛能').split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            <div className="interpretation-card">
              <div className="card-content">
                {generateReading(wealthPalace, false, '財富觀念與理財').split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'palaces' && (
          <div className="interpretation-section fade-in">
            <h3 className="section-title">全息星盤解碼</h3>
            <div className="palaces-grid-view">
              {astrolabe.palaces.map((palace: any) => (
                <div key={palace.name} className="interpretation-card mini">
                  <div className="card-content">
                    {generateReading(palace).split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
