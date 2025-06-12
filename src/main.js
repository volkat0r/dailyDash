// Import Styles
import './styles/main.scss';

// UI
import './js/ui/toggleDarkMode.js';

// Components
import './js/components/dashboard.js';
import './js/components/widget.js';

// Widgets
import { clockWidget } from './js/components/widgets/clockWidget.js';

// Utils
import './js/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  clockWidget();
});