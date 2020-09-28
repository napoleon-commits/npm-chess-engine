/* eslint no-bitwise: ["error", { "allow": ["|","<<"] }] */

// eslint-disable-next-line
export function MOVE(from, to, captured, promoted, flag) {
  return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}
