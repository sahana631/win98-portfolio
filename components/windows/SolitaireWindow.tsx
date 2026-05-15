'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

type Suit = '♠' | '♥' | '♦' | '♣';
type Value = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
interface Card { suit: Suit; value: Value; faceUp: boolean; }

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const VALUES: Value[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const W = 72, H = 98, D = 18, U = 26;
const DRAG_THRESHOLD = 4;

const num = (v: Value) => VALUES.indexOf(v) + 1;
const red = (s: Suit) => s === '♥' || s === '♦';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface GameState {
  tableau: Card[][];
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
}

function deal(): GameState {
  const deck = shuffle(SUITS.flatMap(s => VALUES.map(v => ({ suit: s, value: v, faceUp: false }))));
  let i = 0;
  const tableau = Array.from({ length: 7 }, (_, col) =>
    Array.from({ length: col + 1 }, (_, row) => ({ ...deck[i++], faceUp: row === col }))
  );
  return { tableau, stock: deck.slice(i), waste: [], foundations: [[], [], [], []] };
}

const canTableau = (card: Card, pile: Card[]) =>
  pile.length === 0 ? card.value === 'K' :
  pile[pile.length - 1].faceUp &&
  red(card.suit) !== red(pile[pile.length - 1].suit) &&
  num(card.value) === num(pile[pile.length - 1].value) - 1;

const canFoundation = (card: Card, pile: Card[]) =>
  pile.length === 0 ? card.value === 'A' :
  pile[pile.length - 1].suit === card.suit &&
  num(card.value) === num(pile[pile.length - 1].value) + 1;

const flipTop = (pile: Card[]): Card[] => {
  if (!pile.length || pile[pile.length - 1].faceUp) return pile;
  return [...pile.slice(0, -1), { ...pile[pile.length - 1], faceUp: true }];
};

type Sel = { source: 'waste' } | { source: 'tableau'; col: number; idx: number } | null;

interface DragState {
  sel: NonNullable<Sel>;
  cards: Card[];
  startX: number; startY: number;
  curX: number; curY: number;
  grabOffsetX: number; grabOffsetY: number;
  active: boolean;
}

interface Hint {
  source: Sel;
  destCol?: number;
  destFoundation?: number;
}

function findHint(g: GameState): Hint | null {
  const wasteTop = g.waste[g.waste.length - 1];
  if (wasteTop) {
    for (let fi = 0; fi < 4; fi++)
      if (canFoundation(wasteTop, g.foundations[fi]))
        return { source: { source: 'waste' }, destFoundation: fi };
  }
  for (let col = 0; col < 7; col++) {
    const pile = g.tableau[col];
    if (!pile.length) continue;
    const top = pile[pile.length - 1];
    if (!top.faceUp) continue;
    for (let fi = 0; fi < 4; fi++)
      if (canFoundation(top, g.foundations[fi]))
        return { source: { source: 'tableau', col, idx: pile.length - 1 }, destFoundation: fi };
  }
  for (let fromCol = 0; fromCol < 7; fromCol++) {
    const pile = g.tableau[fromCol];
    const firstUp = pile.findIndex(c => c.faceUp);
    if (firstUp <= 0) continue;
    const moving = pile.slice(firstUp);
    for (let toCol = 0; toCol < 7; toCol++) {
      if (toCol === fromCol) continue;
      if (canTableau(moving[0], g.tableau[toCol]))
        return { source: { source: 'tableau', col: fromCol, idx: firstUp }, destCol: toCol };
    }
  }
  if (wasteTop) {
    for (let col = 0; col < 7; col++)
      if (canTableau(wasteTop, g.tableau[col]))
        return { source: { source: 'waste' }, destCol: col };
  }
  for (let fromCol = 0; fromCol < 7; fromCol++) {
    const pile = g.tableau[fromCol];
    const firstUp = pile.findIndex(c => c.faceUp);
    if (firstUp === -1) continue;
    const moving = pile.slice(firstUp);
    for (let toCol = 0; toCol < 7; toCol++) {
      if (toCol === fromCol) continue;
      if (canTableau(moving[0], g.tableau[toCol]))
        return { source: { source: 'tableau', col: fromCol, idx: firstUp }, destCol: toCol };
    }
  }
  return null;
}

function getCards(g: GameState, s: Sel): Card[] {
  if (!s) return [];
  if (s.source === 'waste') return g.waste.length ? [g.waste[g.waste.length - 1]] : [];
  return g.tableau[s.col].slice(s.idx);
}

function removeFrom(g: GameState, s: Sel): GameState {
  if (!s) return g;
  if (s.source === 'waste') return { ...g, waste: g.waste.slice(0, -1) };
  return { ...g, tableau: g.tableau.map((p, i) => i === s.col ? flipTop(p.slice(0, s.idx)) : p) };
}

type HintType = 'source' | 'dest';

function FaceCard({ card, selected, hint, faded }: { card: Card; selected: boolean; hint?: HintType; faded?: boolean }) {
  const color = red(card.suit) ? '#cc0000' : '#000';
  const borderColor = selected
    ? '#000080 #000080 #000080 #000080'
    : hint === 'source' ? '#cc8800 #cc8800 #cc8800 #cc8800'
    : hint === 'dest'   ? '#008800 #008800 #008800 #008800'
    : '#fff #808080 #808080 #fff';
  const bg = selected ? '#dde'
    : hint === 'source' ? '#fffde7'
    : hint === 'dest'   ? '#e8f5e9'
    : 'white';
  return (
    <div style={{
      width: W, height: H, background: bg,
      border: '2px solid', borderColor,
      position: 'relative', userSelect: 'none', cursor: faded ? 'default' : 'pointer',
      flexShrink: 0, opacity: faded ? 0.3 : 1,
    }}>
      <div style={{ position: 'absolute', top: 3, left: 4, color, fontSize: 12, lineHeight: 1.2, fontFamily: 'Arial' }}>
        <div style={{ fontWeight: 'bold' }}>{card.value}</div>
        <div>{card.suit}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color, fontSize: 30 }}>
        {card.suit}
      </div>
    </div>
  );
}

function BackCard() {
  return (
    <div style={{
      width: W, height: H,
      background: 'repeating-linear-gradient(45deg, #000080 0px, #000080 3px, #1a52a8 3px, #1a52a8 6px)',
      border: '2px solid', borderColor: '#fff #808080 #808080 #fff',
      cursor: 'default', flexShrink: 0,
    }} />
  );
}

function EmptySlot({ onClick, hint, dropCol, dropFi }: { onClick?: () => void; hint?: HintType; dropCol?: number; dropFi?: number }) {
  return (
    <div
      onClick={onClick}
      data-drop-col={dropCol}
      data-drop-foundation={dropFi}
      style={{
        width: W, height: H,
        border: '2px solid',
        borderColor: hint === 'dest' ? '#008800 #008800 #008800 #008800' : '#808080 #fff #fff #808080',
        background: hint === 'dest' ? '#c8e6c9' : '#006060',
        cursor: onClick ? 'pointer' : 'default', flexShrink: 0,
      }}
    />
  );
}

function colHeight(pile: Card[]): number {
  if (!pile.length) return H;
  let h = 0;
  for (let i = 0; i < pile.length - 1; i++) h += pile[i].faceUp ? U : D;
  return h + H;
}

export function SolitaireWindow() {
  const [g, setG] = useState<GameState>(deal);
  const [sel, setSel] = useState<Sel>(null);
  const [won, setWon] = useState(false);
  const [hint, setHint] = useState<Hint | null>(null);
  const [noHint, setNoHint] = useState(false);
  const [dragRender, setDragRender] = useState<DragState | null>(null);

  const [history, setHistory] = useState<GameState[]>([]);
  const [moves, setMoves] = useState(0);

  const dragRef = useRef<DragState | null>(null);
  const gRef = useRef(g);
  const selRef = useRef(sel);
  const historyRef = useRef<GameState[]>([]);
  gRef.current = g;
  selRef.current = sel;
  historyRef.current = history;
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearHint() {
    setHint(null); setNoHint(false);
    if (hintTimer.current) clearTimeout(hintTimer.current);
  }

  function pushHistory(state: GameState) {
    const next = [...historyRef.current, state].slice(-20);
    historyRef.current = next;
    setHistory(next);
    setMoves(m => m + 1);
  }

  function undo() {
    const h = historyRef.current;
    if (!h.length) return;
    const prev = h[h.length - 1];
    const next = h.slice(0, -1);
    historyRef.current = next;
    setHistory(next);
    gRef.current = prev;
    setG(prev);
    setSel(null);
    clearHint();
    setMoves(m => Math.max(0, m - 1));
  }

  function showHint() {
    clearHint();
    const h = findHint(g);
    if (h) {
      setHint(h);
      hintTimer.current = setTimeout(clearHint, 2500);
    } else {
      setNoHint(true);
      hintTimer.current = setTimeout(() => setNoHint(false), 2000);
    }
  }

  useEffect(() => () => { if (hintTimer.current) clearTimeout(hintTimer.current); }, []);

  // Auto-complete: when stock is empty and all tableau cards are face-up
  const [autoCompleting, setAutoCompleting] = useState(false);

  useEffect(() => {
    if (won) return;
    const noHidden = g.tableau.every(pile => pile.every(c => c.faceUp));
    const stockEmpty = g.stock.length === 0;
    const notDone = !g.foundations.every(f => f.length === 13);
    if (!noHidden || !stockEmpty || !notDone) { setAutoCompleting(false); return; }

    setAutoCompleting(true);
    setSel(null);

    const timer = setTimeout(() => {
      const wasteTop = g.waste[g.waste.length - 1];
      if (wasteTop) {
        for (let fi = 0; fi < 4; fi++) {
          if (canFoundation(wasteTop, g.foundations[fi])) {
            const base = removeFrom(g, { source: 'waste' });
            const next = { ...base, foundations: base.foundations.map((f, i) => i === fi ? [...f, wasteTop] : f) };
            setG(next);
            if (next.foundations.every(f => f.length === 13)) { setWon(true); setAutoCompleting(false); }
            return;
          }
        }
      }
      for (let col = 0; col < 7; col++) {
        const pile = g.tableau[col];
        if (!pile.length) continue;
        const top = pile[pile.length - 1];
        for (let fi = 0; fi < 4; fi++) {
          if (canFoundation(top, g.foundations[fi])) {
            const base = removeFrom(g, { source: 'tableau', col, idx: pile.length - 1 });
            const next = { ...base, foundations: base.foundations.map((f, i) => i === fi ? [...f, top] : f) };
            setG(next);
            if (next.foundations.every(f => f.length === 13)) { setWon(true); setAutoCompleting(false); }
            return;
          }
        }
      }
      setAutoCompleting(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [g, won]);

  const handleDragMove = useCallback((e: MouseEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = Math.abs(e.clientX - d.startX);
    const dy = Math.abs(e.clientY - d.startY);
    const next: DragState = { ...d, curX: e.clientX, curY: e.clientY, active: d.active || dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD };
    dragRef.current = next;
    setDragRender({ ...next });
  }, []);

  const handleDragEnd = useCallback((e: MouseEvent) => {
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);

    const d = dragRef.current;
    dragRef.current = null;
    setDragRender(null);
    if (!d) return;

    const curr = gRef.current;
    const s = selRef.current;

    if (!d.active) {
      // Treat as click
      if (d.sel.source === 'waste') {
        if (!curr.waste.length) return;
        setSel(s?.source === 'waste' ? null : { source: 'waste' });
        return;
      }
      const { col, idx } = d.sel;
      const card = curr.tableau[col][idx];
      if (!s) {
        if (card.faceUp) setSel({ source: 'tableau', col, idx });
        return;
      }
      const cards = getCards(curr, s);
      if (!cards.length) { setSel(null); return; }
      if (s.source === 'tableau' && s.col === col && s.idx === idx) { setSel(null); return; }
      if (canTableau(cards[0], curr.tableau[col])) {
        const base = removeFrom(curr, s);
        const nextH = [...historyRef.current, curr].slice(-20);
        historyRef.current = nextH; setHistory(nextH); setMoves(m => m + 1);
        setG({ ...base, tableau: base.tableau.map((p, i) => i === col ? [...p, ...cards] : p) });
        setSel(null);
      } else if (card.faceUp) {
        setSel({ source: 'tableau', col, idx });
      } else {
        setSel(null);
      }
      return;
    }

    // Drag drop — find target via elementFromPoint
    const el = document.elementFromPoint(e.clientX, e.clientY);
    let target = el as HTMLElement | null;
    while (target) {
      const dc = target.dataset.dropCol;
      const df = target.dataset.dropFoundation;
      if (dc !== undefined) {
        const col = parseInt(dc);
        if (canTableau(d.cards[0], curr.tableau[col])) {
          const base = removeFrom(curr, d.sel);
          const next = { ...base, tableau: base.tableau.map((p, i) => i === col ? [...p, ...d.cards] : p) };
          const nextH = [...historyRef.current, curr].slice(-20);
          historyRef.current = nextH; setHistory(nextH); setMoves(m => m + 1);
          setG(next);
          setSel(null);
          if (next.foundations.every(f => f.length === 13)) setWon(true);
        }
        return;
      }
      if (df !== undefined) {
        const fi = parseInt(df);
        if (d.cards.length === 1 && canFoundation(d.cards[0], curr.foundations[fi])) {
          const base = removeFrom(curr, d.sel);
          const next = { ...base, foundations: base.foundations.map((f, i) => i === fi ? [...f, d.cards[0]] : f) };
          const nextH = [...historyRef.current, curr].slice(-20);
          historyRef.current = nextH; setHistory(nextH); setMoves(m => m + 1);
          setG(next);
          setSel(null);
          if (next.foundations.every(f => f.length === 13)) setWon(true);
        }
        return;
      }
      target = target.parentElement;
    }
  }, [handleDragMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  function startDrag(e: React.MouseEvent, dragSel: NonNullable<Sel>, cards: Card[]) {
    e.preventDefault();
    clearHint();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const state: DragState = {
      sel: dragSel, cards,
      startX: e.clientX, startY: e.clientY,
      curX: e.clientX, curY: e.clientY,
      grabOffsetX: e.clientX - rect.left,
      grabOffsetY: e.clientY - rect.top,
      active: false,
    };
    dragRef.current = state;
    setDragRender(state);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  }

  function reset() {
    setG(deal()); setSel(null); setWon(false); clearHint();
    historyRef.current = []; setHistory([]); setMoves(0);
  }

  function clickStock() {
    clearHint(); setSel(null);
    pushHistory(gRef.current);
    setG(prev => {
      if (!prev.stock.length)
        return { ...prev, stock: [...prev.waste].reverse().map(c => ({ ...c, faceUp: false })), waste: [] };
      const top = { ...prev.stock[prev.stock.length - 1], faceUp: true };
      return { ...prev, stock: prev.stock.slice(0, -1), waste: [...prev.waste, top] };
    });
  }

  function clickFoundation(fi: number) {
    clearHint();
    if (!sel) return;
    const cards = getCards(g, sel);
    if (cards.length !== 1 || !canFoundation(cards[0], g.foundations[fi])) return;
    const base = removeFrom(g, sel);
    const next = { ...base, foundations: base.foundations.map((f, i) => i === fi ? [...f, cards[0]] : f) };
    pushHistory(g);
    setG(next); setSel(null);
    if (next.foundations.every(f => f.length === 13)) setWon(true);
  }

  function clickEmptyTableau(col: number) {
    clearHint();
    if (!sel) return;
    const cards = getCards(g, sel);
    if (!cards.length || cards[0].value !== 'K') return;
    const base = removeFrom(g, sel);
    pushHistory(g);
    setG({ ...base, tableau: base.tableau.map((p, i) => i === col ? [...p, ...cards] : p) });
    setSel(null);
  }

  const isDraggingFrom = (col: number, idx: number) =>
    dragRender?.active && dragRender.sel.source === 'tableau' && dragRender.sel.col === col && idx >= dragRender.sel.idx;

  const isWasteDragging = dragRender?.active && dragRender.sel.source === 'waste';

  const topWaste = g.waste[g.waste.length - 1];

  const wasteHint = hint?.source?.source === 'waste' ? 'source' as HintType : undefined;
  const foundationHint = (fi: number): HintType | undefined => hint?.destFoundation === fi ? 'dest' : undefined;
  const tableauCardHint = (col: number, i: number, isLast: boolean): HintType | undefined => {
    if (hint?.source?.source === 'tableau' && hint.source.col === col && i >= hint.source.idx) return 'source';
    if (isLast && hint?.destCol === col) return 'dest';
    return undefined;
  };

  return (
    <div style={{ fontFamily: 'Arial, system-ui', fontSize: 11, userSelect: 'none', position: 'relative' }}>
      {won && (
        <div style={{ textAlign: 'center', padding: '4px 0 8px', fontWeight: 'bold', color: '#000080' }}>
          You win! 🎉 ({moves} moves)
          <button className="win98-btn" onClick={reset} style={{ marginLeft: 8 }}>New Game</button>
        </div>
      )}

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div onClick={clickStock} style={{ cursor: 'pointer' }}>
            {g.stock.length ? <BackCard /> : <EmptySlot />}
          </div>
          <div
            onMouseDown={topWaste ? (e) => startDrag(e, { source: 'waste' }, [topWaste]) : undefined}
            style={{ cursor: topWaste ? 'grab' : 'default' }}
          >
            {topWaste
              ? <FaceCard card={topWaste} selected={sel?.source === 'waste'} hint={wasteHint} faded={isWasteDragging} />
              : <EmptySlot />}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {g.foundations.map((f, fi) => (
            <div key={fi} onClick={() => clickFoundation(fi)} data-drop-foundation={fi} style={{ cursor: 'pointer' }}>
              {f.length
                ? <FaceCard card={f[f.length - 1]} selected={false} hint={foundationHint(fi)} />
                : <EmptySlot dropFi={fi} hint={foundationHint(fi)} />}
            </div>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
        {g.tableau.map((pile, col) => (
          <div
            key={col}
            data-drop-col={col}
            style={{ position: 'relative', width: W, height: colHeight(pile) + 20, minHeight: H + 8 }}
            onClick={pile.length === 0 ? () => clickEmptyTableau(col) : undefined}
          >
            {pile.length === 0
              ? <EmptySlot dropCol={col} onClick={() => clickEmptyTableau(col)} hint={hint?.destCol === col ? 'dest' : undefined} />
              : pile.map((card, i) => {
                  let top = 0;
                  for (let j = 0; j < i; j++) top += pile[j].faceUp ? U : D;
                  const isSel = sel?.source === 'tableau' && sel.col === col && i >= sel.idx;
                  const faded = isDraggingFrom(col, i);
                  const isLast = i === pile.length - 1;
                  return (
                    <div
                      key={i}
                      data-drop-col={col}
                      style={{ position: 'absolute', top, left: 0, zIndex: i, cursor: card.faceUp ? 'grab' : 'default' }}
                      onMouseDown={card.faceUp ? (e) => startDrag(e, { source: 'tableau', col, idx: i }, g.tableau[col].slice(i)) : undefined}
                    >
                      {card.faceUp
                        ? <FaceCard card={card} selected={isSel} hint={tableauCardHint(col, i, isLast)} faded={faded} />
                        : <BackCard />}
                    </div>
                  );
                })}
          </div>
        ))}
      </div>

      {!won && (
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 11 }}>Moves: <strong>{moves}</strong></span>
            {autoCompleting
              ? <span style={{ color: '#000080', fontSize: 11 }}>✨ Auto-completing...</span>
              : <span style={{ color: noHint ? '#cc0000' : 'transparent', fontSize: 11 }}>No moves found</span>}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {!autoCompleting && <button className="win98-btn" onClick={undo} disabled={history.length === 0}>↩ Undo</button>}
            {!autoCompleting && <button className="win98-btn" onClick={showHint}>💡 Hint</button>}
            <button className="win98-btn" onClick={reset}>New Game</button>
          </div>
        </div>
      )}

      {/* Drag ghost */}
      {dragRender?.active && (
        <div style={{
          position: 'fixed',
          left: dragRender.curX - dragRender.grabOffsetX,
          top: dragRender.curY - dragRender.grabOffsetY,
          zIndex: 9999,
          pointerEvents: 'none',
          height: dragRender.cards.length * U + H,
          width: W,
        }}>
          {dragRender.cards.map((card, i) => (
            <div key={i} style={{ position: 'absolute', top: i * U, left: 0, zIndex: i }}>
              <FaceCard card={card} selected={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
