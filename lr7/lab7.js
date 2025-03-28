const jcISJS = 'O0I1lLg9qSs5Zz2E3F7JjKkXxCcVvNnMm';

const jm7EkV = new Set([
    'function', 'const', 'let', 'var', 'class', 'async', 'await',
    'return', 'try', 'catch', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'break', 'continue', 'throw', 'new', 'this',
    'typeof', 'instanceof', 'void', 'delete', 'in', 'of', 'yield',
    'export', 'import', 'default', 'extends', 'super', 'static',
    'Blob', 'type', 'Set', 'addEventListener','FileReader','Map','RegExp'
]);

function VMsc53(length = 6) {
    let hm2COn = '';
    hm2COn += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 53)];
    for (let Gk3MmL = 1; Gk3MmL < length; Gk3MmL++) {
        const pS0KKF = jcISJS[Math.floor(Math.random() * jcISJS.length)];
        hm2COn += pS0KKF;
    }
    return hm2COn;
}

function ZgZZIN(snXvFz) {
    const o0MgcL = new Set();

    const eE3ZmS = [];
    let A0IL1c = snXvFz.replace(/(['"`])(?:\\\1|.)*?\1/g, function (wckM5K) {
        eE3ZmS.push(wckM5K);
        return `__RESERVED_PART_` + (eE3ZmS.length - 1)  + `__`;
    }).replace(/\/(?:\\\/|.)*?\/[gimuy]*/g, function (wckM5K) {
        eE3ZmS.push(wckM5K);
        return `__RESERVED_PART_` + (eE3ZmS.length - 1)  + `__`;
    });

    const mMjvk9 = /(\w+)\.(\w+)(?:\s*\()?/g;
    let wckM5K;
    while ((wckM5K = mMjvk9.exec(A0IL1c))) {
        const jnxc2g = wckM5K[2];
        if (!jm7EkV.has(jnxc2g)) {
            A0IL1c = A0IL1c.replace(new RegExp(`\\b`+jnxc2g+`\\s*\\(`, 'g'),
                `__SAFE_METHOD_`+jnxc2g+`__(`);
        }
    }

    const UKVg2I = [
        /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)/g,
        /function\s+([a-zA-Z_$][\w$]*)/g,
        /class\s+([a-zA-Z_$][\w$]*)/g,
        /([a-zA-Z_$][\w$]*)\s*\(/g,
        /([a-zA-Z_$][\w$]*)\s*:/g,
    ];

    UKVg2I.forEach(pattern => {
        let eMZLn9;
        while ((eMZLn9 = pattern.exec(A0IL1c))) {
            const BESq9n = eMZLn9[1];
            if (!jm7EkV.has(BESq9n) &&
                !BESq9n.includes('.') &&
                !BESq9n.startsWith('__SAFE_METHOD_') &&
                !BESq9n.startsWith('__RESERVED_PART_')) {
                o0MgcL.add(BESq9n);
            }
        }
    });

    return o0MgcL;
}

function pjCMIE(snXvFz, o0MgcL) {
    const rzC1mx = new Map();

    o0MgcL.forEach(BESq9n => {
        rzC1mx.set(BESq9n, VMsc53());
    });

    const eE3ZmS = [];
    let tZkEZz = snXvFz.replace(/(['"`])(?:\\\1|.)*?\1/g, function (wckM5K) {
        eE3ZmS.push(wckM5K);
        return `__RESERVED_PART_` + (eE3ZmS.length - 1)  + `__`;
    }).replace(/\/(?:\\\/|.)*?\/[gimuy]*/g, function (wckM5K) {
        eE3ZmS.push(wckM5K);
        return `__RESERVED_PART_` + (eE3ZmS.length - 1)  + `__`;
    });

    tZkEZz = tZkEZz.replace(/(\w+)\.(\w+)(?=\s*\()/g, function (wckM5K, obj, method) {
        return obj+`.__SAFE_METHOD_`+method+`__`;
    });

    rzC1mx.forEach((newName, oldName) => {
        const Rv59ZN = new RegExp(`\\b${oldName}\\b`, 'g');
        tZkEZz = tZkEZz.replace(Rv59ZN, newName);
    });

    tZkEZz = tZkEZz.replace(/__SAFE_METHOD_(\w+)__/g, '$1');

    for (let Gk3MmL = 0; Gk3MmL < eE3ZmS.length; Gk3MmL++) {
        tZkEZz = tZkEZz.replace(`__RESERVED_PART_`+Gk3MmL+`__`, eE3ZmS[Gk3MmL]);
    }

    return tZkEZz;
}


function wkx13q(snXvFz, options = { jXmO11: false }) {
    const { jXmO11 } = options;

    const r1mSKK = [];
    let A0IL1c = snXvFz
        .replace(/(['"`])(?:\\\1|.)*?\1/g, function (wckM5K) {
            r1mSKK.push(wckM5K);
            return `__PROTECTED_STRING_`+(r1mSKK.length - 1)+`__`;
        })
        .replace(/\/(?:\\\/|.)*?\/[gimuy]*/g, function (wckM5K) {
            r1mSKK.push(wckM5K);
            return `__PROTECTED_REGEX_`+(r1mSKK.length - 1)+`__`;
        });

        A0IL1c = A0IL1c.replace(/\/\*[\s\S]*?\*\//g, function (wckM5K) {
            if (jXmO11) {
                return '';
            }
            return '/* ' + VMsc53(10) + ' */';
        });

        A0IL1c = A0IL1c.replace(/\/\/[^\n]*\n?/g, function (wckM5K) {
            if (jXmO11) {
                return '';
            }
            return '// ' + VMsc53(10) + '\n';
        });

        for (let Gk3MmL = 0; Gk3MmL < r1mSKK.length; Gk3MmL++) {
            A0IL1c = A0IL1c.replace(`__PROTECTED_STRING_`+(Gk3MmL)+`__`, r1mSKK[Gk3MmL]);
            A0IL1c = A0IL1c.replace(`__PROTECTED_REGEX_`+(Gk3MmL)+`__`, r1mSKK[Gk3MmL]);
        }

        return A0IL1c;
}


function zqnlEX(snXvFz) {
    const o0MgcL = ZgZZIN(snXvFz);

    snXvFz = pjCMIE(snXvFz, o0MgcL);

    snXvFz = wkx13q(snXvFz);

    return snXvFz;
}

function hIOZjF() {
    const NNFxxl = document.getElementById('fileInput');
    NNFxxl.onchange = function (e) {
        const b7EJ9M = e.target.files[0];
        const u2q7L2 = new FileReader();
        u2q7L2.onload = function (e) {
            document.getElementById('inputCode').value = e.target.result;
        };
        u2q7L2.readAsText(b7EJ9M);
    };
}

hIOZjF();

function UZZ2XE() {
    const D1lqj3 = document.getElementById('inputCode').value;
    const X0jOJv = zqnlEX(D1lqj3);
    document.getElementById('outputCode').value = X0jOJv;
}

function LmcN3g() {
    const snXvFz = document.getElementById('inputCode').value;
    const _g2zO2 = document.getElementById('executionOutput');
    F0lEs5(snXvFz, _g2zO2);
}

function O9kmqM() {
    const snXvFz = document.getElementById('outputCode').value;
    const R0vmg7 = new Blob([snXvFz], { type: 'text/javascript' });
    const vKN5M0 = URL.createObjectURL(R0vmg7);
    const u2qL00 = document.createElement('a');
    u2qL00.href = vKN5M0;
    u2qL00.download = 'obfuscated.js';
    document.body.appendChild(u2qL00);
    u2qL00.click();
    document.body.removeChild(u2qL00);
    URL.revokeObjectURL(vKN5M0);
}

function x9qj79() {
    const snXvFz = document.getElementById('outputCode').value;
    const _g2zO2 = document.getElementById('executionOutput');
    F0lEs5(snXvFz, _g2zO2);
}

function F0lEs5(snXvFz, _g2zO2) {
    _g2zO2.textContent = '';

    try {
        const sVgM5I = console.log;
        let X0jOJv = '';
        console.log = function (...args) {
            X0jOJv += args.join(' ') + '\n';
        };

        Jx7lqX(snXvFz);

        console.log = sVgM5I;

        _g2zO2.textContent = X0jOJv || 'Код выполнен успешно, но вывод отсутствует.';
    } catch (error) {
        _g2zO2.textContent = 'Ошибка выполнения: ' + error.message;
    }
}
