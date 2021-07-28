export function filename(path: string): string {
    return `${path.split('\\').pop()?.split('/').pop()}`;
}

export function pathMinusFile(path: string): string {
    return path.substring(0, path.length - filename(path).length)
}