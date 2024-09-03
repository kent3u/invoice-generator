const pdfMake = require('pdfmake/build/pdfmake.min');
const pdfFonts = require('pdfmake/build/vfs_fonts')
const dayjs = require('dayjs')
require('dayjs/locale/et')
pdfMake.vfs = pdfFonts.pdfMake.vfs;
dayjs.locale('et')

function toggleNavActive() {
    let navLinks = [...document.getElementsByClassName('nav-link')];
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.toggle('active');
    }
}

function invoiceActive() {
    return document.getElementById('invoiceLink').classList.contains('active');
}

function translate() {
    document.getElementById('header').innerHTML = invoiceActive() ? 'Invoice template' : 'Price quote template';
    document.getElementById('arveSaajaLabel').innerHTML = invoiceActive() ? 'Arve saaja' : 'Adressaat';
    document.getElementById('arveNumberLabel').innerHTML = invoiceActive() ? 'Arve number' : 'Pakkumise number'
    document.getElementById('arveKuupaevLabel').innerHTML = invoiceActive() ? 'Arve kuupäev' : 'Pakkumise kuupäev';
    document.getElementById('maksetahtaegLabel').innerHTML = invoiceActive() ? 'Maksetähtaeg' : 'Kehtivuse kuupäev';
    document.getElementById('tasudaLabel').innerHTML = invoiceActive() ? 'Tasuda' : 'Hinnapakkumine kokku';
    document.getElementById('arveSummaLabel').innerHTML = invoiceActive() ? 'Arve summa' : 'Summa';
}

function getNewRow(newIndex) {
    let row = document.createElement('tr');
    row.setAttribute('data-index', newIndex)
    row.innerHTML = `
            <td>
                <input type="text" id='toodeTeenus${newIndex}' class="form-control">
            </td>
            <td>
                <input type="text" id='yhikuHind${newIndex}' class="form-control">
            </td>
            <td>
                <input type="text" id='kogus${newIndex}' class="form-control">
            </td>
            <td>
                <input type="text" id='kmPercentage${newIndex}' class="form-control">
            </td>
            <td>
                <input type="text" id='kokku${newIndex}' class="form-control">
            </td>
            <td>
                <input type="button" class="btn btn-outline-danger deleteRowButton" id='deleteRow${newIndex}' data-index='${newIndex}' value="Delete">
            </td>
    `
    return row;
}

function toggleRowDeleteDisabled(element) {
    element.classList.toggle('disabled')
}

let tableBody = () => document.getElementById('invoiceTable').getElementsByTagName('tbody')[0];

document.getElementById('addRow').addEventListener('click', () => {
    const lastIndex = parseInt(tableBody().rows[tableBody().rows.length - 1].getAttribute('data-index'));
    tableBody().appendChild(getNewRow(lastIndex+1));
    toggleRowDeleteDisabled(document.getElementById(`deleteRow${lastIndex}`));
})

document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains("deleteRowButton") && !e.target.classList.contains("disabled")) {
        let targetRowIndex = parseInt(e.target.getAttribute('data-index'));
        toggleRowDeleteDisabled(document.getElementById(`deleteRow${targetRowIndex-1}`))
        tableBody().rows[targetRowIndex].remove()
    }
})

function initFields() {
    document.getElementById('arveKuupaev').value = dayjs().format('DD.MM.YYYY');
    document.getElementById('maksetahtaeg'). value = dayjs().add(2, 'week').format('DD.MM.YYYY');
}

function getPdfTableRows() {
    let combinedFieldData = [];
    for (let row of document.getElementById('invoiceTable').rows) {
        if (!row.hasAttribute('data-index')) {
            continue;
        }
        let singleRowCellData = [];
        for (let i = 0; i < row.cells.length - 1; i++) {
            singleRowCellData.push(row.cells[i].children[0].value || '');
        }
        combinedFieldData.push(singleRowCellData);
    }
    return combinedFieldData;
}

let dd = {
    content: [
        {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 40"><defs><style>.cls-1{fill:#071827;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M2.22,2.8,0,5l5,5,8-8h0C9.81-1.14,5.41-.38,2.22,2.8Z"/><path class="cls-1" d="M11.11,16l9.5-9.49,2.86-2.87a10.38,10.38,0,0,1,14.69,0h0L28,13.84l-2.1,2.1A10.45,10.45,0,0,1,11.11,16Z"/><rect class="cls-1" x="6.47" y="5.57" width="11.3" height="6.76" transform="translate(-2.78 11.19) rotate(-45)"/><path class="cls-1" d="M54.05,15.6V6.66a2.94,2.94,0,0,0-.2-1.21c-.14-.31-.46-.46-1-.46h-.28V4.61h7.16a1.62,1.62,0,0,1,.88.19,1,1,0,0,1,.42.5,1.73,1.73,0,0,1,.12.64v1.3H60.8a1.85,1.85,0,0,0-.54-1.48,2.29,2.29,0,0,0-1.54-.47h-3v4.3h4.45v.68H55.74v4.65h2.9a3.15,3.15,0,0,0,1.72-.42,2.69,2.69,0,0,0,1-1.43l.37.1-.55,1.52a1.5,1.5,0,0,1-.45.66,1.27,1.27,0,0,1-.85.25Z"/><path class="cls-1" d="M66,15.77a6.28,6.28,0,0,1-1.65-.18,2.17,2.17,0,0,1-1-.49,1.25,1.25,0,0,1-.35-.75,8.09,8.09,0,0,1,0-1.06h.4a2.11,2.11,0,0,0,.68,1.3,2.32,2.32,0,0,0,1.6.5,2.17,2.17,0,0,0,1.37-.34,1,1,0,0,0,.41-.83,1,1,0,0,0-.38-.82A4.2,4.2,0,0,0,66,12.47l-1-.42a4.41,4.41,0,0,1-1.49-.91A1.83,1.83,0,0,1,63,9.79a1.87,1.87,0,0,1,.81-1.63,3.58,3.58,0,0,1,2-.55,6,6,0,0,1,1.6.17,2.17,2.17,0,0,1,1,.49,1.28,1.28,0,0,1,.37.75,10.53,10.53,0,0,1,0,1.07h-.4a2.15,2.15,0,0,0-.69-1.31,2.22,2.22,0,0,0-1.55-.49,1.87,1.87,0,0,0-1.2.33,1.06,1.06,0,0,0-.4.83,1,1,0,0,0,.35.77,3.18,3.18,0,0,0,.94.6l1,.42a5.6,5.6,0,0,1,1.65,1,1.79,1.79,0,0,1,.56,1.39,1.82,1.82,0,0,1-.86,1.62A4,4,0,0,1,66,15.77Z"/><path class="cls-1" d="M73.33,15.77a2.17,2.17,0,0,1-1.53-.54,2.21,2.21,0,0,1-.58-1.69V8.46H70.1V7.77h1.12V6.27l.83-1h.85v2.5h1.95v.69H72.9v5.09a2,2,0,0,0,.27,1.17,1,1,0,0,0,.81.37,2,2,0,0,0,.73-.12,4.56,4.56,0,0,0,.54-.25l.18.37a3.73,3.73,0,0,1-.77.45A3.18,3.18,0,0,1,73.33,15.77Z"/><path class="cls-1" d="M84.76,15.77,80.9,6.56a4.52,4.52,0,0,0-.77-1.31,1.58,1.58,0,0,0-1-.44V4.47h.28l.32,0a4.18,4.18,0,0,1,1,.13,2.66,2.66,0,0,1,1.07.59,3.58,3.58,0,0,1,.92,1.4l2.8,6.58,3.63-8.53h.8L85.16,15.77Z"/><path class="cls-1" d="M91.68,15.6V9.82a3,3,0,0,0-.21-1.21,1,1,0,0,0-1-.46h-.28V7.77h1.61a2,2,0,0,1,.91.17.93.93,0,0,1,.46.61,4.61,4.61,0,0,1,.13,1.27V15.6Zm.75-8.79a.92.92,0,0,1-.74-.35,1.18,1.18,0,0,1-.28-.79.74.74,0,0,1,.22-.57.83.83,0,0,1,.58-.21.92.92,0,0,1,.73.33,1.19,1.19,0,0,1,.28.79.76.76,0,0,1-.22.58A.81.81,0,0,1,92.43,6.81Z"/><path class="cls-1" d="M95.86,15.6V9.82a3,3,0,0,0-.21-1.21,1,1,0,0,0-1-.46h-.28V7.77H96a2,2,0,0,1,.91.17.93.93,0,0,1,.46.61,4.61,4.61,0,0,1,.13,1.27V15.6Zm.75-8.79a.92.92,0,0,1-.74-.35,1.18,1.18,0,0,1-.28-.79.75.75,0,0,1,.23-.57.8.8,0,0,1,.57-.21.92.92,0,0,1,.73.33,1.2,1.2,0,0,1,.29.79.77.77,0,0,1-.23.58A.81.81,0,0,1,96.61,6.81Z"/><path class="cls-1" d="M100,15.6V9.82a3,3,0,0,0-.21-1.21,1,1,0,0,0-1-.46h-.28V7.77h1.53a2.16,2.16,0,0,1,.94.17.94.94,0,0,1,.48.48h.08a3.55,3.55,0,0,1,.86-.56,3,3,0,0,1,1.29-.25,3,3,0,0,1,.88.11,1.93,1.93,0,0,1,.71.37,1.79,1.79,0,0,1,.49.63,2.85,2.85,0,0,1,1.05-.81,3.38,3.38,0,0,1,1.42-.3,2.87,2.87,0,0,1,1.26.26,2,2,0,0,1,.89.92,4.1,4.1,0,0,1,.33,1.83v5h-1.68v-5a3.13,3.13,0,0,0-.36-1.75,1.14,1.14,0,0,0-1-.5,1.7,1.7,0,0,0-1,.31,2.33,2.33,0,0,0-.72.66,1.86,1.86,0,0,1,.11.58c0,.26,0,.49,0,.7v5h-1.66v-5a3.13,3.13,0,0,0-.36-1.75,1.16,1.16,0,0,0-1-.5,1.63,1.63,0,0,0-.85.24,3.13,3.13,0,0,0-.68.56V15.6Z"/><path class="cls-1" d="M113.3,15.6V9.82a3,3,0,0,0-.21-1.21,1,1,0,0,0-1-.46h-.28V7.77h1.62a2,2,0,0,1,.91.17,1,1,0,0,1,.45.61A4.54,4.54,0,0,1,115,9.82V15.6Zm.75-8.79a.9.9,0,0,1-.73-.35,1.18,1.18,0,0,1-.29-.79.75.75,0,0,1,.23-.57.8.8,0,0,1,.57-.21.94.94,0,0,1,.74.33,1.19,1.19,0,0,1,.28.79.76.76,0,0,1-.22.58A.83.83,0,0,1,114.05,6.81Z"/><path class="cls-1" d="M119.88,15.77a6.18,6.18,0,0,1-1.65-.18,2.17,2.17,0,0,1-1-.49,1.25,1.25,0,0,1-.35-.75,8.09,8.09,0,0,1,0-1.06h.4a2.11,2.11,0,0,0,.68,1.3,2.32,2.32,0,0,0,1.6.5,2.17,2.17,0,0,0,1.37-.34,1.06,1.06,0,0,0,0-1.65,4.2,4.2,0,0,0-1.12-.63l-1-.42a4.57,4.57,0,0,1-1.5-.91,1.83,1.83,0,0,1-.54-1.35,1.88,1.88,0,0,1,.82-1.63,3.56,3.56,0,0,1,2-.55,6,6,0,0,1,1.6.17,2.17,2.17,0,0,1,1,.49,1.21,1.21,0,0,1,.36.75,8.25,8.25,0,0,1,0,1.07h-.4a2.09,2.09,0,0,0-.68-1.31A2.22,2.22,0,0,0,120,8.29a1.87,1.87,0,0,0-1.2.33,1.06,1.06,0,0,0-.4.83,1.07,1.07,0,0,0,.34.77,3.38,3.38,0,0,0,1,.6l1,.42a5.6,5.6,0,0,1,1.65,1,1.82,1.82,0,0,1,.56,1.39,1.8,1.8,0,0,1-.87,1.62A3.94,3.94,0,0,1,119.88,15.77Z"/><path class="cls-1" d="M127.18,15.77a2.17,2.17,0,0,1-1.53-.54,2.21,2.21,0,0,1-.59-1.69V8.46H124V7.77h1.11V6.27l.84-1h.85v2.5h1.95v.69h-1.95v5.09a2,2,0,0,0,.27,1.17,1,1,0,0,0,.81.37,2,2,0,0,0,.73-.12,4.56,4.56,0,0,0,.54-.25l.18.37a4,4,0,0,1-.77.45A3.18,3.18,0,0,1,127.18,15.77Z"/><path class="cls-1" d="M130.51,15.6V6.66a2.92,2.92,0,0,0-.21-1.21c-.14-.31-.46-.46-1-.46h-.29V4.61h1.63a2.06,2.06,0,0,1,.91.16.94.94,0,0,1,.45.61,4.62,4.62,0,0,1,.14,1.28V15.6Z"/><path class="cls-1" d="M137.49,15.77a3.77,3.77,0,0,1-1.44-.27,2.14,2.14,0,0,1-1.06-.92,3.6,3.6,0,0,1-.4-1.83V9.82a3.15,3.15,0,0,0-.2-1.21,1,1,0,0,0-1-.46h-.17V7.77h1.52a2,2,0,0,1,.9.17.93.93,0,0,1,.46.61,4.54,4.54,0,0,1,.14,1.27v2.93a3.06,3.06,0,0,0,.24,1.34,1.53,1.53,0,0,0,.63.71A1.65,1.65,0,0,0,138,15a1.55,1.55,0,0,0,.65-.14,2.9,2.9,0,0,0,.55-.36,4.51,4.51,0,0,0,.44-.43V7.77h1.66V15.6h-1l-.59-.68h-.08a3.07,3.07,0,0,1-.86.58A2.86,2.86,0,0,1,137.49,15.77Z"/><path class="cls-1" d="M146.26,15.77a6.18,6.18,0,0,1-1.65-.18,2.15,2.15,0,0,1-1-.49,1.25,1.25,0,0,1-.35-.75,10.32,10.32,0,0,1,0-1.06h.4a2.16,2.16,0,0,0,.68,1.3,2.32,2.32,0,0,0,1.6.5,2.15,2.15,0,0,0,1.37-.34,1,1,0,0,0,0-1.65,4.12,4.12,0,0,0-1.11-.63l-1-.42a4.51,4.51,0,0,1-1.49-.91,1.83,1.83,0,0,1-.54-1.35A1.87,1.87,0,0,1,144,8.16a3.58,3.58,0,0,1,2-.55,6,6,0,0,1,1.6.17,2.17,2.17,0,0,1,1,.49A1.22,1.22,0,0,1,149,9a10.53,10.53,0,0,1,0,1.07h-.4A2.19,2.19,0,0,0,148,8.78a2.25,2.25,0,0,0-1.55-.49,1.83,1.83,0,0,0-1.2.33,1.05,1.05,0,0,0-.06,1.6,3.31,3.31,0,0,0,.94.6l1,.42a5.81,5.81,0,0,1,1.66,1,1.82,1.82,0,0,1,.55,1.39,1.8,1.8,0,0,1-.86,1.62A4,4,0,0,1,146.26,15.77Z"/></g></g></svg>',
            width: 400
        },
        {
            columns: [
                {
                    stack: [
                        {
                            get text() { return invoiceActive() ? 'Arve saaja:' : 'Adressaat:'},
                            style: 'header',
                            margin: [0, 0, 0, 8],
                        },
                        {
                            get text() { return document.getElementById('arveSaaja').value || '\n'; },
                        }
                        ],
                    width: '59%'
                },
                {
                    stack: [
                        {
                            get text() { return invoiceActive() ? 'Arve' : 'Hinnapakkumine'},
                            style: 'header',
                            margin: [0, 0, 0, 8]
                        },
                        {
                            get text() { return invoiceActive() ? 'Arve number:' : 'Pakkumise number:' }
                        },
                        {
                            get text() { return invoiceActive() ? 'Arve kuupäev:' : 'Pakkumise kuupäev:' }
                        },
                        {
                            get text() { return invoiceActive() ? 'Maksetähtaeg:' : 'Kehtivuse kuupäev:' }
                        },
                        '\n',
                        {
                            get text() { return invoiceActive() ? 'Tasuda:' : 'Hinnapakkumine kokku:' },
                            style: 'header',
                            margin: [0, 16, 0, 0]
                        },

                    ],
                    width: '25%'
                },
                {
                    stack: [
                        {
                            text: '\n',
                            margin: [0, 0, 0, 8]
                        },
                        {
                            get text() { return document.getElementById('arveNumber').value || '\n'; }
                        },
                        {
                            get text() { return document.getElementById('arveKuupaev').value || '\n'; }
                        },
                        {
                            get text() { return document.getElementById('maksetahtaeg').value || '\n'; }
                        },
                        {
                            get text() { return invoiceActive() ? 'Viivis 0.2% päevas' : '\n'; },
                        },
                        {
                            get text() { return document.getElementById('tasuda').value + ' EUR' || '\n'; },
                            style: 'header',
                            margin: [0, 16, 0, 0]
                        },

                    ],
                    alignment: 'right',
                    width: '*'
                }
            ],
        },
        {
            layout: {
                hLineWidth: function (i) {
                    return (i === 1) ? 1 : 0;
                },
                vLineWidth: () => 0,
                hLineColor: 'gray',
                paddingTop: () => 2,
            },
            table: {
                headerRows: 1,
                widths: ['*', 65, 50, 50, 50],
                body: [
                    ['Toode/teenus', 'Ühiku hind', 'Kogus', 'KM %', 'Kokku €']
                ]
            },
            margin: [0, 40, 0, 0]
        }
    ],
    footer: {
        stack: [
            {
                get text() { return document.getElementById('markused').value || '\n'; },
                margin: [0, 0, 0, 20]
            },
            {
                columns: [
                    {
                        get text() { return invoiceActive() ? 'Arve kokku:' : 'Summa:'; },
                        style: 'header',
                        width: '*'
                    },
                    {
                        stack: [
                            'Summa km-ta',
                            'Käibemaks kokku',
                            {
                                get text() { return invoiceActive() ? 'Arve summa' : 'Summa'; }
                            }
                        ],
                        width: 'auto'
                    },
                    {
                        stack: [
                            {
                                get text() { return document.getElementById('summaKmta').value + ' EUR' || '\n'; }
                            },
                            {
                                get text() { return document.getElementById('kaibemaksKokku').value + ' EUR' || '\n'; },
                            },
                            {
                                get text() { return document.getElementById('arveSumma').value + ' EUR' || '\n'; }
                            }
                        ],
                        alignment: 'right',
                        width: '15%'
                    }
                ]
            },
            {
                svg: '<svg preserveAspectRatio="none" width="515" height="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path d="M0 0h1v1H0" fill="#888"/></svg>',
                margin: [0, 10, 0, 0]
            },
            {
                columns: [
                    {
                        stack: [
                            'EST Viimistlus OÜ',
                            'Ussiharja,',
                            'Ilmandu küla, Harku vald',
                            '76904 Harjumaa',
                            'Reg nr: 16626776'
                        ]
                    },
                    {
                        stack: [
                            'www.estviimistlus.ee',
                            'est.viimistlus@hotmail.com',
                            '+372 55 688 706'
                        ],
                        margin: [20, 0, 0, 0]
                    },
                    {
                        text: 'Swedbank: EE972200221080369692',
                        alignment: 'right'
                    }
                ],
                style: 'smaller',
                margin: [0, 10, 0, 0]
            }
        ],
        margin: [40, 0, 40, 0]
    },
    styles: {
        header: {
            fontSize: 11,
            bold: true
        },
        smaller: {
            fontSize: 9
        }
    },
    defaultStyle: {
        fontSize: 10,
        lineHeight: 1.2
    },
    pageMargins: [40, 60, 40, 200]
}

document.getElementById('downloadPdf').addEventListener('click', () => {
    dd.content[2].table.body = [dd.content[2].table.body[0], ...getPdfTableRows()]
    pdfMake.createPdf(dd).download()
})

document.getElementById('previewPdf').addEventListener('click', () => {
    dd.content[2].table.body = [dd.content[2].table.body[0], ...getPdfTableRows()]
    pdfMake.createPdf(dd).open()
})

document.addEventListener('DOMContentLoaded', () => {
    initFields();
    [...document.getElementsByClassName('nav-link')].forEach((element) => {
            element.addEventListener('click', e => {
                toggleNavActive();
                translate();
            })
        }
    )
})
