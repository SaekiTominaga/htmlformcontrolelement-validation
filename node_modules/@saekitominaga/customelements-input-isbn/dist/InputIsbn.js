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
var _checkDigitMessage, _formSubmitEventListener;
import IsbnVerify from '../../isbn-verify/dist/ISBN.js';
/**
 * ISBN input field
 */
export default class InputIsbn extends HTMLInputElement {
    constructor() {
        super();
        _checkDigitMessage.set(this, void 0); // チェックデジットが不正なときのメッセージ
        _formSubmitEventListener.set(this, void 0);
        __classPrivateFieldSet(this, _formSubmitEventListener, this._formSubmitEvent.bind(this));
    }
    connectedCallback() {
        const isbnCheckDigitMessage = this.dataset.validationMessageIsbnCheckdigit;
        if (isbnCheckDigitMessage === undefined) {
            throw new Error('Attribute: `data-validation-message-isbn-checkdigit` is not set.');
        }
        __classPrivateFieldSet(this, _checkDigitMessage, isbnCheckDigitMessage);
        this.type = 'text';
        this.minLength = 10;
        this.maxLength = 17;
        this.pattern = '(978|979)-\\d{1,5}-\\d{1,7}-\\d{1,7}-\\d|\\d{13}|\\d{1,5}-\\d{1,7}-\\d{1,7}-[\\dX]|\\d{9}[\\dX]';
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
        this.value = this.value.trim();
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
        if (!new IsbnVerify(this.value).isValid()) {
            this._setMessage(__classPrivateFieldGet(this, _checkDigitMessage));
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
_checkDigitMessage = new WeakMap(), _formSubmitEventListener = new WeakMap();
//# sourceMappingURL=InputIsbn.js.map