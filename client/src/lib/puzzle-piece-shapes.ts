export interface PieceEdges {
  top: 'flat' | 'tab' | 'blank';
  right: 'flat' | 'tab' | 'blank';
  bottom: 'flat' | 'tab' | 'blank';
  left: 'flat' | 'tab' | 'blank';
}

export function generatePieceEdges(
  row: number,
  col: number,
  totalRows: number,
  totalCols: number,
  edgeMap: Map<string, boolean>
): PieceEdges {
  const getEdgeKey = (r1: number, c1: number, r2: number, c2: number) => {
    const sorted = [[r1, c1], [r2, c2]].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    return `${sorted[0][0]},${sorted[0][1]}-${sorted[1][0]},${sorted[1][1]}`;
  };

  const getOrSetEdge = (r1: number, c1: number, r2: number, c2: number, isFirst: boolean): boolean => {
    const key = getEdgeKey(r1, c1, r2, c2);
    if (edgeMap.has(key)) {
      const val = edgeMap.get(key)!;
      return isFirst ? val : !val;
    }
    const val = Math.random() > 0.5;
    edgeMap.set(key, val);
    return isFirst ? val : !val;
  };

  return {
    top: row === 0 ? 'flat' : (getOrSetEdge(row - 1, col, row, col, false) ? 'tab' : 'blank'),
    right: col === totalCols - 1 ? 'flat' : (getOrSetEdge(row, col, row, col + 1, true) ? 'tab' : 'blank'),
    bottom: row === totalRows - 1 ? 'flat' : (getOrSetEdge(row, col, row + 1, col, true) ? 'tab' : 'blank'),
    left: col === 0 ? 'flat' : (getOrSetEdge(row, col - 1, row, col, false) ? 'tab' : 'blank'),
  };
}

export function generatePiecePath(
  edges: PieceEdges,
  width: number,
  height: number,
  tabSize: number = 0.2
): string {
  const w = width;
  const h = height;
  const tw = w * tabSize;
  const th = h * tabSize;
  
  let path = '';
  
  path += `M 0 0 `;
  
  if (edges.top === 'flat') {
    path += `L ${w} 0 `;
  } else if (edges.top === 'tab') {
    path += `L ${w * 0.35} 0 `;
    path += `C ${w * 0.35} ${-th * 0.2}, ${w * 0.35 - tw * 0.2} ${-th}, ${w * 0.5} ${-th} `;
    path += `C ${w * 0.65 + tw * 0.2} ${-th}, ${w * 0.65} ${-th * 0.2}, ${w * 0.65} 0 `;
    path += `L ${w} 0 `;
  } else {
    path += `L ${w * 0.35} 0 `;
    path += `C ${w * 0.35} ${th * 0.2}, ${w * 0.35 - tw * 0.2} ${th}, ${w * 0.5} ${th} `;
    path += `C ${w * 0.65 + tw * 0.2} ${th}, ${w * 0.65} ${th * 0.2}, ${w * 0.65} 0 `;
    path += `L ${w} 0 `;
  }
  
  if (edges.right === 'flat') {
    path += `L ${w} ${h} `;
  } else if (edges.right === 'tab') {
    path += `L ${w} ${h * 0.35} `;
    path += `C ${w + tw * 0.2} ${h * 0.35}, ${w + tw} ${h * 0.35 - th * 0.2}, ${w + tw} ${h * 0.5} `;
    path += `C ${w + tw} ${h * 0.65 + th * 0.2}, ${w + tw * 0.2} ${h * 0.65}, ${w} ${h * 0.65} `;
    path += `L ${w} ${h} `;
  } else {
    path += `L ${w} ${h * 0.35} `;
    path += `C ${w - tw * 0.2} ${h * 0.35}, ${w - tw} ${h * 0.35 - th * 0.2}, ${w - tw} ${h * 0.5} `;
    path += `C ${w - tw} ${h * 0.65 + th * 0.2}, ${w - tw * 0.2} ${h * 0.65}, ${w} ${h * 0.65} `;
    path += `L ${w} ${h} `;
  }
  
  if (edges.bottom === 'flat') {
    path += `L 0 ${h} `;
  } else if (edges.bottom === 'tab') {
    path += `L ${w * 0.65} ${h} `;
    path += `C ${w * 0.65} ${h + th * 0.2}, ${w * 0.65 + tw * 0.2} ${h + th}, ${w * 0.5} ${h + th} `;
    path += `C ${w * 0.35 - tw * 0.2} ${h + th}, ${w * 0.35} ${h + th * 0.2}, ${w * 0.35} ${h} `;
    path += `L 0 ${h} `;
  } else {
    path += `L ${w * 0.65} ${h} `;
    path += `C ${w * 0.65} ${h - th * 0.2}, ${w * 0.65 + tw * 0.2} ${h - th}, ${w * 0.5} ${h - th} `;
    path += `C ${w * 0.35 - tw * 0.2} ${h - th}, ${w * 0.35} ${h - th * 0.2}, ${w * 0.35} ${h} `;
    path += `L 0 ${h} `;
  }
  
  if (edges.left === 'flat') {
    path += `L 0 0 `;
  } else if (edges.left === 'tab') {
    path += `L 0 ${h * 0.65} `;
    path += `C ${-tw * 0.2} ${h * 0.65}, ${-tw} ${h * 0.65 + th * 0.2}, ${-tw} ${h * 0.5} `;
    path += `C ${-tw} ${h * 0.35 - th * 0.2}, ${-tw * 0.2} ${h * 0.35}, 0 ${h * 0.35} `;
    path += `L 0 0 `;
  } else {
    path += `L 0 ${h * 0.65} `;
    path += `C ${tw * 0.2} ${h * 0.65}, ${tw} ${h * 0.65 + th * 0.2}, ${tw} ${h * 0.5} `;
    path += `C ${tw} ${h * 0.35 - th * 0.2}, ${tw * 0.2} ${h * 0.35}, 0 ${h * 0.35} `;
    path += `L 0 0 `;
  }
  
  path += 'Z';
  
  return path;
}

export function generateAllPieceEdges(rows: number, cols: number): PieceEdges[][] {
  const edgeMap = new Map<string, boolean>();
  const allEdges: PieceEdges[][] = [];
  
  for (let row = 0; row < rows; row++) {
    const rowEdges: PieceEdges[] = [];
    for (let col = 0; col < cols; col++) {
      rowEdges.push(generatePieceEdges(row, col, rows, cols, edgeMap));
    }
    allEdges.push(rowEdges);
  }
  
  return allEdges;
}
