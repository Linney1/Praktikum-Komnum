function hitung() {

    //PENGAMBILAN DATA
    let func = document.getElementById("func").value;
    let f = function (x) {
        try {
            return eval(func);
        } catch {
            return NaN;
        }
    };

    let rumus = document.getElementById("rumus").value;
    let x1 = parseFloat(document.getElementById("x1").value);
    let x2 = parseFloat(document.getElementById("x2").value);
    let iterasi = parseInt(document.getElementById("iterasi").value);
    let presisi = parseInt(document.getElementById("presisi").value);

    //INISIALISASI TABEL
    let tabel;
    if (rumus == "regula-falsi") {
        tabel =
            `<table>
                <tr>
                    <th>Iterasi</th>
                    <th>x<sub>1</sub></th>
                    <th>x<sub>2</sub></th>
                    <th>x<sub>3</sub></th>
                    <th>f(x<sub>1</sub>)</th>
                    <th>f(x<sub>2</sub>)</th>
                    <th>f(x<sub>3</sub>)</th>
                    <th>E<sub>r</sub></th>
                </tr>`;
    } else if (rumus == 'secant') {
        tabel =
            `<table>
                <tr>
                    <th>Iterasi</th>
                    <th>x<sub>i-1</sub></th>
                    <th>x<sub>i</sub></th>
                    <th>x<sub>i+1</sub></th>
                    <th>E<sub>r</sub></th>
                </tr>`;
    }

    //MENGISI TABEL DENGAN DATA
    let x3, er;
    for (let i = 1; i <= iterasi; i++) {

        if (rumus == "regula-falsi") {

            x3 = (x1 * f(x2) - x2 * f(x1)) / (f(x2) - f(x1));

            tabel +=
                `<tr>
                    <td>${i}</td>
                    <td>${x1.toFixed(presisi)}</td>
                    <td>${x2.toFixed(presisi)}</td>
                    <td>${x3.toFixed(presisi)}</td>
                    <td>${f(x1).toFixed(presisi)}</td>
                    <td>${f(x2).toFixed(presisi)}</td>
                    <td>${f(x3).toFixed(presisi)}</td>`;

            if (f(x3) * f(x1) < 0) {
                er = Math.abs((x3 - x2) / x3) * 100; //error relatif
                x2 = x3;
            } else {
                er = Math.abs((x3 - x1) / x3) * 100;
                x1 = x3;
            }

            tabel +=
                `<td>${er.toFixed(2)}%</td>
                </tr>`;
        } else if (rumus == "secant") {
            x3 = x2 - (f(x2) * (x1 - x2)) / (f(x1) - f(x2));

            tabel +=
                `<tr>
                    <td>${i}</td>
                    <td>${x1.toFixed(presisi)}</td>
                    <td>${x2.toFixed(presisi)}</td>
                    <td>${x3.toFixed(presisi)}</td>`;

            er = Math.abs((x3 - x2) / x3) * 100;
            x1 = x2;
            x2 = x3;

            tabel +=
                `<td>${er.toFixed(2)}%</td>
                </tr>`;
        }
    }

    //MENAMPILKAN TABEL
    tabel += `</table>`;
    document.getElementById("tabel").innerHTML = tabel;

    //PEMBUATAN BATAS GRAFIK
    let rentang = Math.abs(x2 - x1);
    let batasKiri = x3 - rentang * 3; //xMin
    let batasKanan = x3 + rentang * 3; //xMax

    if (rentang < 1) {
        batasKiri -= 1;
        batasKanan += 1;
    }

    let detail = (batasKanan - batasKiri) / 200; //detail atau kehalusan garis grafik

    let batasBawah = Infinity; //yMin
    let batasAtas = -Infinity; // yMax

    //PEMBUATAN KURVA atau GARIS GRAFIK
    let dataGrafik = [];
    for (let x = batasKiri; x <= batasKanan; x += detail) {
        let y = f(x);
        if (isFinite(y)) {
            dataGrafik.push({ x: x, y: y });
            if (batasBawah > y) batasBawah = y;
            if (batasAtas < y) batasAtas = y;
        }
    }

    //TAMPILKAN GRAFIK DENGAN CHART.JS
    let ctx = document.getElementById("grafik");

    if (window.chart instanceof Chart) { //hapus grafik lama
        window.chart.destroy();
    }

    window.chart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [{
                label: "f(x)",
                data: dataGrafik,
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            }]
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
                    min: batasBawah,
                    max: batasAtas,
                    title: { display: true, text: "f(x)" }
                }
            }
        }
    });
}

hitung();