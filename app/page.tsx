import MixtapePlayerPage from "@/app/components/mixtape-player-page";
import { mixtape } from "@/app/data/mixtape";

export default function Home() {
  return (
    <main className="datpif-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="brand-lockup">
            <span className="brand-lockup__mark">PIFDATT</span>
            <span className="brand-lockup__sub">the authority in free mixtapes</span>
          </div>
          <nav className="topbar__nav" aria-label="Primary">
            <a href="#">Home</a>
            <a href="#mixtape" className="topbar__nav-active">Mixtapes</a>
            <a href="#">Upcoming</a>
            <a href="#">Singles</a>
            <a href="#">News</a>
          </nav>
        </div>
      </header>

      <div className="subheader">
        <div className="subheader__inner">
          <div className="breadcrumb-bar">
            <span>Mixtapes</span>
            <span className="breadcrumb-sep">›</span>
            <strong>Wolność Finansowa</strong>
            <span className="breadcrumb-sep">›</span>
            <span>11 utworów</span>
          </div>
          <div className="subheader-hype">NAJLEPSZY MIXTAPE TYSIĄCLECIA</div>
        </div>
      </div>

      <div className="page-frame">
        <div className="two-col">
          <div className="main-col" id="mixtape">
            <MixtapePlayerPage mixtape={mixtape} />
          </div>

          <aside className="sidebar">
            {/* Search */}
            <div className="s-search">
              <div className="s-search__label">Search Mixtapes</div>
              <div className="s-search__row">
                <input
                  className="s-search__input"
                  type="search"
                  placeholder="szukaj mixtape..."
                  aria-label="Szukaj mixtape"
                />
                <button className="s-search__btn" type="button" aria-label="Szukaj">
                  🔍
                </button>
              </div>
            </div>

            {/* Social */}
            <div className="s-social">
              <a href="#" className="s-social__btn s-social__btn--myspace">
                <span className="s-social__icon">✦</span>
                <span className="s-social__count">MySpace</span>
                <span>Share</span>
              </a>
              <a href="#" className="s-social__btn s-social__btn--facebook">
                <span className="s-social__icon">f</span>
                <span className="s-social__count">1.8M</span>
                <span>Like</span>
              </a>
              <a href="#" className="s-social__btn s-social__btn--twitter">
                <span className="s-social__icon">𝕏</span>
                <span className="s-social__count">611K</span>
                <span>Follow</span>
              </a>
            </div>

            {/* Upload */}
            <a href="#" className="s-upload">
              Upload Your Mixtape
            </a>

            {/* Promo */}
            <div className="s-promo">
              <div className="s-promo__badge">Fire Mixtape Alert</div>
              <p className="s-promo__title">NAJLEPSZY MIXTAPE TYSIĄCLECIA</p>
              <p className="s-promo__body">
                BIAŁAS I LANEK drop the hardest tape since the dawn of time.
                10 tracks. No skips. Get on it or get left behind. Real talk.
              </p>
              <a href="#mixtape" className="s-promo__cta">Listen Now →</a>
            </div>

            {/* Stats */}
            <div className="s-stats">
              <div className="s-stats__row">
                Odsłuchań: <strong>1,337,420</strong>
              </div>
              <div className="s-stats__row">
                Ocena: <span className="s-stars">★★★★★</span>
              </div>
              <div className="s-stats__row">
                Downloads: <strong>420,069</strong>
              </div>
              <div className="s-stats__row">
                Dodano: <strong>Kwiecień 2026</strong>
              </div>
            </div>

            {/* MySpace */}
            <div className="s-myspace">
              <p>Dodaj do swojego profilu MySpace</p>
              <a href="#" className="s-myspace__btn">Add to MySpace →</a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
