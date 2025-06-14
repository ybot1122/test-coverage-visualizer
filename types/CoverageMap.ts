export interface CoverageMap {
  path: string;
  statementMap: StatementMap;
  fnMap: FnMap;
  branchMap: BranchMap;
  s: S;
  f: F;
  b: B;
}

interface Location {
  line: number;
  column: number | null;
}

interface StatementMap {
  [key: string]: { start: Location; end: Location };
}

interface FnMap {
  [key: string]: {
    name: string;
    decl: { start: Location; end: Location };
    loc: { start: Location; end: Location };
  };
}

interface BranchMap {
  [key: string]: {
    loc: { start: Location; end: Location };
    type: string;
    locations: { start: Location; end: Location }[];
  };
}

interface S {
  [key: string]: number;
}

interface F {
  [key: string]: number;
}

interface B {
  [key: string]: number[];
}
