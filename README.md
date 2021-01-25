# Input validation of form control

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fhtmlformcontrolelement-validation.svg)](https://badge.fury.io/js/%40saekitominaga%2Fhtmlformcontrolelement-validation)

## Demo

- [Demo page](https://saekitominaga.github.io/htmlformcontrolelement-validation/demo.html)

## Examples

```HTML
<script type="module">
import FormControlValidation from './dist/FormControlValidation.js';

for (const formControlElement of document.querySelectorAll('.js-validation')) {
  const formControlValidation = new FormControlValidation(formControlElement);
  formControlValidation.init();
}
</script>

<p><input class="js-validation" pattern="[a-zA-Z0-9]+"
  data-validation-message-for="validation-input-1"
  data-validation-message-pattern="Only alphanumeric characters can be used."
/></p>
<p hidden="" id="validation-input-1"></p>
```

## Constructor

```TypeScript
new FormControlValidation(
  thisElement: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  invalidClassName?: string
)
```

### Parameters

<dl>
<dt>thisElement [required]</dt>
<dd>Target element</dd>
<dt>invalidClassName [optional]</dt>
<dd>Class name to be added when invalid</dd>
</dl>

## HTMLElement Attributes

<dl>
<dt>data-validation-message-for [required]</dt>
<dd>ID of the element that displays the validation message.</dd>
<dt>data-validation-message-pattern [optional]</dt>
<dd>Error message when it does not match the pattern attribute value. (If omitted, the default message of the browser is displayed.)</dd>
</dl>
