export const buildPGN = (pgn, result, session) => {
  const whitePlayer =
    session.challengerColor === "white"
      ? session.challenger
      : session.challengee;
  const blackPlayer =
    session.challengerColor === "white"
      ? session.challengee
      : session.challenger;
  const date = new Date().toISOString().substring(0, 10);
  // .replace("-", ".")
  // .replace(/T/, " ")
  // .replace(/\..+/, "");
  return `[Date "${date}"]
[White "${whitePlayer}"]
[Black "${blackPlayer}"]
[Source "ChessMate 1.0"]
[Result "${result}"]

${pgn} ${result}`;
};
