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
  const allMinorStars = palace.minorStars || [];
  const allAdjectiveStars = palace.adjectiveStars || [];
  
  if (allMinorStars.length > 0 || allAdjectiveStars.length > 0) {
    reading += `\n【輔星與神煞點綴】\n`;
    
    allMinorStars.forEach((star: any) => {
      if (STAR_MEANINGS[star.name]) {
        reading += `✦ ${STAR_MEANINGS[star.name]}\n`;
      } else {
        reading += `✦ 【${star.name}】帶來額外的干擾或助力。\n`;
      }
    });
    
    allAdjectiveStars.forEach((star: any) => {
      if (ADJECTIVE_STAR_MEANINGS[star.name]) {
        reading += `✧ 【${star.name}】${ADJECTIVE_STAR_MEANINGS[star.name]}\n`;
      }
    });
  }

  return reading;
}

export default function Interpretation({ astrolabe }: { astrolabe: any }) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'personality' | 'palaces'>('timeline');

  if (!astrolabe) return null;

  const currentDecade = astrolabe.palaces.find((p: any) => p.isCurrentDecadal);
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
        {activeTab === 'timeline' && currentDecade && (
          <div className="interpretation-section fade-in">
            <h3 className="section-title">
              <Sparkles className="inline-icon" /> 當前大限 ({currentDecade.decadal.range[0]}-{currentDecade.decadal.range[1]}歲)
            </h3>
            <div className="interpretation-card">
              <div className="card-content">
                {generateReading(currentDecade, true).split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
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
