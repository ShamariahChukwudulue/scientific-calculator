// DOM
const display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");

// State
let expr = "";
let invMode = false;
let lastAns = 0;

// Math helpers (referenced by name in evaluateExpr)
function sinDeg(x) {
  return Math.sin((x * Math.PI) / 180);
}
function cosDeg(x) {
  return Math.cos((x * Math.PI) / 180);
}
function tanDeg(x) {
  return Math.tan((x * Math.PI) / 180);
}
function asinDeg(x) {
  return (Math.asin(x) * 180) / Math.PI;
}
function acosDeg(x) {
  return (Math.acos(x) * 180) / Math.PI;
}
function atanDeg(x) {
  return (Math.atan(x) * 180) / Math.PI;
}
function sq(x) {
  return x * x;
}
function pow10(x) {
  return Math.pow(10, x);
}
function factorial(n) {
  n = Math.round(n);
  if (n < 0) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// Display
function updateDisplay() {
  display.textContent = expr === "" ? "0" : expr;
}

// Evaluation
function evaluateExpr(str) {
  let e2 = str;

  // Postfix operators
  e2 = e2.replace(/(\d+(\.\d+)?)!/g, "factorial($1)");
  e2 = e2.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

  // Functions
  e2 = e2.replace(/√\(/g, "Math.sqrt(");
  e2 = e2.replace(/ln\(/g, "Math.log(");
  e2 = e2.replace(/log\(/g, "Math.log10(");
  e2 = e2.replace(/exp\(/g, "Math.exp(");
  e2 = e2.replace(/sin\(/g, "sinDeg(");
  e2 = e2.replace(/cos\(/g, "cosDeg(");
  e2 = e2.replace(/tan\(/g, "tanDeg(");

  // Constants
  e2 = e2.replace(/π/g, "Math.PI");
  e2 = e2.replace(/ℯ/g, "Math.E");

  // Operators
  e2 = e2.replace(/×/g, "*");
  e2 = e2.replace(/÷/g, "/");
  e2 = e2.replace(/−/g, "-");
  e2 = e2.replace(/\^/g, "**");

  return eval(e2);
}

// Button handling
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    const action = btn.dataset.action;

    // Digits, operators, brackets
    if (val) {
      expr += val;
      updateDisplay();
      return;
    }

    // Actions
    switch (action) {
      case "clear":
        expr = "";
        updateDisplay();
        break;

      case "del":
        expr = expr.slice(0, -1);
        updateDisplay();
        break;

      case "equals":
        try {
          const res = evaluateExpr(expr);
          if (res === undefined || Number.isNaN(res) || !isFinite(res)) {
            throw new Error("invalid result");
          }
          lastAns = res;
          expr = String(res);
          updateDisplay();
        } catch (err) {
          display.textContent = "Error";
          expr = "";
        }
        break;

      case "inv":
        invMode = !invMode;
        btn.classList.toggle("active", invMode);
        break;

      case "sin":
        expr += invMode ? "asin(" : "sin(";
        updateDisplay();
        break;

      case "cos":
        expr += invMode ? "acos(" : "cos(";
        updateDisplay();
        break;

      case "tan":
        expr += invMode ? "atan(" : "tan(";
        updateDisplay();
        break;

      case "ln":
        expr += invMode ? "exp(" : "ln(";
        updateDisplay();
        break;

      case "log":
        expr += invMode ? "pow10(" : "log(";
        updateDisplay();
        break;

      case "sqrt":
        expr += invMode ? "sq(" : "√(";
        updateDisplay();
        break;

      case "pi":
        expr += "π";
        updateDisplay();
        break;

      case "e":
        expr += "ℯ";
        updateDisplay();
        break;

      case "ans":
        expr += String(lastAns);
        updateDisplay();
        break;

      case "exp":
        expr += "×10^(";
        updateDisplay();
        break;

      case "fact":
        expr += "!";
        updateDisplay();
        break;
    }
  });
});
