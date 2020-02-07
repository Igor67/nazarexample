var currDate = 1;
getUnique = function (arr) {
    var i = 0,
        current,
        length = arr.length,
        unique = [];
    for (; i < length; i++) {
        current = arr[i];
        if (!~unique.indexOf(current)) {
            unique.push(current);
        }
    }
    return unique;
};

function clearTable() {
    let element1 = document.getElementById('my-table');
    let element2 = document.getElementById('my-table2');
    let element3 = document.getElementById('my-table3');
    element1.parentNode.removeChild(element1);
    element2.parentNode.removeChild(element2);
    element3.parentNode.removeChild(element3);
}

function totalCalculate(ansFineSumm, threepersum, totalSum, colKt) {
    let total = (parseFloat(ansFineSumm) + parseFloat(threepersum * 100) + parseFloat(totalSum * colKt)).toFixed(2);
    // console.log('penya: ' + ansFineSumm + ' 3per: ' + threepersum * 100 + ' inflation: ' + totalSum * colKt);
    return total;
}

function drawPdf(infltext, indexes, doc, table, penyatext, fin, percent, total, totalIndex, date3) {
    //  var doc1 = new jsPPF();

    let info1 = document.getElementById("info").value;
    let info2 = document.getElementById("info2").value;
    var newTable = document.createElement('table');
    var textNewTable = "";
    let totalDt = 0;
    let texts = [];
    let totalKT = 0;
    let totalS = 0;
    const keys = Object.keys(table);
    let size = keys.length;
    //doc.addFont('NotoSansCJKjp-Regular', 'NotoSansCJKjp', 'normal');

    doc.setFont('NotoSansCJKjp-Regular');
    doc.text(70, 10, 'итого: ' + total);

    for (let i = 0; i < penyaV.length; i++) {
        // console.log(penyaV[i]);

    }
    for (var i = 0; i < size; i++) {
        if (i == 0) {
            textNewTable = "<table>" +
                "<tr>\n" +
                "    <th>операцiя</th>\n" +
                "    <th>дата</th>\n" +
                "    <th>дебiт</th>\n" +
                "    <th>кредит</th>\n" +
                "    <th>с-до</th>\n" +
                "   </tr>";
        }
        let currArray = table[keys[i]];
        let cDate = new Date(keys[i]);
        let month = cDate.getMonth() + 1;
        let day = cDate.getDay();
        let year = cDate.getFullYear();
        let str = day + '.' + month + '.' + year;
        let doc = currArray[0];
        let colKt = currArray[1];
        let colDt = currArray[2];
        let saldo = colKt - colDt;
        totalDt += parseInt(colDt);
        totalKT += parseInt(colKt);
        totalS += parseInt(saldo);
        textNewTable += "<tr>\n" +
            "    <th>" + doc + "</th>\n" +
            "    <th>" + str + "</th>\n" +
            "    <th>" + colDt + "</th>\n" +
            "    <th>" + colKt + "</th>\n" +
            "    <th>" + saldo + "</th>\n" +
            "   </tr>"


        if (i + 1 == size) {
            textNewTable += "</table>";
        }
    }
    textNewTable += "<tr>\n" +
        "    <th>total</th>\n" +
        "    <th></th>\n" +
        "    <th>" + totalDt + "</th>\n" +
        "    <th>" + totalKT + "</th>\n" +
        "    <th>" + totalS + "</th>\n" +
        "   </tr>"
    newTable.innerHTML = (textNewTable);
    newTable.id = 'my-table';
    document.getElementById('table-div').appendChild(newTable);
    //doc.setFont('NotoSansCJKjp-Regular');
    doc.autoTable({html: '#my-table'});


    var newTable3 = document.createElement('table');
    let table3t = "";
    for(let i =0; i< indexes.length; i++){
        if(i ==0){
            table3t = "<table>" +
                "<tr>\n" +
                "    <th>month</th>\n" +
                "    <th>index</th>\n" +
                "   </tr>";
        }
        let month = infltext[i];
        table3t += "<tr>\n" +
            "    <th>" +infltext[i]+ "</th>\n" +
            "    <th>" + indexes[i] + "</th>\n" +
            "   </tr>";
    }
    newTable3.innerHTML = (table3t);
    newTable3.id = 'my-table3';
    document.getElementById('table-div').appendChild(newTable3);
    doc.autoTable({html: '#my-table3'});

    var newTable2 = document.createElement('table');
    let newTable2T = "";
    //doc.text('Inflation', 70, 43);
    let totalsum = 0;
    let countf = 0
    for (let i = 0; i < keys.length; i++) {
        if (i == 0) {
            newTable2T = "<table>" +
                "<tr>\n" +
                "    <th>months</th>\n" +
                "    <th>index</th>\n" +
                "    <th>totalIndex</th>\n" +
                "    <th>sum</th>\n" +
                "    <th>total_Inflation</th>\n" +
                "    <th>inflation</th>\n" +
                "   </tr>";
        }
        let currArray = table[keys[i]];
        // if (keys.length <= 1) {
        //     totalsum = currArray[1] - currArray[2];
        // }
                let sum = currArray[1];
                let msum = currArray[2]
                // totalsum = 0;
                totalsum += parseInt(sum);
                totalsum -= parseInt(msum);
        let date1 = new Date(keys[i]);
        let date2 = new Date(keys[i + 1]);
        if (i + 1 == keys.length) {
            date2 = new Date(date3)
        }
        let cmonth = date1.getMonth() + 1;
        let cyear = date1.getFullYear();
        let cday = date1.getDay();
        let nmonth = date2.getMonth() + 1;
        let nyear = date2.getFullYear();
        let nday = date2.getDay();
        let diff = findDifferenceM(date1, date2);
        let infla = drawInflation(date1, diff).array;
        totalIndex = findTotalIndex(infla);
        console.log(totalIndex);
        let inflStr = drawInflation(date1, diff).string;
        let t = (totalsum * totalIndex)
        let cresult = parseFloat(t) - parseFloat(totalsum);
        newTable2T += "<tr>\n" +
            "    <th>" + date1.getDay() + "." + date1.getMonth()+1 + "." + date1.getFullYear() + "-" + date2.getDay() + "." + date2.getMonth()+1 + "." + date2.getFullYear() + "</th>\n" +
            "    <th>" + inflStr + "</th>\n" +
             "    <th>" + totalIndex.toFixed(2) + "</th>\n" +
            "    <th>" + totalsum.toFixed(2) + "</th>\n" +
            "    <th>" + t.toFixed(2) + "</th>\n" +
            "    <th>" + cresult.toFixed(2)+ "</th>\n" +
            "   </tr>";
        if (i + 1 == indexes.length) {
            newTable2T += "</table>"
        }
        countf++;
    }
    newTable2.innerHTML = (newTable2T);
    newTable2.id = 'my-table2';
    document.getElementById('table-div').appendChild(newTable2);
    //doc.setFont('NotoSansCJKjp-Regular');
    doc.autoTable({html: '#my-table2'});


    // var newTable3 = document.createElement('table');
    // let table3t = "";
    //
    // for (let i = 0; i < penyaV.length; i++) {
    //     if (i == 0) {
    //         table3t = "<table>" +
    //             "<tr>\n" +
    //             "    <th>date</th>\n" +
    //             "    <th>value</th>\n" +
    //             "   </tr>";
    //     }
    //     let datep = penyatext[i]
    //     let penya = penyaV[i];
    //     table3t += "<tr>\n" +
    //         "    <th>" + datep + "</th>\n" +
    //         "    <th>" + penya + "</th>\n" +
    //         "   </tr>";
    //     if (i + 1 == indexes.length) {
    //         table3t += "</table>"
    //     }
    // }
    // newTable3.innerHTML = table3t;
    // newTable3.id = 'my-table3';
    // document.getElementById('table-div').appendChild(newTable3);
    // doc.autoTable({html: '#my-table3'});
    var perTable = document.createElement('table');
    let pertabletext = "";
    var totalper = 0.0;
    for (var i = 0; i < size; i++) {
        if (i == 0) {
            pertabletext = "<table>" +
                "<tr>\n" +
                "    <th>startDate</th>\n" +
                "    <th>endDate</th>\n" +
                "    <th>Difference</th>\n" +
                "    <th>percent</th>\n" +
                "    <th>sum</th>\n" +
                "    <th>answer</th>\n" +
                "   </tr>";
        }
        let currArray = table[keys[i]];
        let cDate = new Date(keys[i]);
        let month = cDate.getMonth() + 1;
        let day = cDate.getDay();
        let year = cDate.getFullYear();
        let str = day + '.' + month + '.' + year;
        let date2 = new Date(keys[i + 1]);
        let sum = currArray[1];
        if (i > 0) {
            sum = 0;
            for (let v = keys.length; v > 0; v--) {
                let fcurrarr = table[keys[v - 1]];
                sum += parseInt(fcurrarr[1]);
                sum = sum - parseInt(fcurrarr[2]);
            }
        }
        if (i + 1 == size) {
            date2 = fin;
        }
        let month2 = date2.getMonth() + 1;
        let day2 = date2.getDay();
        let year2 = date2.getFullYear();
        // console.log('sum: ' + isNaN(sum));
        // console.log('threeper: ' + isNaN(threeper[i]))
        let answer = threeper[i] * 100;

        totalper += answer;
        let differenceDays = findDaysLag(date2, cDate);
        let str2 = day2 + '.' + month2 + '.' + year2;
        pertabletext += "<tr>\n" +
            "    <th>" + str + "</th>\n" +
            "    <th>" + str2 + "</th>\n" +
            "    <th>" + differenceDays + "</th>\n" +
            "    <th>" + percent * 100 + "%</th>\n" +
            "    <th>" + sum + "</th>\n" +
            "    <th>" + answer.toFixed(2) + "</th>\n" +
            "   </tr>"


        if (i + 1 == size) {
            pertabletext += "</table>";
        }
    }
    pertabletext += "<tr>\n" +
        "    <th>total</th>\n" +
        "    <th></th>\n" +
        "    <th></th>\n" +
        "    <th></th>\n" +
        "    <th></th>\n" +
        "    <th>" + totalper.toFixed(2) + "</th>\n" +
        "   </tr>"
    perTable.innerHTML = (pertabletext);
    perTable.id = 'my-table3';
    document.getElementById('table-div').appendChild(perTable);
    //doc.setFont('NotoSansCJKjp-Regular');
    doc.autoTable({html: '#my-table3'});
    doc.save('table.pdf')
}

function penyaDeadLinecalc(date1, deadline) {
    let penyadeadline = date1.getMonth() + stop + '.' + date1.getDay() + date1.getFullYear() + deadline;
    return penyadeadline;
}

function deadlineCheck(date2, term, date1) {
    let termDate = new Date(date2.getFullYear() - term, date2.getMonth(), date2.getDay() - 1);
    let ansFineSumm = 0;
    // if (date2 > penyadeadline) {
    //     ansFineSumm = 0;
    // }
    if (date1 < termDate) {
        return true;
    } else {
        return false;
    }

}

function penyaCalc(summPenya, daysForCalc, colKt) {
    let commonPenya = (Number(summPenya) / Number(daysForCalc + 2)).toFixed(2),
        vasya = ((Number(colKt) * Number(commonPenya) * 2 / 100 / 365 * Number(daysForCalc))).toFixed(2);
    return vasya;
}

function findInflTerm(date1, date2, inflTerm) {
    let inflTermD = date1;
    let inflTermDn = date1;
    if (inflTerm != 0) {
        inflTermDn = new Date(date2.getFullYear() - inflTerm, date2.getMonth(), date2.getDay() - 1);
    }
    if (inflTermD > inflTermDn) {
        inflTermDn = inflTermD;
    }
    return inflTermDn;
}

function findTotalIndex(indexes) {
    let totalSum = 1.0;
    for (let v = 0; v < indexes.length; v++) {
        totalSum = indexes[v] / 100 * totalSum;
    }
    totalSum = totalSum;
    return totalSum;
}

function drawInflation(date1, difference) {
    let indexesDraw = '';
    let indexesDrawa = [];
    date1 = new Date(date1);
    let futureYear = date1.getFullYear();
    let futureMonth = date1.getMonth() + 1;
    for (let i = 0; i <= difference; i++) {
        if (futureMonth == 13) {
            futureYear++;
            futureMonth = 1;
        }
        let str = ('0' + futureMonth + '-' + futureYear);

        if (futureMonth >= 10) {
            str = (futureMonth + '-' + futureYear);
        }
        // console.log('str: ' + str);
        // console.log()
        indexesDraw += (ShowIndexInflation(str).index) + '% ';
        indexesDrawa.push(ShowIndexInflation(str).index)
        futureMonth++;

    }
    return {
        string: indexesDraw,
        array: indexesDrawa
    };
}

function findDaysLag(date2, date1) {
    let daysLag = Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
    return daysLag;
}

function findDaysForCalculate(daysLag, stop) {
    let daysForCalc = 0;

    if (daysLag >= stop) {
        daysForCalc = stop;
    } else {
        daysForCalc = daysLag;
    }
    return daysForCalc;
}

var threeper = [];

function findThreePer(colKt, percent, date2, inflTermD) {
    let threepersum = 1;
    threepersum = colKt * (percent / 100) * 365 / ((date2 - inflTermD) / 60 / 60 / 24 / 1000);
    threeper.push(threepersum);
    // console.log('3per: ' + threepersum);
    return threepersum;
}

function findPenaltyt(daysForCalc, futureYear, futureMonth, futureDay) {
    let penyatext = [];
    for (let i = daysForCalc; i >= 0; i--) {
        let penyadate = new Date(futureYear, futureMonth, futureDay);
        if (i % 365 == 0) {
            futureYear++;
            futureMonth = 1;

        }
        if (i % 31 == 0) {
            futureMonth++;
            futureDay = 1;

        }
        penyatext.push(ShowPenyPercent(penyadate).data);


        futureDay++;
    }
    return penyatext;
}

var penyaV = [];

function findPenalty(daysForCalc, futureYear, futureMonth, futureDay) {
    let summPenya = 0.0;
    for (let i = daysForCalc; i >= 0; i--) {
        let penyadate = new Date(futureYear, futureMonth, futureDay);
        if (i % 365 == 0) {
            futureYear++;
            futureMonth = 1;

        }
        if (i % 31 == 0) {
            futureMonth++;
            futureDay = 1;

        }
        if (document.getElementById('penya-count').value == 0) {
            summPenya += ShowPenyPercent(penyadate).percent;
            penyaV.push(ShowPenyPercent(penyadate).percent);
        } else {
            summPenya += document.getElementById('penya-count').value;
        }

        // ////////console.log(futureDay + '.' + futureMonth + '.' + futureYear + ': ' + ShowPenyPercent(penyadate).percent);
        futureDay++;
    }
    return summPenya;
}

function findDifferenceM(date1, date2) {
    let differenceMonths;
    differenceMonths = date2.getMonth() - date1.getMonth() + (12 * (date2.getFullYear() - date1.getFullYear()));
    return differenceMonths;
}

function inflArrayt(difference, futureMonth, futureYear) {
    let infltext = [];

    for (let i = 0; i <= difference; i++) {
        if (futureMonth == 13) {
            futureYear++;
            futureMonth = 1;
        }
        let str = ('0' + futureMonth + '-' + futureYear);

        if (futureMonth >= 10) {
            str = (futureMonth + '-' + futureYear);
        }


        futureMonth++;
        infltext.push(ShowIndexInflation(str).month);
    }

    return infltext;
}

function inflArrayv(difference, futureMonth, futureYear) {

    let indexes = [];

    for (let i = 0; i <= difference; i++) {
        if (futureMonth == 13) {
            futureYear++;
            futureMonth = 1;
        }
        let str = ('0' + futureMonth + '-' + futureYear);

        if (futureMonth >= 10) {
            str = (futureMonth + '-' + futureYear);
        }
        // console.log('str: ' + str);
        // console.log()
        indexes.push((ShowIndexInflation(str).index));

        futureMonth++;

    }

    return indexes;
}

function addInput() {

    var newdiv = document.createElement('div');
    newdiv.innerHTML = " <input  class=\"main-input input-border col-lg-3\" id=\"col-doc" + currDate + "\" type=\"text\"  placeholder=\"Документ\"\n" +
        "                           data-toggle=\"tooltip\" data-placement=\"top\" data-html=\"true\" title=\"\"\n" +
        "                           data-original-title=\"Назва та реквізити первинного документу у довільній формі\">\n" +
        "                    <input class=\"main-input input-border col-lg-3\" id=\"col-date" + currDate + "\" type=\"text\"\n" +
        "                           placeholder=\"Дата (ДД.ММ.РРРР)\" data-toggle=\"tooltip\" data-placement=\"top\" data-html=\"true\"\n" +
        "                           title=\"\"\n" +
        "                           data-original-title=\"Дата <b>початку прострочення</b>, або дата фатичної оплати. В форматі: <b>ДД.ММ.РРРР</b>.<br><p class='text-warning'><b>УВАГА!!!</b> Дата початку прострочення не завжди співпадає з датою документа</p>\">\n" +
        "                    <input class=\"main-input input-border col-lg-3\" id=\"col-kt" + currDate + "\" type=\"text\"\n" +
        "                           placeholder=\"До cплати (грн.)\" data-toggle=\"tooltip\" data-placement=\"top\" data-html=\"true\"\n" +
        "                           title=\"\" data-original-title=\"Сума збільшення зобов'язання\">\n" +
        "                    <input class=\"main-input input-border col-lg-3\" id=\"col-dt" + currDate + "\" value='0' type=\"number\" placeholder=\"Сплата (грн.)\"\n" +
        "                           data-toggle=\"tooltip\" data-placement=\"top\" data-html=\"true\" title=\"\"\n" +
        "                           data-original-title=\"Сума зменшення зобов'язання\"> <br>";
    document.getElementById('row').appendChild(newdiv);
    // //////console.log(document.querySelectorAll("[id^=col-date]"));
    currDate++;
}

var counterM = 0;
var table = {};


function parsingAllLines() {
    for (let i = 0; i < currDate; i++) {
        let str = document.getElementById('col-date' + String(i)).value
        str = str.split('.');
        let date = new Date(str[2], str[1], str[0]);
        let kredit = document.getElementById('col-kt' + String(i)).value;
        let debit = document.getElementById('col-dt' + String(i)).value;
        let doc = document.getElementById('col-doc' + String(i)).value;
        table[date] = [doc, kredit, debit];

    }
}

// function uniquef(arr, arr2) {
//     // const sortArr = arr.filter((it, index) => index === arr.indexOf(it = it.trim()));
//     return arr;
// }

function calculate() {
    let totaltotal = 0.0;
    var doc = new jsPDF();
    let inflTerm = document.getElementById('infl-term').value;
    let date4 = new Date(document.getElementById("startDate").value);
    let date3 = new Date(document.getElementById("finishDate").value);
    let term = document.getElementById("term").value;
    let percent = document.getElementById("percent").value / 100;
    let deadline = document.getElementById("deadline").value;
    let deadlineStop = document.getElementById("deadline-stop").value;
    let totalpenya = 0.0;
    let penyaSumm = 0.0;
    let daysLag = 0;
    var indexes = [];
    let penyatext = [];
    let totals = [];
    let docs = [];
    let threePer = 0.0;
    let inflTermD = 0;
    parsingAllLines();
    let differenceMonth = 0;
    let totalIndex = 0;
    let stop = deadlineStop / 2 * 61;
    let unique = [];
    const keys = Object.keys(table);
    if (deadlineCheck(date3, term, date4)) {
        alert('На жаль, срок позовної давності за зобов’язанням сплинув')
    }
    for (let i = 0; i < keys.length; i++) {
        let currArray = table[keys[i]];
        let nextArray = table[keys[i + 1]];
        let colKt = currArray[1];
        let colDt = currArray[2];
        let daysForCalculate = 0;
        var infltext = [];
        docs.push(currArray[0]);
        let date1 = new Date(keys[i]);

        let date2 = new Date(document.getElementById("finishDate").value);
        let inflDate = new Date();
        let futureMonth = date1.getMonth() + 1;
        let futureYear = date1.getFullYear();
        let futureDay = date1.getDay();
        if (i + 1 < keys.length) {
            date2 = new Date(keys[i + 1]);
        }
        // console.log('date1: ' + date1);
        // console.log('date2: ' + date2);
        if (i > 0) {
            colKt = 0;
            for (let v = keys.length; v > 0; v--) {
                let fcurrarr = table[keys[v - 1]];
                colKt += parseInt(fcurrarr[1]);
                colKt = colKt - parseInt(fcurrarr[2]);
            }
        }
        // console.log('colKt: ' + colKt);
        inflDate = findInflTerm(date1, date2, inflTerm);
        // console.log('infldate: ' + inflDate);
        differenceMonth = findDifferenceM(inflDate, date2); //сли что-то не так findDifferenceM(inflDate, date2);
        // console.log(differenceMonth);
        indexes = inflArrayv(differenceMonth, futureMonth, futureYear);
        infltext = inflArrayt(differenceMonth, futureMonth, futureYear);
        totalIndex = findTotalIndex(indexes);
        daysLag = findDaysLag(date2, date1);
        daysForCalculate = findDaysForCalculate(daysLag, stop);
        penyaSumm = findPenalty(daysForCalculate, futureYear, futureMonth, futureDay);
        penyatext = findPenaltyt(daysForCalculate, futureYear, futureMonth, futureDay);
        penyatext = getUnique(penyatext);
        totalpenya = penyaCalc(penyaSumm, daysForCalculate, colKt);
        threePer = findThreePer(colKt, percent, date2, inflDate);
        penyaV = getUnique(penyaV);
        var currTotal = totalCalculate(totalpenya, threePer, totalIndex, colKt);

        let penyadeadline = 0;
        penyadeadline = penyaDeadLinecalc(date1, deadline);

    }
    let total = 0.0;
    for (let i = 0; i < totals.length; i++) {
        total += parseFloat(totals[i]);
        // console.log('total: ' + total);
    }
    if (deadlineCheck(date3, term, date4)) {
        total = "srok davnosti splinuv";
    }
    drawPdf(infltext, indexes, doc, table, penyatext, date3, percent, currTotal, totalIndex, date3);

    counterM++;
}

