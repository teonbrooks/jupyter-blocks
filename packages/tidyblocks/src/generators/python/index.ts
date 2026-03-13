// Register all Python generators for tidyblocks block types.
// Import order matches block dependency (data → transform → combine → value → op → plot → stats).
import './data';
import './value';
import './op';
import './transform';
import './combine';
import './plot';
import './stats';
