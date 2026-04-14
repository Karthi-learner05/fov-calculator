import { useState, useEffect } from 'react';
import { Settings, Calculator as CalcIcon, Crosshair, ArrowRight } from 'lucide-react';
import { HiArrowUpRight } from "react-icons/hi2";

const Header = () => (
  <header className="header">
    <div className="header-logo">
      <img src="/e-con.svg" alt="e-con Systems Logo" className="brand-logo" />
    </div>
    <a href="https://www.e-consystems.com/" className="visit-site-btn" target="_blank" rel="noopener noreferrer">
      Visit Site <HiArrowUpRight />
    </a>
  </header>
);

const Footer = () => (
  <footer className="footer">
    <p>Copyright © {new Date().getFullYear()} <a href="https://www.e-consystems.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '600' }}>e-con Systems®</a></p>
  </footer>
);



const App = () => {
  const [activeTab, setActiveTab] = useState(1);

  // Math Helpers
  const toDeg = (rad) => rad * (180 / Math.PI);
  const toRad = (deg) => deg * (Math.PI / 180);

  // State for Mode 1: FOV from Dimensions
  const [m1, setM1] = useState({ dist: 0, h: 0, v: 0, d: 0 });
  const [o1, setO1] = useState({ hfov: 0, vfov: 0, dfov: 0 });

  // State for Mode 2: Dimensions from FOV
  const [m2, setM2] = useState({ dist: 0, hfov: 0, vfov: 0, dfov: 0 });
  const [o2, setO2] = useState({ h: 0, v: 0, d: 0 });

  // State for Mode 3: FOV from Focal Length
  const [m3, setM3] = useState({ efl: 0, h: 0, v: 0, d: 0 });
  const [o3, setO3] = useState({ hfov: 0, vfov: 0, dfov: 0 });

  // Calculation Hooks
  useEffect(() => {
    // Mode 1 Calculation
    const calcFov = (dim, distance) => {
      if (!dim || !distance) return 0;
      return 2 * toDeg(Math.atan(dim / (distance * 2)));
    };
    setO1({
      hfov: calcFov(m1.h, m1.dist),
      vfov: calcFov(m1.v, m1.dist),
      dfov: calcFov(m1.d, m1.dist)
    });
  }, [m1]);

  useEffect(() => {
    // Mode 2 Calculation
    const calcDim = (fov, distance) => {
      if (!fov || !distance) return 0;
      return 2 * distance * Math.tan(toRad(fov / 2));
    };
    setO2({
      h: calcDim(m2.hfov, m2.dist),
      v: calcDim(m2.vfov, m2.dist),
      d: calcDim(m2.dfov, m2.dist)
    });
  }, [m2]);

  useEffect(() => {
    // Mode 3 Calculation
    const calcFovFocal = (dim, efl) => {
      if (!dim || !efl) return 0;
      return 2 * toDeg(Math.atan((dim / 2) / efl));
    };
    setO3({
      hfov: calcFovFocal(m3.h, m3.efl),
      vfov: calcFovFocal(m3.v, m3.efl),
      dfov: calcFovFocal(m3.d, m3.efl)
    });
  }, [m3]);

  // Input Handlers
  const handleM1Change = (e) => {
    const { name, value } = e.target;
    setM1(prev => ({ ...prev, [name]: parseFloat(value) || '' }));
  };

  const handleM2Change = (e) => {
    const { name, value } = e.target;
    setM2(prev => ({ ...prev, [name]: parseFloat(value) || '' }));
  };

  const handleM3Change = (e) => {
    const { name, value } = e.target;
    setM3(prev => ({ ...prev, [name]: parseFloat(value) || '' }));
  };

  return (
    <div className="app-container">
      <Header />

      <section className="hero-section">
        <div className="hero-image-container">
          <img src="/hero-image.png" alt="Modern Camera Lens" className="hero-image" />
        </div>
        <div className="hero-text">
          <h1>Lens FOV Calculator</h1>
          <p>Instantly calculate field of view angles, sensor dimensions, and effective focal lengths for our embedded cameras.</p>
        </div>
      </section>

      <main className="main-content">
        <div className="calculator-wrapper">
          <div className="tabs-container">
            <button className={`tab-btn ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
              Find FOV from Dimensions
            </button>
            <button className={`tab-btn ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
              Find Dimensions from FOV
            </button>
            <button className={`tab-btn ${activeTab === 3 ? 'active' : ''}`} onClick={() => setActiveTab(3)}>
              Find FOV from Focal Length
            </button>
          </div>

          <div className="form-container">
            {activeTab === 1 && (
              <>
                <div className="input-section">
                  <h3 className="section-title"><Settings size={20} /> Input Parameters</h3>
                  <div className="input-group">
                    <label>Distance from Object (mm)</label>
                    <input type="number" name="dist" value={m1.dist} onChange={handleM1Change} />
                  </div>
                  <div className="input-group">
                    <label>Horizontal - H (mm)</label>
                    <input type="number" name="h" value={m1.h} onChange={handleM1Change} />
                  </div>
                  <div className="input-group">
                    <label>Vertical - V (mm)</label>
                    <input type="number" name="v" value={m1.v} onChange={handleM1Change} />
                  </div>
                  <div className="input-group">
                    <label>Diagonal - D (mm)</label>
                    <input type="number" name="d" value={m1.d} onChange={handleM1Change} />
                  </div>
                </div>
                <div className="output-section">
                  <h3 className="section-title"><CalcIcon size={20} /> Calculated FOV</h3>
                  <div className="result-card">
                    <span className="result-label">Horizontal FOV (HFOV)</span>
                    <div><span className="result-value">{o1.hfov.toFixed(5)}</span><span className="unit">°</span></div>
                  </div>
                  <div className="result-card">
                    <span className="result-label">Vertical FOV (VFOV)</span>
                    <div><span className="result-value">{o1.vfov.toFixed(5)}</span><span className="unit">°</span></div>
                  </div>
                  <div className="result-card">
                    <span className="result-label">Diagonal FOV (DFOV)</span>
                    <div><span className="result-value">{o1.dfov.toFixed(5)}</span><span className="unit">°</span></div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 2 && (
              <>
                <div className="input-section">
                  <h3 className="section-title"><Settings size={20} /> Input Parameters</h3>
                  <div className="input-group">
                    <label>Distance from Object (mm)</label>
                    <input type="number" name="dist" value={m2.dist} onChange={handleM2Change} />
                  </div>
                  <div className="input-group">
                    <label>Horizontal FOV (HFOV in Degrees)</label>
                    <input type="number" name="hfov" value={m2.hfov} onChange={handleM2Change} />
                  </div>
                  <div className="input-group">
                    <label>Vertical FOV (VFOV in Degrees)</label>
                    <input type="number" name="vfov" value={m2.vfov} onChange={handleM2Change} />
                  </div>
                  <div className="input-group">
                    <label>Diagonal FOV (DFOV in Degrees)</label>
                    <input type="number" name="dfov" value={m2.dfov} onChange={handleM2Change} />
                  </div>
                </div>
                <div className="output-section">
                  <h3 className="section-title"><CalcIcon size={20} /> Calculated Dimensions</h3>
                  <div className="result-card">
                    <span className="result-label">Horizontal Height - H (mm)</span>
                    <div><span className="result-value">{o2.h.toFixed(5)}</span><span className="unit">mm</span></div>
                  </div>
                  <div className="result-card">
                    <span className="result-label">Vertical Height - V (mm)</span>
                    <div><span className="result-value">{o2.v.toFixed(5)}</span><span className="unit">mm</span></div>
                  </div>
                  <div className="result-card">
                    <span className="result-label">Diagonal Length - D (mm)</span>
                    <div><span className="result-value">{o2.d.toFixed(5)}</span><span className="unit">mm</span></div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 3 && (
              <>
                <div className="input-section">
                  <h3 className="section-title"><Settings size={20} /> Input Parameters</h3>
                  <div className="input-group">
                    <label>Effective Focal Length (EFL)</label>
                    <input type="number" name="efl" value={m3.efl} onChange={handleM3Change} />
                  </div>
                  <div className="input-group">
                    <label>Horizontal - H (mm)</label>
                    <input type="number" name="h" value={m3.h} onChange={handleM3Change} />
                  </div>
                  <div className="input-group">
                    <label>Vertical - V (mm)</label>
                    <input type="number" name="v" value={m3.v} onChange={handleM3Change} />
                  </div>
                  <div className="input-group">
                    <label>Diagonal - D (mm)</label>
                    <input type="number" name="d" value={m3.d} onChange={handleM3Change} />
                  </div>
                </div>
                <div className="output-section">
                  <h3 className="section-title"><CalcIcon size={20} /> Calculated FOV</h3>
                  <div className="result-card">
                    <span className="result-label">Horizontal FOV (HFOV)</span>
                    <div><span className="result-value">{o3.hfov.toFixed(4)}</span><span className="unit">°</span></div>
                  </div>
                  <div className="result-card">
                    <span className="result-label">Vertical FOV (VFOV)</span>
                    <div><span className="result-value">{o3.vfov.toFixed(4)}</span><span className="unit">°</span></div>
                  </div>
                  <div className="result-card">
                    <span className="result-label">Diagonal FOV (DFOV)</span>
                    <div><span className="result-value">{o3.dfov.toFixed(4)}</span><span className="unit">°</span></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
