const CATEGORIES = [
	{ value: 'general',     label: 'General' },
	{ value: 'home',        label: 'Home & Garden' },
	{ value: 'errands',     label: 'Errands' },
	{ value: 'transport',   label: 'Transport' },
	{ value: 'education',   label: 'Education' },
	{ value: 'tech',        label: 'Tech Help' },
	{ value: 'health',      label: 'Health & Wellness' },
	{ value: 'pets',        label: 'Pets' },
	{ value: 'other',       label: 'Other' },
];

let selectedType = null;
let selectedCategory = 'general';

function initCustomization() {
	const typeBtns = document.querySelectorAll('[data-post-type]');
	const categorySelect = document.getElementById('post-category');

	typeBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			typeBtns.forEach(b => b.classList.remove('type-active'));
			btn.classList.add('type-active');
			selectedType = btn.dataset.postType;
		});
	});

	if (categorySelect) {
		CATEGORIES.forEach(({ value, label }) => {
			const opt = document.createElement('option');
			opt.value = value;
			opt.textContent = label;
			categorySelect.appendChild(opt);
		});

		categorySelect.addEventListener('change', () => {
			selectedCategory = categorySelect.value;
		});
	}
}

function getCustomizationValues() {
	return { type: selectedType, category: selectedCategory };
}

function validateCustomization({ type }) {
	if (!type) return 'Please select whether this is a request or an offer.';
	return null;
}

export { initCustomization, getCustomizationValues, validateCustomization, CATEGORIES };