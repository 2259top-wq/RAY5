import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Play, Pause } from 'lucide-react';
import './Tutorial.css';

interface TutorialProps {
  onClose: () => void;
}

const TUTORIAL_SLIDES = [
  {
    title: '第一課：生命宇宙的導航儀',
    subtitle: '何謂紫微斗數？',
    image: '/RAY5/assets/tutorial_astrolabe.png',
    content: '紫微斗數並非迷信，而是一套傳承千年的「東方生命數據庫」。\n\n想像您的出生時刻是一組宇宙的初始密碼。星盤就是將這組密碼解碼後的「靈魂藍圖」。它不會決定您一生的絕對宿命，而是揭示了您天生的「出廠設定」與「潛能優勢」。\n\n透過星盤，您可以如同擁有上帝視角般，看清自己生命中隱藏的阻力與助力，從而在人生的岔路口做出最優化的選擇。'
  },
  {
    title: '第二課：十二座生命舞台',
    subtitle: '認識十二宮位',
    image: '/RAY5/assets/tutorial_palaces.png',
    content: '星盤周圍環繞的十二個方格，我們稱為「十二宮」。您可以把它們想像成人生這場遊戲中的「十二個不同舞台」。\n\n從代表自我核心的「命宮」、管理財富運作的「財帛宮」、到象徵情感寄託的「夫妻宮」與「福德宮」。每一座舞台都有不同的課題與劇本。\n\n當星曜落入特定的宮位，就如同為該舞台指派了特定的演員與導演，決定了您在該領域會遇到怎樣的精彩故事與挑戰。'
  },
  {
    title: '第三課：星曜的能量磁場',
    subtitle: '解讀星曜的引力',
    image: '/RAY5/assets/tutorial_stars.png',
    content: '星盤中的「星曜」並非天上的實體星星，而是代表不同特質的「能量符號」。\n\n主星（如紫微、貪狼、七殺）代表了該宮位的主要性格與大方向；輔星（如文昌、擎羊、火星）則像是調味料，能增強或改變主星的化學反應。\n\n學習看盤，就是學習解讀這些能量如何互相拉扯、融合。了解您的強勢能量在哪裡，就能順流而上；發現您的弱勢能量，便能提早佈局，這就是「趨吉避凶」的真正涵義。'
  }
];

export default function Tutorial({ onClose }: TutorialProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Auto-advance logic
  useEffect(() => {
    let interval: number;
    let progressInterval: number;
    
    if (isPlaying) {
      // Update progress bar
      progressInterval = window.setInterval(() => {
        setProgress(p => {
          if (p >= 100) return 0;
          return p + (100 / 70); // 7 seconds total (100ms interval = 70 ticks)
        });
      }, 100);

      // Change slide
      interval = window.setInterval(() => {
        setCurrentSlide(curr => {
          if (curr === TUTORIAL_SLIDES.length - 1) {
            setIsPlaying(false); // Stop at the end
            return curr;
          }
          return curr + 1;
        });
        setProgress(0);
      }, 7000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isPlaying, currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const nextSlide = () => {
    if (currentSlide < TUTORIAL_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setProgress(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setProgress(0);
    }
  };

  const togglePlay = () => {
    if (currentSlide === TUTORIAL_SLIDES.length - 1 && !isPlaying) {
      setCurrentSlide(0);
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="tutorial-overlay" onClick={onClose}>
      <div className="tutorial-modal" onClick={e => e.stopPropagation()}>
        <button className="tutorial-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="tutorial-content-wrapper">
          <div className="tutorial-image-container">
            <img 
              src={TUTORIAL_SLIDES[currentSlide].image} 
              alt={TUTORIAL_SLIDES[currentSlide].title}
              className="tutorial-image"
            />
            <div className="tutorial-image-overlay"></div>
          </div>
          
          <div className="tutorial-text-container">
            <div className="tutorial-header">
              <span className="tutorial-subtitle">{TUTORIAL_SLIDES[currentSlide].subtitle}</span>
              <h2 className="tutorial-title">{TUTORIAL_SLIDES[currentSlide].title}</h2>
            </div>
            
            <div className="tutorial-body">
              {TUTORIAL_SLIDES[currentSlide].content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="tutorial-controls">
          <button className="control-btn" onClick={prevSlide} disabled={currentSlide === 0}>
            <ChevronLeft size={24} />
          </button>
          
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button className="control-btn" onClick={nextSlide} disabled={currentSlide === TUTORIAL_SLIDES.length - 1}>
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="tutorial-progress-bar-container">
          {TUTORIAL_SLIDES.map((_, idx) => (
            <div 
              key={idx} 
              className={`tutorial-progress-segment ${idx === currentSlide ? 'active' : ''} ${idx < currentSlide ? 'completed' : ''}`}
              onClick={() => goToSlide(idx)}
            >
              <div 
                className="tutorial-progress-fill" 
                style={{ 
                  width: idx === currentSlide && isPlaying ? `${progress}%` : (idx < currentSlide ? '100%' : '0%') 
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
