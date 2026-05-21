export const PLAYOFF_SLOTS = [
  { matchNo: 67, homeSeed: "1st", awaySeed: "4th" },
  { matchNo: 68, homeSeed: "2nd", awaySeed: "3rd" },
];

export const KNOCKOUT_PLACEHOLDER_SLOTS = {
  "Semi-finals": PLAYOFF_SLOTS,
  "Final": [{ matchNo: 69, homeSeed: "W67", awaySeed: "W68" }],
};

export const KO_ROUNDS = [
  ["Semi-finals", PLAYOFF_SLOTS.map((slot) => slot.matchNo)],
  ["Final", KNOCKOUT_PLACEHOLDER_SLOTS.Final.map((slot) => slot.matchNo)],
];
