document.addEventListener('DOMContentLoaded', function () {
    `use strict`;

    let tab = document.querySelectorAll('.bplaw_calculator__info-header-tab'),
        info = document.querySelector('.bplaw_calculator__info-header'),
        tabContent = document.querySelectorAll('.bplaw_calculator__info-tabcontent');

    //ES6

    let hideTabContent = (a) => {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('bplaw_calculator__show');
            tabContent[i].classList.add('bplaw_calculator__hide');
            tab[i].classList.remove('bplaw_calculator__avtive');
        }
    }

    hideTabContent(1);

    let ShowTabContent = (b) => {
        if (tabContent[b].classList.contains('bplaw_calculator__hide')) {
            tabContent[b].classList.add('bplaw_calculator__show');
            tabContent[b].classList.remove('bplaw_calculator__hide');
            tab[b].classList.add('bplaw_calculator__avtive');
        }
    }
    if (info) {
        info.addEventListener('click', function (event) {
            let target = event.target;

            if (target && target.classList.contains('bplaw_calculator__info-header-tab')) {
                for (let i = 0; i < tab.length; i++) {
                    if (target == tab[i]) {
                        hideTabContent(0);
                        ShowTabContent(i);
                        break;
                    }
                }
            }
        })
    }

    //logic ease calculator
    let debt = document.querySelector('#debt'),
        dateStart = document.querySelector('#data-start'),
        dataFinish = document.querySelector('#data-finish'),
        debtAns = document.querySelector('#debtAns'),
        ansDebt = document.querySelector('.bplaw_calculator__calculated-answer-debt-span'),
        ansInflation = document.querySelector('.bplaw_calculator__calculated-answer-inflation-span'),
        ansPercent = document.querySelector('.bplaw_calculator__calculated-answer-percent-span'),
        ansFine = document.querySelector('.bplaw_calculator__calculated-answer-fine-span'),
        buttonCalculation = document.querySelector('.bplaw_calculator__button-calculation');


    if (buttonCalculation) {
        buttonCalculation.addEventListener('click', function () {
            if ((debt.value != null && debt.value != undefined && debt.value != '') &&
                (dateStart.value != null && dateStart.value != undefined && dateStart.value != '') &&
                (dataFinish.value != null && dataFinish.value != undefined && dataFinish.value != '')) {


                // debt withdrawal
                //сумма долга  debt.value
                ansDebt.innerHTML = debt.value


                // interest debt
                let //date1 = new Date(dateStart.value),
                    //date2 = new Date(dataFinish.value),
                    date1 = toDate('#data-start'),
                    date2 = toDate('#data-finish'),
                    //получаем разницу колва дней между датами
                    daysLag = Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
                console.log(date1);
                window.daysForPDF = daysLag;
                //       console.log('Разница дней: ' + daysLag);
                let answerForPercent = (debt.value * 3 / 100 / 365 * daysLag).toFixed(2);
                window.ansPercent = answerForPercent;
                ansPercent.innerHTML = (debt.value * 3 / 100 / 365 * daysLag).toFixed(2);


                // Inflation
                //начальный и конечный месяц
                let currentDate = moment(date1),
                    futureMonth = currentDate,
                    averageInflation = '1',
                    aInflation = [],
                    bInflation

                window.TextInflationPDFMonth = '';
                window.TextInflationPDFPercent = '';

                //получаем разницу колва месяцев между датами

                let differenceMonth = date2.getMonth() - date1.getMonth() + (12 * (date2.getFullYear() - date1.getFullYear()));

                for (let i = 0; i <= differenceMonth; i++) {

                    futureMonth = moment(currentDate).add(i, 'M');
                    let DateMonthYear = futureMonth.format('MM-YYYY');

                    averageInflation = (Number(averageInflation) * (Number(ShowIndexInflation(DateMonthYear).index / 100))).toFixed(5);

                    //console.log(averageInflation);
                    //генерируем текст для пдф
                    aInflation[i] = ShowIndexInflation(DateMonthYear);

                    if (aInflation[i].month != bInflation) {
                        bInflation = aInflation[i].month;

                        window.TextInflationPDFMonth += aInflation[i].month + '\n';
                        window.TextInflationPDFPercent += aInflation[i].index + '%\n'
                    }
                }
                //средний процент инфляции
                let averageInflationSum = (averageInflation * 100),
                    answerInflation = (debt.value * averageInflationSum / 100 - debt.value).toFixed(2);

                //console.log(averageInflationSum);

                window.averageInflationPDF = averageInflationSum;
                window.answerInflationPDF = answerInflation;
                ansInflation.innerHTML = (debt.value * averageInflationSum / 100 - debt.value).toFixed(2);


                //penya
                let firstDate = moment(date1),
                    nextDate = firstDate,
                    summPenya = 0,
                    aPenya = [],
                    bPenya = '';

                window.TextPenyaPDFPercent = '';
                window.TextPenyaPDFData = '';

                let daysForCalc;

                if (daysLag >= 182) {
                    daysForCalc = 182;
                } else {
                    daysForCalc = daysLag;
                }
                window.daysForPDFPenya = daysForCalc;
                for (let i = daysForCalc; i >= 0; i--) {

                    nextDate = moment(currentDate).add(i, 'days');

                    let needPenyaDate = new Date(nextDate.format('YYYY,MM,DD'));
                    // console.log('Нужная дата для уточнения пени: ' + needPenyaDate.getTime());

                    //средння пеня
                    summPenya += ShowPenyPercent(needPenyaDate).percent;

                    //генерируем текст для пдф
                    aPenya[i] = ShowPenyPercent(needPenyaDate);

                    if (aPenya[i].data != bPenya) {
                        bPenya = aPenya[i].data;

                        window.TextPenyaPDFPercent += aPenya[i].percent + '%\n';
                        window.TextPenyaPDFData += aPenya[i].data + '\n';
                    }

                }
                let commonPenya = (Number(summPenya) / Number(daysForCalc + 2)).toFixed(2),
                    ansFineSumm = ((Number(debt.value) * Number(commonPenya) * 2 / 100 / 365 * Number(daysForCalc))).toFixed(2);

                window.ansPenyaSumPDF = commonPenya;
                window.ansPenyaEndSumPDF = ansFineSumm;

                ansFine.innerHTML = ((Number(debt.value) * Number(commonPenya) * 2 / 100 / 365 * Number(daysForCalc))).toFixed(2);


                // all debt
                debtAns.innerHTML = (Number(debt.value) + Number(answerForPercent) + Number(answerInflation) + Number(ansFineSumm)).toFixed(2);
                window.SummAll = (Number(debt.value) + Number(answerForPercent) + Number(answerInflation) + Number(ansFineSumm)).toFixed(2);
            }
        })
    }


    //Детальная информация
    let buttonMore = document.querySelector('.bplaw_calculator__button-more');

    if (buttonMore) {
        buttonMore.addEventListener('click', function () {

            let blockMoreInformation = document.querySelector('#more-information'),
                debt = document.querySelector('#debt'),

                dataInTextStart = toDate('#data-start'),
                DDStart = dataInTextStart.getDate(),
                MMStart = Number(dataInTextStart.getMonth()),

                dataInTextLast = toDate('#data-finish'),
                DDLast = dataInTextLast.getDate(),
                MMLast = Number(dataInTextLast.getMonth()),

                docInfo = {},
                IndexINFL = window.TextInflationPDFMonth,
                IndexINFLPercent = window.TextInflationPDFPercent,
                CountDayPDF = window.daysForPDF,
                CountDayPDFPenya = window.daysForPDFPenya,
                AvarageInflation = window.averageInflationPDF,
                ansInflationPDF = window.answerInflationPDF,
                PenyaPercentPDF = window.TextPenyaPDFPercent,
                PenyaDataPDF = window.TextPenyaPDFData,
                AnsPenyaPDF = window.ansPenyaSumPDF,
                AnsPenyaEndPdf = window.ansPenyaEndSumPDF,
                AnsPercent = window.ansPercent,
                AnsSumm = window.SummAll,

                //Конечная дата долга
                //DDLast + '.' + month_names[MMLast] + '.' + dataInTextLast.getFullYear()
                //получаем сегодняшную дату
                today = new Date(),
                dd = String(today.getDate()).padStart(2, '0'),
                mm = String(today.getMonth() + 1).padStart(2, '0'), //January is 0!
                yyyy = today.getFullYear();

            today = dd + '.' + mm + '.' + yyyy;

            const month_names = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

            if (DDLast <= 9) {
                DDLast = '0' + DDLast;
            }
            if (DDStart <= 9) {
                DDStart = '0' + DDStart;
            }

            let DataStartForPDF = DDStart + '.' + month_names[MMStart] + '.' + dataInTextStart.getFullYear(),
                DataLastForPDF = DDLast + '.' + month_names[MMLast] + '.' + dataInTextLast.getFullYear();


            //формирование пдф
            docInfo = {

                info: {
                    title: 'Расчет пени, инфляции и процентов',
                    author: 'http://bplaw.com.ua',
                    subject: 'bplaw.com.ua',
                    keywords: 'bplaw.com.ua'
                },

                pageSize: 'A4',
                pageOrientation: 'portrait', //'portrait'
                pageMargins: [50, 50, 30, 60],

                footer: function (pageCount) {
                    if (pageCount == 1) {
                        return [{
                            text: 'Відповідно до статті 625 Цивільного кодексу України боржник, який прострочив виконання грошового зобов\'язання, на вимогу кредитора, зобов\'язаний сплатити три проценти річних від простроченої суми, якщо інший розмір процентів не встановлений договором або законом.',
                            margin: [50, 0, 0, 10],
                            fontSize: 9,
                            color: '#444',
                        }, {
                            text: 'Розраховано за допомогою юридичного калькулятору АО «Борисенко і партнери»',
                            link: 'https://bplaw.com.ua',
                            margin: [50, 0, 0, 0],
                            fontSize: 8,
                            color: '#444'
                        }]
                    } else if (pageCount == 2) {
                        return [{
                            text: 'Відповідно до частини 6 статті 232 Господарського кодексу України, нарахування штрафних санкцій за прострочення виконання зобов\'язання, якщо інше не встановлено законом або договором, припиняється через шість місяців від дня, коли зобов\'язання мало бути виконано.',
                            margin: [50, 0, 0, 10],
                            fontSize: 9,
                            color: '#444',
                        },
                            {
                                text: 'Розраховано за допомогою юридичного калькулятору АО «Борисенко і партнери»',
                                link: 'https://bplaw.com.ua',
                                margin: [50, 0, 0, 0],
                                fontSize: 8,
                                color: '#444'
                            }
                        ]
                    } else {
                        return [{
                            text: 'Розраховано за допомогою юридичного калькулятору АО «Борисенко і партнери»',
                            link: 'https://bplaw.com.ua',
                            margin: [50, 30, 0, 0],
                            fontSize: 10
                        }]
                    }
                },

                content: (
                    [{
                        text: 'Додаток № ___\n до позовної заяви від ' + today + ' року',
                        margin: [5, 5, 5, 10],
                        fontSize: 10,
                        alignment: 'right'
                    },
                        {
                            text: 'Розрахунок ціни позову\n\n',
                            fontSize: 16,
                            bold: true
                        },
                        {
                            text: 'Відомості про взаєморозрахунки\n',
                            fontSize: 12,
                            margin: [0, 0, 0, 10]
                        },
                        {
                            table: {
                                widths: ['auto', 90, 90, 90, 90],
                                body: [
                                    [{
                                        text: 'Зміст операції',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Дата',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Дебет',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Кредит',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Сальдо',
                                        bold: true,
                                        fillColor: 'orange'
                                    }],
                                    ['', {
                                        text: DataStartForPDF,
                                        alignment: 'center'
                                    }, {
                                        text: debt.value,
                                        alignment: 'center'
                                    }, ' ', ' '],
                                    [{
                                        text: 'Всього',
                                        bold: true,
                                        fillColor: 'silver'
                                    },
                                        {
                                            text: '',
                                            bold: true,
                                            fillColor: 'silver'
                                        }, {
                                        text: debt.value,
                                        bold: true,
                                        fillColor: 'silver',
                                        alignment: 'center'
                                    },
                                        {
                                            text: '',
                                            bold: true,
                                            fillColor: 'silver'
                                        },
                                        {
                                            text: debt.value,
                                            bold: true,
                                            fillColor: 'silver',
                                            alignment: 'center'
                                        }
                                    ]
                                ],
                                headerRows: 1
                            }
                        },
                        {
                            text: 'Основна сума заборгованості станом на  ' + DataLastForPDF + ' року становить ' + debt.value + ' грн.',
                            fontSize: 10,
                            bold: true,
                            italics: true,
                            margin: [0, 10, 10, 10]
                        },
                        {
                            style: 'tableExample',
                            table: {
                                widths: [250, 250],
                                body: [
                                    [{
                                        text: 'Дата початку прострочення зобов’язання:',
                                        fontSize: 11
                                    }, {
                                        text: DataStartForPDF,
                                        fontSize: 11
                                    }],
                                    [{
                                        text: 'Дата закінчення розрахунку:',
                                        fontSize: 11
                                    }, {
                                        text: DataLastForPDF,
                                        fontSize: 11
                                    }],
                                    [{
                                        text: 'Позовна давність:',
                                        fontSize: 11
                                    }, {
                                        text: 'застосована загальна позовна давність  у три роки, передбачена статтею 257 Цивільного кодексу України.',
                                        fontSize: 11
                                    }]
                                ],
                            },
                            layout: 'noBorders'
                        },
                        '\n',
                        {
                            text: 'Інфляційні втрати на прострочену заборгованість',
                            bold: true,
                            margin: [0, 20, 0, 10]
                        },
                        {
                            text: 'Інфляційні втрати розраховуються за такою формулою:\n',
                        },
                        {
                            text: '[Інфляційні нарахування] = [Сума боргу] × [Індекс інфляції] / 100% - [Сума боргу]',
                            bold: true,
                            margin: [0, 0, 0, 10]
                        },
                        {
                            table: {
                                widths: ['auto', 90, 90, 90, 90],
                                body: [
                                    [{
                                        text: 'Місяці прострочення',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Індекс інфляції',
                                        bold: true,
                                        fillColor: 'orange'
                                    },
                                        {
                                            text: 'Підсумковий індекс інфляції',
                                            bold: true,
                                            fillColor: 'orange'
                                        },
                                        {
                                            text: 'Сума основної заборгованості',
                                            bold: true,
                                            fillColor: 'orange'
                                        },
                                        {
                                            text: 'Інфляційні нарахування',
                                            bold: true,
                                            fillColor: 'orange'
                                        }
                                    ],
                                    [{
                                        text: IndexINFL
                                    }, {
                                        text: IndexINFLPercent,
                                        alignment: 'center'
                                    },
                                        {
                                            text: AvarageInflation.toFixed(2),
                                            alignment: 'center'
                                        },
                                        {
                                            text: debt.value,
                                            alignment: 'center'
                                        },
                                        {
                                            text: ansInflationPDF,
                                            alignment: 'center'
                                        }
                                    ]
                                ],
                            }
                        },
                        {
                            text: 'Інфляційні нарахування на суму простроченої заборгованості за період з ' + DataStartForPDF + ' по ' + DataLastForPDF + '  становлять ' + ansInflationPDF + ' гривень\n\n',
                            fontSize: 10,
                            bold: true,
                            italics: true,
                            margin: [0, 10, 10, 10]
                        },
                        {
                            text: 'Проценти річних від простроченої суми',
                            bolt: true
                        },
                        {
                            text: 'Процентна ставка за користування чужими коштами: 	3% річні',
                            fontSize: 11,
                            margin: [5, 10, 0, 0]
                        },
                        //           {
                        //             text: 'Відповідно до статті 625 Цивільного кодексу України боржник, який прострочив виконання грошового зобов\'язання, на вимогу кредитора, зобов\'язаний сплатити три проценти річних від простроченої суми, якщо інший розмір процентів не встановлений договором або законом.',
                        //             margin: [5, 10, 0, 0],
                        //             fontSize: 10,
                        //             color: '#444',
                        //           },
                        {
                            text: 'Підсумковий індекс інфляції розраховано відповідно до рекомендацій листа Верховного Суду України від 03.04.1997 №62-97 р., Постанови Пленуму Вищого господарського суду України № 14 від 17.12.2013 року. ',
                            margin: [5, 15, 0, 20],
                            fontSize: 10,
                            color: '#444',
                        },
                        {
                            text: 'Проценти річні від простроченої суми розраховуються за такою формулою:',
                            fontSize: 11
                        },
                        {
                            text: '[Проценти] = [Сума боргу] × [Процентна ставка] / 100% / 365 днів × [Кількість днів]',
                            fontSize: 11,
                            bold: true,
                            margin: [5, 5, 0, 20],
                        },
                        {
                            table: {
                                //           widths: [90,90,90,90,90,90,90],
                                fontSize: 12,
                                body: [
                                    [{
                                        text: 'Дата початку розрахунку:',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Дата закінчення розрахунку:',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Кількість днів між датами',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Процентна ставка',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Сума заборгованості',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Проценти річних',
                                        bold: true,
                                        fillColor: 'orange'
                                    }],
                                    [{
                                        text: DataStartForPDF,
                                        alignment: 'center'
                                    }, {
                                        text: DataLastForPDF,
                                        alignment: 'center'
                                    }, {
                                        text: CountDayPDF,
                                        alignment: 'center'
                                    }, {
                                        text: '3%',
                                        alignment: 'center'
                                    }, {
                                        text: debt.value,
                                        alignment: 'center'
                                    }, {
                                        text: AnsPercent,
                                        alignment: 'center'
                                    }],
                                    [{
                                        text: 'Всього',
                                        fillColor: 'silver'
                                    }, {
                                        text: '',
                                        fillColor: 'silver'
                                    }, {
                                        text: '',
                                        fillColor: 'silver'
                                    }, {
                                        text: '',
                                        fillColor: 'silver'
                                    }, {
                                        text: '',
                                        fillColor: 'silver'
                                    }, {
                                        text: AnsPercent,
                                        fillColor: 'silver',
                                        bold: true,
                                        alignment: 'center'
                                    }]
                                ],
                            }
                        },
                        {
                            text: 'Всього процентів річних  від простроченої суми за період з ' + DataStartForPDF + ' по ' + DataLastForPDF + ' - ' + AnsPercent + ' гривень',
                            fontSize: 10,
                            bold: true,
                            italics: true,
                            margin: [0, 10, 10, 10]
                        },
                        {
                            text: 'Пеня за порушення грошового зобов’язання.',
                            margin: [0, 20, 0, 10],
                            bold: true
                        },
                        {
                            style: 'tableExample',
                            table: {
                                widths: [250, 250],
                                body: [
                                    [{
                                        text: 'Процентна ставка пені: ',
                                        fontSize: 11
                                    }, {
                                        text: 'подвійна облікова ставка НБУ',
                                        fontSize: 11
                                    }],
                                    [{
                                        text: 'Строк в межах якого нараховується пеня:',
                                        fontSize: 11
                                    }, {
                                        text: '6 місяців ',
                                        fontSize: 11
                                    }]
                                ],
                            },
                            layout: 'noBorders'
                        },
                        {
                            text: 'Пеня за порушення грошового зобов’язання розраховуються за такою формулою:',
                            margin: [0, 20, 0, 0]
                        },
                        {
                            text: '[Пеня] = [Сума боргу] × [Ставка пені (%)] / 100% / 365 днів × [Кількість днів] ',
                            margin: [0, 0, 0, 20]
                        },
                        {
                            table: {
                                //           widths: [90,90,90,90,90,90,90],
                                fontSize: 12,
                                body: [
                                    [{
                                        text: 'Початкова дата розрахунку:',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Кінцева дата розрахунку:',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Кількість днів:',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Сума заборгованості',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Облікова ставка НБУ',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Розрахункова ставка',
                                        bold: true,
                                        fillColor: 'orange'
                                    }, {
                                        text: 'Пеня',
                                        bold: true,
                                        fillColor: 'orange'
                                    }],
                                    [{
                                        text: DataStartForPDF,
                                        alignment: 'center'
                                    }, {
                                        text: DataLastForPDF,
                                        alignment: 'center'
                                    }, {
                                        text: CountDayPDFPenya,
                                        alignment: 'center'
                                    }, {
                                        text: debt.value,
                                        alignment: 'center'
                                    }, {
                                        text: AnsPenyaPDF,
                                        alignment: 'center'
                                    }, {
                                        text: AnsPenyaPDF * 2,
                                        alignment: 'center'
                                    }, {
                                        text: AnsPenyaEndPdf,
                                        alignment: 'center'
                                    }],
                                    [{
                                        text: 'Всього',
                                        fillColor: 'silver',
                                        bold: true
                                    }, {
                                        text: '',
                                        fillColor: 'silver'
                                    }, {
                                        text: CountDayPDFPenya,
                                        fillColor: 'silver',
                                        bold: true,
                                        alignment: 'center'
                                    }, {
                                        text: '',
                                        fillColor: 'silver'
                                    }, {
                                        text: '',
                                        fillColor: 'silver'
                                    }, {
                                        text: '',
                                        fillColor: 'silver'
                                    }, {
                                        text: AnsPenyaEndPdf,
                                        fillColor: 'silver',
                                        bold: true,
                                        alignment: 'center'
                                    }]
                                ],
                            }
                        },
                        {
                            text: 'Пеня за порушення грошового зобов’язання за період з ' + DataStartForPDF + ' по ' + DataLastForPDF + ' становить 176,71 гривень.',
                            fontSize: 10,
                            bold: true,
                            italics: true,
                            margin: [0, 10, 10, 10]
                        },
                        {
                            text: 'Підсумковий розрахунок ціни позову:',
                            bold: true,
                            margin: [0, 0, 0, 5],
                            alignment: 'center'
                        },
                        {
                            style: 'tableExample',
                            table: {
                                widths: [300, 200],
                                body: [
                                    [{
                                        text: 'Основна сума заборгованості:',
                                        fontSize: 12
                                    }, {
                                        text: debt.value,
                                        fontSize: 12
                                    }],
                                    [{
                                        text: 'Інфляційні нарахування на суму простроченої заборгованості:',
                                        fontSize: 12
                                    }, {
                                        text: ansInflationPDF,
                                        fontSize: 12
                                    }],
                                    [{
                                        text: 'Проценти річні:',
                                        fontSize: 12
                                    }, {
                                        text: AnsPercent,
                                        fontSize: 12
                                    }],
                                    [{
                                        text: 'Пеня за порушення грошового зобов’язання:',
                                        fontSize: 12
                                    }, {
                                        text: AnsPenyaEndPdf,
                                        fontSize: 12
                                    }],
                                    [{
                                        text: 'Загальна сума позовних вимог:',
                                        fontSize: 16,
                                        bold: true
                                    }, {
                                        text: AnsSumm,
                                        fontSize: 16,
                                        bold: true
                                    }]
                                ],
                            },
                            layout: 'noBorders'
                        },
                    ])
            };
            pdfMake.fonts = {
                Roboto: {
                    normal: 'TimesNewRomanCyr.ttf',
                    bold: 'Times New Roman Cyr Bold.ttf',
                    italics: 'Times New Roman Cyr Italic.ttf',
                    bolditalics: 'TimesNewRomanCyrBoldItalic.ttf'
                }
            };

            pdfMake.createPdf(docInfo).download('rozrakhunok.pdf');
        });
    }

});


function toDate(selector) {
    let from = document.querySelector(selector).value;
    from = from.split(".")
    return new Date(from[2], from[1] - 1, from[0])

}