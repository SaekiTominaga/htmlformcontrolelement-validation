import IsbnVerify from '@saekitominaga/isbn-verify';

/**
 * ISBN input field
 */
export default class InputIsbn extends HTMLInputElement {
	#checkDigitMessage!: string; // チェックデジットが不正なときのメッセージ

	readonly #formSubmitEventListener: (ev: Event) => void;

	constructor() {
		super();

		this.#formSubmitEventListener = this._formSubmitEvent.bind(this);
	}

	connectedCallback(): void {
		const isbnCheckDigitMessage = this.dataset.validationMessageIsbnCheckdigit;
		if (isbnCheckDigitMessage === undefined) {
			throw new Error('Attribute: `data-validation-message-isbn-checkdigit` is not set.');
		}
		this.#checkDigitMessage = isbnCheckDigitMessage;

		this.type = 'text';
		this.minLength = 10;
		this.maxLength = 17;
		this.pattern = '(978|979)-\\d{1,5}-\\d{1,7}-\\d{1,7}-\\d|\\d{13}|\\d{1,5}-\\d{1,7}-\\d{1,7}-[\\dX]|\\d{9}[\\dX]';

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
		this.value = this.value.trim();
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

		if (!new IsbnVerify(this.value).isValid()) {
			this._setMessage(this.#checkDigitMessage);

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
