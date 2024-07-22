export function commentParser(text) {
  text = text.trim();

  if (text.substr(0, 2) === '//') {
    return [
      'line',
      text.split(/\r?\n/).map(function (line) {
        return line.substr(2);
      }),
    ];
  } else if (text.substr(0, 2) === '/*' && text.substr(-2) === '*/') {
    return ['block', text.substring(2, text.length - 2)];
  } else {
    throw new Error(
      'Could not parse comment file: the file must contain either just line comments (//) or a single block comment (/* ... */)',
    );
  }
}
