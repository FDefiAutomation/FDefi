export function ellipsizeIt(text: string, length: number): string {
  if (text.length > length) {
    return `${text.substring(0, length)}...${text.substring(
      text.length - length
    )}`;
  }
  return "";
}
