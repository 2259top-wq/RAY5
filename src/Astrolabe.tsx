
const gridPosition = [
  { gridRow: 4, gridColumn: 1 }, // 0: 寅
  { gridRow: 3, gridColumn: 1 }, // 1: 卯
  { gridRow: 2, gridColumn: 1 }, // 2: 辰
  { gridRow: 1, gridColumn: 1 }, // 3: 巳
  { gridRow: 1, gridColumn: 2 }, // 4: 午
  { gridRow: 1, gridColumn: 3 }, // 5: 未
  { gridRow: 1, gridColumn: 4 }, // 6: 申
  { gridRow: 2, gridColumn: 4 }, // 7: 酉
  { gridRow: 3, gridColumn: 4 }, // 8: 戌
  { gridRow: 4, gridColumn: 4 }, // 9: 亥
  { gridRow: 4, gridColumn: 3 }, // 10: 子
  { gridRow: 4, gridColumn: 2 }, // 11: 丑
];

function Palace({ data, pos }: { data: any, pos: any }) {
  return (
    <div className="palace" style={pos}>
      <div className="palace-header">
        <span>{data.heavenlyStem}{data.earthlyBranch}</span>
        <span>{data.decadal.range[0]}-{data.decadal.range[1]}</span>
      </div>
      
      <div className="stars-container">
        {data.majorStars.map((s: any, i: number) => (
          <span key={i} className="star major">
            {s.name}
            {s.brightness && <span className="brightness">{s.brightness}</span>}
            {s.mutagen && <span className="mutagen">{s.mutagen}</span>}
          </span>
        ))}
      </div>

      <div className="stars-container">
        {data.minorStars.map((s: any, i: number) => (
          <span key={i} className={`star minor ${s.type || ''}`}>
            {s.name}
          </span>
        ))}
      </div>
      
      <div className="stars-container">
        {data.adjectiveStars.slice(0, 4).map((s: any, i: number) => (
          <span key={i} className={`star adjective ${s.type || ''}`}>
            {s.name}
          </span>
        ))}
      </div>

      <div className="palace-name">
        {data.name}
      </div>
    </div>
  );
}

export default function AstrolabeComponent({ astrolabe }: { astrolabe: any }) {
  if (!astrolabe || !astrolabe.palaces) return null;

  return (
    <section className="astrolabe">
      {astrolabe.palaces.map((palace: any, index: number) => (
        <Palace key={index} data={palace} pos={gridPosition[index]} />
      ))}
      
      <div className="palace-center">
        <div className="center-info">
          <h2>{astrolabe.solarDate}</h2>
          <p>農曆: {astrolabe.lunarDate}</p>
          <p>命主: {astrolabe.sign}</p>
          <p>五行局: {astrolabe.fiveElementsClass}</p>
          <p>身主: {astrolabe.bodySign}</p>
        </div>
      </div>
    </section>
  );
}
