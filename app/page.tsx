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
                <span className="s-social__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                    <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                  </svg>
                </span>
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
