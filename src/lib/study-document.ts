export function parseStudyDocument(source: string) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const first = lines.findIndex(line => /^Atividade \d+ — /.test(line));
  const starts = lines.flatMap((line, index) => /^Atividade \d+ — /.test(line) ? [index] : []);
  return {
    title: lines[0], metadata: lines[1], introduction: lines.slice(2, first).join('\n').trim(),
    activities: starts.map((start, index) => {
      const end = starts[index + 1] ?? lines.length;
      const raw = lines.slice(start + 1, end).filter(line => !/^Atividades 7 a 10 — /.test(line)).join('\n').trim();
      const answerIndex = raw.indexOf('\nResposta:\n');
      if (answerIndex < 0) throw new Error('Activity without supplied answer: ' + lines[start]);
      return {
        number: index + 1, title: lines[start],
        groupHeading: index === 6 ? lines.find(line => /^Atividades 7 a 10 — /.test(line)) : undefined,
        prompt: raw.slice(0, answerIndex), answer: raw.slice(answerIndex + '\nResposta:\n'.length),
      };
    }),
  };
}
