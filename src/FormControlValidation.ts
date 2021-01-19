/**
 * Input validation of form control
 */
export default class {
	#thisElement: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement; // 対象要素

	#invalidClassName: string | undefined; // invalid 時に追加するクラス名
	#messageElement: HTMLElement; // バリデーションメッセージを表示する要素
	#patternMessage: string | undefined; // pattern 属性値にマッチしない場合のエラー文言

	/**
	 * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} thisElement - Target element
	 * @param {string} invalidClassName - Class name to be added when invalid
	 */
	constructor(thisElement: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, invalidClassName?: string) {
		this.#thisElement = thisElement;
		this.#invalidClassName = invalidClassName;

		const messageElementId = this.#thisElement.dataset.validationMessageFor;
		if (messageElementId === undefined) {
			throw new Error('Attribute: `data-validation-message-for` is not set.');
		}

		const messageElement = document.getElementById(messageElementId);
		if (messageElement === null) {
			throw new Error(`Element: #${messageElementId} can not found.`);
		}
		messageElement.setAttribute('role', 'alert');
		messageElement.setAttribute('aria-live', 'assertive');
		this.#messageElement = messageElement;

		const patternMessage = this.#thisElement.dataset.validationMessagePattern;
		if (patternMessage !== undefined) {
			this.#patternMessage = patternMessage;
		}

		const changeEventListener = this._changeEvent.bind(this);
		const invalidEventListener = this._invalidEvent.bind(this);

		this.#thisElement.addEventListener('change', changeEventListener, { passive: true });
		this.#thisElement.addEventListener('invalid', invalidEventListener);
	}

	/**
	 * フォームコントロールの内容が変更されたときの処理
	 */
	private _changeEvent(): void {
		if (this.#thisElement.type === 'radio') {
			for (const validationTargetElement of <NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>>(
				document.getElementsByName(this.#thisElement.name)
			)) {
				/* バリデーション文言をいったんクリア */
				this._clearMessage(validationTargetElement);

				if (!validationTargetElement.validity.valid) {
					/* バリデーション文言を設定 */
					validationTargetElement.dispatchEvent(new UIEvent('invalid'));
				}
			}
		} else {
			/* バリデーション文言をいったんクリア */
			this._clearMessage(this.#thisElement);

			if (!this.#thisElement.validity.valid) {
				/* バリデーション文言を設定 */
				this.#thisElement.dispatchEvent(new UIEvent('invalid'));
			}
		}
	}

	/**
	 * Invalid 発生時の処理
	 *
	 * @param {Event} ev - Event
	 */
	private _invalidEvent(ev: Event): void {
		/* バリデーション文言を設定する */
		let message = this.#thisElement.validationMessage; // ブラウザのデフォルトメッセージ

		const validity = this.#thisElement.validity;
		if (!validity.valueMissing) {
			if (validity.patternMismatch && this.#patternMessage !== undefined) {
				/* data-* 属性でカスタムエラー文言が設定されている場合 */
				message = this.#patternMessage;
			}
		}

		this._setMessage(this.#thisElement, message);

		ev.preventDefault();
	}

	/**
	 * カスタムバリデーション文言を設定
	 *
	 * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} formCtrlElement - フォームコントロール要素
	 * @param {string} message - カスタムバリデーション文言
	 */
	private _setMessage(formCtrlElement: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, message: string): void {
		if (this.#invalidClassName !== undefined) {
			formCtrlElement.classList.add(this.#invalidClassName);
		}
		formCtrlElement.setCustomValidity(message);

		this.#messageElement.hidden = false;
		this.#messageElement.textContent = message;
	}

	/**
	 * カスタムバリデーション文言を削除
	 *
	 * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} formCtrlElement - フォームコントロール要素
	 */
	private _clearMessage(formCtrlElement: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
		if (this.#invalidClassName !== undefined) {
			formCtrlElement.classList.remove(this.#invalidClassName);
		}
		formCtrlElement.setCustomValidity('');

		this.#messageElement.hidden = true;
		this.#messageElement.textContent = '';
	}
}
