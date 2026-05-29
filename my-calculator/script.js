let expression = '';

function appendToDisplay(value) {
  expression += value;
  document.getElementById('expression').textContent = expression;
}

function clearAll() {
  expression = '';
  document.getElementById('expression').textContent = '';
  document.getElementById('result').textContent = '0';
}

function deleteLast() {
  expression = expression.slice(0, -1);
  document.getElementById('expression').textContent = expression;
}

function calculate() {
  if (expression === '') return;
  try {
    let answer = eval(expression);
    document.getElementById('result').textContent = answer;
    document.getElementById('expression').textContent = expression + ' =';
    expression = String(answer);
  } catch (e) {
    document.getElementById('result').textContent = 'Error';
    expression = '';
  }
}