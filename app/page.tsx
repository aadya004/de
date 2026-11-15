'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, TransitionEvent } from 'react'
import { ArrowLeft, ArrowRight, Maximize2, Volume2, VolumeX } from 'lucide-react'

type PageType = 'cover' | 'invitation' | 'portrait' | 'details' | 'principal' | 'back' | 'inside'
type Direction = 'next' | 'prev'
type Spread = { left: PageType | null; right: PageType }

const contentPages: PageType[] = ['invitation', 'portrait', 'details', 'principal', 'back']

function Ornament({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`ornament ${className}`}><span>✦</span><i /><span>❧</span><i /><span>✦</span></div>
}

function PageContent({ type }: { type: PageType }) {
  if (type === 'cover') return <div className="cover-content">
    <div className="crest"><span>✦</span><b>CMS</b><small>LUCKNOW</small></div>
    <p className="school-name">CITY MONTESSORI SCHOOL</p>
    <p className="location">Kanpur Road, Lucknow</p>
    <Ornament />
    <p className="eyebrow gold">GRAND ANNUAL FUNCTION 2026</p>
    <h1 className="cover-title">Enchanté</h1>
    <p className="cover-subtitle">A Celebration of Excellence</p>
    <Ornament />
    <p className="cover-note">An Evening of Talent, Creativity<br />&amp; Togetherness</p>
    <span className="tap-hint">OPEN YOUR INVITATION <ArrowRight size={13} /></span>
  </div>

  if (type === 'inside') return <div className="inside-cover" aria-hidden="true"><span>✦</span></div>

  if (type === 'invitation') return <div className="paper-content invitation-content">
    <p className="eyebrow">WITH WARM REGARDS</p><Ornament />
    <p className="serif-line">The Principal, Staff &amp; Students of</p>
    <h2 className="school-title">CITY MONTESSORI<br />SCHOOL</h2>
    <p className="location ink">Kanpur Road, Lucknow</p>
    <div className="fine-rule" />
    <p className="serif-line">Cordially invite Respected Parents<br />and Grandparents to the</p>
    <h3 className="event-name">Grand Annual Function<br /><em>– Enchanté</em></h3>
    <p className="tagline">A Celebration of Excellence</p>
    <Ornament />
  </div>

  if (type === 'portrait') return <div className="paper-content portrait-content">
    <p className="eyebrow">A MOMENT TO TREASURE</p>
    <Ornament />
    <div className="portrait-frame" aria-label="Annual celebration stage illustration">
      <div className="portrait-inner"><span className="frame-star">✧</span><img className="portrait-image-area" src="/annual-stage-illustration.png" alt="Vintage illustration of children performing music, dance, and theatre on a golden-curtained school stage" /><span className="frame-star">✧</span></div>
    </div>
    <p className="portrait-caption">Celebrating Talent, Creativity<br />and Togetherness...</p>
    <Ornament />
  </div>

  if (type === 'details') return <div className="paper-content details-content">
    <p className="eyebrow">KINDLY JOIN US</p><Ornament />
    <h2 className="details-heading">An evening<br /><em>to remember</em></h2>
    <div className="detail-card"><div className="detail-icon">✳</div><div><p className="eyebrow">DATE</p><p className="detail-value">28th November, 2026</p></div></div>
    <div className="detail-divider"><span>✦</span></div>
    <div className="detail-card"><div className="detail-icon clock">◷</div><div><p className="eyebrow">TIME</p><p className="detail-value">03:30 pm onwards</p></div></div>
    <Ornament />
  </div>

  if (type === 'principal') return <div className="principal-content">
    <div className="principal-inner"><Ornament />
      <p className="eyebrow gold">WITH WARMEST WISHES</p>
      <h2 className="principal-name">Mrs. Abha Anant</h2><p className="principal-role">– Principal –</p>
      <div className="fine-rule gold-rule" />
      <p className="presence">Your presence will make our<br />celebration even more special!</p>
      <div className="contact-box"><span className="contact-label">CONTACT</span><span className="contact-number">0522 2435690</span></div>
      <Ornament />
    </div>
  </div>

  return <div className="back-content"><div className="back-mark">✦</div><p className="eyebrow gold">CITY MONTESSORI SCHOOL</p><h2>ENCHANTÉ<br /><span>2026</span></h2><Ornament /><p className="back-tagline">A Celebration of Excellence</p><p className="back-quote">Where Talent Meets Creativity,<br />and Memories Come Alive.</p><div className="back-mark bottom">✦</div></div>
}

function PageFace({ type, className = '' }: { type: PageType; className?: string }) {
  const tone = type === 'cover' || type === 'inside' || type === 'principal' || type === 'back' ? 'navy-page' : 'ivory-page'
  return <div className={`book-page ${tone} ${className}`}>
    {type === 'cover' && <><span className="cover-texture" aria-hidden="true" /><span className="page-border cover-border" aria-hidden="true" /></>}
    {type !== 'cover' && type !== 'principal' && type !== 'back' && <span className="page-border" aria-hidden="true" />}
    {type === 'principal' && <span className="page-border navy-border" aria-hidden="true" />}
    {type === 'back' && <span className="page-border navy-border" aria-hidden="true" />}
    <PageContent type={type} />
  </div>
}

function getSpread(position: number, mobile: boolean): Spread {
  if (mobile) return { left: null, right: position === 0 ? 'cover' : contentPages[position - 1] }
  if (position <= 1) return { left: 'inside', right: 'invitation' }
  if (position <= 3) return { left: 'portrait', right: 'details' }
  return { left: 'principal', right: 'back' }
}

function PageSpread({ spread, className = '' }: { spread: Spread; className?: string }) {
  return <div className={`book-spread ${className}`}>
    {spread.left ? <PageFace type={spread.left} className="left-page" /> : <div className="book-page page-blank" aria-hidden="true" />}
    <PageFace type={spread.right} className="right-page" />
  </div>
}

export default function Page() {
  const [position, setPosition] = useState(0)
  const [turning, setTurning] = useState(false)
  const [direction, setDirection] = useState<Direction>('next')
  const [turnTarget, setTurnTarget] = useState<number | null>(null)
  const [mobile, setMobile] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const shellRef = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeFrameRef = useRef<number | null>(null)
  const invitationOpenedRef = useRef(false)
  const turningRef = useRef(false)
  const startX = useRef<number | null>(null)
  const didSwipe = useRef(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const update = () => setMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    try {
      const preference = window.sessionStorage.getItem('enchante-sound-enabled')
      if (preference !== null) setSoundEnabled(preference === 'true')
    } catch {
      setSoundEnabled(true)
    }

    return () => {
      if (fadeFrameRef.current !== null) window.cancelAnimationFrame(fadeFrameRef.current)
      audioRef.current?.pause()
    }
  }, [])

  const fadeAudio = (targetVolume: number, pauseWhenSilent = false) => {
    const audio = audioRef.current
    if (!audio) return
    if (fadeFrameRef.current !== null) window.cancelAnimationFrame(fadeFrameRef.current)

    const startingVolume = audio.volume
    const startedAt = performance.now()
    const duration = 2600
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      audio.volume = startingVolume + (targetVolume - startingVolume) * progress
      if (progress < 1) {
        fadeFrameRef.current = window.requestAnimationFrame(animate)
        return
      }
      fadeFrameRef.current = null
      if (pauseWhenSilent && targetVolume === 0) audio.pause()
      setMusicPlaying(targetVolume > 0)
    }
    fadeFrameRef.current = window.requestAnimationFrame(animate)
  }

  const startMusic = (force = false) => {
    if (!force && !soundEnabled) return
    const audio = audioRef.current
    if (!audio) return
    invitationOpenedRef.current = true

    if (audio.paused) {
      audio.volume = 0
      void audio.play().then(() => {
        setMusicPlaying(true)
        fadeAudio(0.18)
      }).catch(() => setMusicPlaying(false))
    } else {
      setMusicPlaying(true)
      fadeAudio(0.18)
    }
  }

  const toggleSound = () => {
    const nextEnabled = !soundEnabled
    setSoundEnabled(nextEnabled)
    try {
      window.sessionStorage.setItem('enchante-sound-enabled', String(nextEnabled))
    } catch {
      // Sound preference remains available for this page even when storage is blocked.
    }

    if (!nextEnabled) {
      if (audioRef.current && !audioRef.current.paused) fadeAudio(0, true)
    } else if (invitationOpenedRef.current) {
      startMusic(true)
    }
  }

  const turn = useCallback((way: Direction) => {
    if (turningRef.current) return
    const isMobile = window.matchMedia('(max-width: 640px)').matches
    const step = way === 'next' ? (position === 0 ? 1 : isMobile ? 1 : 2) : (position === 1 || isMobile ? 1 : 2)
    const target = position + (way === 'next' ? step : -step)
    if (target < 0 || target > contentPages.length) return
    turningRef.current = true
    setDirection(way)
    setTurnTarget(target)
    setTurning(true)
  }, [position])

  const finishTurn = useCallback((event: TransitionEvent<HTMLButtonElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform' || turnTarget === null) return
    setPosition(turnTarget)
    setTurnTarget(null)
    setTurning(false)
    turningRef.current = false
  }, [turnTarget])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); turn('next') }
      if (event.key === 'ArrowLeft') { event.preventDefault(); turn('prev') }
      if (event.key === 'Escape' && document.fullscreenElement) void document.exitFullscreen()
    }
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement))
    window.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFullscreen) }
  }, [turn])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await shellRef.current?.requestFullscreen()
    else await document.exitFullscreen()
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX
    didSwipe.current = false
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return
    const delta = event.clientX - startX.current
    startX.current = null
    if (Math.abs(delta) > 45) {
      didSwipe.current = true
      turn(delta < 0 ? 'next' : 'prev')
    }
  }

  const currentSpread = getSpread(position === 0 ? 1 : position, mobile)
  const targetSpread = turnTarget !== null && turnTarget > 0 ? getSpread(turnTarget, mobile) : null
  const coverInteractive = position === 0 || (turning && turnTarget === 0)
  const canPrev = position > 0 && !turning
  const canNext = position < contentPages.length && !turning

  return <main className="invitation-shell" ref={shellRef}>
    <audio ref={audioRef} src="/annual-celebration-score.wav" loop preload="none" aria-hidden="true" />
    <div className="ambient-glow" aria-hidden="true" />
    <div className="stars" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <span key={i} style={{ '--i': i } as CSSProperties}>✦</span>)}</div>
    <header className="topbar">
      <div className="brand-lockup"><span className="brand-seal">C</span><div><strong>CMS</strong><small>THE GRAND ANNUAL FUNCTION</small></div></div>
      <div className="top-date">LUCKNOW <span>·</span> 28 NOVEMBER 2026</div>
    </header>
    <section className="stage" aria-label="Interactive invitation flipbook">
      <div
        className={`book ${position === 0 ? 'book-closed' : 'book-open'} ${turning ? `is-turning ${direction}` : ''} ${turnTarget === 0 ? 'is-closing' : ''} ${mobile ? 'single-page' : ''}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { startX.current = null }}
        aria-label="Enchanté 2026 invitation"
      >
        <div className="book-shadow" aria-hidden="true" />
        <div className="page-under" aria-hidden="true"><PageSpread spread={targetSpread ?? currentSpread} /></div>
        {position > 0 && <PageSpread spread={currentSpread} className="spread-current" />}
        {position === 0 && <PageSpread spread={currentSpread} className="spread-current opening-spread" />}
        {(position === 0 || position === 1) && <button
          type="button"
          className={`flip-sheet cover-leaf ${coverInteractive && turning ? 'is-animating' : ''}`}
          aria-label={position === 0 ? 'Open invitation' : 'Close invitation'}
          aria-hidden={!coverInteractive}
          disabled={!coverInteractive}
          onClick={() => {
            if (didSwipe.current) { didSwipe.current = false; return }
            if (position === 0) startMusic()
            turn(position === 0 ? 'next' : 'prev')
          }}
          onTransitionEnd={finishTurn}
        ><span className="flip-face front"><PageFace type="cover" /></span><span className="flip-face back"><PageFace type="inside" /></span></button>}
        {position > 0 && <>
          <button
            type="button"
            className={`flip-sheet page-leaf next ${turning && turnTarget !== 0 && direction === 'next' ? 'active' : ''}`}
            aria-label={`Turn to page ${(turnTarget ?? position + 2) + 1}`}
            aria-hidden={!(turning && turnTarget !== 0 && direction === 'next')}
            disabled={!(turning && turnTarget !== 0 && direction === 'next')}
            tabIndex={-1}
            onTransitionEnd={finishTurn}
          ><span className="flip-face front"><PageFace type={currentSpread.right} /></span><span className="flip-face back"><PageFace type={targetSpread?.left ?? targetSpread?.right ?? currentSpread.right} /></span></button>
          <button
            type="button"
            className={`flip-sheet page-leaf prev ${turning && turnTarget !== 0 && direction === 'prev' ? 'active' : ''}`}
            aria-label={`Return to page ${(turnTarget ?? Math.max(0, position - 2)) + 1}`}
            aria-hidden={!(turning && turnTarget !== 0 && direction === 'prev')}
            disabled={!(turning && turnTarget !== 0 && direction === 'prev')}
            tabIndex={-1}
            onTransitionEnd={finishTurn}
          ><span className="flip-face front"><PageFace type={currentSpread.left ?? currentSpread.right} /></span><span className="flip-face back"><PageFace type={targetSpread?.right ?? currentSpread.right} /></span></button>
        </>}
        {position > 0 && !turning && <button
          type="button"
          className="page-advance"
          aria-label={`Turn forward from page ${position + 1}`}
          onClick={() => { if (didSwipe.current) { didSwipe.current = false; return } turn('next') }}
        ><PageFace type={currentSpread.right} /></button>}
        <div className="book-pages-edge" aria-hidden="true" />
      </div>
    </section>
    <footer className="controls">
      <div className="page-count" aria-live="polite"><span>{position === 0 ? 'COVER' : `0${position + 1}`}</span><i />06</div>
      <div className="nav-controls">
        <button onClick={() => turn('prev')} disabled={!canPrev} aria-label="Previous page"><ArrowLeft /></button>
        <span className="turn-hint">{position === 0 ? 'TAP TO OPEN' : position === contentPages.length ? 'THE END' : turning ? 'TURNING' : 'TURN THE PAGE'}</span>
        <button onClick={() => turn('next')} disabled={!canNext} aria-label="Next page"><ArrowRight /></button>
      </div>
      <div className="utility-controls">
        <button className={`sound-toggle ${musicPlaying ? 'is-playing' : ''}`} onClick={toggleSound} aria-label={soundEnabled ? 'Sound On' : 'Sound Off'} aria-pressed={soundEnabled} title={soundEnabled ? 'Sound On' : 'Sound Off'}>
          {soundEnabled ? <Volume2 /> : <VolumeX />}
        </button>
        <button onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit full screen' : 'Enter full screen'} title={fullscreen ? 'Exit full screen' : 'Full screen'}><Maximize2 /></button>
      </div>
    </footer>
    <p className="keyboard-hint">USE ← → TO TURN <span>·</span> SWIPE TO EXPLORE</p>
  </main>
}
