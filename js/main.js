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
            text: 'OÜ Jackal Technologies \n \n',
            fontSize: 18
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
                            text: '\n'
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
                            'OÜ Jackal Technologies',
                            'Ussiharja,',
                            'Ilmandu küla, Harku vald',
                            '76904 Harjumaa',
                            'Reg nr: 17158975'
                        ]
                    },
                    {
                        stack: [
                            'kent.zuntov@gmail.com',
                            '+372 58 29 1106'
                        ],
                        margin: [20, 0, 0, 0]
                    },
                    {
                        text: 'LHV: EE087700771011366868',
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
