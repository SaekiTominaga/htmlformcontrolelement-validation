/**
 * Convert date control to <input type=text>
 *
 * @version 1.0.0
 */
export default class InputDateToText extends HTMLInputElement {
	#noexistMessage: string | undefined;

	#min: string | undefined;
	#minMessage: string | undefined;

	#max: string | undefined;
	#maxMessage: string | undefined;

	#formSubmitEventListener: (ev: Event) => void;

	constructor() {
		super();

		this.#formSubmitEventListener = this._formSubmitEvent.bind(this);
	}

	connectedCallback(): void {
		const noexistMessage = this.dataset.validationMessageDateNoexist;
		if (noexistMessage === undefined) {
			throw new Error('Attribute: `data-validation-message-date-noexist` is not set.');
		}
		this.#noexistMessage = noexistMessage;

		/* 日付コントロールを <input type="text"> に置換 */
		if (this.min !== '') {
			const minMessage = this.dataset.validationMessageDateMin;
			if (minMessage === undefined) {
				throw new Error('Attribute: `data-validation-message-date-min` is not set.');
			}

			this.#min = this.min;
			this.#minMessage = minMessage;
			this.removeAttribute('min');
		}

		if (this.max !== '') {
			const maxMessage = this.dataset.validationMessageDateMax;
			if (maxMessage === undefined) {
				throw new Error('Attribute: `data-validation-message-date-max` is not set.');
			}

			this.#max = this.max;
			this.#maxMessage = maxMessage;
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
		this.form?.addEventListener('submit', this.#formSubmitEventListener);
	}

	disconnectedCallback(): void {
		this.removeEventListener('change', this._changeEvent);
		this.form?.removeEventListener('submit', this.#formSubmitEventListener);
	}

	/**
	 * フォームコントロールの内容が変更されたときの処理
	 */
	private _changeEvent(): void {
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
	private _formSubmitEvent(ev: Event): void {
		this._convertValue();

		if (!this._validate()) {
			ev.preventDefault();
		}
	}

	/**
	 * 入力値を変換（整形）する
	 */
	private _convertValue() {
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
		} else {
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
	private _validate(): boolean {
		if (this.value === '') {
			return true;
		}

		const valueYear = Number(this.value.substring(0, 4));
		const valueMonth = Number(this.value.substring(5, 7)) - 1;
		const valueDay = Number(this.value.substring(8, 10));
		const valueDate = new Date(valueYear, valueMonth, valueDay);

		if (valueDate.getFullYear() !== valueYear || valueDate.getMonth() !== valueMonth || valueDate.getDate() !== valueDay) {
			/* 2月30日など存在しない日付の場合 */
			this._setMessage(<string>this.#noexistMessage);
			return false;
		}

		if (
			this.#min !== undefined &&
			valueDate < new Date(Number(this.#min.substring(0, 4)), Number(this.#min.substring(5, 7)) - 1, Number(this.#min.substring(8, 10)))
		) {
			/* min 属性値より過去の日付を入力した場合 */
			this._setMessage(<string>this.#minMessage);
			return false;
		}

		if (
			this.#max !== undefined &&
			valueDate > new Date(Number(this.#max.substring(0, 4)), Number(this.#max.substring(5, 7)) - 1, Number(this.#max.substring(8, 10)))
		) {
			/* max 属性値より未来の日付を入力した場合 */
			this._setMessage(<string>this.#maxMessage);
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
	private _setMessage(message: string): void {
		this.setCustomValidity(message);

		this.dispatchEvent(new Event('invalid'));
	}

	/**
	 * カスタムバリデーション文言を削除
	 */
	private _clearMessage(): void {
		this.setCustomValidity('');
	}
}
