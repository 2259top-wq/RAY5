import { useState, useRef, useEffect } from 'react';
import { X, BookOpen, Clock, Atom, Compass, Activity } from 'lucide-react';
import './Masterclass.css';

interface MasterclassProps {
  onClose: () => void;
}

const CHAPTERS = [
  {
    id: 'intro',
    icon: <Compass size={20} />,
    title: '【緒論】宇宙全息論與紫微數學模型',
    content: (
      <>
        <h1>【緒論】宇宙全息論與紫微數學模型</h1>
        <p className="masterclass-lead">紫微斗數並非建立於信仰之上的玄學，而是一套嚴密的「時間與空間數學投影模型」。</p>
        
        <h2>1. 宇宙全息投影 (Holographic Universe)</h2>
        <p>在現代量子物理學的全息宇宙理論（Holographic Principle）中，三維空間的所有資訊，都可以被編碼在一個二維的邊界上。紫微斗數星盤，正是這種全息投影的古老應用。它將您出生那一刻，整個太陽系甚至銀河系的引力分佈、磁場狀態，完整地投影在一張二維的十二宮格矩陣中。</p>
        
        <h2>2. 初始邊界條件 (Initial Boundary Conditions)</h2>
        <p>當我們輸入出生的「年、月、日、時」，實際上是在為這個數學模型輸入「初始邊界條件」。這組座標決定了這個生命體在切入四維時空連續體（Space-time Continuum）時，所攜帶的基礎幾何參數。這就是我們常說的「命運」——它不是宿命論中的必然結果，而是一個機率波函數（Probability Wave Function）的初始分佈。</p>
        
        <div className="masterclass-quote">
          「命盤是一張宇宙發行給您的導航地圖，但方向盤永遠掌握在觀測者（您自己）的手中。」
        </div>
      </>
    )
  },
  {
    id: 'ontology',
    icon: <Clock size={20} />,
    title: '【本體論】時空座標與五行矩陣',
    content: (
      <>
        <h1>【本體論】時空座標與五行矩陣</h1>
        <p className="masterclass-lead">要解碼星盤，必須先理解系統的底層二進制與高階運算元：陰陽與五行。</p>

        <h2>1. 陰陽：宇宙的二進位制 (Binary System)</h2>
        <p>陰（0）與陽（1）構成了宇宙最基礎的資訊編碼。在命盤中，所有的星曜與宮位都被賦予了陰陽屬性。陽性代表發散、顯化、主動的能量（如太陽星）；陰性代表收斂、隱藏、被動的能量（如太陰星）。生命的痛苦往往來自於陰陽能量的失衡，而解盤的目的在於尋找系統的「熱力學平衡（Thermodynamic Equilibrium）」。</p>

        <h2>2. 10天干與12地支：時空向量網格</h2>
        <p>天干（甲乙丙丁等）代表了時間的流動性，是動態的能量函數；地支（子丑寅卯等）代表了空間的方位性，是靜態的物理容器。當天干與地支結合成六十甲子，就形成了一個極其精密的「時空向量矩陣」。您的命宮落在哪一個地支，就決定了您靈魂載體的原始空間結構。</p>

        <h2>3. 五行生剋：能量轉移方程式</h2>
        <p>木、火、土、金、水並非實體的物質，而是五種不同的「能量轉態過程」。木代表擴張生長、火代表輻射爆發、土代表引力凝聚、金代表結構收縮、水代表流動與傳輸。五行的相生相剋，本質上就是這五種能量在系統中進行能量轉移（Energy Transfer）的化學方程式。</p>
      </>
    )
  },
  {
    id: 'phenomenology',
    icon: <BookOpen size={20} />,
    title: '【現象學】十二宮的意識維度',
    content: (
      <>
        <h1>【現象學】十二宮的意識維度</h1>
        <p className="masterclass-lead">十二宮位並非平面的分類，而是人類集體潛意識（Collective Unconscious）投射在物理世界的十二個維度。</p>

        <h2>1. 核心自我層：命、兄、夫、子</h2>
        <p><strong>命宮</strong>是第一維度，是自我意識的奇異點（Singularity），所有運算的起點。<strong>兄弟宮</strong>與<strong>夫妻宮</strong>代表了最親近的平行鏡像，我們透過與平輩及伴侶的碰撞來確認自我的邊界。<strong>子女宮</strong>則是自我能量的向下輻射與創造力展現。</p>

        <h2>2. 社會實踐層：財、疾、遷、交</h2>
        <p><strong>財帛宮</strong>定義了我們與物質世界交換能量（價值）的模式。<strong>疾厄宮</strong>是潛意識的物理具象化，身體的病痛往往是未被處理的心理創傷。<strong>遷移宮</strong>是我們面對未知與外界的公眾面具（Persona）。<strong>交友宮（奴僕）</strong>則是我們在社會網路中的節點連結能力。</p>

        <h2>3. 精神歸宿層：官、田、福、父</h2>
        <p><strong>官祿宮</strong>代表自我實現的軌跡與社會階層的爬升力。<strong>田宅宮</strong>是物質能量的最終儲存槽（黑洞），也是我們內心最深處的安全感來源。<strong>福德宮</strong>主宰了精神熵（Mental Entropy）的高低，決定了我們是否能感受到深層的幸福。<strong>父母宮</strong>則是我們與權威、規則以及上層維度溝通的管道。</p>
      </>
    )
  },
  {
    id: 'dynamics',
    icon: <Atom size={20} />,
    title: '【動力學】星曜的人格量子態',
    content: (
      <>
        <h1>【動力學】星曜的人格量子態</h1>
        <p className="masterclass-lead">星盤中的14顆主星與無數輔星，就像是量子力學中的基本粒子，各自帶有特定的自旋與質量。</p>

        <h2>1. 主星：四大能量家族</h2>
        <p>我們可將14顆主星視為四大類型的「心理原型（Archetypes）」：</p>
        <ul>
          <li><strong>開創型（七殺、破軍、廉貞、貪狼）</strong>：具有極高的動能與不穩定性，如同高能粒子，擅長破壞舊結構並建立新秩序。</li>
          <li><strong>領導型（紫微、天府、武曲、天相）</strong>：質量極大，具有強大的重力場，能夠吸引周圍的資源並建立穩定的系統。</li>
          <li><strong>支援型（太陽、巨門、天機）</strong>：如同光子與傳遞信息的玻色子，擅長溝通、傳播、分析與連結。</li>
          <li><strong>合作型（太陰、天梁、天同）</strong>：具有強大的包容力與吸收力，如同暗物質，提供系統運行所需的緩衝與滋養。</li>
        </ul>

        <h2>2. 雙星疊加與量子糾纏</h2>
        <p>當兩顆主星同處一宮（如紫微七殺），並不是簡單的A+B，而是發生了「量子糾纏（Quantum Entanglement）」。它們會形成一個全新的疊加態，同時展現出帝王（紫微）的威嚴與將軍（七殺）的殺氣，產生極度複雜的化學反應。</p>

        <h2>3. 輔星：系統的催化劑與阻尼器</h2>
        <p>六吉星（左輔右弼等）是系統的「催化劑」，能降低達到目標所需的活化能（Activation Energy）。而六煞星（擎羊陀羅等）並非絕對的壞事，它們是系統的「阻尼器」與「摩擦力」；雖然帶來痛苦與考驗，但也提供了突破現狀所需的強大應力（Stress）。</p>
      </>
    )
  },
  {
    id: 'time',
    icon: <Activity size={20} />,
    title: '【微積分】大限流年的時間函數',
    content: (
      <>
        <h1>【微積分】大限流年的時間函數</h1>
        <p className="masterclass-lead">命盤不是靜態的畫作，而是一組隨時間不斷演進的動態微分方程式（Dynamic Differential Equations）。</p>

        <h2>1. 大限：十年的氣候週期</h2>
        <p>「大限」代表了以十年為單位的總體能量背景。您可以把它想像成經濟學中的「康狄夫長波（Kondratiev Wave）」。當您進入一個新的大限，代表您的生命航線駛入了一個新的星系，環境的引力常數（命盤的重點宮位）發生了轉移。在順風的大限中，微小的努力也能獲得巨大的動能；在逆風的大限中，則需要收斂能量，等待週期反轉。</p>

        <h2>2. 流年：一年的天氣預報</h2>
        <p>「流年」則是每年更迭的短期波動，如同日常的天氣變化。流年星曜會與本命星曜、大限星曜發生「共振（Resonance）」。當三者的能量頻率對齊時，就會引發生命中重大的事件節點（Event Horizon）。</p>

        <h2>3. 趨吉避凶的物理學意涵</h2>
        <p>所謂的「算命」，在科學上的意義是「建立系統的預測模型」。透過理解大限與流年的波峰與波谷，我們可以進行「生命資源的最佳化配置」。在能量低谷時進行學習與防守（累積位能），在能量高峰時全力出擊（轉換為動能），這就是紫微斗數教給我們的最高維度的時間管理學。</p>
        
        <div className="masterclass-quote">
          「沒有絕對的壞運，只有放錯位置的能量。掌握時間函數，您就是自己宇宙的造物主。」
        </div>
      </>
    )
  }
];

export default function Masterclass({ onClose }: MasterclassProps) {
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0].id);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleChapterClick = (id: string) => {
    setActiveChapter(id);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="masterclass-overlay">
      <div className="masterclass-modal glass-panel">
        <button className="masterclass-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="masterclass-layout">
          {/* Sidebar */}
          <div className="masterclass-sidebar">
            <div className="masterclass-header">
              <BookOpen size={28} className="masterclass-logo-icon" />
              <h2>紫微大師課</h2>
              <span className="masterclass-badge">論文級學理</span>
            </div>
            
            <nav className="masterclass-nav">
              {CHAPTERS.map(chapter => (
                <button
                  key={chapter.id}
                  className={`masterclass-nav-item ${activeChapter === chapter.id ? 'active' : ''}`}
                  onClick={() => handleChapterClick(chapter.id)}
                >
                  <span className="nav-icon">{chapter.icon}</span>
                  <span className="nav-title">{chapter.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="masterclass-content-area" ref={contentRef}>
            <div className="masterclass-article">
              {CHAPTERS.find(c => c.id === activeChapter)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
