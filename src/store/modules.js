// All store modules
import { initModules } from './initModules';

export default initModules(import.meta.globEager('./*/*.{js,ts}'));
