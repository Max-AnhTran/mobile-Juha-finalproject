export function distributeIntoRows(items, rows = 3) {
    const result = Array.from({length: rows}, () => []);
    items.forEach((item, i) => {
        result[i % rows].push(item); // round-robin
    });
    return result;
}
