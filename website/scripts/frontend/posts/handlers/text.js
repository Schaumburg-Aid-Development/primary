const TITLE_MAX = 80;
const DESC_MAX = 500;

function initTextHandlers() {
	const titleInput = document.getElementById('post-title');
	const descInput = document.getElementById('post-description');
	const titleCount = document.getElementById('title-count');
	const descCount = document.getElementById('desc-count');

	if (titleInput && titleCount) {
		titleInput.addEventListener('input', () => {
			const len = titleInput.value.length;
			titleCount.textContent = `${len} / ${TITLE_MAX}`;
			titleCount.classList.toggle('post-count-warn', len > TITLE_MAX * 0.85);
			titleCount.classList.toggle('post-count-over', len > TITLE_MAX);
		});
	}

	if (descInput && descCount) {
		descInput.addEventListener('input', () => {
			const len = descInput.value.length;
			descCount.textContent = `${len} / ${DESC_MAX}`;
			descCount.classList.toggle('post-count-warn', len > DESC_MAX * 0.85);
			descCount.classList.toggle('post-count-over', len > DESC_MAX);
		});
	}
}

function getTextValues() {
	const title = document.getElementById('post-title')?.value.trim() || '';
	const description = document.getElementById('post-description')?.value.trim() || '';
	return { title, description };
}

function validateText({ title, description }) {
	if (!title) return 'Please enter a title.';
	if (title.length > TITLE_MAX) return `Title must be ${TITLE_MAX} characters or less.`;
	if (!description) return 'Please enter a description.';
	if (description.length > DESC_MAX) return `Description must be ${DESC_MAX} characters or less.`;
	return null;
}

export { initTextHandlers, getTextValues, validateText, TITLE_MAX, DESC_MAX };