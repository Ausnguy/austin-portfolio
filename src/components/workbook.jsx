import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Shared state for the spreadsheet chrome: which cell is selected and what the formula bar shows.
const WorkbookContext = createContext(null);

export const WorkbookProvider = ({ children }) => {
  const [sheetDefault, setSheetDefault] = useState({ ref: 'A1', formula: '' });
  const [selected, setSelected] = useState(null);

  const select = useCallback((ref, formula) => setSelected({ ref, formula }), []);
  const resetSheet = useCallback((ref, formula) => {
    setSheetDefault({ ref, formula });
    setSelected(null);
  }, []);

  const value = useMemo(
    () => ({ active: selected ?? sheetDefault, selectedRef: selected?.ref ?? null, select, resetSheet }),
    [selected, sheetDefault, select, resetSheet],
  );
  return <WorkbookContext.Provider value={value}>{children}</WorkbookContext.Provider>;
};

export const useWorkbook = () => useContext(WorkbookContext);

// Called once per page: sets what the formula bar shows before anything is clicked, and the tab title.
export const useSheet = (ref, formula, title) => {
  const { resetSheet } = useWorkbook();
  useEffect(() => {
    resetSheet(ref, formula);
  }, [ref, formula, resetSheet]);
  useEffect(() => {
    document.title = title ? `${title} | Austin Nguyen` : 'Austin Nguyen | Data systems, end to end';
  }, [title]);
};

const LETTERS = 'ABCDEFGHIJKL'.split('');

// A sheet: column letters across the top, then rows numbered down the left gutter.
export const Sheet = ({ children, className = '' }) => (
  <div className={`sheet ${className}`}>
    {/* Column letters; phones skip them (and the row numbers) to give content the full width. */}
    <div className="hidden sm:grid grid-cols-[2.75rem_minmax(0,1fr)] border-b border-grid bg-head" aria-hidden="true">
      <div className="border-r border-grid" />
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12">
        {LETTERS.map((letter, i) => (
          <div
            key={letter}
            className={`h-6 items-center justify-center border-r border-grid last:border-r-0 font-mono text-[12px] text-muted ${
              i >= 6 ? 'hidden lg:flex' : i >= 4 ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
    {children}
  </div>
);

export const Row = ({ children, className = '', rowClassName = '' }) => (
  <div className={`sheet-row ${rowClassName}`}>
    <div className="gutter" aria-hidden="true" />
    <div className={`grid grid-cols-12 gap-px bg-grid ${className}`}>{children}</div>
  </div>
);

// One cell. Clicking it (or tabbing into a link inside it) selects it and shows its formula.
export const Cell = ({ id, formula, span = 'col-span-12', pad = true, className = '', children, as: Tag = 'div', ...rest }) => {
  const { selectedRef, select } = useWorkbook();
  const isSelected = selectedRef === id;
  const onSelect = () => select(id, formula ?? '');

  return (
    <Tag
      {...rest}
      onClick={onSelect}
      onFocus={onSelect}
      className={`cell ${span} ${pad ? 'cell-pad' : ''} ${isSelected ? 'is-selected' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};
