# Flair Tagging — Feature Overview

## Layout & Navigation

### Single-Page Layout
Posting and Discussion live on one scrolling page — no tabs. The post composer sits at the top, and the discussion feed follows below it.

### Desktop-First Design
The app is optimised for desktop at a max-width of 1100px, single-column layout with generous horizontal padding.

### App Header
A sticky header at the top of the page shows:
- The Fandom logo (in a white tile) alongside the current context title (e.g. "Fandom Discussions" or "{wiki_name} Discussions")
- When a wiki is selected, a "powered by Fandom" subtitle appears

---

## Current Features - Posting

### "What's on Your Mind?" Entry Point
A prompt box labeled **"What's on your mind?"** is displayed at the top of the page. Clicking it opens the post composer.

### Post Composer
An editable overlay/modal that supports three content types:
- **Text** — freeform written content
- **Image** — photo or media upload
- **Link** — embedded URL with preview

The composer always renders in a light theme regardless of the active wiki theme.

### Flair Selection
In the top-right corner of the post composer, a flair picker lets the user assign a category to their post before submitting.

Selecting a flair is optional; posts without one will not display a category badge.

---

## Current Features - Discussion

Brief term explanation: a **thread** is a top-level discussion; a **post** (or **reply**) is an individual reply within a thread.

### Data & Thread Model
Thread data is loaded from a flat JSON export where each record is a single post (`op` or `reply`). On load the app groups records by `thread_id` to reconstruct threads. Each thread's title, author, date, and category come from its original post (`op`); reply count and total likes are aggregated across all posts in the thread.

### Controls Panel
The wiki filter, category tabs, and search & sort controls are grouped together in a single card above the thread list for visual clarity.

### Wiki Filtering
A search-as-you-type input with a dropdown lets users scope the thread list to **one** wiki. Selecting a wiki also triggers a full theme change (see Wiki-Based Theming). An × button clears the selection and returns to the all-wikis default.

By default threads from all wikis are shown.

### Category Tabs (Flair Tabs)
Pill-shaped tabs filter threads by category. Each tab includes an emoji icon.

Category values are derived dynamically from the data, so new categories appear automatically without code changes. The default view is **All**.

### Category Badge (Flair Badge)
Each thread card and the thread detail view display a small pill badge showing the thread's category with its matching emoji (e.g. 📖 Fanfic). Threads with no assigned category are not shown a badge.

### Keyword Search
A search bar filters the visible thread list in real time, matching the keyword against both the thread **title** and **content**.

### Sort Pills
Three inline sort options reorder the thread list:
- 🕐 **Latest** — most recently active thread first (based on the newest post in the thread)
- ❤️ **Most Liked** — threads with the highest total likes across all posts first
- 💬 **Most Replies** — threads with the most replies first

### Thread Cards
Each thread is displayed as a card showing:
- Author avatar (coloured circle with initial letter, colour deterministically derived from username), name, and relative post date
- Category badge with emoji
- Thread title and a short content excerpt (up to 120 characters)
- Reply count and an interactive ❤️ like button with running total

Cards have a subtle lift-and-glow hover effect styled to match the active wiki theme.

### Interactive Likes
Users can like individual threads and replies directly:
- **Thread card**: clicking ❤️ in the card footer increments the like count; clicking again undoes it. The heart turns red when liked. Click is isolated so it does not open the thread detail.
- **Thread detail — original post & replies**: each post has a ❤️ button at its bottom-right showing the count below the heart. Clicking toggles the liked state, increments or decrements the count, and adds a gold left border to the reply to mark it as liked by the user.

### Thread Detail View
Clicking a thread card opens a full detail view. The post composer disappears while the detail is open; it reappears when the user returns to the thread list.

The detail view shows:
- Complete original post content, author, date, category badge, and a ❤️ like button
- All replies in chronological order, each with author, timestamp, content, and a ❤️ like button (count shown below the heart); replies liked by the user get a gold left border
- User-submitted replies appear at the bottom of the list immediately after posting

A **← Back** button returns to the thread list.

### Reply Composer
A floating reply bar is pinned to the bottom of the viewport when a thread detail is open. It contains a textarea (expands up to 140 px as the user types) and a **Reply** button that is disabled until text is entered. Submitted replies are added to the thread immediately under the username "You" and receive their own like button. The bar uses the active wiki theme colours.

---

## Wiki-Based Theming

Selecting a wiki triggers a full visual theme change applied across the entire page via CSS custom properties. Three wikis have rich image-backed themes; the remaining wikis receive colour-only theming.

### Harry Potter
- **Header**: Hogwarts-at-night image (`harry-potter-2.jpg`) with a dark navy left-fade gradient and a gold bottom border
- **Palette**: Dark navy background (`#080C18`), dark blue-grey cards, warm parchment text (`#E8DCC8`), gold accent (`#C9A84C`)
- **Effects**: Gold glow on card hover and controls panel
- **Decorations**: ⚡ 🏰 🪄 🦉

### Dandy's World Wiki
- **Header**: Colourful cast image (`dandy-1.jpg`) with a pink-purple gradient overlay and a hot-pink bottom border
- **Palette**: Pastel pink background, white cards with pink border, hot pink accent (`#FF4FAD`)
- **Effects**: Pink glow on active tabs and card hover
- **Decorations**: 👁️ 🎪 🃏 💀

### Hunger Games
- **Header**: Katniss poster (`hunger-game-2.jpg`) with a near-black left-fade gradient and an amber bottom border
- **Palette**: Near-black background (`#080402`), dark ember cards, warm tan text (`#F0DEB8`), fire-gold accent (`#E8A020`)
- **Effects**: Ember glow on controls panel and card hover; active sort pills use fire-gold background
- **Decorations**: 🔥 🏹 🪶 ⚔️

### All Other Wikis
Receive their own accent colour, light badge tint, and subtle background colour — no image header. Examples include purple for Dragon Adventures, green for Grow a Garden, teal for One Piece, etc.

### Default (Fandom)
Hot pink accent (`#E8375C`) on a warm cream background (`#FDF5EC`), representing the Fandom brand. Applied whenever no wiki is selected.

All theme transitions are animated (CSS `transition` on background, border, and colour properties).
