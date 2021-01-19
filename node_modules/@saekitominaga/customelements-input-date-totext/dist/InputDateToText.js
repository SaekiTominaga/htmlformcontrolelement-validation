var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _noexistMessage, _min, _minMessage, _max, _maxMessage, _formSubmitEventListener;
/**
 * Convert date control to <input type=text>
 *
 * @version 1.0.0
 */
export default class InputDateToText extends HTMLInputElement {
    constructor() {
        super();
        _noexistMessage.set(this, void 0);
        _min.set(this, void 0);
        _minMessage.set(this, void 0);
        _max.set(this, void 0);
        _maxMessage.set(this, void 0);
        _formSubmitEventListener.set(this, void 0);
        __classPrivateFieldSet(this, _formSubmitEventListener, this._formSubmitEvent.bind(this));
    }
    connectedCallback() {
        const noexistMessage = this.dataset.validationMessageDateNoexist;
        if (noexistMessage === undefined) {
            throw new Error('Attribute: `data-validation-message-date-noexist` is not set.');
        }
        __classPrivateFieldSet(this, _noexistMessage, noexistMessage);
        /* 日付コントロールを <input type="text"> に置換 */
        if (this.min !== '') {
            const minMessage = this.dataset.validationMessageDateMin;
            if (minMessage === undefined) {
                throw new Error('Attribute: `data-validation-message-date-min` is not set.');
            }
            __classPrivateFieldSet(this, _min, this.min);
            __classPrivateFieldSet(this, _minMessage, minMessage);
            this.removeAttribute('min');
        }
        if (this.max !== '') {
            const maxMessage = this.dataset.validationMessageDateMax;
            if (maxMessage === undefined) {
                throw new Error('Attribute: `data-validation-message-date-max` is not set.');
            }
            __classPrivateFieldSet(this, _max, this.max);
            __classPrivateFieldSet(this, _maxMessage, maxMessage);
            this.removeAttribute('max');
        }
        if (this.step !== '') {
            this.removeAttribute('step'); // TODO step 属性指定時の挙動は未実装
        }
        this.type = 'text';
        this.minLength = 8;
        this.maxLength = 10;
        this.pattern = '([0-9０-９]{8})|([0-9０-９]{4}[-/－／][0-9０-９]{1,2}[-/－／][0-9０-９]{1,2})';
        this.placeholder = 'YYYY-MM-DD';
        this.addEventListener('change', this._changeEvent, { passive: true });
        this.form?.addEventListener('submit', __classPrivateFieldGet(this, _formSubmitEventListener));
    }
    disconnectedCallback() {
        this.removeEventListener('change', this._changeEvent);
        this.form?.removeEventListener('submit', __classPrivateFieldGet(this, _formSubmitEventListener));
    }
    /**
     * フォームコントロールの内容が変更されたときの処理
     */
    _changeEvent() {
        if (this.validity.patternMismatch) {
            /* ブラウザ標準機能によるチェックを優先する */
            return;
        }
        this._convertValue();
        this._validate();
    }
    /**
     * フォーム送信時の処理
     *
     * @param {Event} ev - Event
     */
    _formSubmitEvent(ev) {
        this._convertValue();
        if (!this._validate()) {
            ev.preventDefault();
        }
    }
    /**
     * 入力値を変換（整形）する
     */
    _convertValue() {
        let value = this.value.trim();
        if (value === '') {
            this.value = value;
            return;
        }
        /* 数字を半角化 */
        value = value.replace(/[０-９－／]/g, (str) => String.fromCharCode(str.charCodeAt(0) - 0xfee0));
        if (/^[0-9]{8}$/.test(value)) {
            /* e.g. 20000101 → 2000-01-01 */
            value = `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6)}`;
        }
        else {
            /* e.g. 2000/1/1 → 2000-01-01 */
            value = value
                .replace(/\//g, '-')
                .replace(/-([0-9])-/, '-0$1-')
                .replace(/-([0-9])$/, '-0$1');
        }
        this.value = value;
    }
    /**
     * バリデーションを実行
     *
     * @returns {boolean} バリデーションが通れば true
     */
    _validate() {
        if (this.value === '') {
            return true;
        }
        const valueYear = Number(this.value.substring(0, 4));
        const valueMonth = Number(this.value.substring(5, 7)) - 1;
        const valueDay = Number(this.value.substring(8, 10));
        const valueDate = new Date(valueYear, valueMonth, valueDay);
        if (valueDate.getFullYear() !== valueYear || valueDate.getMonth() !== valueMonth || valueDate.getDate() !== valueDay) {
            /* 2月30日など存在しない日付の場合 */
            this._setMessage(__classPrivateFieldGet(this, _noexistMessage));
            return false;
        }
        if (__classPrivateFieldGet(this, _min) !== undefined &&
            valueDate < new Date(Number(__classPrivateFieldGet(this, _min).substring(0, 4)), Number(__classPrivateFieldGet(this, _min).substring(5, 7)) - 1, Number(__classPrivateFieldGet(this, _min).substring(8, 10)))) {
            /* min 属性値より過去の日付を入力した場合 */
            this._setMessage(__classPrivateFieldGet(this, _minMessage));
            return false;
        }
        if (__classPrivateFieldGet(this, _max) !== undefined &&
            valueDate > new Date(Number(__classPrivateFieldGet(this, _max).substring(0, 4)), Number(__classPrivateFieldGet(this, _max).substring(5, 7)) - 1, Number(__classPrivateFieldGet(this, _max).substring(8, 10)))) {
            /* max 属性値より未来の日付を入力した場合 */
            this._setMessage(__classPrivateFieldGet(this, _maxMessage));
            return false;
        }
        this._clearMessage();
        return true;
    }
    /**
     * カスタムバリデーション文言を設定
     *
     * @param {string} message - カスタムバリデーション文言
     */
    _setMessage(message) {
        this.setCustomValidity(message);
        this.dispatchEvent(new Event('invalid'));
    }
    /**
     * カスタムバリデーション文言を削除
     */
    _clearMessage() {
        this.setCustomValidity('');
    }
}
_noexistMessage = new WeakMap(), _min = new WeakMap(), _minMessage = new WeakMap(), _max = new WeakMap(), _maxMessage = new WeakMap(), _formSubmitEventListener = new WeakMap();
//# sourceMappingURL=InputDateToText.js.map