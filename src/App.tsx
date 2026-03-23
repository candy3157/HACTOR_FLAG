import { useState, useEffect } from 'react';
import { verifyFlag, CHALLENGES } from './utils/flagChecker';
import './index.css';

function App() {
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ctf-solved');
    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse local storage', e);
      return [];
    }
  });
  
  // Track selected challenge (null = List View, string = Detail View)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  // States for the Detailed View form
  const [flagInput, setFlagInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const isChallengeComingSoon = (id: string) => id === 'challenge_2';

  useEffect(() => {
    const orb1 = document.createElement('div');
    const orb2 = document.createElement('div');
    orb1.className = 'bg-orb orb-1';
    orb2.className = 'bg-orb orb-2';
    document.body.appendChild(orb1);
    document.body.appendChild(orb2);

    return () => {
      document.body.removeChild(orb1);
      document.body.removeChild(orb2);
    };
  }, []);

  // When opening a detail view, reset its state
  const openChallenge = (id: string) => {
    if (isChallengeComingSoon(id)) return;

    setSelectedChallengeId(id);
    setFlagInput('');
    setStatus(solvedIds.includes(id) ? 'success' : 'idle');
  };

  const handleInput = (val: string) => {
    setFlagInput(val);
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallengeId || !flagInput.trim()) return;

    setStatus('loading');
    
    const isCorrect = await verifyFlag(selectedChallengeId, flagInput.trim());
    
    if (isCorrect) {
      if (!solvedIds.includes(selectedChallengeId)) {
        setSolvedIds(prev => {
          const newSolved = [...prev, selectedChallengeId];
          localStorage.setItem('ctf-solved', JSON.stringify(newSolved));
          return newSolved;
        });
      }
      setStatus('success');
      createConfetti();
    } else {
      setStatus('error');
      setTimeout(() => {
        setStatus(prev => prev === 'error' ? 'idle' : prev);
      }, 2000);
    }
  };

  const createConfetti = () => {
    type ConfettiPiece = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    };

    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d')!;
    const pieces: ConfettiPiece[] = [];
    const colors = ['#8b5cf6', '#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#ec4899'];

    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height + 50,
        vx: (Math.random() - 0.5) * 30,
        vy: (Math.random() - 1) * 25 - 10,
        size: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.8; 
        p.rotation += p.rotationSpeed;
        if (p.y < canvas.height + 100) active = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
      });

      if (active) requestAnimationFrame(render);
      else if (document.body.contains(canvas)) document.body.removeChild(canvas);
    };
    render();
  };


  // Render Detailed View
  if (selectedChallengeId) {
    const challenge = CHALLENGES.find(c => c.id === selectedChallengeId);
    if (!challenge) return null;
    const isSolved = solvedIds.includes(challenge.id);

    return (
      <>
        <div className="page-header">
          <h1 className="title">HACTOR CTF</h1>
          <p className="subtitle">문제 상세</p>
        </div>

        <div className="detail-view">
          <button className="back-btn" onClick={() => setSelectedChallengeId(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            돌아가기
          </button>

          <div className={`detail-card ${status === 'error' ? 'shake' : ''} ${isSolved ? 'success' : ''}`}>
            <div>
              <h2 className="detail-title">{challenge.title}</h2>
              <p className="detail-desc">{challenge.description}</p>
            </div>

            {isSolved ? (
               <div className="solved-overlay" style={{ marginTop: '0', padding: '20px', fontSize: '1.1rem' }}>
                 🎉 정답을 맞혔습니다! (Challenge Completed)
               </div>
            ) : (
              <form className="action-area" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="flag-input"
                  placeholder="HACTOR{...}"
                  value={flagInput}
                  onChange={(e) => handleInput(e.target.value)}
                  disabled={status === 'loading'}
                  spellCheck="false"
                  autoFocus
                />
                
                {status === 'error' && (
                  <div className="feedback error">플래그가 올바르지 않습니다. 다시 시도하세요.</div>
                )}

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={status === 'loading' || !flagInput.trim()}
                >
                  {status === 'loading' ? (
                    <div className="spinner"></div>
                  ) : (
                    '플래그 제출하기 (Submit Flag)'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </>
    );
  }

  // Render List View
  return (
    <>
      <div className="page-header">
        <h1 className="title">N0N4ME7 워게임</h1>
        <p className="subtitle">Flag 정답 유무 확인</p>
      </div>

      <div className="grid-container">
        {CHALLENGES.map((challenge) => {
          const isComingSoon = isChallengeComingSoon(challenge.id);
          const isSolved = !isComingSoon && solvedIds.includes(challenge.id);
          
          return (
            <div 
              key={challenge.id} 
              className={`challenge-card ${isSolved ? 'solved' : ''} ${isComingSoon ? 'coming-soon' : ''}`}
              onClick={isComingSoon ? undefined : () => openChallenge(challenge.id)}
              aria-disabled={isComingSoon}
            >
              <div className="card-header">
                <h3 className="card-title">
                  {isSolved && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{color: '#34d399'}}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  )}
                  {challenge.title}
                </h3>
              </div>
              
              <p className="card-desc">{challenge.description}</p>

              {isComingSoon ? (
                <div className="coming-soon-overlay">
                  <span className="coming-soon-emoji" aria-hidden="true">🚧</span>
                  현재 만드는 중
                </div>
              ) : isSolved ? (
                <div className="solved-overlay">
                  완료됨
                </div>
              ) : (
                <div className="click-hint">
                  문제 열기
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
