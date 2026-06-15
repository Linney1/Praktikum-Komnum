function switchTab(name) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
    event.target.classList.add('active');
}

function hitung() {
    // PENGAMBILAN DATA
    let funcStr = document.getElementById("func").value.trim();
    if (!funcStr) {
        alert("Masukkan fungsi f(x) terlebih dahulu.");
        return;
    }

    let f = function(x) {
        try {
            return eval(funcStr);
        } catch {
            return NaN;
        }
    };

    let a = eval(document.getElementById("a").value);
    let b = eval(document.getElementById("b").value);
    let n = parseInt(document.getElementById("level").value);
    let presisi = parseInt(document.getElementById("presisi").value);
    let nTrap = parseInt(document.getElementById("nTrap").value);

    if (isNaN(a) || isNaN(b) || isNaN(n) || n < 1) {
        alert("Input tidak valid.");
        return;
    }

    if (a >= b) {
        alert("Batas bawah harus lebih kecil dari batas atas.");
        return;
    }

    n = Math.min(n, 8);
    nTrap = Math.max(1, nTrap);

    // =============================================
    // HITUNG TRAPESIUM KOMPOSIT
    // =============================================
    let trapResults = [];

    for (let ni = 1; ni <= nTrap; ni++) {
        let h = (b - a) / ni;
        let sum = f(a) + f(b);

        for (let k = 1; k < ni; k++) {
            sum += 2 * f(a + k * h);
        }

        trapResults.push({
            n: ni,
            h: h,
            result: (h / 2) * sum
        });
    }

    let hasilTrap = trapResults[trapResults.length - 1].result;

    // =============================================
    // HITUNG TABEL ROMBERG R[i][j]
    // =============================================
    let R = [];

    for (let i = 0; i <= n; i++) {
        R.push(new Array(n + 1).fill(0));

        let h = (b - a) / Math.pow(2, i);
        let sum = 0;
        let steps = Math.pow(2, i);

        for (let k = 0; k <= steps; k++) {
            let x = a + k * h;
            let fx = f(x);

            if (k === 0 || k === steps) {
                sum += fx;
            } else {
                sum += 2 * fx;
            }
        }

        R[i][0] = (h / 2) * sum;
    }

    // RICHARDSON EXTRAPOLATION
    for (let j = 1; j <= n; j++) {
        for (let i = j; i <= n; i++) {
            let p = Math.pow(4, j);
            R[i][j] = (p * R[i][j - 1] - R[i - 1][j - 1]) / (p - 1);
        }
    }

    let hasilRomb = R[n][n];
    let errorEst = Math.abs(R[n][n] - R[n][n - 1]);

    // =============================================
    // TAB PERBANDINGAN
    // =============================================
    document.getElementById("trap-val").textContent = hasilTrap.toFixed(presisi);
    document.getElementById("trap-sub").textContent = `∫ f(x) dx dari x=${a} hingga x=${b}`;
    document.getElementById("romb-val").textContent = hasilRomb.toFixed(presisi);
    document.getElementById("romb-sub").textContent = `∫ f(x) dx dari x=${a} hingga x=${b}`;

    document.getElementById("trap-badges").innerHTML =
        `<span class="badge-yellow">Interval: ${nTrap}</span>
         <span class="badge-yellow">h = ${((b - a) / nTrap).toFixed(4)}</span>`;

    document.getElementById("romb-badges").innerHTML =
        `<span class="badge">Level: ${n}</span>
         <span class="badge">Error Est: ${errorEst.toExponential(2)}</span>
         <span class="badge">Subinterval: ${Math.pow(2, n)}</span>`;

    let selisih = Math.abs(hasilTrap - hasilRomb);
    let winnerBox = document.getElementById("winner-box");

    winnerBox.style.display = "block";
    winnerBox.innerHTML =
        `Selisih hasil kedua metode: <strong>${selisih.toExponential(presisi)}</strong>.
         Romberg menggunakan hanya <strong>${Math.pow(2, n)} subinterval</strong> untuk konvergen,
         sedangkan Trapesium menggunakan <strong>${nTrap} interval</strong> dengan akurasi yang lebih rendah.`;

    let tblCmp = `<table>
                <tr>
                    <th>Metode</th>
                    <th>Jumlah Interval</th>
                    <th>Hasil</th>
                    <th>Error Estimasi</th>
                </tr>
                <tr>
                    <td style="color:#f59e0b;font-weight:bold">Trapezoidal</td>
                    <td>${nTrap}</td>
                    <td>${hasilTrap.toFixed(presisi)}</td>
                    <td>${trapResults.length >= 2 ? Math.abs(trapResults[trapResults.length - 1].result - trapResults[trapResults.length - 2].result).toExponential(2) : '—'}</td>
                </tr>
                <tr>
                    <td style="color:#34d399;font-weight:bold">Romberg</td>
                    <td>${Math.pow(2, n)}</td>
                    <td class="result">${hasilRomb.toFixed(presisi)}</td>
                    <td>${errorEst.toExponential(2)}</td>
                </tr>
            </table>`;

    document.getElementById("tabel-perbandingan").innerHTML = tblCmp;

    let tblRomb = `<table>
                <tr><th>i / j</th>`;

    for (let j = 0; j <= n; j++) {
        tblRomb += `<th>R[i][${j}]${j === 0 ? ' <span class="badge">Trapesium</span>' : ''}</th>`;
    }

    tblRomb += `</tr>`;

    for (let i = 0; i <= n; i++) {
        tblRomb += `<tr><td><strong>${i}</strong></td>`;

        for (let j = 0; j <= n; j++) {
            if (j > i) {
                tblRomb += `<td style="color:#1e2a3a">—</td>`;
            } else if (i === n && j === n) {
                tblRomb += `<td class="result">${R[i][j].toFixed(presisi)}</td>`;
            } else if (j === 0) {
                tblRomb += `<td>${R[i][j].toFixed(presisi)}</td>`;
            } else {
                tblRomb += `<td class="diag">${R[i][j].toFixed(presisi)}</td>`;
            }
        }

        tblRomb += `</tr>`;
    }

    tblRomb += `</table>`;
    document.getElementById("tabel-romberg").innerHTML = tblRomb;

    let tblTrap = `<table>
                <tr>
                    <th>n (interval)</th>
                    <th>h</th>
                    <th>Hasil</th>
                    <th>Perubahan</th>
                </tr>`;

    for (let i = 0; i < trapResults.length; i++) {
        let perubahan = i === 0
            ? '—'
            : Math.abs(trapResults[i].result - trapResults[i - 1].result).toExponential(2);

        let isLast = i === trapResults.length - 1;

        tblTrap += `<tr>
                    <td>${trapResults[i].n}</td>
                    <td>${trapResults[i].h.toFixed(presisi)}</td>
                    <td ${isLast ? 'class="result"' : ''}>${trapResults[i].result.toFixed(presisi)}</td>
                    <td>${perubahan}</td>
                </tr>`;
    }

    tblTrap += `</table>`;
    document.getElementById("tabel-trapesium").innerHTML = tblTrap;

    let steps = 300;
    let dx = (b - a) / steps;

    let dataKurva = [];
    let yMin = Infinity;
    let yMax = -Infinity;

    for (let k = 0; k <= steps; k++) {
        let x = a + k * dx;
        let y = f(x);

        if (isFinite(y)) {
            dataKurva.push({ x, y });
            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;
        }
    }

    let dataTrap = [];
    let hTrap = (b - a) / nTrap;

    for (let k = 0; k <= nTrap; k++) {
        let x = a + k * hTrap;
        dataTrap.push({ x, y: f(x) });
    }

    let dataRombPts = [];
    let stepsRomb = Math.pow(2, n);
    let hRomb = (b - a) / stepsRomb;

    for (let k = 0; k <= stepsRomb; k++) {
        let x = a + k * hRomb;
        dataRombPts.push({ x, y: f(x) });
    }

    let margin = (yMax - yMin) * 0.15 || 0.5;
    let ctx = document.getElementById("grafik");

    if (window._chart instanceof Chart) {
        window._chart.destroy();
    }

    window._chart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "f(x)",
                    data: dataKurva,
                    borderColor: "#2563eb",
                    borderWidth: 2,
                    fill: {
                        target: "origin",
                        above: "rgba(37,99,235,0.10)",
                        below: "rgba(239,68,68,0.05)"
                    },
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: `Trapesium (n=${nTrap})`,
                    data: dataTrap,
                    borderColor: "#f59e0b",
                    borderWidth: 1,
                    borderDash: [4, 4],
                    backgroundColor: "rgba(245,158,11,0.08)",
                    pointRadius: 3,
                    pointBackgroundColor: "#f59e0b",
                    fill: false,
                    tension: 0
                },
                {
                    label: `Romberg (${stepsRomb} subinterval)`,
                    data: dataRombPts,
                    borderColor: "#34d399",
                    borderWidth: 1,
                    borderDash: [2, 4],
                    backgroundColor: "rgba(52,211,153,0.08)",
                    pointRadius: 3,
                    pointBackgroundColor: "#34d399",
                    fill: false,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            parsing: false,
            plugins: {
                legend: {
                    labels: { color: "#b1b9c6" }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `f(${ctx.parsed.x.toFixed(3)}) = ${ctx.parsed.y.toFixed(presisi)}`
                    }
                }
            },
            scales: {
                x: {
                    type: "linear",
                    title: { display: true, text: "x", color: "#7c8fa6" },
                    ticks: { color: "#7c8fa6" },
                    grid: { color: "#1e2a3a" },
                    min: a - (b - a) * 0.05,
                    max: b + (b - a) * 0.05
                },
                y: {
                    min: yMin - margin,
                    max: yMax + margin,
                    title: { display: true, text: "f(x)", color: "#7c8fa6" },
                    ticks: { color: "#7c8fa6" },
                    grid: { color: "#1e2a3a" }
                }
            }
        }
    });
}