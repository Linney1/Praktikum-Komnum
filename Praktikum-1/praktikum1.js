function parseFunction(expr) {
  return function(x) {
    try {
      return eval(expr);
    } catch {
      return NaN;
    }
  };
}

function hitung() {
  let expr = document.getElementById("func").value;
  let f = parseFunction(expr);

  let a = parseFloat(document.getElementById("a").value);
  let b = parseFloat(document.getElementById("b").value);
  let n = parseInt(document.getElementById("n").value);

  let output = "<table><tr><th>Iterasi</th><th>a</th><th>b</th><th>xr</th><th>f(xr)</th></tr>";

  let xr;
  let titikIterasi = [];

  for (let i = 1; i <= n; i++) {
    xr = (a + b) / 2;
    let fxr = f(xr);

    titikIterasi.push({ x: xr, y: fxr });

    output += `<tr>
      <td>${i}</td>
      <td>${a.toFixed(4)}</td>
      <td>${b.toFixed(4)}</td>
      <td>${xr.toFixed(4)}</td>
      <td>${fxr.toFixed(4)}</td>
    </tr>`;

    if (f(a) * fxr < 0) {
      b = xr;
    } else {
      a = xr;
    }
  }

  output += "</table>";
  document.getElementById("output").innerHTML = output;

  // GRAFIK 
  let data = [];

  let xr_last = xr;
  let range = Math.abs(b - a);

  let xStart = xr_last - range * 3;
  let xEnd = xr_last + range * 3;

  if (range < 0.01) {
    xStart -= 1;
    xEnd += 1;
  }

  let step = (xEnd - xStart) / 200;

  let yMin = Infinity;
  let yMax = -Infinity;

  // kurva
  for (let x = xStart; x <= xEnd; x += step) {
    let y = f(x);
    if (isFinite(y)) {
      data.push({ x: x, y: y });
      yMin = Math.min(yMin, y);
      yMax = Math.max(yMax, y);
    }
  }

  // titik iterasi masuk range
  titikIterasi.forEach(p => {
    yMin = Math.min(yMin, p.y);
    yMax = Math.max(yMax, p.y);
  });

  let ctx = document.getElementById("chart");

  if (window.chart instanceof Chart) {
    window.chart.destroy();
  }

  window.chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "f(x)",
          data: data,
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        },

        // titik iterasi jelas & beda warna
        {
          label: "Titik Iterasi",
          data: titikIterasi,
          pointRadius: 6,
          pointBackgroundColor: titikIterasi.map((_, i) => 
            `hsl(${i * 60}, 70%, 50%)`
          ),
          showLine: false
        },

        {
          label: "Akar (xr terakhir)",
          data: [{ x: xr_last, y: f(xr_last) }],
          pointRadius: 8,
          pointBackgroundColor: "red",
          showLine: false
        }
      ]
    },
    options: {
      responsive: true,
      parsing: false,
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "x" }
        },
        y: {
          min: yMin - 0.5,
          max: yMax + 0.5,
          title: { display: true, text: "f(x)" }
        }
      }
    }
  });
}

hitung();