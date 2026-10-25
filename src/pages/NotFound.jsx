import { Link, useLocation } from 'react-router-dom';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { SHEETS } from '../components/Layout';

const NotFound = () => {
  const { pathname } = useLocation();
  useSheet('A1', `=INDIRECT("${pathname}")`);

  return (
    <Sheet>
      <Row>
        <Cell id="A1" formula={`=INDIRECT("${pathname}")`} className="!py-16 sm:!py-24">
          <div className="font-mono text-5xl sm:text-6xl font-semibold text-[#C0392B]">#REF!</div>
          <h1 className="mt-4 sheet-title">There’s no sheet at {pathname}</h1>
          <p className="body-copy mt-2 max-w-xl">
            The link may be out of date or mistyped. Pick a sheet below to keep going.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {SHEETS.map((sheet, i) => (
              <Link key={sheet.to} to={sheet.to} className={`btn ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}>
                {sheet.label}
              </Link>
            ))}
          </div>
        </Cell>
      </Row>
    </Sheet>
  );
};

export default NotFound;
