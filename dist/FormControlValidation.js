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
var _thisElement, _invalidClassName, _messageElement, _patternMessage, _changeEventListener, _invalidEventListener;
/**
 * Input validation of form control
 */
export default class {
    /**
     * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} thisElement - Target element
     * @param {string} invalidClassName - Class name to be added when invalid
     */
    constructor(thisElement, invalidClassName) {
        _thisElement.set(this, void 0); // 対象要素
        _invalidClassName.set(this, void 0); // invalid 時に追加するクラス名
        _messageElement.set(this, void 0); // バリデーションメッセージを表示する要素
        _patternMessage.set(this, void 0); // pattern 属性値にマッチしない場合のエラー文言
        _changeEventListener.set(this, void 0);
        _invalidEventListener.set(this, void 0);
        __classPrivateFieldSet(this, _thisElement, thisElement);
        __classPrivateFieldSet(this, _invalidClassName, invalidClassName);
        __classPrivateFieldSet(this, _changeEventListener, this._changeEvent.bind(this));
        __classPrivateFieldSet(this, _invalidEventListener, this._invalidEvent.bind(this));
    }
    /**
     * Initial processing
     */
    init() {
        const messageElementId = __classPrivateFieldGet(this, _thisElement).dataset.validationMessageFor;
        if (messageElementId === undefined) {
            throw new Error('Attribute: `data-validation-message-for` is not set.');
        }
        const messageElement = document.getElementById(messageElementId);
        if (messageElement === null) {
            throw new Error(`Element: #${messageElementId} can not found.`);
        }
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'assertive');
        __classPrivateFieldSet(this, _messageElement, messageElement);
        const patternMessage = __classPrivateFieldGet(this, _thisElement).dataset.validationMessagePattern;
        if (patternMessage !== undefined) {
            __classPrivateFieldSet(this, _patternMessage, patternMessage);
        }
        __classPrivateFieldGet(this, _thisElement).addEventListener('change', __classPrivateFieldGet(this, _changeEventListener), { passive: true });
        __classPrivateFieldGet(this, _thisElement).addEventListener('invalid', __classPrivateFieldGet(this, _invalidEventListener));
    }
    /**
     * フォームコントロールの内容が変更されたときの処理
     */
    _changeEvent() {
        if (__classPrivateFieldGet(this, _thisElement).type === 'radio') {
            for (const validationTargetElement of (document.getElementsByName(__classPrivateFieldGet(this, _thisElement).name))) {
                /* バリデーション文言をいったんクリア */
                this._clearMessage(validationTargetElement);
                if (!validationTargetElement.validity.valid) {
                    /* バリデーション文言を設定 */
                    validationTargetElement.dispatchEvent(new UIEvent('invalid'));
                }
            }
        }
        else {
            /* バリデーション文言をいったんクリア */
            this._clearMessage(__classPrivateFieldGet(this, _thisElement));
            if (!__classPrivateFieldGet(this, _thisElement).validity.valid) {
                /* バリデーション文言を設定 */
                __classPrivateFieldGet(this, _thisElement).dispatchEvent(new UIEvent('invalid'));
            }
        }
    }
    /**
     * Invalid 発生時の処理
     *
     * @param {Event} ev - Event
     */
    _invalidEvent(ev) {
        /* バリデーション文言を設定する */
        let message = __classPrivateFieldGet(this, _thisElement).validationMessage; // ブラウザのデフォルトメッセージ
        const validity = __classPrivateFieldGet(this, _thisElement).validity;
        if (!validity.valueMissing) {
            if (validity.patternMismatch && __classPrivateFieldGet(this, _patternMessage) !== undefined) {
                /* data-* 属性でカスタムエラー文言が設定されている場合 */
                message = __classPrivateFieldGet(this, _patternMessage);
            }
        }
        this._setMessage(__classPrivateFieldGet(this, _thisElement), message);
        ev.preventDefault();
    }
    /**
     * カスタムバリデーション文言を設定
     *
     * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} formCtrlElement - フォームコントロール要素
     * @param {string} message - カスタムバリデーション文言
     */
    _setMessage(formCtrlElement, message) {
        if (__classPrivateFieldGet(this, _invalidClassName) !== undefined) {
            formCtrlElement.classList.add(__classPrivateFieldGet(this, _invalidClassName));
        }
        formCtrlElement.setCustomValidity(message);
        __classPrivateFieldGet(this, _messageElement).hidden = false;
        __classPrivateFieldGet(this, _messageElement).textContent = message;
    }
    /**
     * カスタムバリデーション文言を削除
     *
     * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} formCtrlElement - フォームコントロール要素
     */
    _clearMessage(formCtrlElement) {
        if (__classPrivateFieldGet(this, _invalidClassName) !== undefined) {
            formCtrlElement.classList.remove(__classPrivateFieldGet(this, _invalidClassName));
        }
        formCtrlElement.setCustomValidity('');
        __classPrivateFieldGet(this, _messageElement).hidden = true;
        __classPrivateFieldGet(this, _messageElement).textContent = '';
    }
}
_thisElement = new WeakMap(), _invalidClassName = new WeakMap(), _messageElement = new WeakMap(), _patternMessage = new WeakMap(), _changeEventListener = new WeakMap(), _invalidEventListener = new WeakMap();
//# sourceMappingURL=FormControlValidation.js.map