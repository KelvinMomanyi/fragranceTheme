if (!customElements.get('show-more-button')) {
    customElements.define(
        'show-more-button',
        class ShowMoreButton extends HTMLElement {
            constructor() {
                super();
                const button = this.querySelector('button');
                button.addEventListener('click', (event) => {
                    this.expandShowMore(event);
                    const nextElementToFocus = event.target.closest('.parent-display').querySelector('.show-more-item');
                    if (nextElementToFocus && !nextElementToFocus.classList.contains('hidden') && nextElementToFocus.querySelector('input')) {
                        nextElementToFocus.querySelector('input').focus();
                    }
                });
            }
            expandShowMore(event) {
                const parentDisplay = event.target.closest('[id^="Show-More-"]').closest('.parent-display');
                const parentWrap = parentDisplay.querySelector('.parent-wrap');
                this.querySelectorAll('.label-text').forEach((element) => element.classList.toggle('hidden'));
                parentDisplay.querySelectorAll('.show-more-item').forEach((item) => item.classList.toggle('hidden'));
                if (!this.querySelector('.label-show-less')) {
                    this.classList.add('hidden');
                }
            }
        }
    );
}

if (!customElements.get('show-more-component')) {
    customElements.define(
        'show-more-component',
        class ShowMoreComponent extends HTMLElement {
            constructor() {
                super();
            }

            connectedCallback() {
                this.button = this.querySelector('.show-more__button');
                if (this.button) {
                    this.button.addEventListener('click', this.toggle.bind(this));
                }
            }

            disconnectedCallback() {
                if (this.button) {
                    this.button.removeEventListener('click', this.toggle);
                }
            }

            toggle() {
                const isExpanded = this.dataset.expanded === 'true';
                this.dataset.expanded = (!isExpanded).toString();

                const items = this.querySelectorAll('[ref="showMoreItems[]"]');
                items.forEach((item) => {
                    if (isExpanded) {
                        item.classList.add('hidden');
                    } else {
                        item.classList.remove('hidden');
                    }
                });

                const moreLabel = this.querySelector('.show-more__label--more');
                const lessLabel = this.querySelector('.show-more__label--less');

                if (moreLabel && lessLabel) {
                    moreLabel.classList.toggle('hidden', !isExpanded);
                    lessLabel.classList.toggle('hidden', isExpanded);
                }

                if (this.button) {
                    this.button.setAttribute('aria-expanded', (!isExpanded).toString());
                }
            }
        }
    );
}
