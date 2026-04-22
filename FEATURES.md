# Flair Tagging — Feature Overview

## Current Features - Posting

### "What's on Your Mind?" Entry Point
A prompt box labeled **"What's on your mind?"** is displayed at the top of the discussion feed. Clicking it opens the post composer.

### Post Composer
An editable overlay/modal that supports three content types:
- **Text** — freeform written content
- **Image** — photo or media upload
- **Link** — embedded URL with preview

### Flair Selection
In the top-right corner of the post composer, a flair picker lets the user assign a category to their post before submitting. The available flair terms mirror the discussion tabs:
- FanFic, Trading, Event, Ranking, Poll, New Launch, Opinion, Theories

Selecting a flair is optional; posts without one will not display a category badge in the thread list.

## Current Features - Discussion

### Category aka Flair Tabs
Eight top-level tabs filter threads by type:
- **All** (Including all threads as an overview)
- **FanFic**
- **Trading**
- **Event**
- **Ranking**
- **Poll**
- **New Launch**
- **Opinion**
- **Theories**

The default view is on the **All** tab.

### Category aka Flair Badge
Besides each thread's title, add a small icon indicating the flair it belongs to. If no flair is assigned, then skip.

### Keyword Search
A search bar within each flair filters threads in real time by matching the keyword against both the thread **title** and **content**.

### Sort Pills
Four inline sort options let users reorder the thread list:
- **Latest** — most recently posted first
- **Most Liked** — threads with the most liked replies first
- **Most Replies** — threads with the highest reply count first

### Thread Cards
Each thread is displayed as a card showing:
- Author avatar (initial letter), name, and post date
- Thread title and a short content excerpt
- Reply count and like count

### Thread Detail View
Clicking a thread card opens a full detail view showing:
- Complete thread content, author, date, and category badge
- All replies in chronological order, each showing author, timestamp, and content
- Liked replies are highlighted with a gold left border and a "Liked" badge including the number of likes

### Themed UI
- When it is wiki_id=3454593, use Dandy's World Roblox Horror theme
- When it is wiki_id=35171, use Hunger Games' theme

### Wiki Filtering
Users will be able to select **one** wiki based on the wiki-name search bar with a drop-down to scope the thread list. This works on top of the existing category tabs — for example, a user interested only in Hunger Games discussion can select that wiki and then browse different categories of threads specific to it.

By default shows threads from every wiki, preserving the current behaviour.