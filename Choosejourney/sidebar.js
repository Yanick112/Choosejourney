var MD5 = function (string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }
    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
}
const fileInput = document.getElementById('file-upload');
const statusMessage = document.getElementById('status-message');
const uploadButton = document.getElementById('upload-button');
const copyButton = document.getElementById('copy-button');
const clipboardButton = document.getElementById('clipboard-button');
const clearButton = document.getElementById('clear-button');
const setButton = document.getElementById('set-button');
const processButton = document.getElementById('process-button');
const themeToggleButton = document.getElementById('theme-toggle-button');
const upperSection = document.querySelector('.upper-section');
const lowerSection = document.querySelector('.lower-section');
const tooltip = document.createElement('div');
const buttons = document.querySelectorAll('.button');
const dragDropArea = document.getElementById('drag-drop-area');
const loveButton = document.getElementById('love-button');
const itemContainer = document.getElementById('item-container');
const buttonContainer = document.getElementById('category-buttons');
const subcategoryList = document.getElementById('subcategory-list');
const selectionRectangle = document.getElementById('selection-rectangle');
const submitButton = document.getElementById('submit-button');
const inputBox = document.getElementById('input-box');
const wrapper = document.getElementById('wrapper');



let organizedData = {};
let cycleNumber = 3;
let deleteMode = false;
let isUpperSectionHidden = false;
let randomMode = false;


document.addEventListener('DOMContentLoaded', function () {
    checkForCachedData();
    initializeSelection();
    addSpecialButton(dragDropArea, '编辑区');
    observeDragDropArea();
    dragDropArea.addEventListener('dragover', (e) => e.preventDefault());
    dragDropArea.addEventListener('drop', handleDrop);

    [statusMessage, ...buttons].forEach(element => {
        element.addEventListener('mouseenter', function () {
            const title = this.getAttribute('data-tooltip');
            if (title) {
                const formattedTitle = title.replace(/，/g, '\n');
                statusMessage.textContent = formattedTitle;
            }
        });
    });

    [upperSection, lowerSection].forEach(section => {
        section.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    });
});
function checkForCachedData() {
    const cachedData = localStorage.getItem('parsedCSVData');
    if (cachedData) {
        statusMessage.textContent = '数据已加载✔';
        createMainMenu(JSON.parse(cachedData));
    } else {
        loadDefaultCSVIfNeeded();
    }
}
function loadDefaultCSVIfNeeded() {
    fetch(chrome.runtime.getURL('prompts.csv'))
        .then(response => response.text())
        .then(csvData => {
            Papa.parse(csvData, {
                header: true,
                complete: function (results) {
                    localStorage.setItem('parsedCSVData', JSON.stringify(results.data));
                    createMainMenu(results.data);
                    statusMessage.textContent = '默认已加载✔';
                },
                error: function (err) {
                    console.error("CSV解析错误:", err);
                    statusMessage.textContent = '加载默认失败';
                }
            });
        })
        .catch(err => console.error('加载默认CSV失败:', err));
}
function parseCSVFile(file) {
    Papa.parse(file, {
        complete: function (results) {
            localStorage.setItem('parsedCSVData', JSON.stringify(results.data));
            createMainMenu(results.data);
            statusMessage.textContent = '数据已加载✔';
        },
        header: true,
        error: function (err) {
            console.error("CSV解析错误:", err);
            statusMessage.textContent = '加载失败';
        }
    });
}
function processData(data) {
    localStorage.setItem('parsedCSVData', JSON.stringify(data));
    createMainMenu(data);
}
function initializeSelection() {
    const contentList = document.getElementById('content-list');
    const buttonsArray = Array.from(contentList.querySelectorAll('.button-item'));
    let isSelecting = false;
    let startX, startY;
    let selectedButtons = new Set();
    contentList.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isSelecting = true;
        startX = e.offsetX;
        startY = e.offsetY;
        selectionRectangle.style.left = `${startX}px`;
        selectionRectangle.style.top = `${startY}px`;
        selectionRectangle.style.width = '0px';
        selectionRectangle.style.height = '0px';
        document.body.classList.add('disable-text-selection');
    });
    document.addEventListener('mousemove', (e) => {
        if (!isSelecting) return;
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        const left = Math.min(currentX, startX);
        const top = Math.min(currentY, startY);
        selectionRectangle.style.left = `${left}px`;
        selectionRectangle.style.top = `${top}px`;
        selectionRectangle.style.width = `${width}px`;
        selectionRectangle.style.height = `${height}px`;
        selectionRectangle.style.display = 'block';
        const rect = selectionRectangle.getBoundingClientRect();
        buttonsArray.forEach(button => {
            button.style.pointerEvents = 'none';
        });
        buttonsArray.forEach(button => {
            const btnRect = button.getBoundingClientRect();
            const isInside = !(
                rect.right < btnRect.left ||
                rect.left > btnRect.right ||
                rect.bottom < btnRect.top ||
                rect.top > btnRect.bottom
            );
            if (isInside) {
                if (!selectedButtons.has(button)) {
                    selectedButtons.add(button);
                    button.classList.add('active-manual');
                }
            } else {
                if (selectedButtons.has(button)) {
                    selectedButtons.delete(button);
                    button.classList.remove('active-manual');
                }
            }
        });
    });
    document.addEventListener('mouseup', (e) => {
        if (!isSelecting) return;
        selectedButtons.forEach(button => {
            addButtonToDragDropArea(button);
            button.classList.remove('active-manual');
        });
        buttonsArray.forEach(button => {
            button.style.pointerEvents = '';
        });
        selectedButtons.clear();
        isSelecting = false;
        selectionRectangle.style.display = 'none';
        document.body.classList.remove('disable-text-selection');
    });
    contentList.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
}
function addButtonToDragDropArea(button) {
    const textContent = button.textContent;
    const dataText = button.getAttribute('data-text');
    const newButton = createButton(textContent, dataText);
    const backFixedButtons = Array.from(dragDropArea.querySelectorAll('.button.fixed'))
        .filter(btn => btn.getAttribute('data-fixed-position') === 'back');
    insertButton(dragDropArea, newButton, backFixedButtons);
    newButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function clearAllActiveStates(container) {
    const buttons = container.querySelectorAll('.button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains('active-skip')) {
            btn.classList.remove('active-skip');
            btn.classList.add('skip');
        }
    });
}



function createMainMenu(data) {
    data.forEach(item => {
        if (item.superType && item.dir && item.text) {
            if (!organizedData[item.superType]) {
                organizedData[item.superType] = {};
            }
            if (!organizedData[item.superType][item.dir]) {
                organizedData[item.superType][item.dir] = [];
            }
            organizedData[item.superType][item.dir].push({
                text: item.text,
                lang_zh: item.lang_zh
            });
        }
    });
    buttonContainer.innerHTML = '';
    Object.keys(organizedData).forEach((superType) => {
        if (superType) {
            const button = document.createElement('button');
            button.textContent = superType;
            button.className = 'button button-superType';
            button.onclick = (event) => {
                if (deleteMode) {
                    handleDeleteClick.call(button, event);
                } else if (randomMode) { // 新增随机模式判断
                    handleRandomClick.call(button, event);
                } else {
                    itemContainer.innerHTML = '';
                    if (button.classList.contains('skip')) {
                        clearAllActiveStates(buttonContainer);
                        button.classList.remove('skip');
                        button.classList.add('active-skip');
                        createSubmenu(superType, organizedData);
                    } else if (button.classList.contains('active-skip')) {
                    } else if (button.classList.contains('active')) {
                    } else {
                        clearAllActiveStates(buttonContainer);
                        button.classList.add('active');
                        createSubmenu(superType, organizedData);
                    }
                }
            };
            if (deleteMode) {
                button.classList.add('shaking');
            } else {
                button.classList.remove('shaking');
            }
            if (randomMode) {
                button.classList.add('floating');
            } else {
                button.classList.remove('floating');
            }
            buttonContainer.appendChild(button);
        }
    });
    addSpecialButton(buttonContainer, '一级目录');
    const deleteButton = document.createElement('button');
    const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 56 56"><path fill="currentColor" d="M46.035 49.574c4.899 0 7.36-2.414 7.36-7.265V13.69c0-4.851-2.461-7.265-7.36-7.265H25.668c-2.742 0-5.11.703-7.031 2.742L4.832 23.512c-1.523 1.57-2.226 2.976-2.226 4.453c0 1.453.68 2.883 2.226 4.453L18.66 46.691c1.946 2.016 4.29 2.86 7.032 2.86Zm-5.46-11.203c-.563 0-1.055-.21-1.454-.586l-6.844-6.89l-6.867 6.89c-.398.375-.89.586-1.453.586c-1.148 0-2.11-.937-2.11-2.086c0-.539.235-1.054.634-1.476l6.82-6.844l-6.82-6.82c-.399-.422-.633-.938-.633-1.477c0-1.172.96-2.133 2.11-2.133c.538 0 1.054.211 1.476.633l6.843 6.844l6.82-6.844c.423-.422.938-.633 1.477-.633c1.172 0 2.11.961 2.11 2.133c0 .54-.211 1.055-.633 1.477l-6.82 6.82l6.82 6.844c.422.422.633.937.633 1.476c0 1.149-.961 2.086-2.11 2.086"/></svg>
    `;
    deleteButton.innerHTML = svgIcon;
    deleteButton.className = 'button delete-button';
    deleteButton.addEventListener('click', function (event) {
        event.preventDefault();
        toggleDeleteMode();
    });
    buttonContainer.appendChild(deleteButton);
}
function getRandomDelay(min = 0, max = 200) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createSubmenu(superType, organizedData) {
    const dirs = organizedData[superType];
    subcategoryList.innerHTML = '';
    Object.keys(dirs).forEach(dir => {
        const button = document.createElement('button');
        button.className = 'button button-dir button-animate';
        const dirName = dir.replace(`${superType}/`, '');
        button.textContent = dirName;
        button.onclick = (event) => {
            if (deleteMode) {
                handleDeleteClick.call(button, event);
            } else if (randomMode) { // 新增随机模式判断
                handleRandomClick.call(button, event);
            } else {
                clearAllActiveStates(subcategoryList);
                button.classList.add('active');
                createPrompts(superType, dir, organizedData);
            }
        };
        if (deleteMode) {
            button.classList.add('shaking');
        } else {
            button.classList.remove('shaking');
        }
        if (randomMode) {
            button.classList.add('floating');
        } else {
            button.classList.remove('floating');
        }
        button.style.animationDelay = `${getRandomDelay()}ms`;
        button.addEventListener('animationend', () => {
            button.classList.remove('button-animate');
            button.style.opacity = '1';
        });
        subcategoryList.appendChild(button);
    });
    addSpecialButton(subcategoryList, '二级目录');
}
function createPrompts(superType, dir, organizedData) {
    itemContainer.innerHTML = '';
    organizedData[superType][dir].forEach(item => {
        const button = document.createElement('button');
        button.className = 'button button-item button-animate';
        button.setAttribute('data-text', item.text);
        button.textContent = `${item.text}(${item.lang_zh})`;
        button.onclick = function (event) {
            if (deleteMode) {
                handleDeleteClick.call(button, event);
            } else {
                const textToCopy = this.getAttribute('data-text');
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showTheTooltip(event, "已复制");
                    const newButton = createButton(this.textContent, this.getAttribute('data-text'));
                    const backFixedButtons = Array.from(dragDropArea.querySelectorAll('.button.fixed[data-fixed-position="back"]'));
                    insertButton(dragDropArea, newButton, backFixedButtons);
                    newButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
                })
            }
        };
        if (deleteMode) {
            button.classList.add('shaking');
        } else {
            button.classList.remove('shaking');
        }
        button.style.animationDelay = `${getRandomDelay()}ms`;
        button.addEventListener('animationend', () => {
            button.classList.remove('button-animate');
            button.style.opacity = '1';
        });
        itemContainer.appendChild(button);
    });
    initializeSelection();
}



function toggleFixedState(position) {
    if (this.classList.contains('fixed')) {
        this.classList.remove('fixed');
        this.removeAttribute('data-fixed-position');
    } else {
        this.classList.add('fixed');
        this.setAttribute('data-fixed-position', position);
    }
    dragDropArea.removeChild(this);
    if (position === 'front') {
        dragDropArea.insertBefore(this, dragDropArea.firstChild);
    } else {
        dragDropArea.appendChild(this);
    }
}
function createButton(dataText, textContent) {
    const newButton = document.createElement('button');
    newButton.className = 'button button-item';
    newButton.textContent = textContent;
    newButton.setAttribute('data-text', dataText);
    newButton.draggable = true;
    newButton.addEventListener('dragstart', handleDragStart);
    newButton.addEventListener('dragover', handleDragOver);
    newButton.addEventListener('drop', handleDrop);
    newButton.addEventListener('dragend', handleDragEnd);
    newButton.addEventListener('dblclick', function () {
        this.remove();
    });
    newButton.onclick = function () {
        const textToCopy = this.getAttribute('data-text');
        navigator.clipboard.writeText(textToCopy)
    };
    return newButton;
}
function resetDragDropArea() {
    const dragDropArea = document.getElementById('drag-drop-area');
    const fixedButtons = Array.from(dragDropArea.querySelectorAll('.button.fixed'));
    const frontFixedButtons = fixedButtons.filter(button => button.getAttribute('data-fixed-position') === 'front');
    const backFixedButtons = fixedButtons.filter(button => button.getAttribute('data-fixed-position') === 'back');
    dragDropArea.innerHTML = '';
    frontFixedButtons.forEach(button => dragDropArea.appendChild(button));
    backFixedButtons.forEach(button => dragDropArea.appendChild(button));
    return { dragDropArea, fixedButtons, frontFixedButtons, backFixedButtons };
}
function insertButton(dragDropArea, newButton, backFixedButtons) {
    if (backFixedButtons.length > 0) {
        const referenceNode = backFixedButtons[0];
        dragDropArea.insertBefore(newButton, referenceNode);
    } else {
        dragDropArea.appendChild(newButton);
    }
}


function showTooltip(targetElement, message, duration = 500) {
    return new Promise((resolve) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip show';
        tooltip.textContent = message;
        document.body.appendChild(tooltip);
        const rect = targetElement.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
        setTimeout(() => {
            tooltip.remove();
            resolve();
        }, duration);
    });
}
function showTheTooltip(event, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip show tooltip-special';
    tooltip.textContent = message;
    document.body.appendChild(tooltip);
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    tooltip.style.left = `${mouseX + window.scrollX}px`;
    tooltip.style.top = `${mouseY + window.scrollY}px`;
    return tooltip;
}
document.addEventListener('mousemove', function () {
    const tooltips = document.querySelectorAll('.tooltip-special');
    tooltips.forEach(tooltip => {
        tooltip.remove();
    });
});


function showCustomConfirm(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'custom-overlay';
        const dialog = document.createElement('div');
        dialog.className = 'custom-dialog';
        const messageElem = document.createElement('p');
        messageElem.textContent = message;
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'custom-buttons';
        const confirmButton = document.createElement('button');
        confirmButton.textContent = '确定';
        confirmButton.className = 'button confirm-button';
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.className = 'button cancel-button';
        buttonsContainer.appendChild(confirmButton);
        buttonsContainer.appendChild(cancelButton);
        dialog.appendChild(messageElem);
        dialog.appendChild(buttonsContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        confirmButton.addEventListener('click', () => {
            let overlays = document.querySelectorAll('.custom-overlay');
            while (overlays.length > 0) {
                overlays.forEach((overlay) => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                });
                overlays = document.querySelectorAll('.custom-overlay');
            }
            resolve(true);
        });
        cancelButton.addEventListener('click', () => {
            let overlays = document.querySelectorAll('.custom-overlay');
            while (overlays.length > 0) {
                overlays.forEach((overlay) => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                });
                overlays = document.querySelectorAll('.custom-overlay');
            }
            resolve(false);
        });
    });
}



function toggleDeleteMode() {
    deleteMode = !deleteMode;
    const containers = ['#category-buttons', '#subcategory-list', '#content-list'];
    containers.forEach(containerSelector => {
        const container = document.querySelector(containerSelector);
        if (container) {
            const dataButtons = container.querySelectorAll('.button-superType, .button-dir, .button-item');
            if (deleteMode) {
                const buttonsArray = Array.from(dataButtons);
                shuffleArray(buttonsArray);
                buttonsArray.forEach((button, index) => {
                    const delay = Math.random() * 500;
                    setTimeout(() => {
                        button.classList.add('shaking');
                        button.addEventListener('click', handleDeleteClick);
                    }, delay);
                });
            } else {
                dataButtons.forEach(button => {
                    button.classList.remove('shaking');
                    button.removeEventListener('click', handleDeleteClick);
                });
            }
        }
    });
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    if (deleteMode) {
        disableOtherFunctions();
    } else {
        enableOtherFunctions();
    }
}
function handleDeleteClick(event) {
    if (!deleteMode) return;
    event.stopPropagation();
    const button = this;
    const text = button.getAttribute('data-text') || button.textContent;
    const container = button.closest('#category-buttons, #subcategory-list, #content-list');

    if (container.id === 'category-buttons') {
        showCustomConfirm(`确定要删除 "${text}" 及其所有子项吗？`).then(confirmed => {
            if (confirmed) {
                deleteSuperType(text);
                button.remove();
                subcategoryList.innerHTML = '';
                itemContainer.innerHTML = '';
            }
        });
    } else if (container.id === 'subcategory-list') {
        showCustomConfirm(`确定要删除 "${text}" 及其所有子项吗？`).then(confirmed => {
            if (confirmed) {
                deleteDir(text);
                button.remove();
                itemContainer.innerHTML = '';
            }
        });
    } else if (container.id === 'content-list') {
        deleteItem(text);
        button.remove();
    }
}
function deleteSuperType(superType) {
    if (organizedData.hasOwnProperty(superType)) {
        delete organizedData[superType];
    }
    const cachedData = localStorage.getItem('parsedCSVData');
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const updatedData = parsedData.filter(item => item.superType !== superType);
        localStorage.setItem('parsedCSVData', JSON.stringify(updatedData));
        createMainMenu(updatedData);
    }
}
function deleteDir(dir) {
    for (const superType in organizedData) {
        if (organizedData[superType].hasOwnProperty(dir)) {
            delete organizedData[superType][dir];
            break;
        }
    }
    const cachedData = localStorage.getItem('parsedCSVData');
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const updatedData = parsedData.filter(item => item.dir !== dir);
        localStorage.setItem('parsedCSVData', JSON.stringify(updatedData));
        createMainMenu(updatedData);
    }
}
function deleteItem(itemText) {
    for (const superType in organizedData) {
        for (const dir in organizedData[superType]) {
            organizedData[superType][dir] = organizedData[superType][dir].filter(item => item.text !== itemText);
            if (organizedData[superType][dir].length === 0) {
                delete organizedData[superType][dir];
            }
        }
        if (Object.keys(organizedData[superType]).length === 0) {
            delete organizedData[superType];
        }
    }
    const cachedData = localStorage.getItem('parsedCSVData');
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const updatedData = parsedData.filter(item => item.text !== itemText);
        localStorage.setItem('parsedCSVData', JSON.stringify(updatedData));
        createMainMenu(updatedData);
    }
}

function disableOtherFunctions() {
    const aiButtons = document.querySelectorAll('.button-specialButton');
    aiButtons.forEach(button => button.disabled = true);
}
function enableOtherFunctions() {
    const aiButtons = document.querySelectorAll('.button-specialButton');
    aiButtons.forEach(button => button.disabled = false);
}




function handleRandomClick(event) {
    event.stopPropagation();
    const button = this;
    const text = button.getAttribute('data-text') || button.textContent;
    const container = button.closest('#category-buttons, #subcategory-list, #content-list');

    let superType, dir;

    if (container.id === 'category-buttons') {
        superType = text;
        // 在 superType 下随机选择一个 dir
        const dirs = Object.keys(organizedData[superType]);
        if (dirs.length === 0) {
            alert('该类别下没有子目录。');
            return;
        }
        dir = dirs[Math.floor(Math.random() * dirs.length)];
    } else if (container.id === 'subcategory-list') {
        superType = getActiveSuperType();
        dir = text;
    } else {
        return; // 其他情况不处理
    }

    const prompt = getRandomPrompt(superType, dir);
    if (prompt) {
        const newButton = createButton(`${prompt.text}(${prompt.lang_zh})`, prompt.text);
        const backFixedButtons = Array.from(dragDropArea.querySelectorAll('.button.fixed[data-fixed-position="back"]'));
        insertButton(dragDropArea, newButton, backFixedButtons);
        newButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        alert('该目录下没有提示词组。');
    }
}
function getRandomPrompt(superType, dir) {
    if (superType && dir && organizedData[superType] && organizedData[superType][dir]) {
        const prompts = organizedData[superType][dir];
        if (prompts.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * prompts.length);
        return prompts[randomIndex];
    }
    return null;
}
function getActiveSuperType() {
    const activeButton = buttonContainer.querySelector('.button.active');
    return activeButton ? activeButton.textContent : null;
}
function addFloatingEffect() {
    const containers = ['#category-buttons', '#subcategory-list'];
    containers.forEach(containerSelector => {
        const container = document.querySelector(containerSelector);
        if (container) {
            const dataButtons = container.querySelectorAll('.button-superType, .button-dir, .button-item');
            const buttonsArray = Array.from(dataButtons);
            shuffleArray(buttonsArray);
            buttonsArray.forEach(button => {
                const delay = Math.random() * 500; // 随机延迟 0 到 500 毫秒
                setTimeout(() => {
                    button.classList.add('floating');
                    // 可以在需要时添加其他事件监听器或逻辑
                }, delay);
            });
        }
    });

    disableOtherFunctions();
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

function removeFloatingEffect() {
    const containers = ['#category-buttons', '#subcategory-list'];
    containers.forEach(containerSelector => {
        const container = document.querySelector(containerSelector);
        if (container) {
            const dataButtons = container.querySelectorAll('.button-superType, .button-dir, .button-item');
            dataButtons.forEach(button => {
                button.classList.remove('floating');
            });
        }
    });

    enableOtherFunctions();
}



function addSpecialButton(container, level) {
    const specialButton = document.createElement('button');
    const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/></g></svg>
    `;
    specialButton.innerHTML = svgIcon;
    specialButton.className = 'button button-specialButton';
    specialButton.addEventListener('click', function (event) {
        event.preventDefault();
        const inputValue = inputBox.value.trim();
        if (inputValue === '') {
            statusMessage.textContent = '请先输入内容！';
            inputBox.focus();
            return;
        }
        statusMessage.textContent = '正在生成内容...';
        statusMessage.classList.add('generating');
        aiGenerateContent(inputValue, level).then(generatedContent => {
            statusMessage.textContent = '';
            statusMessage.classList.remove('generating');
            if (level === '编辑区') {
                const dragDropArea = document.getElementById('drag-drop-area');
                const newButton = createButton(generatedContent, generatedContent);
                const backFixedButtons = Array.from(dragDropArea.querySelectorAll('.button.fixed[data-fixed-position="back"]'));
                insertButton(dragDropArea, newButton, backFixedButtons);
                newButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                updateCSV(generatedContent, level);
            }
        });
    });
    container.appendChild(specialButton);
}
function showSettingsDialog() {
    const settingsContainer = document.createElement('div');
    settingsContainer.className = 'custom-settings-container';
    const savedTranslateAppId = localStorage.getItem('translateAppId') || '';
    const savedTranslateKey = localStorage.getItem('translateKey') || '';
    const translateAppIdInput = document.createElement('input');
    translateAppIdInput.type = 'text';
    translateAppIdInput.placeholder = '请输入百度翻译API AppID';
    translateAppIdInput.value = savedTranslateAppId;
    settingsContainer.appendChild(translateAppIdInput);
    const translateKeyInput = document.createElement('input');
    translateKeyInput.type = 'text';
    translateKeyInput.placeholder = '请输入百度翻译API密钥';
    translateKeyInput.value = savedTranslateKey;
    settingsContainer.appendChild(translateKeyInput);
    const savedApiKey = localStorage.getItem('aiApiKey') || '';
    const savedModel = localStorage.getItem('aiModel') || '';
    const savedProxyUrl = localStorage.getItem('proxyUrl') || '';
    const apiKeyInput = document.createElement('input');
    apiKeyInput.type = 'text';
    apiKeyInput.placeholder = '请输入AI密钥，OpenAI兼容';
    apiKeyInput.value = savedApiKey;
    settingsContainer.appendChild(apiKeyInput);
    const proxyInput = document.createElement('input');
    proxyInput.type = 'text';
    proxyInput.placeholder = '默认接口https://api.openai.com/v1/chat/completions';
    proxyInput.value = savedProxyUrl;
    settingsContainer.appendChild(proxyInput);
    const modelInput = document.createElement('input');
    modelInput.type = 'text';
    modelInput.placeholder = '默认模型gpt-4o-mini';
    modelInput.value = savedModel || '';
    settingsContainer.appendChild(modelInput);
    const settingsContainer2 = document.createElement('div');
    settingsContainer2.className = 'custom-buttons';
    settingsContainer.appendChild(settingsContainer2);
    const saveButton = document.createElement('button');
    saveButton.textContent = '保存';
    saveButton.className = 'button button-superType';
    settingsContainer2.appendChild(saveButton);
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.className = 'button button-superType';
    settingsContainer2.appendChild(cancelButton);
    showDialog(settingsContainer);
    saveButton.addEventListener('click', function () {
        const translateAppId = translateAppIdInput.value;
        const translateKey = translateKeyInput.value;
        const apiKey = apiKeyInput.value;
        const proxyUrl = proxyInput.value;
        const model = modelInput.value;
        localStorage.setItem('translateAppId', translateAppId);
        localStorage.setItem('translateKey', translateKey);
        localStorage.setItem('aiApiKey', apiKey);
        localStorage.setItem('proxyUrl', proxyUrl);
        localStorage.setItem('aiModel', model);
        statusMessage.textContent = '设置已保存';
        closeDialog();
    });
    cancelButton.addEventListener('click', function () {
        closeDialog();
    });
}
function observeDragDropArea() {
    const dragDropArea = document.getElementById('drag-drop-area');
    const observer = new MutationObserver(function (mutationsList, observer) {
        ensureSpecialButtonExistsAndAtEnd();
    });
    observer.observe(dragDropArea, { childList: true });
}
function ensureSpecialButtonExistsAndAtEnd() {
    const dragDropArea = document.getElementById('drag-drop-area');
    let specialButton = dragDropArea.querySelector('.button-specialButton');
    if (!specialButton) {
        // 如果 specialButton 不存在，重新创建并添加它
        addSpecialButton(dragDropArea, '编辑区');
        specialButton = dragDropArea.querySelector('.button-specialButton');
    }
    if (specialButton && specialButton !== dragDropArea.lastElementChild) {
        // 如果 specialButton 存在但不在最后，移动到最后
        dragDropArea.appendChild(specialButton);
    }
}
function showDialog(contentElement) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-overlay';
    overlay.appendChild(contentElement);
    document.body.appendChild(overlay);
    window.currentCustomDialogOverlay = overlay;
}
function closeDialog() {
    if (window.currentCustomDialogOverlay) {
        document.body.removeChild(window.currentCustomDialogOverlay);
        window.currentCustomDialogOverlay = null;
    }
}
async function aiGenerateContent(input, level) {
    const apiKey = localStorage.getItem('aiApiKey');
    const model = localStorage.getItem('aiModel') || 'gpt-4o-mini';
    const proxyUrl = localStorage.getItem('proxyUrl');
    if (!apiKey || !model || !proxyUrl) {
        showSettingsDialog();
        throw new Error('未找到AI密钥或模型或代理URL，请先设置');
    }
    let apiUrl;
    apiUrl = proxyUrl;
    let prompt;
    if (level === '一级目录') {
        prompt = `"${input}" 始终是 superType（父类目）。"${input}" 始终是 superType（父类目）。
        先为 "${input}" 只需要生成 6 个不同的 dir（子类目）。
        然后每个 dir（子类目） 下生成 6 组 text（英文） 和对应的 lang_zh（中文）。
        总共生成 36 行内容。
        再调整每行的格式为：text, lang_zh, dir, superType。
        请保持与以下示例相同的纯文本格式：
    Furniture,家具,家具类,产品
    Sofa,沙发,家具类,产品
    Chairs,椅子,家具类,产品
    Tables,桌子,家具类,产品
    Beds,床,家具类,产品
    Bookshelves,书架,家具类,产品
    Cups,杯子,厨房用品类,产品
    Cookware,烹饪器具,厨房用品类,产品
    Kettles,水壶,厨房电器类,产品
    Blenders,搅拌机,厨房电器类,产品
    Toasters,烤面包机,厨房电器类,产品
    Microwaves,微波炉,厨房电器类,产品
    不要添加任何序号。不要添加任何序号。不要添加任何序号。
    现在，请为 "${input}" 生成内容，严格按照上述要求和格式。`;
    }
    else if (level === '二级目录') {
        prompt = `请生成和"${input}"相关的子项，
        "${input}"总是dir（类目）级，
        "${input}"生成30对text（英文）, lang_zh（对应中文），
        text, lang_zh, dir这个顺序
        按照以下参考格式：
        Furniture,家具,家具类
        Sofa,沙发,家具类
        Chairs,椅子,家具类
        Tables,桌子,家具类
        Beds,床,家具类
        Bookshelves,书架,家具类
        现在为"${input}"生成内容，保持纯文本相同的格式。
        不允许序号，不允许序号，不允许序号`;
    }
    else if (level === '编辑区') {
        prompt = `请扩写以下提示词到100字，全部使用短句："${input}"。`;
    }
    const payload = {
        model: model,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: 800,
        temperature: 0.2
    };
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`API 请求失败，状态码: ${response.status}`);
        }
        const data = await response.json();
        const generatedText = data.choices && data.choices[0]?.message?.content.trim();
        return generatedText ? `${generatedText}` : '没有生成内容';
    } catch (error) {
        console.error('AI生成内容错误:', error);
        throw error;
    }
}
function updateCSV(generatedContent, level) {
    let csvData = localStorage.getItem('parsedCSVData');
    if (csvData) {
        csvData = JSON.parse(csvData);
    } else {
        csvData = [];
    }
    if (level === '一级目录') {
        const lines = generatedContent.split('\n').filter(line => line.trim() !== '');
        lines.forEach(line => {
            const [text, lang_zh, dir, superType] = line.split(',').map(item => item.trim());
            csvData.push({ text, lang_zh, dir, superType });
        });
    } else if (level === '二级目录') {
        const activeSuperTypeButton = document.querySelector('.button-superType.active');
        if (activeSuperTypeButton) {
            const superType = activeSuperTypeButton.textContent;
            const lines = generatedContent.split('\n').filter(line => line.trim() !== '');
            lines.forEach(line => {
                const [text, lang_zh, dir] = line.split(',').map(item => item.trim());
                csvData.push({ text, lang_zh, dir, superType });
            });
        } else {
            console.warn('没有选中的一级目录，无法添加二级目录。');
            return;
        }
    }
    localStorage.setItem('parsedCSVData', JSON.stringify(csvData));
    const activeSuperTypeButton = document.querySelector('.button-superType.active');
    let activeSuperType = null;
    if (activeSuperTypeButton) {
        activeSuperType = activeSuperTypeButton.textContent;
    }
    createMainMenu(csvData);
    if (activeSuperType) {
        const buttons = document.querySelectorAll('.button-superType');
        buttons.forEach(button => {
            if (button.textContent === activeSuperType) {
                button.classList.add('active');
                createSubmenu(activeSuperType, organizedData);
            }
        });
    }
}





let draggedItem = null;
let placeholder = null;
const actionBoxes = wrapper.querySelectorAll('.action-box');
actionBoxes.forEach(box => {
    box.addEventListener('dragover', handleDragOver);
    box.addEventListener('dragenter', handleDragEnter);
    box.addEventListener('dragleave', handleDragLeave);
    box.addEventListener('drop', handleDrop);
});
dragDropArea.addEventListener('dragover', handleDragOver);
dragDropArea.addEventListener('drop', handleDrop);
function handleDragStart(e) {
    draggedItem = this;
    placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.style.width = `${draggedItem.offsetWidth}px`;
    placeholder.style.height = `${draggedItem.offsetHeight}px`;
    draggedItem.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    setTimeout(() => {
        draggedItem.style.display = 'none';
    }, 0);
    actionBoxes.forEach(box => {
        box.style.display = 'flex';
    });
}
function handleDragOver(e) {
    e.preventDefault();
    const target = e.target;
    if (target && target !== draggedItem) {
        if (target.classList.contains('button-item')) {
            const rect = target.getBoundingClientRect();
            const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
            const parent = target.parentNode;
            if (next) {
                parent.insertBefore(placeholder, target.nextSibling);
            } else {
                parent.insertBefore(placeholder, target);
            }
        } else if (target.classList.contains('action-box')) {
            // 高亮悬停的操作框
            target.classList.add('highlight');
        } else {
            actionBoxes.forEach(box => box.classList.remove('highlight'));
        }
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}
function handleDragEnter(e) {
    e.preventDefault();
    if (this.classList.contains('action-box')) {
        this.classList.add('highlight');
    }
}
function handleDragLeave(e) {
    if (this.classList.contains('action-box')) {
        this.classList.remove('highlight');
    }
}
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    if (target.classList.contains('action-box')) {
        const action = target.getAttribute('data-action');
        performAction(action, draggedItem);
    } else if (target.classList.contains('button-item') || target === dragDropArea) {
        const parent = placeholder.parentNode;
        if (parent && draggedItem) {
            parent.insertBefore(draggedItem, placeholder);
        }
        draggedItem.style.display = '';
        draggedItem.classList.remove('dragging');
    }
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
    actionBoxes.forEach(box => box.classList.remove('highlight'));
    draggedItem = null;
    placeholder = null;
}
function handleDragEnd(e) {
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
    if (draggedItem) {
        draggedItem.style.display = '';
        draggedItem.classList.remove('dragging');
    }
    actionBoxes.forEach(box => box.classList.remove('highlight'));
    actionBoxes.forEach(box => {
        box.style.display = 'none';
    });
    draggedItem = null;
    placeholder = null;
}
function performAction(action, item) {
    switch (action) {
        case 'pinToTop':
            toggleFixedState.call(item, 'front');
            break;
        case 'pinToBottom':
            toggleFixedState.call(item, 'back');
            break;
        case 'disassemble':
            disassembleItem(item);
            break;
        case 'translate':
            translateItem(item);
            break;
    }
    item.style.display = '';
    item.classList.remove('dragging');
}
async function disassembleItem(item) {
    const fixedButtons = Array.from(dragDropArea.querySelectorAll('.button.fixed'));
    const backFixedButtons = fixedButtons.filter(button => button.getAttribute('data-fixed-position') === 'back');
    const existingTexts = fixedButtons.map(button => button.getAttribute('data-text'));
    const text = item.getAttribute('data-text');
    const parameterRegex = /--\S+\s+\S+/g;
    const parameters = text.match(parameterRegex) || [];
    const cleanText = text.replace(parameterRegex, '').trim();
    const items = cleanText.split(/[，,。\.]+/);
    for (const itemText of items) {
        if (itemText.trim() !== '' && !existingTexts.includes(itemText.trim())) {
            let newButtonText;
            newButtonText = itemText.trim();
            const newButton = createButton(itemText.trim(), newButtonText);
            insertButton(dragDropArea, newButton, backFixedButtons);
            await translateItem(newButton);
        }
    }
    for (const itemText of parameters) {
        if (itemText.trim() !== '' && !existingTexts.includes(itemText.trim())) {
            let newButtonText;
            newButtonText = itemText.trim();
            const newButton = createButton(itemText.trim(), newButtonText);
            insertButton(dragDropArea, newButton, backFixedButtons);
        }
    }
    item.remove();
    backFixedButtons.forEach(button => dragDropArea.appendChild(button));
}
async function translateItem(item) {
    const text = item.getAttribute('data-text');
    let newButtonText;
    if (isChinese(text.trim())) {
        newButtonText = text.trim();
    } else {
        const translatedText = await translateAPI(text.trim());
        newButtonText = translatedText ? `${text.trim()}\.(${translatedText})` : text.trim();
    }
    item.setAttribute('data-text', text.trim());
    item.textContent = newButtonText;
}






document.querySelectorAll('.button-item').forEach(button => {
    button.draggable = true;
    button.addEventListener('dragstart', handleDragStart);
    button.addEventListener('dragover', handleDragOver);
    button.addEventListener('drop', handleDrop);
    button.addEventListener('dragend', handleDragEnd);
});
copyButton.addEventListener('click', function () {
    const buttons = document.querySelectorAll('#drag-drop-area .button');
    const buttonTexts = Array.from(buttons).map(button => button.getAttribute('data-text'));
    let concatenatedTexts = buttonTexts.join(', ');
    concatenatedTexts = concatenatedTexts.replace(/, --/g, ' --');
    navigator.clipboard.writeText(concatenatedTexts).then(() => {
        statusMessage.textContent = '已复制';
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs[0] && tabs[0].id) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['contentScript.js']
            }, function () {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'fillTextarea', data: concatenatedTexts }, function (response) {
                    if (chrome.runtime.lastError) {
                        console.error("运行时错误:", chrome.runtime.lastError.message);
                    } else if (response && response.status === 'success') {
                    } else {
                        console.error('无法填充文本区域:', response ? response.message : '未收到回复');
                    }
                });
            });
        } else {
            console.error('没有找到活动选项卡或缺少选项卡ID');
        }
    });
});
processButton.addEventListener('click', () => {
    randomMode = !randomMode;
    if (randomMode) {

        processButton.classList.add('active');
        statusMessage.textContent = '已切换到随机模式';
        addFloatingEffect();
    } else {
        statusMessage.textContent = '已关闭随机模式';

        processButton.classList.remove('active');
        removeFloatingEffect();
    }
});
function isChinese(text) {
    return /[\u4e00-\u9fa5]/.test(text);
}
async function translateAPI(text) {
    const appid = localStorage.getItem('translateAppId') || '默认AppID';
    const key = localStorage.getItem('translateKey') || '默认密钥';
    if (!appid || !key) {
        console.error('翻译API设置不完整');
        statusMessage.textContent = '请设置翻译API信息';
        return null;
    }
    const salt = new Date().getTime();
    const from = 'en';
    const to = 'zh';
    const sign = MD5(appid + text + salt + key);
    const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(text)}&appid=${appid}&salt=${salt}&from=${from}&to=${to}&sign=${sign}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        if (result && result.trans_result) {
            return result.trans_result[0].dst;
        } else {
            console.error('翻译API返回错误:', result);
            statusMessage.textContent = '翻译API错误';
            return null;
        }
    } catch (error) {
        console.error('调用翻译API时出错:', error);
        statusMessage.textContent = '翻译网络错误';
        return null;
    }
}
clipboardButton.addEventListener('click', async function () {
    const { dragDropArea, fixedButtons, backFixedButtons } = resetDragDropArea();
    const existingTexts = fixedButtons.map(button => button.getAttribute('data-text'));
    try {
        const text = await navigator.clipboard.readText();
        if (text.trim() !== '' && !existingTexts.includes(text.trim())) {
            const newButton = createButton(text.trim(), text.trim());
            insertButton(dragDropArea, newButton, backFixedButtons);
        }
    } catch (error) {
        console.error('读取剪贴板内容出错:', error);
        statusMessage.textContent = '读取剪贴板失败';
    }
    // 恢复固定按钮
    backFixedButtons.forEach(button => dragDropArea.appendChild(button));
});
document.addEventListener('DOMContentLoaded', function () {
    let darkModePreference = localStorage.getItem('darkMode');
    if (!darkModePreference) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        darkModePreference = prefersDarkMode ? 'enabled' : 'disabled';
        localStorage.setItem('darkMode', darkModePreference);
    }
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});
themeToggleButton.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        statusMessage.textContent = '已切换到深色模式';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        statusMessage.textContent = '已切换到浅色模式';
    }
});
loveButton.addEventListener('click', function () {
    const dragDropArea = document.getElementById('drag-drop-area');
    const buttons = dragDropArea.querySelectorAll('.button');
    const currentDate = new Date();
    const monthDay = ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2);
    const period = currentDate.getHours() < 12 ? "A" : "P";
    const currentPeriodKey = `${monthDay}-${period}`;
    let lastPeriod = localStorage.getItem('lastPeriod');
    let sequence = localStorage.getItem('currentSequence');
    if (!sequence || lastPeriod !== currentPeriodKey) {
        sequence = 1;
    } else {
        sequence = parseInt(sequence) + 1;
    }
    localStorage.setItem('currentSequence', sequence.toString());
    localStorage.setItem('lastPeriod', currentPeriodKey);
    const dir = `${monthDay}-${period}-${("0" + sequence).slice(-2)}`;
    const newEntries = [];
    buttons.forEach(button => {
        const text = button.getAttribute('data-text');
        const fullText = button.textContent;
        let lang_zh = '';
        const match = fullText.match(/\(([^)]+)\)$/);
        if (match) {
            lang_zh = match[1];
        }
        if (text) {
            newEntries.push({
                text: text,
                lang_zh: lang_zh,
                dir: dir,
                superType: '收藏'
            });
        }
    });
    if (newEntries.length > 0) {
        let csvData = localStorage.getItem('parsedCSVData');
        if (csvData) {
            csvData = JSON.parse(csvData);
        } else {
            csvData = [];
        }
        csvData = csvData.concat(newEntries);
        localStorage.setItem('parsedCSVData', JSON.stringify(csvData));
        createMainMenu(csvData);
        statusMessage.textContent = '已收藏';
    } else {
        statusMessage.textContent = '没有可收藏的内容';
    }
});
statusMessage.addEventListener('click', function () {
    const downloadLink = document.createElement('a');
    downloadLink.href = chrome.runtime.getURL('prompts.csv');
    downloadLink.download = 'prompts.csv';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    const csvData = localStorage.getItem('parsedCSVData');
    if (csvData) {
        const parsedData = JSON.parse(csvData);
        const csvContent = convertToCSV(parsedData);
        downloadCSV(csvContent, 'updated_prompts.csv');
    } else {
        alert('没有更新的 CSV 数据');
    }
});
function convertToCSV(data) {
    const header = ['text', 'lang_zh', 'dir', 'superType'];
    const csvRows = [];
    csvRows.push(header.join(','));
    data.forEach(item => {
        const row = [item.text, item.lang_zh, item.dir, item.superType].map(field => `"${field}"`);
        csvRows.push(row.join(','));
    });
    return csvRows.join('\n');
}
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
uploadButton.addEventListener('click', function () {
    fileInput.click();
});
fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (file) {
        parseCSVFile(file);
    } else {
        statusMessage.textContent = '没有CSV';
    }
});
clearButton.addEventListener('click', function () {
    const nonFixedButtons = dragDropArea.querySelectorAll('.button:not(.fixed)');
    nonFixedButtons.forEach(button => dragDropArea.removeChild(button));
    const fixedButtons = Array.from(dragDropArea.querySelectorAll('.button.fixed'));
    const frontFixedButtons = fixedButtons.filter(button => button.getAttribute('data-fixed-position') === 'front');
    const backFixedButtons = fixedButtons.filter(button => button.getAttribute('data-fixed-position') !== 'front');
    dragDropArea.innerHTML = '';
    frontFixedButtons.forEach(button => dragDropArea.appendChild(button));
    backFixedButtons.forEach(button => dragDropArea.appendChild(button));
    const textarea = document.querySelector('textarea[placeholder="Imagine..."]');
    if (textarea) {
        textarea.value = '';
    }
});




document.addEventListener('DOMContentLoaded', function () {
    const setButton = document.getElementById('set-button');
    if (setButton) {
        setButton.addEventListener('click', function (event) {
            event.preventDefault();
            showSettingsDialog();
        });
    } else {
        console.error('未找到 id 为 "set-button" 的按钮元素。');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    submitButton.addEventListener('click', () => {
        const inputValue = inputBox.value.trim();
        if (inputValue === '') {
            statusMessage.textContent = '请先输入内容！';
            inputBox.focus();
            return;
        }
        const newButton = createButton(inputValue, inputValue);
        dragDropArea.appendChild(newButton);
        inputBox.value = '';
    });
});


document.addEventListener('DOMContentLoaded', function () {
    /* 主分隔线相关元素 */
    const mainDivider = document.querySelector('.divider');
    const upperSection = document.getElementById('upper-section');
    const lowerSection = document.getElementById('lower-section');
    const sidebarContainer = document.getElementById('sidebar-container');

    /* 上部分分隔线相关元素 */
    const upDivider = document.querySelector('.up-divider');
    const itemContainer = document.getElementById('item-container');
    const subcategoryList = document.getElementById('subcategory-list');

    /*** 主分隔线拖动逻辑 ***/
    let isMainDragging = false;

    mainDivider.addEventListener('mousedown', function (e) {
        e.preventDefault();
        isMainDragging = true;

        const startY = e.clientY;
        const containerHeight = sidebarContainer.getBoundingClientRect().height;
        const upperFlex = parseFloat(getComputedStyle(upperSection).flex);
        const lowerFlex = parseFloat(getComputedStyle(lowerSection).flex);

        function onMainMouseMove(e) {
            if (!isMainDragging) return;

            const deltaY = e.clientY - startY;
            const deltaFlex = (deltaY / containerHeight) * 10; // 基准数为10，可根据需求调整

            let newUpperFlex = upperFlex + deltaFlex;
            let newLowerFlex = lowerFlex - deltaFlex;

            const minFlex = 2; // 设置最小flex值以防止区域过小

            if (newUpperFlex < minFlex) {
                newUpperFlex = minFlex;
                newLowerFlex = upperFlex + lowerFlex - minFlex;
            } else if (newLowerFlex < minFlex) {
                newLowerFlex = minFlex;
                newUpperFlex = upperFlex + lowerFlex - minFlex;
            }

            upperSection.style.flex = newUpperFlex;
            lowerSection.style.flex = newLowerFlex;
        }

        function onMainMouseUp() {
            isMainDragging = false;
            document.removeEventListener('mousemove', onMainMouseMove);
            document.removeEventListener('mouseup', onMainMouseUp);
        }

        document.addEventListener('mousemove', onMainMouseMove);
        document.addEventListener('mouseup', onMainMouseUp);
    });



    /*** 上部分分隔线拖动逻辑 ***/
    let isUpDragging = false;

    upDivider.addEventListener('mousedown', function (e) {
        e.preventDefault();
        isUpDragging = true;

        const startY = e.clientY;
        const upperSectionHeight = upperSection.getBoundingClientRect().height;
        const itemHeight = itemContainer.getBoundingClientRect().height;
        const categoryrHeight = subcategoryList.getBoundingClientRect().height;

        function onUpMouseMove(e) {
            if (!isUpDragging) return;

            const deltaY = e.clientY - startY;

            let newItemHeight = itemHeight + deltaY;
            let newCategoryrHeight = categoryrHeight - deltaY;


            // 计算flex比例
            const itemFlex = newItemHeight / upperSectionHeight * 7;
            const categoryrFlex = newCategoryrHeight / upperSectionHeight * 7;

            const minFlex = 1;

            if (itemFlex < minFlex) {
                itemFlex = minFlex;
                itemContainer.style.flex = itemFlex;
                subcategoryList.style.flex = '1 1 auto';
            } else if (categoryrFlex < minFlex) {
                categoryrFlex = minFlex;
                subcategoryList.style.flex = categoryrFlex;
                itemContainer.style.flex = '1 1 auto';
            } else {
                itemContainer.style.flex = itemFlex;
                subcategoryList.style.flex = categoryrFlex;
            }

        }

        function onUpMouseUp() {
            isUpDragging = false;
            document.removeEventListener('mousemove', onUpMouseMove);
            document.removeEventListener('mouseup', onUpMouseUp);
        }

        document.addEventListener('mousemove', onUpMouseMove);
        document.addEventListener('mouseup', onUpMouseUp);
    });

});