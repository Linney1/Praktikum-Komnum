function ubahFungsi(rumus) {
  return function(x) {
    try {
      return eval(rumus);
    } catch {
      return NaN;
    }
  };
}

function hitung() {
  let rumus = document.getElementById("fungsi").value;
  let func = ubahFungsi(rumus);

  let x1 = parseFloat(document.getElementById("x1").value);
  let x2 = parseFloat(document.getElementById("x2").value);
  let iteration = parseInt(document.getElementById("iteration").value);
  let decimalNum = parseInt(document.getElementById("decimalNum").value);

  let output = "<table><tr><th>Iterasi</th><th>x1</th><th>x2</th><th>x3</th><th>f(x3)</th></tr>";

  let x3;
  let titikIterasi = [];

  for (let i = 1; i <= iteration; i++) {
    x3 = (x1 * func(x2) - x2 * func(x1)) / (func(x2) - func(x1));
    let funcx3 = func(x3);

    titikIterasi.push({ x: x3, y: funcx3 });

    output += `<tr>
      <td>${i}</td>
      <td>${x1.toFixed(decimalNum)}</td>
      <td>${x2.toFixed(decimalNum)}</td>
      <td>${x3.toFixed(decimalNum)}</td>
      <td>${funcx3.toFixed(decimalNum)}</td>
    </tr>`;

    if (func(x1) * func(x3) < 0) {
      x2 = x3;
    } else {
      x1 = x3;
    }
  }

  output += "</table>";
  document.getElementById("output").innerHTML = output;

  // GRAFIK 
  let data = [];

  let x3_last = x3;
  let range = Math.abs(x2 - x1);

  let xStart = x3_last - range * 3;
  let xEnd = x3_last + range * 3;

  if (range < 0.01) {
    xStart -= 1;
    xEnd += 1;
  }

  let step = (xEnd - xStart) / 200;

  let yMin = Infinity;
  let yMax = -Infinity;

  // KURVA
  for (let x = xStart; x <= xEnd; x += step) {
    let y = func(x);
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
          label: "func(x)",
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
          data: [{ x: x3_last, y: func(x3_last) }],
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