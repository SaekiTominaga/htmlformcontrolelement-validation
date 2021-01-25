/**
 * Input validation of form control
 */
export default class {
    #private;
    /**
     * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} thisElement - Target element
     * @param {string} invalidClassName - Class name to be added when invalid
     */
    constructor(thisElement: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, invalidClassName?: string);
    /**
     *
     */
    init(): void;
    /**
     * フォームコントロールの内容が変更されたときの処理
     */
    private _changeEvent;
    /**
     * Invalid 発生時の処理
     *
     * @param {Event} ev - Event
     */
    private _invalidEvent;
    /**
     * カスタムバリデーション文言を設定
     *
     * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} formCtrlElement - フォームコントロール要素
     * @param {string} message - カスタムバリデーション文言
     */
    private _setMessage;
    /**
     * カスタムバリデーション文言を削除
     *
     * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} formCtrlElement - フォームコントロール要素
     */
    private _clearMessage;
}
//# sourceMappingURL=FormControlValidation.d.ts.map