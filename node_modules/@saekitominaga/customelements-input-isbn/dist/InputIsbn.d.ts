/**
 * ISBN input field
 */
export default class InputIsbn extends HTMLInputElement {
    #private;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * フォームコントロールの内容が変更されたときの処理
     */
    private _changeEvent;
    /**
     * フォーム送信時の処理
     *
     * @param {Event} ev - Event
     */
    private _formSubmitEvent;
    /**
     * 入力値を変換（整形）する
     */
    private _convertValue;
    /**
     * バリデーションを実行
     *
     * @returns {boolean} バリデーションが通れば true
     */
    private _validate;
    /**
     * カスタムバリデーション文言を設定
     *
     * @param {string} message - カスタムバリデーション文言
     */
    private _setMessage;
    /**
     * カスタムバリデーション文言を削除
     */
    private _clearMessage;
}
//# sourceMappingURL=InputIsbn.d.ts.map